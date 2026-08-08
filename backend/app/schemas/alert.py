from pydantic import BaseModel
from typing import Optional

class Alert(BaseModel):
    id: str
    facility_id: str
    facility_name: str
    severity: str  # CRITICAL, HIGH, MODERATE, SAFE
    title: str
    message: str
    timestamp: str
    acknowledged: bool = False
    resolved: bool = False
    recommended_action: Optional[str] = None
