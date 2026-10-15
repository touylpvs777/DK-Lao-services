from datetime import datetime

from pydantic import BaseModel, Field


class SiteBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    address: str | None = None
    district: str | None = None
    province: str | None = None
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    is_primary: bool = False
    notes: str | None = None


class SiteCreate(SiteBase):
    pass


class SiteUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    address: str | None = None
    district: str | None = None
    province: str | None = None
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    is_primary: bool | None = None
    notes: str | None = None


class SiteOut(SiteBase):
    model_config = {"from_attributes": True}
    id: int
    customer_id: int
    created_at: datetime


class ContactBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    site_id: int | None = None
    position: str | None = None
    phone: str | None = None
    whatsapp: str | None = None
    email: str | None = None
    is_primary: bool = False
    notes: str | None = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    site_id: int | None = None
    position: str | None = None
    phone: str | None = None
    whatsapp: str | None = None
    email: str | None = None
    is_primary: bool | None = None
    notes: str | None = None


class ContactOut(ContactBase):
    model_config = {"from_attributes": True}
    id: int
    customer_id: int
    created_at: datetime
