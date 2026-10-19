import json
import re
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
from app.models.lead import Lead, LeadSource, LeadStatus
from app.schemas.customer_portal import StorefrontCatalogItem, StorefrontCatalogOut
from app.schemas.public_inquiry import PublicOrderTrackItem, PublicOrderTrackOut

router = APIRouter(prefix="/storefront", tags=["Storefront"])
_RETAIL_MARKUP_RATE = 1.65


def _require_storefront_token(token: str | None) -> None:
    if not settings.STOREFRONT_INTEGRATION_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Storefront integration is not configured",
        )
    # Compare bytes: compare_digest raises TypeError (a 500) on a non-ASCII str, e.g. a token with a BOM.
    if not token or not secrets.compare_digest(
        token.encode(), settings.STOREFRONT_INTEGRATION_TOKEN.encode()
    ):
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


_REFERENCE_RE = re.compile(r"^WEB-(\d{1,9})$", re.IGNORECASE)
# A customer sees only these states. Only "won" means staff have confirmed the order.
_TRACK_STATUS = {LeadStatus.WON: "CONFIRMED", LeadStatus.LOST: "CANCELLED"}


def _phone_digits(value: str | None) -> str:
    return re.sub(r"\D", "", value or "")


def _same_phone(a: str | None, b: str | None) -> bool:
    """Match +856 20 5555 1234 with 020 5555 1234: compare the last 8 digits."""
    x, y = _phone_digits(a), _phone_digits(b)
    if len(x) < 8 or len(y) < 8:
        return False
    return x[-8:] == y[-8:]


@router.get("/orders/track", response_model=PublicOrderTrackOut)
async def track_website_order(
    reference: str = Query(..., min_length=4, max_length=20),
    phone: str = Query(..., min_length=3, max_length=50),
    db: AsyncSession = Depends(get_db),
    storefront_token: str | None = Header(default=None, alias="X-Storefront-Token"),
):
    """Let a customer follow a website order with its reference number and the phone used to place it."""
    _require_storefront_token(storefront_token)
    not_found = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    match = _REFERENCE_RE.match(reference.strip())
    if not match:
        raise not_found
    lead = await db.get(Lead, int(match.group(1)))
    if lead is None or lead.source != LeadSource.WEBSITE.value or not lead.description:
        raise not_found
    try:
        details = json.loads(lead.description.split("\n\n", 1)[1])
    except (IndexError, ValueError):
        raise not_found
    # Same answer for "no such order" and "wrong phone" so references cannot be probed.
    if details.get("inquiry_type") != "store_order" or not _same_phone(phone, details.get("phone_number")):
        raise not_found

    return PublicOrderTrackOut(
        reference_number=f"WEB-{lead.id:06d}",
        status=_TRACK_STATUS.get(lead.status, "PENDING"),
        customer_name=details.get("customer_name", ""),
        payment_method=details.get("payment_method"),
        total_usd=details.get("total_usd") or 0,
        total_lak=details.get("total_lak") or 0,
        created_at=lead.created_at.isoformat() if lead.created_at else "",
        items=[
            PublicOrderTrackItem(
                sku_code=i["sku_code"], part_name=i["part_name"], unit_price=i["unit_price"],
                quantity=i["quantity"], subtotal=round(i["unit_price"] * i["quantity"], 2),
            )
            for i in details.get("items", [])
        ],
    )
