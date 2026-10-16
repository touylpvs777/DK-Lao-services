from datetime import datetime, timedelta, timezone

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.customer import Customer
from app.models.user import User

pytestmark = pytest.mark.anyio


async def _admin_headers(client: AsyncClient, db_session: AsyncSession) -> dict:
    db_session.add(User(
        email="boss@example.com", username="boss", hashed_password=hash_password("Test@1234"),
        is_active=True, is_superuser=True,
    ))
    await db_session.commit()
    r = await client.post("/api/v1/auth/login", json={"username": "boss", "password": "Test@1234"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


async def _customers(db_session: AsyncSession) -> tuple[int, int]:
    a = Customer(first_name="A", last_name="One", company="A Co")
    b = Customer(first_name="B", last_name="Two", company="B Co")
    db_session.add_all([a, b])
    await db_session.commit()
    return a.id, b.id


async def test_document_site_contact_must_belong_to_customer(client: AsyncClient, db_session: AsyncSession):
    h = await _admin_headers(client, db_session)
    a, b = await _customers(db_session)
    site = (await client.post(f"/api/v1/customers/{a}/sites", json={"name": "Plant"}, headers=h)).json()
    contact = (await client.post(
        f"/api/v1/customers/{a}/contacts", json={"name": "Boun", "site_id": site["id"]}, headers=h,
    )).json()

    ok = await client.post("/api/v1/quotations/", headers=h, json={
        "quotation_type": "sales", "title": "Q1", "customer_id": a,
        "site_id": site["id"], "contact_id": contact["id"],
    })
    assert ok.status_code == 201, ok.text
    detail = (await client.get(f"/api/v1/quotations/{ok.json()['id']}", headers=h)).json()
    assert detail["site_id"] == site["id"] and detail["contact_id"] == contact["id"]

    bad = await client.post("/api/v1/quotations/", headers=h, json={
        "quotation_type": "sales", "title": "Q2", "customer_id": b, "site_id": site["id"],
    })
    assert bad.status_code == 422


async def test_deleting_site_detaches_contact(client: AsyncClient, db_session: AsyncSession):
    h = await _admin_headers(client, db_session)
    a, _ = await _customers(db_session)
    site = (await client.post(f"/api/v1/customers/{a}/sites", json={"name": "Yard"}, headers=h)).json()
    contact = (await client.post(
        f"/api/v1/customers/{a}/contacts", json={"name": "Sone", "site_id": site["id"]}, headers=h,
    )).json()
    assert (await client.delete(f"/api/v1/customers/{a}/sites/{site['id']}", headers=h)).status_code == 204
    rows = (await client.get(f"/api/v1/customers/{a}/contacts", headers=h)).json()
    assert rows[0]["id"] == contact["id"] and rows[0]["site_id"] is None


async def test_activity_task_lifecycle(client: AsyncClient, db_session: AsyncSession):
    h = await _admin_headers(client, db_session)
    a, _ = await _customers(db_session)

    # Needs a customer or lead.
    assert (await client.post("/api/v1/crm/activities/", json={"subject": "x"}, headers=h)).status_code == 422

    past = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
    task = await client.post("/api/v1/crm/activities/", headers=h, json={
        "type": "call", "subject": "Follow up quote", "customer_id": a, "due_at": past,
    })
    assert task.status_code == 201, task.text
    t = task.json()
    assert t["completed_at"] is None and t["is_overdue"] is True and t["customer_name"] == "A Co"

    # A log entry without a due date is recorded as already done.
    log = (await client.post("/api/v1/crm/activities/", headers=h, json={
        "type": "visit", "subject": "Visited plant", "customer_id": a,
    })).json()
    assert log["completed_at"] is not None

    summary = (await client.get("/api/v1/crm/activities/summary", headers=h)).json()
    assert summary["open"] == 1 and summary["overdue"] == 1

    overdue = (await client.get("/api/v1/crm/activities/?state=overdue", headers=h)).json()
    assert [x["id"] for x in overdue] == [t["id"]]

    done = (await client.post(f"/api/v1/crm/activities/{t['id']}/complete", headers=h)).json()
    assert done["completed_at"] is not None and done["is_overdue"] is False
    assert (await client.get("/api/v1/crm/activities/summary", headers=h)).json()["open"] == 0

    reopened = (await client.post(f"/api/v1/crm/activities/{t['id']}/reopen", headers=h)).json()
    assert reopened["completed_at"] is None

    timeline = (await client.get(f"/api/v1/crm/activities/?customer_id={a}", headers=h)).json()
    assert len(timeline) == 2
    assert (await client.delete(f"/api/v1/crm/activities/{t['id']}", headers=h)).status_code == 204
