from fastapi import APIRouter, HTTPException
from app.models.in_memory_db import db
from app.services.providers.mock_fortyguard import MockFortyGuardProvider
from app.services.providers.fortyguard import FortyGuardProvider
from app.services.risk_engine import calculate_heat_risk
from app.schemas.risk import RiskAssessment
from app.config import settings

router = APIRouter(prefix="/api/risk", tags=["risk"])

def get_data_provider():
    if settings.FORTYGUARD_MODE == "live":
        return FortyGuardProvider()
    return MockFortyGuardProvider()

@router.get("/{facility_id}", response_model=RiskAssessment)
async def get_risk_assessment(facility_id: str):
    facility = db.get_facility(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    provider = get_data_provider()
    env = await provider.get_current_conditions(facility_id, facility.latitude, facility.longitude)

    risk_assessment = calculate_heat_risk(
        facility_id=facility_id,
        temperature=env.temperature,
        heat_index=env.heat_index,
        humidity=env.humidity,
        wet_bulb=env.wet_bulb,
        exposure_duration_hours=4.5,
        facility_type=facility.type
    )

    # Update facility cached score in in-memory DB
    facility.risk_score = risk_assessment.score
    facility.risk_level = risk_assessment.level
    facility.current_temperature = env.temperature

    return risk_assessment
