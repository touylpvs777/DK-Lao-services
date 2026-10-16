from datetime import date, timedelta

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification
from app.scheduler import rental_scan
from app.tests.test_billing_scheduler import _make_contract, _make_customer, _make_item

pytestmark = pytest.mark.anyio


async def _events(db: AsyncSession) -> list[str]:
    rows = await db.execute(select(Notification.event_type).where(Notification.entity_type == "rental_contract"))
    return sorted(e.split(".")[1] for (e,) in rows.all())


async def test_expiring_contract_notified_once(db_session: AsyncSession):
    customer = await _make_customer(db_session, company="ACME")
    contract = await _make_contract(db_session, customer=customer, end_date=date.today() + timedelta(days=5))
    await _make_item(db_session, contract=contract)

    first = await rental_scan(db_session)
    assert first >= 1
    assert "expiring" in await _events(db_session)
    assert await rental_scan(db_session) == 0  # idempotent


async def test_overdue_contract_notified(db_session: AsyncSession):
    customer = await _make_customer(db_session)
    await _make_contract(db_session, customer=customer, end_date=date.today() - timedelta(days=2))

    await rental_scan(db_session)
    assert "overdue" in await _events(db_session)


async def test_far_future_contract_not_notified_for_expiry(db_session: AsyncSession):
    customer = await _make_customer(db_session)
    contract = await _make_contract(db_session, customer=customer, start_date=date.today() - timedelta(days=10))
    await _make_item(db_session, contract=contract)
    # one period already billed through yesterday+30 => next billing is far away
    from app.models.rental_billing_cycle import RentalBillingCycle
    db_session.add(RentalBillingCycle(
        billing_number="BC-1", contract_id=contract.id, contract_item_id=None, billing_type="rental_period",
        description="x", period_start=date.today() - timedelta(days=10), period_end=date.today() + timedelta(days=20),
    ))
    await db_session.commit()

    await rental_scan(db_session)
    assert await _events(db_session) == []


async def test_non_active_contract_ignored(db_session: AsyncSession):
    customer = await _make_customer(db_session)
    await _make_contract(db_session, customer=customer, status="closed", end_date=date.today() - timedelta(days=2))
    assert await rental_scan(db_session) == 0
