from fastapi import APIRouter, HTTPException
from typing import List
from app.models.in_memory_db import db
from app.schemas.alert import Alert

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

@router.get("", response_model=List[Alert])
async def list_alerts():
    return db.get_alerts()

@router.post("/{alert_id}/acknowledge", response_model=Alert)
async def acknowledge_alert(alert_id: str):
    alert = db.acknowledge_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.post("/{alert_id}/resolve", response_model=Alert)
async def resolve_alert(alert_id: str):
    alert = db.resolve_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
