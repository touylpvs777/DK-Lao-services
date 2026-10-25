"""Staff intake: one entry point for what a customer asked for by phone, chat or in person.

Every request lands as a Lead tied to the right customer (the audit trail of who asked what, through
which channel). Orders, reservations and service calls also get their draft document, linked back to
that customer, so nothing has to be re-typed in another screen.
"""
import logging
from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.permissions import PermissionName, assert_permission
from app.models.activity_log import ActionType, EntityType
from app.models.customer import Customer
from app.models.lead import Lead, LeadSource, LeadStatus
from app.models.user import User
from app.models.work_order import OrderType
from app.schemas.customer import CustomerCreate
from app.schemas.intake import IntakeChannel, IntakeCreate, IntakeResult, IntakeType
from app.schemas.maintenance import WorkOrderCreate
from app.schemas.notification import NotificationCreate
from app.schemas.rental import RentalContractCreate, RentalContractItemCreate
from app.schemas.sales_order import SalesOrderCreate, SalesOrderItemCreate
from app.services.activity_log_service import ActivityLogService
from app.services.customer_service import CustomerService
from app.services.maintenance_service import MaintenanceService
from app.services.notification_service import NotificationService
from app.services.rental_contract_service import RentalContractService
from app.services.sales_order_service import SalesOrderService
from app.services.website_leads import find_customer_by_contact

logger = logging.getLogger(__name__)

INTAKE_EVENT = "intake.created"

_LEAD_SOURCE = {
    IntakeChannel.WHATSAPP: LeadSource.SOCIAL_MEDIA,
    IntakeChannel.FACEBOOK: LeadSource.SOCIAL_MEDIA,
    IntakeChannel.LINE: LeadSource.SOCIAL_MEDIA,
    IntakeChannel.EMAIL: LeadSource.EMAIL,
}

# What the person at the keyboard must be allowed to do for each kind of request.
_EXTRA_PERMISSION = {
    IntakeType.PARTS_ORDER: PermissionName.SALES_ORDER_CREATE,
    IntakeType.RENTAL_RESERVATION: PermissionName.RENTAL_CREATE,
    IntakeType.SERVICE_REQUEST: PermissionName.FORKLIFT_UPDATE,
}

_TYPE_LABEL = {
    IntakeType.QUOTE_REQUEST: "Inquiry / quotation request",
    IntakeType.PARTS_ORDER: "Parts / goods order",
    IntakeType.RENTAL_RESERVATION: "Rental reservation",
    IntakeType.SERVICE_REQUEST: "Service request",
}


def _customer_name(customer: Customer) -> str:
    name = f"{customer.first_name} {customer.last_name}".strip(" -")
    return customer.company or name


class IntakeService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, data: IntakeCreate, user: User) -> IntakeResult:
        await assert_permission(user, self.db, PermissionName.CREATE_LEAD)
        extra = _EXTRA_PERMISSION.get(data.intake_type)
        if extra:
            await assert_permission(user, self.db, extra)

        customer, created = await self._resolve_customer(data, user)

        lead = Lead(
            title=f"{_TYPE_LABEL[data.intake_type]}: {data.subject}"[:255],
            description=self._describe(data),
            value=self._value(data),
            source=_LEAD_SOURCE.get(data.channel, LeadSource.OTHER).value,
            status=LeadStatus.NEW if data.intake_type == IntakeType.QUOTE_REQUEST else LeadStatus.CONTACTED,
            customer_id=customer.id,
            assigned_to=user.id,
            created_by=user.id,
        )
        self.db.add(lead)
        await self.db.commit()
        await self.db.refresh(lead)
        lead_id = lead.id

        try:
            doc_type, doc_id, doc_number = await self._create_document(data, customer, lead_id, user)
        except Exception:
            # No half-finished intake: the request is either fully recorded or not at all.
            await self.db.rollback()
            orphan = await self.db.get(Lead, lead_id)
            if orphan is not None:
                await self.db.delete(orphan)
                await self.db.commit()
            raise

        if doc_number:
            lead = await self.db.get(Lead, lead_id)
            lead.description = f"{lead.description}\n\nLinked document: {doc_type} {doc_number}"
            await self.db.commit()

        reference = f"INQ-{lead_id:06d}"
        await ActivityLogService(self.db).log(
            user_id=user.id,
            action=ActionType.LEAD_CREATED,
            entity_type=EntityType.LEAD,
            entity_id=lead_id,
            details={
                "intake_type": data.intake_type.value,
                "channel": data.channel.value,
                "document": doc_number,
            },
        )

        notified = await self._notify_customer(data, customer, reference, doc_number)
        return IntakeResult(
            reference=reference,
            lead_id=lead_id,
            customer_id=customer.id,
            customer_name=_customer_name(customer),
            customer_created=created,
            document_type=doc_type,
            document_id=doc_id,
            document_number=doc_number,
            customer_notified=notified,
        )

    # ── Customer ─────────────────────────────────────────────────────────────

    async def _resolve_customer(self, data: IntakeCreate, user: User) -> tuple[Customer, bool]:
        if data.customer_id is not None:
            customer = await CustomerService(self.db).get_by_id(data.customer_id)
            if customer is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
            return customer, False

        new = data.new_customer
        await assert_permission(user, self.db, PermissionName.CREATE_CUSTOMER)
        # Never create a second record for someone already on file: ask staff to pick the existing one.
        existing = await find_customer_by_contact(self.db, new.phone, new.email)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "code": "customer_exists",
                    "message": "This phone number or email already belongs to a customer.",
                    "customer_id": existing.id,
                    "customer_name": _customer_name(existing),
                },
            )
        customer = await CustomerService(self.db).create(
            CustomerCreate(
                first_name=new.first_name, last_name=new.last_name, phone=new.phone,
                email=new.email, company=new.company, assigned_to=user.id,
            ),
            created_by=user.id,
        )
        return customer, True

    # ── Documents ────────────────────────────────────────────────────────────

    async def _create_document(
        self, data: IntakeCreate, customer: Customer, lead_id: int, user: User,
    ) -> tuple[str | None, int | None, str | None]:
        notes = f"Intake via {data.channel.value}: {data.subject}" + (f"\n{data.details}" if data.details else "")

        if data.intake_type == IntakeType.PARTS_ORDER:
            service = SalesOrderService(self.db)
            order = await service.create_sales_order(
                SalesOrderCreate(
                    title=data.subject,
                    customer_id=customer.id,
                    contact_name=_customer_name(customer),
                    contact_phone=customer.phone,
                    contact_email=customer.email,
                    expected_delivery_date=data.expected_delivery_date,
                    location=data.delivery_address,
                    notes=f"{notes}\nLead: INQ-{lead_id:06d}",
                ),
                created_by=user.id,
            )
            order_id = order.id
            try:
                for item in data.items:
                    await service.add_item(order.id, SalesOrderItemCreate(
                        description=item.description, quantity=item.quantity,
                        unit_price=item.unit_price, spare_part_id=item.spare_part_id,
                    ))
            except Exception:
                await self.db.rollback()
                await service.delete_sales_order(order_id)
                raise
            return "Sales order", order.id, order.so_number

        if data.intake_type == IntakeType.RENTAL_RESERVATION:
            service = RentalContractService(self.db)
            contract = await service.create_contract(
                RentalContractCreate(
                    customer_id=customer.id,
                    contract_type=data.contract_type,
                    start_date=data.start_date,
                    end_date=data.end_date,
                    lead_id=lead_id,
                    delivery_address=data.delivery_address,
                    delivery_contact_name=_customer_name(customer),
                    delivery_contact_phone=customer.phone,
                    notes=notes,
                ),
                created_by=user.id,
            )
            # Reserves the machine; fails (409) if it is not available for those dates.
            contract_id = contract.id
            try:
                await service.add_item(
                    contract_id,
                    RentalContractItemCreate(
                        forklift_id=data.forklift_id, description=data.subject,
                        monthly_rate=data.monthly_rate, daily_rate=data.daily_rate,
                    ),
                    user.id,
                )
            except Exception:
                await self.db.rollback()
                await service.delete_contract(contract_id)
                raise
            return "Rental contract", contract.id, contract.contract_number

        if data.intake_type == IntakeType.SERVICE_REQUEST:
            work_order = await MaintenanceService(self.db).create_work_order(
                WorkOrderCreate(
                    forklift_id=data.forklift_id,
                    order_type=OrderType.CORRECTIVE,
                    priority=data.priority,
                    title=data.subject,
                    description=(
                        f"{notes}\nCustomer: {_customer_name(customer)} {customer.phone or ''}\n"
                        f"Lead: INQ-{lead_id:06d}"
                    ).strip(),
                    scheduled_date=data.scheduled_date or datetime.now(UTC),
                ),
                created_by=user.id,
            )
            return "Work order", work_order.id, work_order.work_order_number

        return None, None, None

    # ── Helpers ──────────────────────────────────────────────────────────────

    @staticmethod
    def _value(data: IntakeCreate) -> float | None:
        total = sum(i.quantity * i.unit_price for i in data.items)
        return total or None

    @staticmethod
    def _describe(data: IntakeCreate) -> str:
        lines = [
            f"Channel: {data.channel.value}",
            f"Type: {_TYPE_LABEL[data.intake_type]}",
            f"Subject: {data.subject}",
        ]
        if data.details:
            lines += ["", data.details]
        if data.items:
            lines += ["", "Items:"] + [f"- {i.description} x {i.quantity:g}" for i in data.items]
        if data.start_date and data.end_date:
            lines.append(f"Period: {data.start_date} to {data.end_date}")
        return "\n".join(lines)

    async def _notify_customer(
        self, data: IntakeCreate, customer: Customer, reference: str, document_number: str | None,
    ) -> bool:
        """Send the customer their confirmation over WhatsApp, falling back to email. Best effort."""
        if not data.notify_customer or not (customer.phone or customer.email):
            return False
        ref = f"{reference} / {document_number}" if document_number else reference
        message = (
            f"DK Lao Services: ເຮົາໄດ້ຮັບເລື່ອງຂອງທ່ານແລ້ວ ({data.subject}). "
            f"ເລກອ້າງອີງ {ref}. ພະນັກງານຈະຕິດຕໍ່ກັບຄືນໂດຍໄວ. "
            f"We have received your request ({ref}); our team will contact you shortly."
        )
        try:
            result = await NotificationService(self.db).send(NotificationCreate(
                recipient_phone=customer.phone, recipient_email=customer.email,
                subject=f"DK Lao Services {reference}", message=message,
                event_type=INTAKE_EVENT, entity_type="customer", entity_id=customer.id,
            ))
            return result.status == "sent"
        except Exception:
            await self.db.rollback()
            logger.exception("Could not confirm intake %s to the customer", reference)
            return False
