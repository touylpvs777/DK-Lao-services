from collections import defaultdict
from datetime import timedelta
import secrets

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.security import create_customer_portal_token, decode_token, hash_password, verify_password
from app.database.session import get_db
from app.dependencies import get_current_superuser
from app.models.customer import Customer
from app.models.customer_portal_account import CustomerPortalAccount
from app.models.forklift import Forklift
from app.models.invoice import Invoice
from app.models.rental_contract import RentalContract
from app.models.revoked_token import RevokedToken
from app.models.user import User
from app.models.work_order import WorkOrder
from app.schemas.customer_portal import (
    CustomerPortalAccountCreate,
    CustomerPortalAccountOut,
    CustomerPortalAccountUpdate,
    CustomerPortalDashboard,
    CustomerPortalLogin,
    CustomerPortalToken,
    PortalCustomer,
    PortalForklift,
    PortalInvoice,
    PortalRentalContract,
    PortalSummary,
    PortalWorkOrder,
)

router = APIRouter(prefix="/portal", tags=["Customer Portal"])
portal_bearer = HTTPBearer(auto_error=False)
_DUMMY_PASSWORD_HASH = hash_password(secrets.token_urlsafe(48))
_OPEN_WORK_ORDERS = {"scheduled", "due", "in_progress"}
_HIDDEN_INVOICES = {"draft", "cancelled", "voided"}


def _account_out(account: CustomerPortalAccount) -> CustomerPortalAccountOut:
    customer = account.customer
    return CustomerPortalAccountOut(
        id=account.id,
        customer_id=account.customer_id,
        customer_name=f"{customer.first_name} {customer.last_name}".strip(),
        company=customer.company,
        username=account.username,
        is_active=account.is_active,
        created_at=account.created_at,
    )


async def get_current_portal_account(
    credentials: HTTPAuthorizationCredentials | None = Depends(portal_bearer),
    db: AsyncSession = Depends(get_db),
) -> CustomerPortalAccount:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate customer portal credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized
    try:
        payload = decode_token(credentials.credentials)
        if payload.get("type") != "customer_portal":
            raise unauthorized
        account_id = int(payload.get("sub", ""))
        token_version = int(payload.get("ver", -1))
        jti = payload.get("jti")
    except (ValueError, TypeError):
        raise unauthorized

    if jti:
        revoked = await db.execute(select(RevokedToken).where(RevokedToken.jti == jti))
        if revoked.scalar_one_or_none() is not None:
            raise unauthorized

    account = await db.scalar(
        select(CustomerPortalAccount)
        .where(CustomerPortalAccount.id == account_id)
        .options(selectinload(CustomerPortalAccount.customer))
    )
    if (
        account is None
        or not account.is_active
        or account.token_version != token_version
    ):
        raise unauthorized
    return account


@router.post("/auth/login", response_model=CustomerPortalToken)
async def login(data: CustomerPortalLogin, db: AsyncSession = Depends(get_db)):
    account = await db.scalar(
        select(CustomerPortalAccount).where(
            CustomerPortalAccount.username == data.username.lower()
        )
    )
    password_matches = verify_password(
        data.password,
        account.hashed_password if account is not None else _DUMMY_PASSWORD_HASH,
    )
    if account is None or not account.is_active or not password_matches:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    token = create_customer_portal_token(
        account.id,
        account.token_version,
        expires_delta=timedelta(seconds=expires_in),
    )
    return CustomerPortalToken(access_token=token, expires_in=expires_in)


@router.get("/dashboard", response_model=CustomerPortalDashboard)
async def get_dashboard(
    account: CustomerPortalAccount = Depends(get_current_portal_account),
    db: AsyncSession = Depends(get_db),
):
    customer_id = account.customer_id
    customer = account.customer

    forklift_result = await db.execute(
        select(Forklift)
        .where(Forklift.customer_id == customer_id, Forklift.is_active.is_(True))
        .options(selectinload(Forklift.brand))
        .order_by(Forklift.serial_number)
    )
    forklifts = list(forklift_result.scalars().all())

    contract_result = await db.execute(
        select(RentalContract)
        .where(RentalContract.customer_id == customer_id)
        .order_by(RentalContract.start_date.desc())
    )
    contracts = list(contract_result.scalars().all())

    work_order_result = await db.execute(
        select(WorkOrder)
        .join(Forklift, WorkOrder.forklift_id == Forklift.id)
        .where(Forklift.customer_id == customer_id, WorkOrder.is_active.is_(True))
        .options(selectinload(WorkOrder.forklift))
        .order_by(WorkOrder.scheduled_date.desc())
    )
    work_orders = list(work_order_result.scalars().all())

    invoice_result = await db.execute(
        select(Invoice)
        .where(Invoice.customer_id == customer_id)
        .order_by(Invoice.created_at.desc())
    )
    invoices = [
        invoice for invoice in invoice_result.scalars().all()
        if invoice.status not in _HIDDEN_INVOICES
    ]

    outstanding_by_currency: dict[str, float] = defaultdict(float)
    for invoice in invoices:
        if invoice.status in {"issued", "sent", "partially_paid", "overdue"}:
            outstanding_by_currency[invoice.currency] += invoice.balance_due

    return CustomerPortalDashboard(
        customer=PortalCustomer(
            id=customer.id,
            display_name=f"{customer.first_name} {customer.last_name}".strip(),
            company=customer.company,
        ),
        summary=PortalSummary(
            forklift_count=len(forklifts),
            active_rental_count=sum(contract.status == "active" for contract in contracts),
            open_work_order_count=sum(order.status in _OPEN_WORK_ORDERS for order in work_orders),
            outstanding_by_currency=dict(outstanding_by_currency),
        ),
        forklifts=[
            PortalForklift(
                id=forklift.id,
                serial_number=forklift.serial_number,
                name_en=forklift.name_en,
                name_lo=forklift.name_lo,
                model_number=forklift.model_number,
                brand=forklift.brand.name if forklift.brand else None,
                status=forklift.status,
                fuel_type=forklift.fuel_type,
                current_hour_meter=forklift.current_hour_meter,
            )
            for forklift in forklifts
        ],
        rental_contracts=[
            PortalRentalContract(
                id=contract.id,
                contract_number=contract.contract_number,
                status=contract.status,
                start_date=contract.start_date,
                end_date=contract.end_date,
                total_value=contract.total_value,
                currency=contract.currency,
            )
            for contract in contracts
        ],
        work_orders=[
            PortalWorkOrder(
                id=order.id,
                work_order_number=order.work_order_number,
                status=order.status,
                priority=order.priority,
                title=order.title,
                scheduled_date=order.scheduled_date,
                completed_at=order.completed_at,
                forklift_serial_number=order.forklift.serial_number,
                forklift_name=order.forklift.name_en,
            )
            for order in work_orders
        ],
        invoices=[
            PortalInvoice(
                id=invoice.id,
                invoice_number=invoice.invoice_number,
                status=invoice.status,
                total_amount=invoice.total_amount,
                balance_due=invoice.balance_due,
                currency=invoice.currency,
                due_date=invoice.due_date,
            )
            for invoice in invoices
        ],
    )


@router.get("/accounts", response_model=list[CustomerPortalAccountOut])
async def list_portal_accounts(
    customer_id: int | None = Query(default=None, gt=0),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_superuser),
):
    query = select(CustomerPortalAccount).options(selectinload(CustomerPortalAccount.customer))
    if customer_id is not None:
        query = query.where(CustomerPortalAccount.customer_id == customer_id)
    result = await db.execute(
        query.order_by(CustomerPortalAccount.id).offset(skip).limit(limit)
    )
    return [_account_out(account) for account in result.scalars().all()]


@router.post("/accounts", response_model=CustomerPortalAccountOut, status_code=status.HTTP_201_CREATED)
async def create_portal_account(
    data: CustomerPortalAccountCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_superuser),
):
    customer = await db.get(Customer, data.customer_id)
    if customer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    account = CustomerPortalAccount(
        customer_id=data.customer_id,
        username=data.username.lower(),
        hashed_password=hash_password(data.password),
    )
    db.add(account)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A portal account already exists for this customer or username",
        ) from exc
    account = await db.scalar(
        select(CustomerPortalAccount)
        .where(CustomerPortalAccount.id == account.id)
        .options(selectinload(CustomerPortalAccount.customer))
    )
    return _account_out(account)


@router.patch("/accounts/{account_id}", response_model=CustomerPortalAccountOut)
async def update_portal_account(
    account_id: int,
    data: CustomerPortalAccountUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_superuser),
):
    account = await db.scalar(
        select(CustomerPortalAccount)
        .where(CustomerPortalAccount.id == account_id)
        .options(selectinload(CustomerPortalAccount.customer))
    )
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portal account not found")
    changed = False
    if data.is_active is not None and data.is_active != account.is_active:
        account.is_active = data.is_active
        changed = True
    if data.password is not None:
        account.hashed_password = hash_password(data.password)
        changed = True
    if changed:
        account.token_version += 1
        await db.commit()
        await db.refresh(account)
    return _account_out(account)
