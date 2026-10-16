"""Shared validation: a document's site/contact must belong to the document's customer."""
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.customer_site import CustomerContact, CustomerSite


async def validate_site_contact(
    db: AsyncSession, customer_id: int | None, site_id: int | None, contact_id: int | None,
) -> None:
    for model, ref_id, label in ((CustomerSite, site_id, "site"), (CustomerContact, contact_id, "contact")):
        if ref_id is None:
            continue
        row = await db.get(model, ref_id)
        if row is None or customer_id is None or row.customer_id != customer_id:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail=f"The selected {label} does not belong to this customer.",
            )
