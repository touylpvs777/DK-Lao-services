import logging

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.forklift import ForkliftStatus, OwnershipState
from app.models.forklift_status_history import ForkliftStatusHistory
from app.repositories.forklift_repository import ForkliftRepository
from app.repositories.forklift_status_repository import ForkliftStatusRepository
from app.models.inventory_transaction import InventoryTransaction, TransactionType
from app.services.inventory_service import InventoryService
from app.models.delivery_note import DeliveryNote, DeliveryNoteStatus
from app.models.delivery_note_status_history import DeliveryNoteStatusHistory
from app.repositories.delivery_note_repository import DeliveryNoteRepository

logger = logging.getLogger(__name__)

VALID_TRANSITIONS: dict[str, set[str]] = {
    DeliveryNoteStatus.DRAFT.value: {
        DeliveryNoteStatus.DISPATCHED.value,
        DeliveryNoteStatus.CANCELLED.value,
    },
    DeliveryNoteStatus.DISPATCHED.value: {
        DeliveryNoteStatus.DELIVERED.value,
        DeliveryNoteStatus.CANCELLED.value,
    },
    DeliveryNoteStatus.DELIVERED.value: set(),
    DeliveryNoteStatus.CANCELLED.value: set(),
}


class DeliveryNoteWorkflowService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self._repo = DeliveryNoteRepository(db)
        self._inventory = InventoryService(db)
        self._forklift_repo = ForkliftRepository(db)
        self._forklift_status_repo = ForkliftStatusRepository(db)

    async def dispatch(self, delivery_note_id: int, reason: str | None, user_id: int) -> DeliveryNote:
        delivery_note = await self._require(delivery_note_id)
        self._validate_transition(delivery_note.status, DeliveryNoteStatus.DISPATCHED.value)

        if len(delivery_note.items) == 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Cannot dispatch a delivery note with no line items.",
            )

        # Goods leave the warehouse on dispatch: issue stock for every line that
        # is linked to a spare part. Raises 422 (nothing committed) if short.
        await self._issue_stock(delivery_note, user_id)
        return await self._transition(delivery_note, DeliveryNoteStatus.DISPATCHED.value, reason, user_id)

    async def deliver(self, delivery_note_id: int, reason: str | None, user_id: int) -> DeliveryNote:
        delivery_note = await self._require(delivery_note_id)
        self._validate_transition(delivery_note.status, DeliveryNoteStatus.DELIVERED.value)
        await self._mark_forklifts_sold(delivery_note, user_id)
        return await self._transition(delivery_note, DeliveryNoteStatus.DELIVERED.value, reason, user_id)

    async def cancel(self, delivery_note_id: int, reason: str | None, user_id: int) -> DeliveryNote:
        delivery_note = await self._require(delivery_note_id)
        self._validate_transition(delivery_note.status, DeliveryNoteStatus.CANCELLED.value)
        if delivery_note.status == DeliveryNoteStatus.DISPATCHED.value:
            # Stock was issued at dispatch — put it back.
            await self._return_stock(delivery_note, user_id)
        return await self._transition(delivery_note, DeliveryNoteStatus.CANCELLED.value, reason, user_id)

    # ── Internal ─────────────────────────────────────────────────────────────

    async def _resolve_warehouse_id(self, delivery_note: DeliveryNote) -> int:
        """`DeliveryNote.warehouse` is free text: match it to a warehouse by
        code or name, otherwise fall back to the first active warehouse."""
        warehouses = await self._inventory._repo.get_warehouses()
        if not warehouses:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="No active warehouse is configured to issue stock from.",
            )
        wanted = (delivery_note.warehouse or "").strip().casefold()
        if wanted:
            for wh in warehouses:
                if wanted in (wh.code.casefold(), wh.name.casefold()):
                    return wh.id
        return warehouses[0].id

    async def _mark_forklifts_sold(self, delivery_note: DeliveryNote, user_id: int) -> None:
        """A delivered forklift line means the unit changed hands: mark it SOLD,
        owned by the delivery note's customer, with a status-history entry.
        Units already sold/decommissioned are left alone."""
        forklift_ids = {i.forklift_id for i in delivery_note.items if i.forklift_id}
        for forklift_id in forklift_ids:
            forklift = await self._forklift_repo.get_by_id(forklift_id)
            if forklift is None or forklift.status in (
                ForkliftStatus.SOLD.value, ForkliftStatus.DECOMMISSIONED.value,
            ):
                continue
            old_status = forklift.status
            changes = {
                "status": ForkliftStatus.SOLD.value,
                "ownership_state": OwnershipState.CUSTOMER_OWNED.value,
            }
            if delivery_note.customer_id:
                changes["customer_id"] = delivery_note.customer_id
            await self._forklift_repo.update(forklift, changes)
            await self._forklift_status_repo.create(ForkliftStatusHistory(
                forklift_id=forklift.id,
                from_status=old_status,
                to_status=ForkliftStatus.SOLD.value,
                reason=f"Delivered on {delivery_note.dn_number}",
                changed_by=user_id,
            ))

    async def _issue_stock(self, delivery_note: DeliveryNote, user_id: int) -> None:
        lines = [i for i in delivery_note.items if i.spare_part_id and i.quantity_delivered > 0]
        if not lines:
            return
        warehouse_id = await self._resolve_warehouse_id(delivery_note)
        for item in lines:
            await self._inventory.issue_stock(
                item.spare_part_id, warehouse_id, item.quantity_delivered, user_id,
                reference_type="delivery_note", reference_id=delivery_note.id,
                notes=f"Delivery note {delivery_note.dn_number}",
            )

    async def _return_stock(self, delivery_note: DeliveryNote, user_id: int) -> None:
        issued = (await self.db.execute(
            select(InventoryTransaction).where(
                InventoryTransaction.reference_type == "delivery_note",
                InventoryTransaction.reference_id == delivery_note.id,
                InventoryTransaction.transaction_type == TransactionType.ISSUE.value,
            )
        )).scalars().all()
        for txn in issued:
            await self._inventory.return_stock(
                txn.spare_part_id, txn.warehouse_id, txn.quantity, user_id,
                reference_type="delivery_note", reference_id=delivery_note.id,
                notes=f"Cancelled delivery note {delivery_note.dn_number}",
            )

    async def _transition(
        self, delivery_note: DeliveryNote, to_status: str, reason: str | None, user_id: int,
    ) -> DeliveryNote:
        old_status = delivery_note.status
        await self._repo.update(delivery_note, {
            "status": to_status,
            "updated_by": user_id,
        })
        await self._repo.add_status_history(DeliveryNoteStatusHistory(
            delivery_note_id=delivery_note.id,
            from_status=old_status,
            to_status=to_status,
            reason=reason,
            changed_by=user_id,
        ))
        await self.db.commit()
        return await self._repo.get_by_id(delivery_note.id)

    async def _require(self, delivery_note_id: int) -> DeliveryNote:
        delivery_note = await self._repo.get_by_id(delivery_note_id)
        if delivery_note is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Delivery note not found")
        return delivery_note

    @staticmethod
    def _validate_transition(from_status: str, to_status: str) -> None:
        allowed = VALID_TRANSITIONS.get(from_status, set())
        if to_status not in allowed:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail=f"Invalid action: cannot transition from '{from_status}' to '{to_status}'.",
            )
