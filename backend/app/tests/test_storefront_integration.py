"""Storefront integration: token-protected catalog and website inquiries (the customer portal is off)."""
import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.main import app
from app.models.customer import Customer
from app.models.forklift import Forklift
from app.models.inventory_balance import InventoryBalance
from app.models.lead import Lead
from app.models.spare_part import SparePart
from app.models.warehouse import Warehouse
from app.tests.test_sites_activities import _admin_headers

pytestmark = pytest.mark.anyio

TOKEN = "test-storefront-token"
SF = {"X-Storefront-Token": TOKEN}


@pytest.fixture(autouse=True)
def _storefront_token(monkeypatch):
    monkeypatch.setattr(settings, "STOREFRONT_INTEGRATION_TOKEN", TOKEN)


async def test_catalog_requires_token(client: AsyncClient):
    assert (await client.get("/api/v1/storefront/catalog")).status_code == 401
    assert (await client.get("/api/v1/storefront/catalog", headers={"X-Storefront-Token": "nope"})).status_code == 401


async def test_catalog_disabled_without_configured_token(client: AsyncClient, monkeypatch):
    monkeypatch.setattr(settings, "STOREFRONT_INTEGRATION_TOKEN", "")
    assert (await client.get("/api/v1/storefront/catalog", headers=SF)).status_code == 503


async def test_catalog_publishes_retail_price_and_availability_only(client: AsyncClient, db_session: AsyncSession):
    wh = Warehouse(code="W1", name="Main")
    stocked = SparePart(part_number="P-1", name="Filter", unit_price=100_000, currency="LAK")
    empty = SparePart(part_number="P-2", name="Belt", unit_price=10.0, currency="USD")
    unpriced = SparePart(part_number="P-3", name="No price", unit_price=0)
    db_session.add_all([wh, stocked, empty, unpriced])
    await db_session.commit()
    db_session.add(InventoryBalance(
        spare_part_id=stocked.id, warehouse_id=wh.id, quantity_on_hand=7, quantity_available=7,
    ))
    await db_session.commit()

    r = await client.get("/api/v1/storefront/catalog", headers=SF)
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 2
    items = {i["sku_code"]: i for i in body["items"]}
    assert set(items) == {"P-1", "P-2"}
    assert items["P-1"]["unit_price"] == 165_000
    assert items["P-1"]["available_to_order"] is True
    assert items["P-2"]["unit_price"] == 16.5
    assert items["P-2"]["available_to_order"] is False
    # Internal cost and warehouse quantities never leave the CRM.
    assert "quantity_on_hand" not in items["P-1"] and "cost" not in items["P-1"]


async def test_website_store_order_creates_lead(client: AsyncClient, db_session: AsyncSession):
    payload = {
        "inquiry_type": "store_order", "category": "store_order",
        "customer_name": "Noy", "phone_number": "020 5555 1234", "company_name": "Lao Logistics",
        "payment_method": "B2B_PO",
        "items": [{"sku_code": "P-1", "part_name": "Filter", "unit_price": 165000, "quantity": 2}],
    }
    assert (await client.post("/api/v1/leads/website-inquiries", json=payload)).status_code == 401

    r = await client.post("/api/v1/leads/website-inquiries", json=payload, headers=SF)
    assert r.status_code == 201
    ref = r.json()["reference_number"]
    assert ref.startswith("WEB-")

    lead = (await db_session.execute(select(Lead))).scalars().one()
    assert lead.title == "Website Store order inquiry: Lao Logistics"
    assert lead.source == "website"
    assert "P-1" in lead.description


async def test_website_inquiry_rejects_store_order_without_items(client: AsyncClient):
    payload = {
        "inquiry_type": "store_order", "category": "store_order",
        "customer_name": "Noy", "phone_number": "0205551234", "items": [],
    }
    assert (await client.post("/api/v1/leads/website-inquiries", json=payload, headers=SF)).status_code == 422


async def test_customer_portal_is_off_in_the_staff_only_system(client: AsyncClient):
    # Customers have no login: confirmations reach them by WhatsApp/email only.
    assert settings.CUSTOMER_PORTAL_ENABLED is False
    assert not [p for p in app.openapi()["paths"] if p.startswith("/api/v1/portal")]


_ORDER = {
    "inquiry_type": "store_order", "category": "store_order",
    "customer_name": "Noy", "phone_number": "+856 20 5555 1234", "payment_method": "BANK_TRANSFER",
    "total_lak": 330000,
    "items": [{"sku_code": "P-1", "part_name": "Filter", "unit_price": 165000, "quantity": 2}],
}


async def _place(client: AsyncClient, payload: dict | None = None) -> str:
    r = await client.post("/api/v1/leads/website-inquiries", json=payload or _ORDER, headers=SF)
    assert r.status_code == 201, r.text
    return r.json()["reference_number"]


async def test_website_order_sets_lead_value(client: AsyncClient, db_session: AsyncSession):
    await _place(client)
    assert (await db_session.execute(select(Lead))).scalars().one().value == 330000


async def test_contact_message_with_email_only_is_accepted(client: AsyncClient, db_session: AsyncSession):
    payload = {
        "inquiry_type": "service", "category": "standard", "customer_name": "Somsak",
        "email": "somsak@example.com", "details": "Need a PM quote for 3 forklifts",
    }
    r = await client.post("/api/v1/leads/website-inquiries", json=payload, headers=SF)
    assert r.status_code == 201, r.text
    # No contact route at all is rejected, and so is an email that is not one.
    no_contact = {**payload}
    no_contact.pop("email")
    assert (await client.post("/api/v1/leads/website-inquiries", json=no_contact, headers=SF)).status_code == 422
    bad = {**payload, "email": "not-an-email"}
    assert (await client.post("/api/v1/leads/website-inquiries", json=bad, headers=SF)).status_code == 422
    # A store order still needs a phone, even when an email is given.
    order = {**_ORDER, "email": "a@b.co"}
    order.pop("phone_number")
    assert (await client.post("/api/v1/leads/website-inquiries", json=order, headers=SF)).status_code == 422


async def test_track_order_needs_reference_and_matching_phone(client: AsyncClient, db_session: AsyncSession):
    ref = await _place(client)
    q = {"reference": ref}

    assert (await client.get("/api/v1/storefront/orders/track", params={**q, "phone": "020 5555 1234"})).status_code == 401

    r = await client.get("/api/v1/storefront/orders/track", params={**q, "phone": "020 5555 1234"}, headers=SF)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["reference_number"] == ref
    assert body["status"] == "PENDING"
    assert body["items"][0]["subtotal"] == 330000
    assert "description" not in body and "phone_number" not in body

    # Wrong phone, unknown reference and a malformed reference all look the same.
    for params in ({**q, "phone": "020 9999 0000"}, {"reference": "WEB-999999", "phone": "020 5555 1234"},
                   {"reference": "1; DROP", "phone": "020 5555 1234"}):
        assert (await client.get("/api/v1/storefront/orders/track", params=params, headers=SF)).status_code == 404


async def test_track_order_follows_lead_status_and_ignores_service_inquiries(client: AsyncClient, db_session: AsyncSession):
    ref = await _place(client)
    lead = (await db_session.execute(select(Lead))).scalars().one()
    lead.status = "won"
    await db_session.commit()
    r = await client.get("/api/v1/storefront/orders/track", params={"reference": ref, "phone": "+85620 5555 1234"}, headers=SF)
    assert r.json()["status"] == "CONFIRMED"

    service_ref = await _place(client, {
        "inquiry_type": "service", "category": "standard", "customer_name": "S", "phone_number": "020 5555 1234",
    })
    assert (await client.get("/api/v1/storefront/orders/track",
                             params={"reference": service_ref, "phone": "020 5555 1234"}, headers=SF)).status_code == 404


async def _sales_user(db: AsyncSession, username: str, *, active: bool = True):
    from app.core.security import hash_password
    from app.models.role import Role, RoleName
    from app.models.user import User

    role = (await db.execute(select(Role).where(Role.name == RoleName.SALES.value))).scalar_one_or_none()
    if role is None:
        role = Role(name=RoleName.SALES.value, description="sales", is_active=True)
        db.add(role)
        await db.commit()
    user = User(
        email=f"{username}@example.com", username=username, hashed_password=hash_password("Test@1234"),
        is_active=active, is_superuser=False, role_id=role.id,
    )
    db.add(user)
    await db.commit()
    return user


async def test_website_order_alerts_sales_team_and_admin_feed(client: AsyncClient, db_session: AsyncSession):
    from app.models.notification import Notification

    anna = await _sales_user(db_session, "anna")
    away = await _sales_user(db_session, "away", active=False)
    ref = await _place(client)

    rows = (await db_session.execute(select(Notification).where(Notification.event_type == "lead.website"))).scalars().all()
    assert {n.recipient_user_id for n in rows if n.recipient_user_id} == {anna.id}
    assert away.id not in {n.recipient_user_id for n in rows}
    assert [n.target_role for n in rows if n.target_role] == ["admin"]
    note = rows[0]
    assert note.subject == f"New website order {ref}"
    assert note.entity_type == "lead" and note.entity_id == int(ref.split("-")[1])
    assert "New contact" in note.message and "2 items" not in note.subject
    assert not note.is_read


async def test_returning_customer_is_linked_by_phone_and_named_in_alert(client: AsyncClient, db_session: AsyncSession):
    from app.models.notification import Notification

    known = Customer(first_name="Kham", last_name="Vong", company="Known Co", phone="020-5555 1234")
    db_session.add(known)
    await db_session.commit()
    await _place(client)  # placed with +856 20 5555 1234

    lead = (await db_session.execute(select(Lead))).scalars().one()
    assert lead.customer_id == known.id
    admin_note = (await db_session.execute(select(Notification).where(Notification.target_role == "admin"))).scalars().one()
    assert "Existing customer: Kham Vong" in admin_note.message


async def test_ambiguous_or_unknown_phone_is_not_linked(client: AsyncClient, db_session: AsyncSession):
    db_session.add_all([
        Customer(first_name="A", last_name="One", phone="020 5555 1234"),
        Customer(first_name="B", last_name="Two", phone="+856 20 5555 1234"),
    ])
    await db_session.commit()
    await _place(client)
    assert (await db_session.execute(select(Lead))).scalars().one().customer_id is None


async def test_contact_message_is_linked_by_email(client: AsyncClient, db_session: AsyncSession):
    known = Customer(first_name="Somsak", last_name="K", email="Somsak@Example.com")
    db_session.add(known)
    await db_session.commit()
    r = await client.post("/api/v1/leads/website-inquiries", headers=SF, json={
        "inquiry_type": "service", "category": "standard", "customer_name": "Somsak",
        "email": "somsak@example.com", "details": "Need a quote",
    })
    assert r.status_code == 201
    assert (await db_session.execute(select(Lead))).scalars().one().customer_id == known.id


async def test_alert_failure_does_not_lose_the_customers_request(client: AsyncClient, db_session: AsyncSession, monkeypatch):
    import app.routes.leads as leads_route

    async def boom(*args, **kwargs):
        raise RuntimeError("notifications are down")

    monkeypatch.setattr(leads_route, "notify_sales_of_website_lead", boom)
    ref = await _place(client)
    assert ref.startswith("WEB-")
    assert len((await db_session.execute(select(Lead))).scalars().all()) == 1
