"""Storefront integration: token-protected catalog, website inquiries, customer portal."""
import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
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


async def test_portal_account_login_and_scoped_dashboard(client: AsyncClient, db_session: AsyncSession):
    admin = await _admin_headers(client, db_session)
    mine = Customer(first_name="Kham", last_name="P", company="Mine Co")
    other = Customer(first_name="Other", last_name="C", company="Other Co")
    db_session.add_all([mine, other])
    await db_session.commit()
    db_session.add_all([
        Forklift(serial_number="FL-MINE", slug="fl-mine", name_en="Mitsubishi FD30", customer_id=mine.id),
        Forklift(serial_number="FL-OTHER", slug="fl-other", name_en="Other forklift", customer_id=other.id),
    ])
    await db_session.commit()

    r = await client.post("/api/v1/portal/accounts", headers=admin, json={
        "customer_id": mine.id, "username": "Mine.Login", "password": "Portal@12345",
    })
    assert r.status_code == 201, r.text
    account_id = r.json()["id"]
    # One account per customer.
    dup = await client.post("/api/v1/portal/accounts", headers=admin, json={
        "customer_id": mine.id, "username": "second", "password": "Portal@12345",
    })
    assert dup.status_code == 409

    bad = await client.post("/api/v1/portal/auth/login", json={"username": "mine.login", "password": "wrong-pass"})
    assert bad.status_code == 401
    r = await client.post("/api/v1/portal/auth/login", json={"username": "mine.login", "password": "Portal@12345"})
    assert r.status_code == 200
    portal = {"Authorization": f"Bearer {r.json()['access_token']}"}

    dash = await client.get("/api/v1/portal/dashboard", headers=portal)
    assert dash.status_code == 200
    data = dash.json()
    assert data["customer"]["company"] == "Mine Co"
    assert [f["serial_number"] for f in data["forklifts"]] == ["FL-MINE"]

    # A portal token is not an employee token, and an employee token is not a portal token.
    assert (await client.get("/api/v1/customers/", headers=portal)).status_code == 401
    assert (await client.get("/api/v1/portal/dashboard", headers=admin)).status_code == 401

    # Deactivating the account invalidates its existing tokens.
    r = await client.patch(f"/api/v1/portal/accounts/{account_id}", headers=admin, json={"is_active": False})
    assert r.status_code == 200
    assert (await client.get("/api/v1/portal/dashboard", headers=portal)).status_code == 401


async def test_portal_accounts_require_superuser(client: AsyncClient):
    assert (await client.get("/api/v1/portal/accounts")).status_code == 401
