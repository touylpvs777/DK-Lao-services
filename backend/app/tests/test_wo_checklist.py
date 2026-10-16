from datetime import datetime, timezone

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.forklift import Forklift
from app.tests.test_sites_activities import _admin_headers

pytestmark = pytest.mark.anyio

NOW = datetime.now(timezone.utc).isoformat()


async def _forklift(db: AsyncSession) -> int:
    f = Forklift(serial_number="FL-CHK", slug="fl-chk", name_en="Toyota 8FG25")
    db.add(f)
    await db.commit()
    await db.refresh(f)
    return f.id


async def _wo(client, h, fid, **extra):
    r = await client.post("/api/v1/maintenance/work-orders", headers=h, json={
        "forklift_id": fid, "order_type": "preventive", "title": "PM 250h", "scheduled_date": NOW, **extra,
    })
    assert r.status_code == 201, r.text
    return r.json()["id"]


async def test_preventive_wo_gets_default_checklist_and_blocks_completion(client: AsyncClient, db_session: AsyncSession):
    h = await _admin_headers(client, db_session)
    wo = await _wo(client, h, await _forklift(db_session))

    items = (await client.get(f"/api/v1/maintenance/work-orders/{wo}/checklist", headers=h)).json()
    assert len(items) == 12 and all(i["result"] == "pending" for i in items)

    await client.post(f"/api/v1/maintenance/work-orders/{wo}/start", headers=h, json={"hour_meter_reading": 100})
    blocked = await client.post(f"/api/v1/maintenance/work-orders/{wo}/complete", headers=h, json={"actual_hours": 1})
    assert blocked.status_code == 422 and "12" in blocked.text

    for i in items:
        r = await client.patch(f"/api/v1/maintenance/work-orders/{wo}/checklist/{i['id']}", headers=h,
                               json={"result": "ok" if i["position"] != 3 else "attention", "remark": "x" if i["position"] == 3 else None})
        assert r.status_code == 200 and r.json()["checked_at"]

    summary = (await client.get(f"/api/v1/maintenance/work-orders/{wo}/checklist/summary", headers=h)).json()
    assert summary["pending"] == 0 and summary["attention"] == 1 and summary["ok"] == 11
    done = await client.post(f"/api/v1/maintenance/work-orders/{wo}/complete", headers=h, json={"actual_hours": 1})
    assert done.status_code == 200, done.text


async def test_corrective_wo_has_no_checklist_and_completes(client: AsyncClient, db_session: AsyncSession):
    h = await _admin_headers(client, db_session)
    r = await client.post("/api/v1/maintenance/work-orders", headers=h, json={
        "forklift_id": await _forklift(db_session), "order_type": "corrective", "title": "Fix", "scheduled_date": NOW,
    })
    wo = r.json()["id"]
    assert (await client.get(f"/api/v1/maintenance/work-orders/{wo}/checklist", headers=h)).json() == []
    await client.post(f"/api/v1/maintenance/work-orders/{wo}/start", headers=h, json={"hour_meter_reading": 100})
    assert (await client.post(f"/api/v1/maintenance/work-orders/{wo}/complete", headers=h, json={"actual_hours": 1})).status_code == 200


async def test_plan_checklist_is_used_and_items_can_be_added(client: AsyncClient, db_session: AsyncSession):
    h = await _admin_headers(client, db_session)
    plan = (await client.post("/api/v1/maintenance/plans", headers=h, json={
        "name": "Custom", "service_type": "preventive", "interval_type": "days", "interval_value": 30,
        "checklist": ["Check A", "Check B"],
    })).json()
    wo = await _wo(client, h, await _forklift(db_session), plan_id=plan["id"])
    items = (await client.get(f"/api/v1/maintenance/work-orders/{wo}/checklist", headers=h)).json()
    assert [i["label"] for i in items] == ["Check A", "Check B"]
    added = await client.post(f"/api/v1/maintenance/work-orders/{wo}/checklist", headers=h, json={"label": "Check C"})
    assert added.status_code == 201 and added.json()["position"] == 3
    assert (await client.delete(f"/api/v1/maintenance/work-orders/{wo}/checklist/{added.json()['id']}", headers=h)).status_code == 204
