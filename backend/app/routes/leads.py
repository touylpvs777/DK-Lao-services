import json
import logging
import secrets

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.permissions import PermissionName, require_permission
from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.activity_log import ActionType, EntityType
from app.models.lead import Lead, LeadSource, LeadStatus
from app.models.user import User
from app.schemas.public_inquiry import PublicInquiryCreate, PublicInquiryOut, PublicInquiryType
from app.schemas.lead import (
    LeadCreate,
    LeadDetail,
    LeadNoteCreate,
    LeadNoteOut,
    LeadOut,
    LeadUpdate,
)
from app.services.activity_log_service import ActivityLogService
from app.services.lead_service import LeadService
from app.services.website_leads import find_customer_for_inquiry, notify_sales_of_website_lead

router = APIRouter(prefix="/leads", tags=["Leads"])
logger = logging.getLogger(__name__)


@router.get("/", response_model=list[LeadOut])
async def list_leads(
    skip: int = 0,
    limit: int = 100,
    status: LeadStatus | None = None,
    source: LeadSource | None = None,
    assigned_to: int | None = None,
    customer_id: int | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return await LeadService(db).get_all(
        skip=skip,
        limit=limit,
        status=status,
        source=source,
        assigned_to=assigned_to,
        customer_id=customer_id,
    )


@router.post("/", response_model=LeadOut, status_code=status.HTTP_201_CREATED)
async def create_lead(
    data: LeadCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = require_permission(PermissionName.CREATE_LEAD),
):
    lead = await LeadService(db).create(data, created_by=current_user.id)
    await ActivityLogService(db).log(
        user_id=current_user.id,
        action=ActionType.LEAD_CREATED,
        entity_type=EntityType.LEAD,
        entity_id=lead.id,
        details={"title": lead.title, "status": lead.status.value},
    )
    return lead


@router.post(
    "/website-inquiries",
    response_model=PublicInquiryOut,
    status_code=status.HTTP_201_CREATED,
    summary="Receive a storefront service or parts inquiry",
)
async def create_website_inquiry(
    data: PublicInquiryCreate,
    db: AsyncSession = Depends(get_db),
    storefront_token: str | None = Header(default=None, alias="X-Storefront-Token"),
):
    """Store customer-submitted requests as CRM leads for staff follow-up.

    The public storefront cannot create a confirmed sales order or work order;
    staff must validate stock, pricing, customer identity, and payment first.
    """
    if not settings.STOREFRONT_INTEGRATION_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Storefront inquiry integration is not configured",
        )
    # Compare bytes: compare_digest raises TypeError (a 500) on a non-ASCII str, e.g. a token with a BOM.
    if not storefront_token or not secrets.compare_digest(
        storefront_token.encode(), settings.STOREFRONT_INTEGRATION_TOKEN.encode()
    ):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid storefront token")

    details = data.model_dump(mode="json")
    lead_type = "Store order inquiry" if data.inquiry_type == PublicInquiryType.STORE_ORDER else "Service inquiry"
    company_or_name = data.company_name or data.customer_name
    title = f"Website {lead_type}: {company_or_name}"[:255]
    description = (
        "Submitted through the public storefront. This is an inquiry only; "
        "prices, stock, and payment have not been verified.\n\n"
        + json.dumps(details, ensure_ascii=False)
    )
    # Link a returning customer automatically. A failed lookup must never lose the customer's request.
    try:
        customer = await find_customer_for_inquiry(db, data)
    except Exception:
        logger.exception("Customer lookup for a website inquiry failed")
        customer = None
    # Read now: the customer row is expired once the session commits.
    matched_customer = f"{customer.first_name} {customer.last_name}".strip() if customer else None

    lead = Lead(
        title=title,
        description=description,
        customer_id=customer.id if customer else None,
        # Shows the order value in the pipeline; staff re-price before quoting.
        value=data.total_lak if data.total_lak else None,
        source=LeadSource.WEBSITE.value,
        status=LeadStatus.NEW,
        created_by=None,
    )
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    reference = f"WEB-{lead.id:06d}"

    # The lead is saved; alerting staff is best effort and must not fail the customer's request.
    try:
        await notify_sales_of_website_lead(db, lead, data, matched_customer, reference)
    except Exception:
        await db.rollback()
        logger.exception("Could not alert sales about website lead %s", reference)

    return PublicInquiryOut(reference_number=reference)


@router.get("/{lead_id}", response_model=LeadDetail)
async def get_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    lead = await LeadService(db).get_by_id_with_detail(lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return lead


@router.put("/{lead_id}", response_model=LeadOut)
async def update_lead(
    lead_id: int,
    data: LeadUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = require_permission(PermissionName.EDIT_LEAD),
):
    service = LeadService(db)
    lead = await service.get_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")

    changed_fields = list(data.model_dump(exclude_unset=True).keys())
    old_status = lead.status

    lead = await service.update(lead, data)

    activity = ActivityLogService(db)
    await activity.log(
        user_id=current_user.id,
        action=ActionType.LEAD_UPDATED,
        entity_type=EntityType.LEAD,
        entity_id=lead.id,
        details={"changed_fields": changed_fields},
    )
    if "status" in changed_fields and data.status != old_status:
        await activity.log(
            user_id=current_user.id,
            action=ActionType.LEAD_STATUS_CHANGED,
            entity_type=EntityType.LEAD,
            entity_id=lead.id,
            details={"from": old_status.value, "to": data.status.value},
        )
    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = require_permission(PermissionName.DELETE_LEAD),
):
    service = LeadService(db)
    lead = await service.get_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    title = lead.title
    await service.delete(lead)
    await ActivityLogService(db).log(
        user_id=current_user.id,
        action=ActionType.LEAD_DELETED,
        entity_type=EntityType.LEAD,
        entity_id=lead_id,
        details={"title": title},
    )


# ── Notes ──────────────────────────────────────────────────────────────────────


@router.get("/{lead_id}/notes", response_model=list[LeadNoteOut])
async def list_notes(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    service = LeadService(db)
    lead = await service.get_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return await service.get_notes(lead_id)


@router.post(
    "/{lead_id}/notes",
    response_model=LeadNoteOut,
    status_code=status.HTTP_201_CREATED,
)
async def add_note(
    lead_id: int,
    data: LeadNoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = LeadService(db)
    lead = await service.get_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    note = await service.add_note(lead_id, data, author_id=current_user.id)
    await ActivityLogService(db).log(
        user_id=current_user.id,
        action=ActionType.LEAD_NOTE_ADDED,
        entity_type=EntityType.NOTE,
        entity_id=note.id,
        details={"lead_id": lead_id, "lead_title": lead.title},
    )
    return note


@router.delete(
    "/{lead_id}/notes/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_note(
    lead_id: int,
    note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = LeadService(db)
    lead = await service.get_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    note = await service.get_note(note_id)
    if not note or note.lead_id != lead_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    if note.author_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    await service.delete_note(note)
    await ActivityLogService(db).log(
        user_id=current_user.id,
        action=ActionType.LEAD_NOTE_DELETED,
        entity_type=EntityType.NOTE,
        entity_id=note_id,
        details={"lead_id": lead_id, "lead_title": lead.title},
    )
