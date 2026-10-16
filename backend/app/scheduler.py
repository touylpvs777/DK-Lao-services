"""
Background scheduler (Phase 1, Steps 4-5).

Each `*_scan()` function is a plain async function — callable directly
(tests, manual runs) or via the nightly APScheduler cron jobs wired up in
`start_scheduler()`.

`pm_scan()` scans active `maintenance_schedules` for anything due by date or
by hour-meter reading, and auto-generates a `preventive` / `scheduled`
`WorkOrder` for each one that doesn't already have an open work order,
emitting `work_order.created` on the shared event bus for each one created.

`billing_scan()` scans active `rental_contracts` for billing cycles that have
come due (reusing `BillingService.generate_next_billing_cycles()`'s existing
"next period after the last one" + `billing_cycle_day` cadence math, rather
than duplicating it) and, for any contract that got new cycles, immediately
turns them into an `Invoice` via `BillingService.create_invoice_from_cycles()`,
emitting `invoice.created` on the shared event bus.

Concurrency safety: `SchedulerLock` is a one-row-per-job database table, not
an in-memory lock — it survives a server restart, so a crashed-and-restarted
process (or a second process) can't run the same job concurrently. A stale
lock (held past `LOCK_STALE_AFTER`) is treated as abandoned and reclaimed.
`max_instances=1` on each APScheduler job is a cheap first line of defense
against overlapping triggers within a single process; the DB lock is the
authoritative guard across processes/restarts.
"""
import logging
from datetime import UTC, date, datetime, timedelta

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import and_, func, or_, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database.session import AsyncSessionLocal
from app.events import event_bus
from app.models.crm_activity import CrmActivity
from app.models.customer import Customer
from app.models.forklift import Forklift
from app.models.inventory_balance import InventoryBalance
from app.models.spare_part import SparePart
from app.models.notification import Notification, NotificationChannel, NotificationStatus
from app.models.maintenance_schedule import MaintenanceSchedule, ScheduleStatus
from app.models.rental_billing_cycle import BillingType, RentalBillingCycle
from app.models.rental_contract import RentalContract, RentalContractStatus
from app.models.rental_contract_item import RentalContractItem
from app.models.scheduler_lock import SchedulerLock
from app.models.work_order import OrderType, WorkOrder, WorkOrderStatus
from app.schemas.billing import InvoiceFromCyclesRequest
from app.schemas.maintenance import WorkOrderCreate
from app.services.billing_service import BillingService
from app.services.maintenance_service import MaintenanceService

logger = logging.getLogger("app.scheduler")

PM_SCAN_JOB = "pm_scan"
BILLING_SCAN_JOB = "billing_scan"
TASK_SCAN_JOB = "task_scan"
RENTAL_SCAN_JOB = "rental_scan"
STOCK_SCAN_JOB = "stock_scan"
RENTAL_EXPIRY_WARN_DAYS = 7
RENTAL_BILLING_WARN_DAYS = 3
TASK_OVERDUE_EVENT = "activity.overdue"
LOCK_STALE_AFTER = timedelta(hours=1)
_OPEN_WORK_ORDER_STATUSES = {
    WorkOrderStatus.SCHEDULED.value,
    WorkOrderStatus.DUE.value,
    WorkOrderStatus.IN_PROGRESS.value,
}


async def _try_acquire_lock(db: AsyncSession, job_name: str) -> bool:
    now = datetime.now(UTC)
    lock = await db.get(SchedulerLock, job_name)

    if lock is None:
        db.add(SchedulerLock(job_name=job_name, locked_at=now))
        try:
            await db.commit()
            return True
        except IntegrityError:
            await db.rollback()
            return False  # another process created the row first

    result = await db.execute(
        update(SchedulerLock)
        .where(SchedulerLock.job_name == job_name)
        .where(or_(SchedulerLock.locked_at.is_(None), SchedulerLock.locked_at < now - LOCK_STALE_AFTER))
        .values(locked_at=now)
        # SQLite doesn't round-trip tzinfo, so the default in-memory "evaluate"
        # sync strategy chokes comparing naive vs. aware datetimes on already-
        # loaded objects. The UPDATE itself is correct either way; we don't
        # need the loaded `lock` object kept in sync afterward.
        .execution_options(synchronize_session=False)
    )
    await db.commit()
    return result.rowcount > 0


async def _release_lock(db: AsyncSession, job_name: str) -> None:
    await db.execute(
        update(SchedulerLock)
        .where(SchedulerLock.job_name == job_name)
        .values(locked_at=None)
        .execution_options(synchronize_session=False)
    )
    await db.commit()


async def _find_due_schedules(db: AsyncSession) -> list[MaintenanceSchedule]:
    today = date.today()
    result = await db.execute(
        select(MaintenanceSchedule)
        .join(Forklift, MaintenanceSchedule.forklift_id == Forklift.id)
        .options(
            selectinload(MaintenanceSchedule.forklift),
            selectinload(MaintenanceSchedule.plan),
        )
        .where(
            MaintenanceSchedule.is_active.is_(True),
            MaintenanceSchedule.status == ScheduleStatus.ACTIVE.value,
            or_(
                and_(
                    MaintenanceSchedule.next_due_date.is_not(None),
                    MaintenanceSchedule.next_due_date <= today,
                ),
                and_(
                    MaintenanceSchedule.next_due_hours.is_not(None),
                    Forklift.current_hour_meter >= MaintenanceSchedule.next_due_hours,
                ),
            ),
        )
    )
    return list(result.scalars().unique().all())


async def _has_open_work_order(db: AsyncSession, schedule_id: int) -> bool:
    result = await db.execute(
        select(WorkOrder.id).where(
            WorkOrder.schedule_id == schedule_id,
            WorkOrder.status.in_(_OPEN_WORK_ORDER_STATUSES),
        )
    )
    return result.first() is not None


async def pm_scan(db: AsyncSession | None = None) -> int:
    """
    Scan due maintenance schedules and auto-generate preventive work orders.
    Returns the number of work orders created.

    `db` is normally omitted — the nightly scheduled run opens its own
    session against the real database. Tests pass their isolated test
    session explicitly so the scan never touches the real `crm.db`.
    """
    if db is None:
        async with AsyncSessionLocal() as session:
            return await _run_pm_scan(session)
    return await _run_pm_scan(db)


async def _run_pm_scan(db: AsyncSession) -> int:
    if not await _try_acquire_lock(db, PM_SCAN_JOB):
        logger.info("pm_scan: lock held by another run, skipping this cycle")
        return 0

    created_count = 0
    try:
        service = MaintenanceService(db)
        for schedule in await _find_due_schedules(db):
            if await _has_open_work_order(db, schedule.id):
                continue
            plan = schedule.plan
            if plan is None:
                continue

            try:
                data = WorkOrderCreate(
                    forklift_id=schedule.forklift_id,
                    schedule_id=schedule.id,
                    plan_id=schedule.plan_id,
                    order_type=OrderType.PREVENTIVE,
                    title=f"Preventive Maintenance: {plan.name}",
                    scheduled_date=(
                        datetime.combine(schedule.next_due_date, datetime.min.time())
                        if schedule.next_due_date else datetime.now()
                    ),
                    estimated_hours=plan.estimated_duration_hours,
                    estimated_cost=plan.estimated_cost,
                )
                work_order = await service.create_work_order(data, created_by=None)
                created_count += 1
                await event_bus.emit("work_order.created", db=db, work_order=work_order, schedule=schedule)
            except Exception:
                logger.exception("pm_scan: failed to create work order for schedule id=%s", schedule.id)
    finally:
        await _release_lock(db, PM_SCAN_JOB)

    logger.info("pm_scan: created %s work order(s)", created_count)
    return created_count


async def _find_active_contracts(db: AsyncSession) -> list[RentalContract]:
    result = await db.execute(
        select(RentalContract).where(RentalContract.status == RentalContractStatus.ACTIVE.value)
    )
    return list(result.scalars().all())


async def _contract_has_due_billing(db: AsyncSession, contract: RentalContract) -> bool:
    """
    True if at least one item's next billing period has actually started
    (period_start <= today). `BillingService.generate_next_billing_cycles()`
    itself only checks "is there room before contract.end_date" — it has no
    date gate, because its other caller is a staff member manually choosing
    to pre-generate a cycle. Calling it straight from a nightly cron without
    this check would front-load and invoice every remaining period on the
    very first run instead of one period per elapsed billing cycle.
    """
    today = date.today()
    result = await db.execute(
        select(RentalContractItem).where(RentalContractItem.contract_id == contract.id)
    )
    for item in result.scalars().all():
        cycle_result = await db.execute(
            select(RentalBillingCycle.period_end)
            .where(
                RentalBillingCycle.contract_id == contract.id,
                RentalBillingCycle.contract_item_id == item.id,
                RentalBillingCycle.billing_type == BillingType.RENTAL_PERIOD.value,
            )
            .order_by(RentalBillingCycle.period_end.desc())
            .limit(1)
        )
        last_end = cycle_result.scalar_one_or_none()
        next_start = (last_end + timedelta(days=1)) if last_end else (contract.actual_start_date or contract.start_date)
        if next_start <= today <= contract.end_date:
            return True
    return False


async def billing_scan(db: AsyncSession | None = None) -> int:
    """
    Scan active rental contracts, auto-generate any billing cycles that have
    come due, and invoice them. Returns the number of invoices created.

    `db` is normally omitted — the nightly scheduled run opens its own
    session against the real database. Tests pass their isolated test
    session explicitly so the scan never touches the real `crm.db`.
    """
    if db is None:
        async with AsyncSessionLocal() as session:
            return await _run_billing_scan(session)
    return await _run_billing_scan(db)


async def _run_billing_scan(db: AsyncSession) -> int:
    if not await _try_acquire_lock(db, BILLING_SCAN_JOB):
        logger.info("billing_scan: lock held by another run, skipping this cycle")
        return 0

    invoices_created = 0
    try:
        service = BillingService(db)
        for contract in await _find_active_contracts(db):
            try:
                if not await _contract_has_due_billing(db, contract):
                    continue

                # Reuses the existing "next period after the last generated
                # one" cadence logic (keyed off billing_cycle_day) instead of
                # duplicating it here. Idempotent: returns [] if nothing is
                # due yet, so a nightly re-run naturally skips not-yet-due
                # contracts with no extra bookkeeping needed.
                new_cycles = await service.generate_next_billing_cycles(contract.id, user_id=None)
                if not new_cycles:
                    continue

                invoice = await service.create_invoice_from_cycles(
                    InvoiceFromCyclesRequest(
                        contract_id=contract.id,
                        billing_cycle_ids=[cycle.id for cycle in new_cycles],
                        tax_rate=contract.tax_rate,
                        currency=contract.currency,
                    ),
                    created_by=None,
                )
                invoices_created += 1
                await event_bus.emit("invoice.created", db=db, invoice=invoice, contract=contract)
            except Exception:
                logger.exception("billing_scan: failed to bill contract id=%s", contract.id)
    finally:
        await _release_lock(db, BILLING_SCAN_JOB)

    logger.info("billing_scan: created %s invoice(s)", invoices_created)
    return invoices_created


async def task_scan(db: AsyncSession | None = None) -> int:
    """
    Raise one in-app notification per overdue CRM follow-up task, addressed to
    its assignee. Idempotent: a task that already has an `activity.overdue`
    notification is skipped, so hourly re-runs never duplicate alerts.
    Returns the number of notifications created.
    """
    if db is None:
        async with AsyncSessionLocal() as session:
            return await _run_task_scan(session)
    return await _run_task_scan(db)


async def _run_task_scan(db: AsyncSession) -> int:
    if not await _try_acquire_lock(db, TASK_SCAN_JOB):
        logger.info("task_scan: lock held by another run, skipping this cycle")
        return 0
    created = 0
    try:
        now = datetime.now(UTC)
        already = select(Notification.entity_id).where(
            Notification.event_type == TASK_OVERDUE_EVENT, Notification.entity_type == "crm_activity",
        )
        rows = (await db.execute(
            select(CrmActivity, Customer.company, Customer.first_name, Customer.last_name)
            .outerjoin(Customer, Customer.id == CrmActivity.customer_id)
            .where(
                CrmActivity.completed_at.is_(None), CrmActivity.due_at.is_not(None), CrmActivity.due_at < now,
                CrmActivity.assigned_to.is_not(None), CrmActivity.id.not_in(already),
            )
        )).all()
        for activity, company, first, last in rows:
            who = company or " ".join(x for x in (first, last) if x)
            db.add(Notification(
                channel=NotificationChannel.IN_APP.value,
                status=NotificationStatus.SENT.value,
                recipient=f"user:{activity.assigned_to}",
                subject="ງານຕິດຕາມເກີນກຳນົດ",
                message=f"{activity.subject}" + (f" — {who}" if who else ""),
                event_type=TASK_OVERDUE_EVENT,
                entity_type="crm_activity",
                entity_id=activity.id,
                recipient_user_id=activity.assigned_to,
                sent_at=now,
            ))
            created += 1
        await db.commit()
    finally:
        await _release_lock(db, TASK_SCAN_JOB)
    logger.info("task_scan: created %s notification(s)", created)
    return created


async def _notify_once(
    db: AsyncSession, *, user_id: int | None, event_type: str, entity_type: str, entity_id: int,
    subject: str, message: str,
) -> bool:
    """Create one in-app notification unless the same (event_type, entity) already has one."""
    exists = (await db.execute(
        select(Notification.id).where(
            Notification.event_type == event_type, Notification.entity_type == entity_type,
            Notification.entity_id == entity_id,
        ).limit(1)
    )).first()
    if exists:
        return False
    db.add(Notification(
        channel=NotificationChannel.IN_APP.value,
        status=NotificationStatus.SENT.value,
        recipient=f"user:{user_id}" if user_id else "role:admin",
        subject=subject, message=message,
        event_type=event_type, entity_type=entity_type, entity_id=entity_id,
        recipient_user_id=user_id,
        target_role=None if user_id else "admin",
        sent_at=datetime.now(UTC),
    ))
    return True


async def _next_billing_start(db: AsyncSession, contract: RentalContract) -> date | None:
    """Earliest next-period start across the contract's items, or None if fully billed."""
    items = (await db.execute(
        select(RentalContractItem).where(RentalContractItem.contract_id == contract.id)
    )).scalars().all()
    starts: list[date] = []
    for item in items:
        last_end = (await db.execute(
            select(RentalBillingCycle.period_end).where(
                RentalBillingCycle.contract_id == contract.id,
                RentalBillingCycle.contract_item_id == item.id,
                RentalBillingCycle.billing_type == BillingType.RENTAL_PERIOD.value,
            ).order_by(RentalBillingCycle.period_end.desc()).limit(1)
        )).scalar_one_or_none()
        nxt = (last_end + timedelta(days=1)) if last_end else (contract.actual_start_date or contract.start_date)
        if nxt <= contract.end_date:
            starts.append(nxt)
    return min(starts) if starts else None


async def rental_scan(db: AsyncSession | None = None) -> int:
    """
    Reminders for active rentals, one in-app notification per contract per milestone:
      - ending within RENTAL_EXPIRY_WARN_DAYS days            (rental.expiring)
      - past end_date but still active (not returned)         (rental.overdue)
      - next billing period starting within RENTAL_BILLING_WARN_DAYS days (rental.billing_soon)
    Sent to the contract's assignee, or the admin feed when unassigned.
    The milestone date is part of event_type, so extending a contract re-arms the reminder.
    Returns the number of notifications created.
    """
    if db is None:
        async with AsyncSessionLocal() as session:
            return await _run_rental_scan(session)
    return await _run_rental_scan(db)


async def _run_rental_scan(db: AsyncSession) -> int:
    if not await _try_acquire_lock(db, RENTAL_SCAN_JOB):
        logger.info("rental_scan: lock held by another run, skipping this cycle")
        return 0
    created = 0
    try:
        today = date.today()
        contracts = (await db.execute(
            select(RentalContract, Customer.company, Customer.first_name, Customer.last_name)
            .join(Customer, Customer.id == RentalContract.customer_id)
            .where(RentalContract.status.in_((RentalContractStatus.ACTIVE.value, RentalContractStatus.OVERDUE.value)))
        )).all()
        for contract, company, first, last in contracts:
            who = company or f"{first} {last}"
            ref = f"{contract.contract_number} — {who}"
            notify = dict(user_id=contract.assigned_to, entity_type="rental_contract", entity_id=contract.id)
            days_left = (contract.end_date - today).days
            if days_left < 0:
                created += await _notify_once(
                    db, event_type=f"rental.overdue.{contract.end_date}", subject="ສັນຍາເຊົ່າເກີນກຳນົດສົ່ງຄືນ",
                    message=f"{ref} · ກຳນົດ {contract.end_date} (ເກີນ {-days_left} ວັນ)", **notify)
            elif days_left <= RENTAL_EXPIRY_WARN_DAYS:
                created += await _notify_once(
                    db, event_type=f"rental.expiring.{contract.end_date}", subject="ສັນຍາເຊົ່າໃກ້ໝົດ",
                    message=f"{ref} · ໝົດ {contract.end_date} (ອີກ {days_left} ວັນ)", **notify)
            nxt = await _next_billing_start(db, contract)
            if nxt is not None and 0 <= (nxt - today).days <= RENTAL_BILLING_WARN_DAYS:
                created += await _notify_once(
                    db, event_type=f"rental.billing_soon.{nxt}", subject="ໃກ້ຮອບເກັບເງິນຄ່າເຊົ່າ",
                    message=f"{ref} · ຮອບໃໝ່ເລີ່ມ {nxt}", **notify)
        await db.commit()
    finally:
        await _release_lock(db, RENTAL_SCAN_JOB)
    logger.info("rental_scan: created %s notification(s)", created)
    return created


async def stock_scan(db: AsyncSession | None = None) -> int:
    """
    Low-stock reminders for spare parts: when a part's available quantity (summed over
    warehouses) is at or below its min_stock_level, post one admin-feed notification
    per part per ISO week until it is restocked. Returns the number created.
    """
    if db is None:
        async with AsyncSessionLocal() as session:
            return await _run_stock_scan(session)
    return await _run_stock_scan(db)


async def _run_stock_scan(db: AsyncSession) -> int:
    if not await _try_acquire_lock(db, STOCK_SCAN_JOB):
        logger.info("stock_scan: lock held by another run, skipping this cycle")
        return 0
    created = 0
    try:
        year, week, _ = date.today().isocalendar()
        rows = (await db.execute(
            select(SparePart, func.coalesce(func.sum(InventoryBalance.quantity_available), 0.0))
            .join(InventoryBalance, InventoryBalance.spare_part_id == SparePart.id)
            .where(SparePart.is_active.is_(True))
            .group_by(SparePart.id)
        )).all()
        for part, available in rows:
            if available > part.min_stock_level:
                continue
            created += await _notify_once(
                db, user_id=None, event_type=f"stock.low.{year}-W{week:02d}", entity_type="spare_part", entity_id=part.id,
                subject="ອາໄຫຼ່ໃກ້ໝົດສະຕັອກ",
                message=f"{part.part_number} — {part.name} · ເຫຼືອ {available:g} (ຂັ້ນຕ່ຳ {part.min_stock_level}, ສັ່ງເພີ່ມ {part.reorder_quantity})",
            )
        await db.commit()
    finally:
        await _release_lock(db, STOCK_SCAN_JOB)
    logger.info("stock_scan: created %s notification(s)", created)
    return created


scheduler = AsyncIOScheduler()


def start_scheduler() -> None:
    if scheduler.running:
        return
    scheduler.add_job(
        pm_scan,
        trigger=CronTrigger(hour=2, minute=0),
        id=PM_SCAN_JOB,
        max_instances=1,
        coalesce=True,
        misfire_grace_time=3600,
    )
    scheduler.add_job(
        billing_scan,
        trigger=CronTrigger(hour=3, minute=0),
        id=BILLING_SCAN_JOB,
        max_instances=1,
        coalesce=True,
        misfire_grace_time=3600,
    )
    scheduler.add_job(
        task_scan,
        trigger=CronTrigger(minute=5),  # hourly
        id=TASK_SCAN_JOB,
        max_instances=1,
        coalesce=True,
        misfire_grace_time=1800,
    )
    scheduler.add_job(
        rental_scan,
        trigger=CronTrigger(hour=7, minute=30),
        id=RENTAL_SCAN_JOB,
        max_instances=1,
        coalesce=True,
        misfire_grace_time=3600,
    )
    scheduler.add_job(
        stock_scan,
        trigger=CronTrigger(hour=7, minute=45),
        id=STOCK_SCAN_JOB,
        max_instances=1,
        coalesce=True,
        misfire_grace_time=3600,
    )
    scheduler.start()


def shutdown_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
