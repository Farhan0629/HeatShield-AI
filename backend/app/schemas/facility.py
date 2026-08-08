from pydantic import BaseModel, Field
from typing import Optional

class FacilityBase(BaseModel):
    name: str = Field(..., example="Kolkata Distribution Warehouse")
    type: str = Field(..., example="Warehouse")
    location: str = Field(..., example="Kolkata, West Bengal, India")
    latitude: float = Field(..., example=22.5726)
    longitude: float = Field(..., example=88.3639)
    workers_count: int = Field(..., example=240)
    operating_hours: str = Field(..., example="06:00 - 22:00 IST")
    exposure_type: str = Field(..., example="Hybrid (Indoor/Outdoor)")
    cooling_availability: str = Field(..., example="Partial Evaporative Cooling")

class FacilityCreate(FacilityBase):
    pass

class FacilityUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    workers_count: Optional[int] = None
    operating_hours: Optional[str] = None
    exposure_type: Optional[str] = None
    cooling_availability: Optional[str] = None

class Facility(FacilityBase):
    id: str
    risk_score: float
    risk_level: str
    current_temperature: float
    status: str

    class Config:
        from_attributes = True
