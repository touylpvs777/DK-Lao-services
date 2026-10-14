from fastapi import HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.customer import Customer
from app.models.forklift import Forklift
from app.models.invoice import Invoice, InvoiceStatus
from app.models.lead import Lead, LeadStatus
from app.models.quotation import Quotation, QuotationStatus
from app.models.sales_order import SalesOrder
from app.models.rental_contract import RentalContract, RentalContractStatus
from app.models.work_order import WorkOrder, WorkOrderStatus
from app.schemas.customer import (
    Customer360Forklift,
    Customer360Invoice,
    Customer360Lead,
    Customer360Out,
    Customer360Quotation,
    Customer360SalesOrder,
    Customer360RentalContract,
    Customer360Summary,
    Customer360WorkOrder,
    CustomerCreate,
    CustomerOut,
    CustomerUpdate,
)

_OPEN_WORK_ORDER_STATUSES = {
    WorkOrderStatus.SCHEDULED.value,
    WorkOrderStatus.DUE.value,
    WorkOrderStatus.IN_PROGRESS.value,
}
_OUTSTANDING_INVOICE_STATUSES = {
    InvoiceStatus.ISSUED.value,
    InvoiceStatus.SENT.value,
    InvoiceStatus.PARTIALLY_PAID.value,
    InvoiceStatus.OVERDUE.value,
}


class CustomerService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, customer_id: int) -> Customer | None:
        result = await self.db.execute(select(Customer).where(Customer.id == customer_id))
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100, q: str | None = None) -> list[Customer]:
        stmt = select(Customer)
        if q:
            pattern = f"%{q}%"
            stmt = stmt.where(or_(
                Customer.first_name.ilike(pattern),
                Customer.last_name.ilike(pattern),
                Customer.email.ilike(pattern),
                Customer.phone.ilike(pattern),
                Customer.company.ilike(pattern),
            ))
        stmt = stmt.offset(skip).limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create(self, data: CustomerCreate, created_by: int) -> Customer:
        customer = Customer(**data.model_dump(), created_by=created_by)
        self.db.add(customer)
        try:
            await self.db.commit()
            await self.db.refresh(customer)
            return customer
        except IntegrityError:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A customer with this email address already exists.",
            )

    async def update(self, customer: Customer, data: CustomerUpdate) -> Customer:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(customer, field, value)
        try:
            await self.db.commit()
            await self.db.refresh(customer)
            return customer
        except IntegrityError:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A customer with this email address already exists.",
            )

    async def delete(self, customer: Customer) -> None:
        await self.db.delete(customer)
        await self.db.commit()

    async def get_360(self, customer_id: int) -> Customer360Out | None:
        customer = await self.get_by_id(customer_id)
        if not customer:
            return None

        forklifts_result = await self.db.execute(
            select(Forklift)
            .where(Forklift.customer_id == customer_id)
            .order_by(Forklift.serial_number)
        )
        forklifts = list(forklifts_result.scalars().all())

        contracts_result = await self.db.execute(
            select(RentalContract)
            .where(RentalContract.customer_id == customer_id)
            .order_by(RentalContract.start_date.desc())
        )
        contracts = list(contracts_result.scalars().all())

        work_orders_result = await self.db.execute(
            select(WorkOrder)
            .join(Forklift, WorkOrder.forklift_id == Forklift.id)
            .where(Forklift.customer_id == customer_id)
            .options(selectinload(WorkOrder.forklift))
            .order_by(WorkOrder.scheduled_date.desc())
        )
        work_orders = list(work_orders_result.scalars().all())

        invoices_result = await self.db.execute(
            select(Invoice)
            .where(Invoice.customer_id == customer_id)
            .order_by(Invoice.created_at.desc())
        )
        invoices = list(invoices_result.scalars().all())

        quotations = list((await self.db.execute(
            select(Quotation).where(Quotation.customer_id == customer_id)
            .order_by(Quotation.created_at.desc())
        )).scalars().all())
        sales_orders = list((await self.db.execute(
            select(SalesOrder).where(SalesOrder.customer_id == customer_id)
            .order_by(SalesOrder.created_at.desc())
        )).scalars().all())
        leads = list((await self.db.execute(
            select(Lead).where(Lead.customer_id == customer_id)
            .order_by(Lead.created_at.desc())
        )).scalars().all())

        _OPEN_QUOTATION = {
            QuotationStatus.DRAFT.value, QuotationStatus.UNDER_REVIEW.value, QuotationStatus.APPROVED.value,
            QuotationStatus.REVISION.value, QuotationStatus.SENT.value,
        }
        _CLOSED_LEAD = {LeadStatus.WON, LeadStatus.LOST}
        billable = [inv for inv in invoices if inv.status not in ("draft", "cancelled", "voided")]

        summary = Customer360Summary(
            total_invoiced=sum(inv.total_amount for inv in billable),
            total_paid=sum(inv.amount_paid for inv in billable),
            open_quotation_count=sum(1 for q in quotations if q.status in _OPEN_QUOTATION),
            open_pipeline_value=sum((l.value or 0.0) for l in leads if l.status not in _CLOSED_LEAD),
            forklift_count=len(forklifts),
            active_rental_count=sum(
                1 for c in contracts if c.status == RentalContractStatus.ACTIVE.value
            ),
            open_work_order_count=sum(
                1 for wo in work_orders if wo.status in _OPEN_WORK_ORDER_STATUSES
            ),
            total_outstanding=sum(
                inv.balance_due for inv in invoices
                if inv.status in _OUTSTANDING_INVOICE_STATUSES
            ),
            currency=invoices[0].currency if invoices else "LAK",
        )

        return Customer360Out(
            customer=CustomerOut.model_validate(customer),
            summary=summary,
            forklifts=[Customer360Forklift.model_validate(f) for f in forklifts],
            rental_contracts=[Customer360RentalContract.model_validate(c) for c in contracts],
            work_orders=[Customer360WorkOrder.model_validate(wo) for wo in work_orders],
            invoices=[Customer360Invoice.model_validate(inv) for inv in invoices],
            quotations=[Customer360Quotation.model_validate(q) for q in quotations],
            sales_orders=[Customer360SalesOrder.model_validate(s) for s in sales_orders],
            leads=[Customer360Lead.model_validate(l) for l in leads],
        )
