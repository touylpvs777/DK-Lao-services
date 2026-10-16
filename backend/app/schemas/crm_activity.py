from datetime import datetime

from pydantic import BaseModel, Field

from app.models.crm_activity import ActivityType


class ActivityCreate(BaseModel):
    type: ActivityType = ActivityType.TASK
    subject: str = Field(..., min_length=1, max_length=255)
    notes: str | None = None
    customer_id: int | None = None
    lead_id: int | None = None
    contact_id: int | None = None
    due_at: datetime | None = None
    assigned_to: int | None = None
    # Log an interaction that already happened (call made, visit done...).
    completed: bool = False


class ActivityUpdate(BaseModel):
    type: ActivityType | None = None
    subject: str | None = Field(default=None, min_length=1, max_length=255)
    notes: str | None = None
    contact_id: int | None = None
    due_at: datetime | None = None
    assigned_to: int | None = None


class ActivityOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    type: str
    subject: str
    notes: str | None = None
    customer_id: int | None = None
    customer_name: str | None = None
    lead_id: int | None = None
    contact_id: int | None = None
    due_at: datetime | None = None
    completed_at: datetime | None = None
    assigned_to: int | None = None
    assigned_name: str | None = None
    created_by: int | None = None
    created_at: datetime
    is_overdue: bool = False


class ActivitySummary(BaseModel):
    open: int
    overdue: int
    due_today: int
