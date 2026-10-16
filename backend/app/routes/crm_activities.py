"""CRM activities: logged interactions and follow-up tasks."""
from datetime import datetime, time, timedelta, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.crm_activity import ActivityType, CrmActivity
from app.models.customer import Customer
from app.models.customer_site import CustomerContact
from app.models.lead import Lead
from app.models.user import User
from app.schemas.crm_activity import ActivityCreate, ActivityOut, ActivitySummary, ActivityUpdate

router = APIRouter(prefix="/crm/activities", tags=["CRM activities"])


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _aware(dt: datetime | None) -> datetime | None:
    if dt is not None and dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def _to_out(a: CrmActivity, customer_name: str | None, assigned_name: str | None) -> ActivityOut:
    due = _aware(a.due_at)
    out = ActivityOut.model_validate(a)
    out.customer_name = customer_name
    out.assigned_name = assigned_name
    out.is_overdue = bool(due and a.completed_at is None and due < _now())
    return out


def _base_query():
    return (
        select(
            CrmActivity,
            func.coalesce(Customer.company, Customer.first_name + " " + Customer.last_name),
            func.coalesce(User.full_name, User.username),
        )
        .outerjoin(Customer, Customer.id == CrmActivity.customer_id)
        .outerjoin(User, User.id == CrmActivity.assigned_to)
    )


async def _load(db: AsyncSession, activity_id: int) -> ActivityOut:
    row = (await db.execute(_base_query().where(CrmActivity.id == activity_id))).first()
    if row is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Activity not found")
    return _to_out(*row)


async def _validate_links(db: AsyncSession, customer_id: int | None, lead_id: int | None, contact_id: int | None):
    if customer_id is not None and await db.get(Customer, customer_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Customer not found")
    if lead_id is not None and await db.get(Lead, lead_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Lead not found")
    if contact_id is not None:
        contact = await db.get(CustomerContact, contact_id)
        if contact is None or contact.customer_id != customer_id:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "The contact does not belong to this customer.")


@router.get("/", response_model=list[ActivityOut])
async def list_activities(
    customer_id: int | None = None,
    lead_id: int | None = None,
    state: Literal["open", "overdue", "done", "all"] = "all",
    mine: bool = False,
    skip: int = 0,
    limit: int = Query(100, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = _base_query()
    if customer_id is not None:
        q = q.where(CrmActivity.customer_id == customer_id)
    if lead_id is not None:
        q = q.where(CrmActivity.lead_id == lead_id)
    if mine:
        q = q.where(CrmActivity.assigned_to == current_user.id)
    if state == "open":
        q = q.where(CrmActivity.completed_at.is_(None), CrmActivity.due_at.is_not(None))
    elif state == "overdue":
        q = q.where(CrmActivity.completed_at.is_(None), CrmActivity.due_at < _now())
    elif state == "done":
        q = q.where(CrmActivity.completed_at.is_not(None))

    if state in ("open", "overdue"):
        q = q.order_by(CrmActivity.due_at.asc())
    else:
        q = q.order_by(func.coalesce(CrmActivity.completed_at, CrmActivity.created_at).desc())
    rows = (await db.execute(q.offset(skip).limit(limit))).all()
    return [_to_out(*r) for r in rows]


@router.get("/summary", response_model=ActivitySummary)
async def my_summary(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    now = _now()
    end_of_day = datetime.combine(now.date(), time.max, tzinfo=timezone.utc)
    base = select(func.count(CrmActivity.id)).where(
        CrmActivity.assigned_to == current_user.id, CrmActivity.completed_at.is_(None), CrmActivity.due_at.is_not(None),
    )
    open_n = (await db.execute(base)).scalar_one()
    overdue = (await db.execute(base.where(CrmActivity.due_at < now))).scalar_one()
    today = (await db.execute(base.where(CrmActivity.due_at >= now, CrmActivity.due_at <= end_of_day))).scalar_one()
    return ActivitySummary(open=open_n, overdue=overdue, due_today=today)


@router.post("/", response_model=ActivityOut, status_code=status.HTTP_201_CREATED)
async def create_activity(
    data: ActivityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.customer_id is None and data.lead_id is None:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "Link the activity to a customer or a lead.")
    await _validate_links(db, data.customer_id, data.lead_id, data.contact_id)
    # Interactions without a due date (call/visit/note...) are log entries; only TASK stays open without one.
    is_logged = data.completed or (data.due_at is None and data.type != ActivityType.TASK)
    activity = CrmActivity(
        type=data.type.value, subject=data.subject.strip(), notes=data.notes,
        customer_id=data.customer_id, lead_id=data.lead_id, contact_id=data.contact_id,
        due_at=data.due_at, completed_at=_now() if is_logged else None,
        assigned_to=data.assigned_to or current_user.id, created_by=current_user.id,
    )
    db.add(activity)
    await db.commit()
    return await _load(db, activity.id)


async def _require(db: AsyncSession, activity_id: int) -> CrmActivity:
    activity = await db.get(CrmActivity, activity_id)
    if activity is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Activity not found")
    return activity


@router.patch("/{activity_id}", response_model=ActivityOut)
async def update_activity(
    activity_id: int, data: ActivityUpdate,
    db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user),
):
    activity = await _require(db, activity_id)
    changes = data.model_dump(exclude_unset=True)
    if "contact_id" in changes:
        await _validate_links(db, activity.customer_id, None, changes["contact_id"])
    for k, v in changes.items():
        setattr(activity, k, v.value if hasattr(v, "value") else v)
    await db.commit()
    return await _load(db, activity_id)


@router.post("/{activity_id}/complete", response_model=ActivityOut)
async def complete_activity(activity_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    activity = await _require(db, activity_id)
    if activity.completed_at is None:
        activity.completed_at = _now()
        await db.commit()
    return await _load(db, activity_id)


@router.post("/{activity_id}/reopen", response_model=ActivityOut)
async def reopen_activity(activity_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    activity = await _require(db, activity_id)
    activity.completed_at = None
    if activity.due_at is None:
        activity.due_at = _now() + timedelta(days=1)
    await db.commit()
    return await _load(db, activity_id)


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    activity_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user),
):
    activity = await _require(db, activity_id)
    if not (current_user.is_superuser or current_user.id in (activity.created_by, activity.assigned_to)):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Only the creator or assignee can delete an activity.")
    await db.delete(activity)
    await db.commit()
