from enum import Enum

from pydantic import BaseModel, Field, model_validator


class PublicInquiryType(str, Enum):
    SERVICE = "service"
    STORE_ORDER = "store_order"


class PublicInquiryCategory(str, Enum):
    SALE = "sale_inquiry"
    RENTAL = "rental_b2b"
    SERVICE = "standard"
    SPARE_PARTS = "spare_parts"
    STORE_ORDER = "store_order"


class PublicPaymentMethod(str, Enum):
    BCEL_ONE_QR = "BCEL_ONE_QR"
    BANK_TRANSFER = "BANK_TRANSFER"
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY"
    B2B_PO = "B2B_PO"


class PublicInquiryItem(BaseModel):
    sku_code: str = Field(..., min_length=1, max_length=100)
    part_name: str = Field(..., min_length=1, max_length=300)
    unit_price: float = Field(..., ge=0, le=1_000_000_000)
    quantity: int = Field(..., ge=1, le=10_000)


class PublicInquiryCreate(BaseModel):
    inquiry_type: PublicInquiryType
    category: PublicInquiryCategory
    customer_name: str = Field(..., min_length=1, max_length=200)
    # A phone number is required, except for contact-form messages that give an email instead.
    phone_number: str | None = Field(default=None, min_length=3, max_length=50)
    email: str | None = Field(default=None, max_length=200, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    company_name: str | None = Field(default=None, max_length=200)
    province: str | None = Field(default=None, max_length=120)
    district: str | None = Field(default=None, max_length=120)
    delivery_address: str | None = Field(default=None, max_length=1000)
    brand: str | None = Field(default=None, max_length=150)
    details: str | None = Field(default=None, max_length=4000)
    payment_method: PublicPaymentMethod | None = None
    total_usd: float | None = Field(default=None, ge=0, le=1_000_000_000)
    total_lak: float | None = Field(default=None, ge=0, le=1_000_000_000_000)
    slip_reference: str | None = Field(default=None, max_length=200)
    tax_company_name: str | None = Field(default=None, max_length=200)
    tax_id: str | None = Field(default=None, max_length=100)
    notes: str | None = Field(default=None, max_length=2000)
    items: list[PublicInquiryItem] = Field(default_factory=list, max_length=30)

    @model_validator(mode="after")
    def validate_inquiry_shape(self):
        if not self.phone_number and not self.email:
            raise ValueError("A phone number or an email is required so staff can reply")
        if self.inquiry_type == PublicInquiryType.STORE_ORDER:
            if not self.phone_number:
                raise ValueError("Store orders need a phone number")
            if self.category != PublicInquiryCategory.STORE_ORDER or not self.items:
                raise ValueError("Store inquiries need the store_order category and at least one item")
        elif self.category == PublicInquiryCategory.STORE_ORDER:
            raise ValueError("Service inquiries cannot use the store_order category")
        return self


class PublicInquiryOut(BaseModel):
    reference_number: str
    status: str = "received"


class PublicOrderTrackItem(BaseModel):
    sku_code: str
    part_name: str
    unit_price: float
    quantity: int
    subtotal: float


class PublicOrderTrackOut(BaseModel):
    """What a customer may see about their website order: no staff notes, no other contacts."""
    reference_number: str
    status: str  # PENDING | CONFIRMED | CANCELLED
    customer_name: str
    payment_method: str | None = None
    total_usd: float = 0
    total_lak: float = 0
    created_at: str
    items: list[PublicOrderTrackItem] = Field(default_factory=list)
