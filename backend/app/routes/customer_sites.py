"""Sites (locations) and contacts (people) of a customer."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.permissions import PermissionName, require_permission
from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.customer import Customer
from app.models.customer_site import CustomerContact, CustomerSite
from app.models.user import User
from app.schemas.customer_site import (
    ContactCreate, ContactOut, ContactUpdate, SiteCreate, SiteOut, SiteUpdate,
)

router = APIRouter(prefix="/customers/{customer_id}", tags=["Customer sites & contacts"])


async def _customer_or_404(db: AsyncSession, customer_id: int) -> None:
    if await db.get(Customer, customer_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Customer not found")


async def _owned(db: AsyncSession, model, item_id: int, customer_id: int):
    obj = await db.get(model, item_id)
    if obj is None or obj.customer_id != customer_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"{model.__name__} not found")
    return obj


async def _check_site(db: AsyncSession, customer_id: int, site_id: int | None) -> None:
    if site_id is not None:
        await _owned(db, CustomerSite, site_id, customer_id)


async def _single_primary(db: AsyncSession, model, customer_id: int, keep_id: int) -> None:
    await db.execute(
        update(model).where(model.customer_id == customer_id, model.id != keep_id).values(is_primary=False)
    )


# -- Sites ---------------------------------------------------------------

@router.get("/sites", response_model=list[SiteOut])
async def list_sites(customer_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    rows = await db.execute(
        select(CustomerSite).where(CustomerSite.customer_id == customer_id)
        .order_by(CustomerSite.is_primary.desc(), CustomerSite.id)
    )
    return rows.scalars().all()


@router.post("/sites", response_model=SiteOut, status_code=status.HTTP_201_CREATED)
async def create_site(
    customer_id: int, data: SiteCreate, db: AsyncSession = Depends(get_db),
    _: User = require_permission(PermissionName.EDIT_CUSTOMER),
):
    await _customer_or_404(db, customer_id)
    site = CustomerSite(customer_id=customer_id, **data.model_dump())
    db.add(site)
    await db.flush()
    if site.is_primary:
        await _single_primary(db, CustomerSite, customer_id, site.id)
    await db.commit()
    await db.refresh(site)
    return site


@router.patch("/sites/{site_id}", response_model=SiteOut)
async def update_site(
    customer_id: int, site_id: int, data: SiteUpdate, db: AsyncSession = Depends(get_db),
    _: User = require_permission(PermissionName.EDIT_CUSTOMER),
):
    site = await _owned(db, CustomerSite, site_id, customer_id)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(site, k, v)
    if site.is_primary:
        await _single_primary(db, CustomerSite, customer_id, site.id)
    await db.commit()
    await db.refresh(site)
    return site


@router.delete("/sites/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_site(
    customer_id: int, site_id: int, db: AsyncSession = Depends(get_db),
    _: User = require_permission(PermissionName.EDIT_CUSTOMER),
):
    site = await _owned(db, CustomerSite, site_id, customer_id)
    # Detach contacts explicitly so this behaves the same on SQLite (no FK enforcement) and Postgres.
    await db.execute(update(CustomerContact).where(CustomerContact.site_id == site_id).values(site_id=None))
    await db.delete(site)
    await db.commit()


# -- Contacts ------------------------------------------------------------

@router.get("/contacts", response_model=list[ContactOut])
async def list_contacts(customer_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    rows = await db.execute(
        select(CustomerContact).where(CustomerContact.customer_id == customer_id)
        .order_by(CustomerContact.is_primary.desc(), CustomerContact.id)
    )
    return rows.scalars().all()


@router.post("/contacts", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
async def create_contact(
    customer_id: int, data: ContactCreate, db: AsyncSession = Depends(get_db),
    _: User = require_permission(PermissionName.EDIT_CUSTOMER),
):
    await _customer_or_404(db, customer_id)
    await _check_site(db, customer_id, data.site_id)
    contact = CustomerContact(customer_id=customer_id, **data.model_dump())
    db.add(contact)
    await db.flush()
    if contact.is_primary:
        await _single_primary(db, CustomerContact, customer_id, contact.id)
    await db.commit()
    await db.refresh(contact)
    return contact


@router.patch("/contacts/{contact_id}", response_model=ContactOut)
async def update_contact(
    customer_id: int, contact_id: int, data: ContactUpdate, db: AsyncSession = Depends(get_db),
    _: User = require_permission(PermissionName.EDIT_CUSTOMER),
):
    contact = await _owned(db, CustomerContact, contact_id, customer_id)
    changes = data.model_dump(exclude_unset=True)
    if "site_id" in changes:
        await _check_site(db, customer_id, changes["site_id"])
    for k, v in changes.items():
        setattr(contact, k, v)
    if contact.is_primary:
        await _single_primary(db, CustomerContact, customer_id, contact.id)
    await db.commit()
    await db.refresh(contact)
    return contact


@router.delete("/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(
    customer_id: int, contact_id: int, db: AsyncSession = Depends(get_db),
    _: User = require_permission(PermissionName.EDIT_CUSTOMER),
):
    contact = await _owned(db, CustomerContact, contact_id, customer_id)
    await db.delete(contact)
    await db.commit()
