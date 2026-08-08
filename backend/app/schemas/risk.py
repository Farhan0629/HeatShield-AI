from pydantic import BaseModel, Field
from typing import List

class RiskFactor(BaseModel):
    name: str = Field(..., example="Heat Index Burden")
    value: float = Field(..., example=95.0, description="Factor burden percentage 0-100%")
    weight: float = Field(..., example=0.30)
    contribution: float = Field(..., example=28.5)
    description: str = Field(..., example="Apparent temperature of 48.2°C exceeds safety thresholds")

class RiskAssessment(BaseModel):
    facility_id: str
    score: float = Field(..., ge=0, le=100)
    level: str = Field(..., example="CRITICAL", description="SAFE | MODERATE | HIGH | CRITICAL")
    headline: str = Field(..., example="CRITICAL HEAT EXPOSURE DETECTED")
    summary: str
    exposure_duration_hours: float = Field(..., example=4.5)
    factors: List[RiskFactor]
    why_it_matters: List[str]
    recommended_actions: List[str]
    model_version: str = "HeatShield Risk Model — Prototype"
    is_demo_data: bool = True
