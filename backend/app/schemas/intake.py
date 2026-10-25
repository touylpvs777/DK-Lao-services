from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, Field, model_validator

from app.models.rental_contract import ContractType
from app.models.work_order import WorkOrderPriority


class IntakeType(str, Enum):
    QUOTE_REQUEST = "quote_request"
    PARTS_ORDER = "parts_order"
    RENTAL_RESERVATION = "rental_reservation"
    SERVICE_REQUEST = "service_request"


class IntakeChannel(str, Enum):
    PHONE = "phone"
    WHATSAPP = "whatsapp"
    FACEBOOK = "facebook"
    LINE = "line"
    EMAIL = "email"
    WALK_IN = "walk_in"
    OTHER = "other"


class IntakeNewCustomer(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(default="-", min_length=1, max_length=100)
    phone: str | None = Field(default=None, min_length=3, max_length=20)
    email: str | None = Field(default=None, max_length=255, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    company: str | None = Field(default=None, max_length=255)

    @model_validator(mode="after")
    def need_a_way_to_reach_them(self):
        if not self.phone and not self.email:
            raise ValueError("A phone number or an email is required so staff can reply")
        return self


class IntakeItem(BaseModel):
    description: str = Field(..., min_length=1, max_length=1000)
    quantity: float = Field(default=1.0, gt=0)
    unit_price: float = Field(default=0.0, ge=0)
    spare_part_id: int | None = None


class IntakeCreate(BaseModel):
    intake_type: IntakeType
    channel: IntakeChannel = IntakeChannel.PHONE
    # Exactly one of these identifies who is asking.
    customer_id: int | None = None
    new_customer: IntakeNewCustomer | None = None

    subject: str = Field(..., min_length=1, max_length=200)
    details: str | None = Field(default=None, max_length=4000)
    notify_customer: bool = True

    # parts_order
    items: list[IntakeItem] = Field(default_factory=list, max_length=50)
    expected_delivery_date: date | None = None
    delivery_address: str | None = Field(default=None, max_length=1000)

    # rental_reservation / service_request
    forklift_id: int | None = None
    start_date: date | None = None
    end_date: date | None = None
    contract_type: ContractType = ContractType.SHORT_TERM
    daily_rate: float = Field(default=0.0, ge=0)
    monthly_rate: float = Field(default=0.0, ge=0)

    # service_request
    scheduled_date: datetime | None = None
    priority: WorkOrderPriority = WorkOrderPriority.NORMAL

    @model_validator(mode="after")
    def validate_shape(self):
        if (self.customer_id is None) == (self.new_customer is None):
            raise ValueError("Give either customer_id or new_customer")
        if self.intake_type == IntakeType.RENTAL_RESERVATION:
            if not self.forklift_id or not self.start_date or not self.end_date:
                raise ValueError("A rental reservation needs forklift_id, start_date and end_date")
            if self.end_date <= self.start_date:
                raise ValueError("end_date must be after start_date")
        if self.intake_type == IntakeType.SERVICE_REQUEST and not self.forklift_id:
            raise ValueError("A service request needs forklift_id")
        if self.intake_type == IntakeType.PARTS_ORDER and not self.items:
            raise ValueError("A parts order needs at least one item")
        return self


class IntakeResult(BaseModel):
    reference: str
    lead_id: int
    customer_id: int
    customer_name: str
    customer_created: bool
    document_type: str | None = None
    document_id: int | None = None
    document_number: str | None = None
    customer_notified: bool = False
