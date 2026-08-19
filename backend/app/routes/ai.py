import logging
from fastapi import APIRouter, HTTPException
from app.models.in_memory_db import db
from app.services.providers.fortyguard import FortyGuardProvider
from app.services.risk_engine import calculate_heat_risk
from app.services.ai_engine import ai_engine
from app.schemas.ai import AIChatRequest, AIChatResponse
from app.config import settings

logger = logging.getLogger("heatshield.routes.ai")
router = APIRouter(prefix="/api/ai", tags=["ai"])

_live_provider: FortyGuardProvider = FortyGuardProvider()

def get_live_provider() -> FortyGuardProvider:
    global _live_provider
    if _live_provider is None:
        _live_provider = FortyGuardProvider()
    return _live_provider

@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(request: AIChatRequest):
    facility = db.get_facility(request.facility_id)
    if not facility:
        # Fallback to default facility f1 if invalid
        facility = db.get_facility("f1") or db.get_facilities()[0]

    provider = get_live_provider()
    try:
        env = await provider.get_current_conditions(facility.id, facility.latitude, facility.longitude)
        forecast = await provider.get_forecast(facility.id, facility.latitude, facility.longitude)
    except Exception as e:
        logger.error(f"FortyGuard live data failed in AI chat: {e}")
        raise HTTPException(status_code=502, detail=f"FortyGuard live telemetry error in AI decision engine: {str(e)}")

    risk = calculate_heat_risk(
        facility_id=facility.id,
        temperature=env.temperature,
        heat_index=env.heat_index,
        humidity=env.humidity,
        wet_bulb=env.wet_bulb,
        facility_type=facility.type,
        is_demo_data=False
    )

    context = {
        "facility_name": facility.name,
        "facility_type": facility.type,
        "temperature": env.temperature,
        "heat_index": env.heat_index,
        "humidity": env.humidity,
        "wet_bulb": env.wet_bulb,
        "risk_score": risk.score,
        "risk_level": risk.level,
        "peak_time": forecast.peak_time,
        "threshold_exceedance_hours": risk.threshold_exceedance_hours,
        "operating_hours": facility.operating_hours,
        "is_demo_data": False
    }

    return await ai_engine.chat(request, context)

