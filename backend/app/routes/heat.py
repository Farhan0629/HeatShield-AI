import logging
from fastapi import APIRouter, HTTPException, Query
from app.config import settings
from app.models.in_memory_db import db
from app.services.providers.fortyguard import FortyGuardProvider
from app.schemas.heat import EnvironmentalMetrics, HeatForecastResponse, HeatmapGeoJSONResponse

logger = logging.getLogger("heatshield.routes.heat")
router = APIRouter(prefix="/api/heat", tags=["heat"])

_live_provider: FortyGuardProvider = FortyGuardProvider()

def get_live_provider() -> FortyGuardProvider:
    global _live_provider
    if _live_provider is None:
        _live_provider = FortyGuardProvider()
    return _live_provider

@router.get("/current/{facility_id}", response_model=EnvironmentalMetrics)
async def get_current_conditions(facility_id: str):
    facility = db.get_facility(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    provider = get_live_provider()
    try:
        metrics = await provider.get_current_conditions(facility_id, facility.latitude, facility.longitude)
        metrics.is_demo_data = False
        return metrics
    except Exception as e:
        logger.error(f"FortyGuard live get_current_conditions failed: {e}")
        raise HTTPException(status_code=502, detail=f"FortyGuard live telemetry error: {str(e)}")

@router.get("/forecast/{facility_id}", response_model=HeatForecastResponse)
async def get_forecast(facility_id: str, hours: int = Query(default=12, ge=1, le=24)):
    facility = db.get_facility(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    provider = get_live_provider()
    try:
        forecast = await provider.get_forecast(facility_id, facility.latitude, facility.longitude, hours=hours)
        forecast.is_demo_data = False
        return forecast
    except Exception as e:
        logger.error(f"FortyGuard live get_forecast failed: {e}")
        raise HTTPException(status_code=502, detail=f"FortyGuard live forecast error: {str(e)}")

@router.get("/heatmap/{facility_id}", response_model=HeatmapGeoJSONResponse)
async def get_heatmap(facility_id: str):
    facility = db.get_facility(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    provider = get_live_provider()
    try:
        heatmap = await provider.get_heatmap(facility_id, facility.latitude, facility.longitude)
        heatmap.is_demo_data = False
        return heatmap
    except Exception as e:
        logger.error(f"FortyGuard live get_heatmap failed: {e}")
        raise HTTPException(status_code=502, detail=f"FortyGuard live heatmap error: {str(e)}")

