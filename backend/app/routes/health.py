from fastapi import APIRouter
from app.config import settings

router = APIRouter(prefix="/api", tags=["health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "HeatShield AI Operations API",
        "fortyguard_mode": settings.FORTYGUARD_MODE,
        "fortyguard_connected": bool(settings.FORTYGUARD_API_KEY) if settings.FORTYGUARD_MODE == "live" else False,
        "ai_provider": settings.AI_PROVIDER,
        "version": "1.0.0-prototype"
    }
