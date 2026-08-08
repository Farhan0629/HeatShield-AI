from fastapi import APIRouter, HTTPException
from typing import List
from app.models.in_memory_db import db
from app.schemas.facility import Facility, FacilityCreate, FacilityUpdate

router = APIRouter(prefix="/api/facilities", tags=["facilities"])

@router.get("", response_model=List[Facility])
async def list_facilities():
    return db.get_facilities()

@router.post("", response_model=Facility)
async def create_facility(payload: FacilityCreate):
    return db.create_facility(payload)

@router.get("/{facility_id}", response_model=Facility)
async def get_facility(facility_id: str):
    facility = db.get_facility(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility

@router.put("/{facility_id}", response_model=Facility)
async def update_facility(facility_id: str, payload: FacilityUpdate):
    facility = db.update_facility(facility_id, payload)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility
