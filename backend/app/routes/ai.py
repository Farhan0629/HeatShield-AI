from fastapi import APIRouter, HTTPException
from app.models.in_memory_db import db
from app.services.providers.mock_fortyguard import MockFortyGuardProvider
from app.services.providers.fortyguard import FortyGuardProvider
from app.services.risk_engine import calculate_heat_risk
from app.services.ai_engine import ai_engine
from app.schemas.ai import AIChatRequest, AIChatResponse
from app.config import settings

router = APIRouter(prefix="/api/ai", tags=["ai"])

def get_data_provider():
    if settings.FORTYGUARD_MODE == "live":
        return FortyGuardProvider()
    return MockFortyGuardProvider()

@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(request: AIChatRequest):
    facility = db.get_facility(request.facility_id)
    if not facility:
        # Fallback to default facility f1 if invalid
        facility = db.get_facility("f1")

    provider = get_data_provider()
    env = await provider.get_current_conditions(facility.id, facility.latitude, facility.longitude)
    forecast = await provider.get_forecast(facility.id, facility.latitude, facility.longitude)
    risk = calculate_heat_risk(
        facility_id=facility.id,
        temperature=env.temperature,
        heat_index=env.heat_index,
        humidity=env.humidity,
        wet_bulb=env.wet_bulb,
        facility_type=facility.type
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
        "operating_hours": facility.operating_hours
    }

    return await ai_engine.chat(request, context)
