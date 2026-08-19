import logging
from fastapi import APIRouter, HTTPException, Response
from app.models.in_memory_db import db
from app.services.providers.fortyguard import FortyGuardProvider
from app.services.risk_engine import calculate_heat_risk
from app.services.report_service import report_service
from app.schemas.report import ReportRequest, ReportResponse
from app.config import settings

logger = logging.getLogger("heatshield.routes.reports")
router = APIRouter(prefix="/api/reports", tags=["reports"])

_live_provider: FortyGuardProvider = FortyGuardProvider()

def get_live_provider() -> FortyGuardProvider:
    global _live_provider
    if _live_provider is None:
        _live_provider = FortyGuardProvider()
    return _live_provider

@router.post("/generate", response_model=ReportResponse)
async def generate_report(request: ReportRequest):
    facility = db.get_facility(request.facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    provider = get_live_provider()
    try:
        env = await provider.get_current_conditions(facility.id, facility.latitude, facility.longitude)
    except Exception as e:
        logger.error(f"FortyGuard live data failed in reports: {e}")
        raise HTTPException(status_code=502, detail=f"FortyGuard live telemetry error in reports: {str(e)}")

    risk = calculate_heat_risk(
        facility_id=facility.id,
        temperature=env.temperature,
        heat_index=env.heat_index,
        humidity=env.humidity,
        wet_bulb=env.wet_bulb,
        facility_type=facility.type,
        is_demo_data=False
    )

    return report_service.generate_report_data(
        request=request,
        facility_data=facility.model_dump(),
        env_data=env.model_dump(),
        risk_data=risk.model_dump()
    )

@router.post("/pdf")
async def generate_report_pdf(request: ReportRequest):
    report_data = await generate_report(request)
    pdf_bytes = report_service.generate_pdf_bytes(report_data)
    
    filename = f"HeatShield_Report_{report_data.id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

