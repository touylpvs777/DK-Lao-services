import enum
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database.base import Base


class ChecklistResult(str, enum.Enum):
    PENDING = "pending"
    OK = "ok"
    ATTENTION = "attention"   # works, but needs follow-up
    FAIL = "fail"
    NA = "na"


class WorkOrderChecklistItem(Base):
    """One inspection point of a work order; copied from the plan's checklist on creation."""
    __tablename__ = "work_order_checklist_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    work_order_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("work_orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    label: Mapped[str] = mapped_column(String(300), nullable=False)
    result: Mapped[str] = mapped_column(String(20), default=ChecklistResult.PENDING.value, nullable=False, index=True)
    remark: Mapped[str | None] = mapped_column(Text, nullable=True)
    checked_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    checked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
