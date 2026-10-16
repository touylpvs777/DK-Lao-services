from datetime import date, datetime

from pydantic import BaseModel, Field, StringConstraints, field_validator
from typing import Annotated


PortalUsername = Annotated[str, StringConstraints(min_length=3, max_length=100, pattern=r"^[A-Za-z0-9._-]+$")]
PortalPassword = Annotated[str, StringConstraints(min_length=8, max_length=72)]


class CustomerPortalAccountCreate(BaseModel):
    customer_id: int = Field(gt=0)
    username: PortalUsername
    password: PortalPassword

    @field_validator("password")
    @classmethod
    def bcrypt_password_byte_limit(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return value


class CustomerPortalAccountUpdate(BaseModel):
    is_active: bool | None = None
    password: PortalPassword | None = None

    @field_validator("password")
    @classmethod
    def bcrypt_password_byte_limit(cls, value: str | None) -> str | None:
        if value is not None and len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return value


class CustomerPortalAccountOut(BaseModel):
    id: int
    customer_id: int
    customer_name: str
    company: str | None
    username: str
    is_active: bool
    created_at: datetime


class CustomerPortalLogin(BaseModel):
    username: PortalUsername
    password: str = Field(min_length=1, max_length=72)

    @field_validator("password")
    @classmethod
    def bcrypt_password_byte_limit(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return value


class CustomerPortalToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class PortalCustomer(BaseModel):
    id: int
    display_name: str
    company: str | None = None


class PortalSummary(BaseModel):
    forklift_count: int
    active_rental_count: int
    open_work_order_count: int
    outstanding_by_currency: dict[str, float]


class PortalForklift(BaseModel):
    id: int
    serial_number: str
    name_en: str
    name_lo: str | None = None
    model_number: str | None = None
    brand: str | None = None
    status: str
    fuel_type: str | None = None
    current_hour_meter: float


class PortalRentalContract(BaseModel):
    id: int
    contract_number: str
    status: str
    start_date: date
    end_date: date
    total_value: float
    currency: str


class PortalWorkOrder(BaseModel):
    id: int
    work_order_number: str
    status: str
    priority: str
    title: str
    scheduled_date: datetime
    completed_at: datetime | None = None
    forklift_serial_number: str
    forklift_name: str


class PortalInvoice(BaseModel):
    id: int
    invoice_number: str
    status: str
    total_amount: float
    balance_due: float
    currency: str
    due_date: date | None = None


class CustomerPortalDashboard(BaseModel):
    customer: PortalCustomer
    summary: PortalSummary
    forklifts: list[PortalForklift]
    rental_contracts: list[PortalRentalContract]
    work_orders: list[PortalWorkOrder]
    invoices: list[PortalInvoice]


class StorefrontCatalogItem(BaseModel):
    sku_code: str
    name: str
    description: str | None = None
    category: str
    brand: str | None = None
    unit: str
    unit_price: float
    currency: str
    image_url: str | None = None
    available_to_order: bool
    lead_time_days: int


class StorefrontCatalogOut(BaseModel):
    items: list[StorefrontCatalogItem]
    total: int
    skip: int
    limit: int
