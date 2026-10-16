import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.inventory_balance import InventoryBalance
from app.models.notification import Notification
from app.models.spare_part import SparePart
from app.models.warehouse import Warehouse
from app.scheduler import stock_scan
from app.tests.test_sites_activities import _admin_headers

pytestmark = pytest.mark.anyio


async def test_search_finds_part_by_oem_and_equivalent_number(client: AsyncClient, db_session: AsyncSession):
    h = await _admin_headers(client, db_session)
    r = await client.post("/api/v1/inventory/parts", headers=h, json={
        "part_number": "DK-F-001", "name": "Oil filter", "oem_number": "04152-YZZA1",
        "equivalent_numbers": "HF-6553, P550162", "compatible_models": "Toyota 8FG25, 8FD30",
    })
    assert r.status_code == 201, r.text
    assert r.json()["oem_number"] == "04152-YZZA1"
    await client.post("/api/v1/inventory/parts", headers=h, json={"part_number": "DK-X-002", "name": "Other"})

    for q in ("04152-YZZA1", "P550162", "8FD30"):
        items = (await client.get("/api/v1/inventory/parts", params={"q": q}, headers=h)).json()["items"]
        assert [i["part_number"] for i in items] == ["DK-F-001"], q

    upd = await client.put(f"/api/v1/inventory/parts/{r.json()['id']}", headers=h, json={"equivalent_numbers": None})
    assert upd.status_code == 200 and upd.json()["equivalent_numbers"] is None


async def test_stock_scan_alerts_low_parts_once_per_week(db_session: AsyncSession):
    wh = Warehouse(code="W1", name="Main")
    low = SparePart(part_number="LOW-1", name="Low part", min_stock_level=5)
    fine = SparePart(part_number="OK-1", name="Fine part", min_stock_level=5)
    never = SparePart(part_number="NEW-1", name="Never stocked", min_stock_level=5)
    db_session.add_all([wh, low, fine, never])
    await db_session.commit()
    db_session.add_all([
        InventoryBalance(spare_part_id=low.id, warehouse_id=wh.id, quantity_on_hand=2, quantity_available=2),
        InventoryBalance(spare_part_id=fine.id, warehouse_id=wh.id, quantity_on_hand=50, quantity_available=50),
    ])
    await db_session.commit()

    assert await stock_scan(db_session) == 1
    assert await stock_scan(db_session) == 0
    rows = (await db_session.execute(select(Notification).where(Notification.entity_type == "spare_part"))).scalars().all()
    assert len(rows) == 1 and rows[0].entity_id == low.id and rows[0].target_role == "admin"
