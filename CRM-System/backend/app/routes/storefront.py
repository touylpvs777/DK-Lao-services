import secrets

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.database.session import get_db
from app.models.brand import Brand
from app.models.inventory_balance import InventoryBalance
from app.models.spare_part import SparePart
from app.models.warehouse import Warehouse
from app.schemas.customer_portal import StorefrontCatalogItem, StorefrontCatalogOut

router = APIRouter(prefix="/storefront", tags=["Storefront"])
_RETAIL_MARKUP_RATE = 1.65


def _require_storefront_token(token: str | None) -> None:
    if not settings.STOREFRONT_INTEGRATION_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Storefront integration is not configured",
        )
    if not token or not secrets.compare_digest(token, settings.STOREFRONT_INTEGRATION_TOKEN):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid storefront token")


@router.get("/catalog", response_model=StorefrontCatalogOut)
async def get_public_catalog(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    storefront_token: str | None = Header(default=None, alias="X-Storefront-Token"),
):
    """Return published spare-part fields only; never expose warehouse quantities."""
    _require_storefront_token(storefront_token)

    available_parts = (
        select(
            InventoryBalance.spare_part_id.label("spare_part_id"),
            func.sum(InventoryBalance.quantity_on_hand - InventoryBalance.quantity_reserved).label("available"),
        )
        .join(Warehouse, Warehouse.id == InventoryBalance.warehouse_id)
        .where(Warehouse.is_active.is_(True))
        .group_by(InventoryBalance.spare_part_id)
        .subquery()
    )
    base = (
        select(SparePart, Brand.name, func.coalesce(available_parts.c.available, 0) > 0)
        .outerjoin(Brand, Brand.id == SparePart.brand_id)
        .outerjoin(available_parts, available_parts.c.spare_part_id == SparePart.id)
        .where(
            SparePart.is_active.is_(True),
            SparePart.unit_price > 0,
            SparePart.currency.in_(["LAK", "THB", "USD"]),
        )
    )
    total = await db.scalar(select(func.count()).select_from(base.subquery())) or 0
    rows = await db.execute(
        base.order_by(SparePart.name, SparePart.part_number).offset(skip).limit(limit)
    )

    items = [
        StorefrontCatalogItem(
            sku_code=part.part_number,
            name=part.name,
            description=part.description,
            category=part.part_category,
            brand=brand_name,
            unit=part.unit,
            # `spare_parts.unit_price` is the internal inventory cost. Only the
            # approved 65% retail price is published to the storefront.
            unit_price=(
                round(part.unit_price * _RETAIL_MARKUP_RATE)
                if part.currency == "LAK"
                else round(part.unit_price * _RETAIL_MARKUP_RATE, 2)
            ),
            currency=part.currency,
            image_url=part.image_url,
            available_to_order=bool(available),
            lead_time_days=part.lead_time_days,
        )
        for part, brand_name, available in rows.all()
    ]
    return StorefrontCatalogOut(items=items, total=total, skip=skip, limit=limit)
