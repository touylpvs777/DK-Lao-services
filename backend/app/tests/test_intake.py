"""Staff intake: a request taken by phone/chat is tied to the right customer and drafts its document."""
from datetime import date, timedelta

import pytest
from httpx import AsyncClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.customer import Customer
from app.models.forklift import Forklift
from app.models.lead import Lead
from app.models.notification import Notification
from app.models.rental_contract import RentalContract
from app.models.role import Role, RoleName
from app.models.sales_order import SalesOrder
from app.models.user import User
from app.models.work_order import WorkOrder
from app.tests.test_sites_activities import _admin_headers

pytestmark = pytest.mark.anyio

URL = "/api/v1/intake/"


async def _count(db: AsyncSession, model) -> int:
    return await db.scalar(select(func.count()).select_from(model))


async def test_requires_login(client: AsyncClient):
    assert (await client.post(URL, json={})).status_code == 401


async def test_quote_request_for_new_customer_creates_customer_and_lead(client: AsyncClient, db_session: AsyncSession):
    admin = await _admin_headers(client, db_session)
    r = await client.post(URL, headers=admin, json={
        "intake_type": "quote_request", "channel": "whatsapp", "subject": "Price of 3t forklift",
        "new_customer": {"first_name": "Noy", "phone": "020 5555 1234", "company": "Noy Trading"},
        "notify_customer": False,
    })
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["customer_created"] is True and body["document_type"] is None
    assert body["reference"] == f"INQ-{body['lead_id']:06d}"

    lead = await db_session.get(Lead, body["lead_id"])
    assert lead.customer_id == body["customer_id"]
    assert lead.source == "social_media" and lead.status.value == "new"
    customer = await db_session.get(Customer, body["customer_id"])
    assert customer.company == "Noy Trading"


async def test_existing_phone_is_not_duplicated(client: AsyncClient, db_session: AsyncSession):
    admin = await _admin_headers(client, db_session)
    db_session.add(Customer(first_name="Noy", last_name="K", phone="+856 20 5555 1234", company="Noy Co"))
    await db_session.commit()
    r = await client.post(URL, headers=admin, json={
        "intake_type": "quote_request", "subject": "x", "notify_customer": False,
        "new_customer": {"first_name": "Noy again", "phone": "020-5555-1234"},
    })
    assert r.status_code == 409
    assert r.json()["detail"]["code"] == "customer_exists"
    assert await _count(db_session, Customer) == 1 and await _count(db_session, Lead) == 0


async def test_parts_order_drafts_sales_order_for_the_customer(client: AsyncClient, db_session: AsyncSession):
    admin = await _admin_headers(client, db_session)
    customer = Customer(first_name="Kham", last_name="P", company="Kham Co", phone="02055550000")
    db_session.add(customer)
    await db_session.commit()
    r = await client.post(URL, headers=admin, json={
        "intake_type": "parts_order", "channel": "phone", "subject": "Filters", "customer_id": customer.id,
        "items": [{"description": "Oil filter", "quantity": 2, "unit_price": 50000}],
        "notify_customer": False,
    })
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["document_type"] == "Sales order"
    order = await db_session.get(SalesOrder, body["document_id"])
    assert order.customer_id == customer.id and order.so_number == body["document_number"]
    lead = await db_session.get(Lead, body["lead_id"])
    assert lead.value == 100000 and body["document_number"] in lead.description


async def test_rental_reservation_reserves_the_machine(client: AsyncClient, db_session: AsyncSession):
    admin = await _admin_headers(client, db_session)
    customer = Customer(first_name="Kham", last_name="P", company="Kham Co")
    forklift = Forklift(serial_number="FL-1", slug="fl-1", name_en="Mitsubishi FD30")
    db_session.add_all([customer, forklift])
    await db_session.commit()
    start = date.today() + timedelta(days=3)
    r = await client.post(URL, headers=admin, json={
        "intake_type": "rental_reservation", "subject": "FD30 for a week", "customer_id": customer.id,
        "forklift_id": forklift.id, "start_date": start.isoformat(),
        "end_date": (start + timedelta(days=7)).isoformat(), "monthly_rate": 9000000, "daily_rate": 400000,
        "notify_customer": False,
    })
    assert r.status_code == 201, r.text
    body = r.json()
    contract = await db_session.get(RentalContract, body["document_id"])
    assert contract.customer_id == customer.id and contract.lead_id == body["lead_id"]
    assert contract.status == "reservation"


async def test_rental_failure_leaves_no_orphan_lead(client: AsyncClient, db_session: AsyncSession):
    admin = await _admin_headers(client, db_session)
    customer = Customer(first_name="Kham", last_name="P")
    db_session.add(customer)
    await db_session.commit()
    start = date.today() + timedelta(days=3)
    r = await client.post(URL, headers=admin, json={
        "intake_type": "rental_reservation", "subject": "Ghost machine", "customer_id": customer.id,
        "forklift_id": 9999, "start_date": start.isoformat(),
        "end_date": (start + timedelta(days=2)).isoformat(), "notify_customer": False,
    })
    assert r.status_code >= 400
    assert await _count(db_session, Lead) == 0 and await _count(db_session, RentalContract) == 0


async def test_service_request_creates_work_order(client: AsyncClient, db_session: AsyncSession):
    admin = await _admin_headers(client, db_session)
    customer = Customer(first_name="Kham", last_name="P")
    forklift = Forklift(serial_number="FL-2", slug="fl-2", name_en="Toyota 8FD")
    db_session.add_all([customer, forklift])
    await db_session.commit()
    r = await client.post(URL, headers=admin, json={
        "intake_type": "service_request", "subject": "Hydraulic leak", "customer_id": customer.id,
        "forklift_id": forklift.id, "priority": "high", "notify_customer": False,
    })
    assert r.status_code == 201, r.text
    wo = await db_session.get(WorkOrder, r.json()["document_id"])
    assert wo.forklift_id == forklift.id and wo.priority == "high"


async def test_customer_gets_a_confirmation_notification(client: AsyncClient, db_session: AsyncSession):
    admin = await _admin_headers(client, db_session)
    customer = Customer(first_name="Kham", last_name="P", email="kham@example.com")
    db_session.add(customer)
    await db_session.commit()
    r = await client.post(URL, headers=admin, json={
        "intake_type": "quote_request", "subject": "Quote", "customer_id": customer.id,
    })
    assert r.status_code == 201, r.text
    rows = (await db_session.execute(
        select(Notification).where(Notification.event_type == "intake.created")
    )).scalars().all()
    assert len(rows) == 1 and r.json()["reference"] in rows[0].message


async def test_role_without_rental_permission_cannot_reserve(client: AsyncClient, db_session: AsyncSession):
    role = Role(name=RoleName.PARTS.value, is_active=True)
    db_session.add(role)
    await db_session.commit()
    db_session.add(User(
        email="parts@example.com", username="parts", hashed_password=hash_password("Test@1234"),
        is_active=True, role_id=role.id,
    ))
    customer = Customer(first_name="Kham", last_name="P")
    db_session.add(customer)
    await db_session.commit()
    login = await client.post("/api/v1/auth/login", json={"username": "parts", "password": "Test@1234"})
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}
    start = date.today() + timedelta(days=3)
    r = await client.post(URL, headers=headers, json={
        "intake_type": "rental_reservation", "subject": "x", "customer_id": customer.id, "forklift_id": 1,
        "start_date": start.isoformat(), "end_date": (start + timedelta(days=2)).isoformat(),
    })
    assert r.status_code == 403
    assert await _count(db_session, Lead) == 0
