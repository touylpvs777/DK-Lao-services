"""Follow-up for leads that arrive from the public website.

Two jobs, both best effort: link the lead to an existing customer when there is exactly one
obvious match, and put an alert in the bell of the sales team so a new order is not missed.
"""
import logging
import re
from datetime import UTC, datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.customer import Customer
from app.models.lead import Lead
from app.models.notification import Notification, NotificationChannel, NotificationStatus
from app.models.role import Role, RoleName
from app.models.user import User
from app.schemas.public_inquiry import PublicInquiryCreate, PublicInquiryType
from app.services.notification_service import ADMIN_ROLE

logger = logging.getLogger(__name__)

WEBSITE_LEAD_EVENT = "lead.website"
# Phone numbers are compared on their last digits so +856 20 5555 1234 matches 020 5555 1234.
_PHONE_TAIL_DIGITS = 8


def _digits(value: str | None) -> str:
    return re.sub(r"\D", "", value or "")


def _phone_digits_expr():
    """The customer's stored phone with spaces, dashes, brackets, dots and + removed, in SQL."""
    expr = Customer.phone
    for ch in (" ", "-", "(", ")", ".", "+"):
        expr = func.replace(expr, ch, "")
    return expr


async def find_customer_by_contact(db: AsyncSession, phone: str | None, email: str | None) -> Customer | None:
    """Return the one existing customer with this phone or email, or None.

    Matches on phone first, then on email. When several customers share the number the match is
    ambiguous, so nothing is linked and staff decide.
    """
    digits = _digits(phone)
    if len(digits) >= _PHONE_TAIL_DIGITS:
        tail = digits[-_PHONE_TAIL_DIGITS:]
        rows = (await db.execute(
            select(Customer).where(Customer.phone.is_not(None), _phone_digits_expr().like(f"%{tail}"))
            .limit(2)
        )).scalars().all()
        if len(rows) == 1:
            return rows[0]
        if len(rows) > 1:
            return None

    if email:
        rows = (await db.execute(
            select(Customer).where(func.lower(Customer.email) == email.strip().lower()).limit(2)
        )).scalars().all()
        if len(rows) == 1:
            return rows[0]
    return None


async def find_customer_for_inquiry(db: AsyncSession, data: PublicInquiryCreate) -> Customer | None:
    return await find_customer_by_contact(db, data.phone_number, data.email)


async def notify_sales_of_website_lead(
    db: AsyncSession, lead: Lead, data: PublicInquiryCreate, matched_customer: str | None, reference: str,
) -> int:
    """Alert every active sales user and the admin feed. Returns how many alerts were created."""
    is_order = data.inquiry_type == PublicInquiryType.STORE_ORDER
    who = data.company_name or data.customer_name
    contact = data.phone_number or data.email or ""
    detail = [f"{who} · {contact}".strip(" ·")]
    if is_order:
        total = f"{data.total_lak:,.0f} LAK" if data.total_lak else f"{len(data.items)} items"
        detail.append(f"{len(data.items)} items · {total}")
    detail.append(
        f"Existing customer: {matched_customer}" if matched_customer else "New contact, not in customers yet"
    )
    subject = f"{'New website order' if is_order else 'New website inquiry'} {reference}"
    message = " · ".join(detail)

    sales_user_ids = (await db.execute(
        select(User.id).join(Role, Role.id == User.role_id)
        .where(User.is_active.is_(True), Role.name == RoleName.SALES.value)
    )).scalars().all()

    now = datetime.now(UTC)

    def alert(**target) -> Notification:
        return Notification(
            channel=NotificationChannel.IN_APP.value, status=NotificationStatus.SENT.value,
            subject=subject, message=message, event_type=WEBSITE_LEAD_EVENT,
            entity_type="lead", entity_id=lead.id, sent_at=now, **target,
        )

    alerts = [alert(recipient=f"user:{uid}", recipient_user_id=uid) for uid in sales_user_ids]
    alerts.append(alert(recipient=f"role:{ADMIN_ROLE}", target_role=ADMIN_ROLE))
    db.add_all(alerts)
    await db.commit()
    return len(alerts)
