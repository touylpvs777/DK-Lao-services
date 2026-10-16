"""PM inspection checklist attached to a work order."""
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.maintenance_plan import MaintenancePlan
from app.models.work_order import WorkOrder
from app.models.work_order_checklist_item import ChecklistResult, WorkOrderChecklistItem
from app.schemas.maintenance import ChecklistSummary

# Used for preventive work orders whose plan has no checklist of its own.
DEFAULT_PM_CHECKLIST: list[str] = [
    "ເຄື່ອງຍົນ: ລະດັບ ແລະ ສະພາບນ້ຳມັນເຄື່ອງ",
    "ລະບົບໄຮດຣອລິກ: ນ້ຳມັນ, ທໍ່, ການຮົ່ວ",
    "ສາຍພານ ແລະ ລະບົບຫຼໍ່ເຢັນ",
    "ແບັດເຕີຣີ / ລະບົບໄຟຟ້າ",
    "ເບກ ແລະ ເບກມື",
    "ລໍ້ ແລະ ຢາງ",
    "ເສົາຍົກ, ໂຊ່ ແລະ ງ່າມ (forks)",
    "ພວງມາໄລ ແລະ ລະບົບບັງຄັບລ້ຽວ",
    "ໄຟ, ແກ໊ນ ແລະ ສັນຍານເຕືອນຖອຍຫຼັງ",
    "ເຂັມຂັດນິລະໄພ ແລະ ບ່ອນນັ່ງ",
    "ອຸປະກອນຄວາມປອດໄພ (ກັນຝົນ, ຕາໜ່າງ)",
    "ທົດລອງຂັບ ແລະ ຍົກ-ວາງ ຮັບນ້ຳໜັກ",
]


async def seed_checklist(db: AsyncSession, wo: WorkOrder) -> int:
    """Copy the plan's checklist (or the default for preventive orders) onto a new work order."""
    labels: list[str] = []
    if wo.plan_id:
        plan = await db.get(MaintenancePlan, wo.plan_id)
        labels = [str(x).strip() for x in (plan.checklist or []) if str(x).strip()] if plan else []
    if not labels and wo.order_type == "preventive":
        labels = DEFAULT_PM_CHECKLIST
    for i, label in enumerate(labels, start=1):
        db.add(WorkOrderChecklistItem(work_order_id=wo.id, position=i, label=label))
    return len(labels)


async def list_items(db: AsyncSession, wo_id: int) -> list[WorkOrderChecklistItem]:
    rows = await db.execute(
        select(WorkOrderChecklistItem).where(WorkOrderChecklistItem.work_order_id == wo_id)
        .order_by(WorkOrderChecklistItem.position, WorkOrderChecklistItem.id)
    )
    return list(rows.scalars().all())


def summarise(items: list[WorkOrderChecklistItem]) -> ChecklistSummary:
    count = lambda r: sum(1 for i in items if i.result == r.value)  # noqa: E731
    return ChecklistSummary(
        total=len(items), pending=count(ChecklistResult.PENDING), ok=count(ChecklistResult.OK),
        attention=count(ChecklistResult.ATTENTION), fail=count(ChecklistResult.FAIL), na=count(ChecklistResult.NA),
    )


async def pending_count(db: AsyncSession, wo_id: int) -> int:
    return (await db.execute(
        select(func.count(WorkOrderChecklistItem.id)).where(
            WorkOrderChecklistItem.work_order_id == wo_id,
            WorkOrderChecklistItem.result == ChecklistResult.PENDING.value,
        )
    )).scalar_one()


async def get_item(db: AsyncSession, wo_id: int, item_id: int) -> WorkOrderChecklistItem:
    item = await db.get(WorkOrderChecklistItem, item_id)
    if item is None or item.work_order_id != wo_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Checklist item not found")
    return item


def stamp(item: WorkOrderChecklistItem, user_id: int) -> None:
    if item.result == ChecklistResult.PENDING.value:
        item.checked_by, item.checked_at = None, None
    else:
        item.checked_by, item.checked_at = user_id, datetime.now(timezone.utc)
