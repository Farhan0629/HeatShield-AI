from fastapi import APIRouter, HTTPException, Query
from app.config import settings
from app.models.in_memory_db import db
from app.services.providers.mock_fortyguard import MockFortyGuardProvider
from app.services.providers.fortyguard import FortyGuardProvider
from app.schemas.heat import EnvironmentalMetrics, HeatForecastResponse, HeatmapGeoJSONResponse

router = APIRouter(prefix="/api/heat", tags=["heat"])

def get_data_provider():
    if settings.FORTYGUARD_MODE == "live":
        return FortyGuardProvider()
    return MockFortyGuardProvider()

@router.get("/current/{facility_id}", response_model=EnvironmentalMetrics)
async def get_current_conditions(facility_id: str):
    facility = db.get_facility(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    provider = get_data_provider()
    return await provider.get_current_conditions(facility_id, facility.latitude, facility.longitude)

@router.get("/forecast/{facility_id}", response_model=HeatForecastResponse)
async def get_forecast(facility_id: str, hours: int = Query(default=12, ge=1, le=24)):
    facility = db.get_facility(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    provider = get_data_provider()
    return await provider.get_forecast(facility_id, facility.latitude, facility.longitude, hours=hours)

@router.get("/heatmap/{facility_id}", response_model=HeatmapGeoJSONResponse)
async def get_heatmap(facility_id: str):
    facility = db.get_facility(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    provider = get_data_provider()
    return await provider.get_heatmap(facility_id, facility.latitude, facility.longitude)
