"""Sales & CRM dashboard: pipeline, quotation conversion, receivables aging,
fleet utilisation and top customers — all computed from the live modules."""
from datetime import date, timedelta

from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.customer import Customer
from app.models.forklift import Forklift
from app.models.invoice import Invoice
from app.models.lead import Lead, LeadStatus
from app.models.quotation import Quotation
from app.models.sales_order import SalesOrder

_OUTSTANDING = ("issued", "sent", "partially_paid", "overdue")
_NOT_BILLED = ("draft", "cancelled", "voided")


class StatusBucket(BaseModel):
    status: str
    count: int
    value: float = 0.0


class AgingBucket(BaseModel):
    label: str
    amount: float
    count: int


class TopCustomer(BaseModel):
    customer_id: int
    name: str
    invoiced: float
    paid: float


class CrmSummary(BaseModel):
    pipeline: list[StatusBucket]
    open_pipeline_value: float
    win_rate: float            # won / (won + lost), 0..1
    quotations: list[StatusBucket]
    quotation_conversion_rate: float  # (accepted + converted) / sent-or-later, 0..1
    sales_orders: list[StatusBucket]
    receivables_total: float
    receivables_aging: list[AgingBucket]
    fleet: list[StatusBucket]
    fleet_utilisation: float   # rented / (rented + in_stock + reserved + in_service), 0..1
    top_customers: list[TopCustomer]
    currency: str = "LAK"


def _rate(num: float, den: float) -> float:
    return round(num / den, 4) if den else 0.0


class CrmDashboardService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_summary(self) -> CrmSummary:
        # ── Lead pipeline ────────────────────────────────────────────────
        rows = (await self.db.execute(
            select(Lead.status, func.count(Lead.id), func.coalesce(func.sum(Lead.value), 0.0)).group_by(Lead.status)
        )).all()
        by_lead = {(s.value if hasattr(s, "value") else s): (c, float(v)) for s, c, v in rows}
        pipeline = [
            StatusBucket(status=s.value, count=by_lead.get(s.value, (0, 0.0))[0], value=by_lead.get(s.value, (0, 0.0))[1])
            for s in LeadStatus
        ]
        won, lost = by_lead.get("won", (0, 0))[0], by_lead.get("lost", (0, 0))[0]
        open_value = sum(b.value for b in pipeline if b.status not in ("won", "lost"))

        # ── Quotations ───────────────────────────────────────────────────
        rows = (await self.db.execute(
            select(Quotation.status, func.count(Quotation.id), func.coalesce(func.sum(Quotation.total_amount), 0.0))
            .group_by(Quotation.status)
        )).all()
        q = {s: (c, float(v)) for s, c, v in rows}
        quotations = [StatusBucket(status=s, count=c, value=v) for s, (c, v) in sorted(q.items())]
        decided = sum(q.get(s, (0, 0))[0] for s in ("sent", "accepted", "converted", "rejected", "expired"))
        won_q = sum(q.get(s, (0, 0))[0] for s in ("accepted", "converted"))

        # ── Sales orders ─────────────────────────────────────────────────
        rows = (await self.db.execute(
            select(SalesOrder.status, func.count(SalesOrder.id), func.coalesce(func.sum(SalesOrder.total_amount), 0.0))
            .group_by(SalesOrder.status)
        )).all()
        sales_orders = [StatusBucket(status=s, count=c, value=float(v)) for s, c, v in sorted(rows)]

        # ── Receivables aging (by due date) ──────────────────────────────
        today = date.today()
        invoices = (await self.db.execute(
            select(Invoice.due_date, Invoice.balance_due).where(Invoice.status.in_(_OUTSTANDING))
        )).all()
        edges = [("Current", None), ("1-30 days", 30), ("31-60 days", 60), ("60+ days", None)]
        sums = {label: [0.0, 0] for label, _ in edges}
        for due, bal in invoices:
            late = (today - due).days if due else 0
            label = "Current" if late <= 0 else "1-30 days" if late <= 30 else "31-60 days" if late <= 60 else "60+ days"
            sums[label][0] += float(bal or 0)
            sums[label][1] += 1
        aging = [AgingBucket(label=k, amount=round(v[0], 2), count=v[1]) for k, v in sums.items()]

        # ── Fleet ────────────────────────────────────────────────────────
        rows = (await self.db.execute(select(Forklift.status, func.count(Forklift.id)).group_by(Forklift.status))).all()
        f = dict(rows)
        fleet = [StatusBucket(status=s, count=c) for s, c in sorted(f.items())]
        active_pool = sum(f.get(s, 0) for s in ("rented", "in_stock", "reserved", "in_service"))

        # ── Top customers ────────────────────────────────────────────────
        rows = (await self.db.execute(
            select(
                Customer.id, Customer.company, Customer.first_name, Customer.last_name,
                func.coalesce(func.sum(Invoice.total_amount), 0.0), func.coalesce(func.sum(Invoice.amount_paid), 0.0),
            )
            .join(Invoice, Invoice.customer_id == Customer.id)
            .where(Invoice.status.notin_(_NOT_BILLED))
            .group_by(Customer.id)
            .order_by(func.sum(Invoice.total_amount).desc())
            .limit(5)
        )).all()
        top = [
            TopCustomer(customer_id=cid, name=company or f"{fn} {ln}", invoiced=float(inv), paid=float(paid))
            for cid, company, fn, ln, inv, paid in rows
        ]

        return CrmSummary(
            pipeline=pipeline, open_pipeline_value=round(open_value, 2), win_rate=_rate(won, won + lost),
            quotations=quotations, quotation_conversion_rate=_rate(won_q, decided),
            sales_orders=sales_orders,
            receivables_total=round(sum(a.amount for a in aging), 2), receivables_aging=aging,
            fleet=fleet, fleet_utilisation=_rate(f.get("rented", 0), active_pool),
            top_customers=top,
        )
