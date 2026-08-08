from pydantic import BaseModel
from typing import List

class ReportRequest(BaseModel):
    facility_id: str
    report_type: str = "Incident Report"  # Incident Report, Daily Heat Summary, Facility Risk Report
    notes: str = ""

class ReportResponse(BaseModel):
    id: str
    facility_id: str
    facility_name: str
    report_type: str
    title: str
    generated_at: str
    risk_level: str
    risk_score: float
    summary: str
    environmental_snapshot: dict
    key_findings: List[str]
    actions_taken: List[str]
    generated_by: str = "HeatShield AI Decision Engine"
