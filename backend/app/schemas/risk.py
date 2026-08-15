from pydantic import BaseModel, Field
from typing import List, Optional

class RiskFactor(BaseModel):
    name: str = Field(..., example="Heat Index Burden")
    value: float = Field(..., example=95.0, description="Factor burden percentage 0-100%")
    weight: float = Field(..., example=0.30)
    contribution: float = Field(..., example=28.5)
    description: str = Field(..., example="Apparent temperature of 48.2°C exceeds safety thresholds")

class ActionRecommendation(BaseModel):
    priority: str = Field(..., example="P1 - Immediate", description="P1 - Immediate | P2 - High | P3 - Standard")
    action: str = Field(..., example="Reschedule heavy outdoor operations to before 11:00")
    reason: str = Field(..., example="Wet bulb temperature exceeds 30°C after 12:00, limiting sweat dissipation")
    expected_benefit: str = Field(..., example="Reduces peak worker heat strain by ~35%")

class OperationalImpact(BaseModel):
    personnel_exposure: str = Field(..., example="CRITICAL", description="CRITICAL | HIGH | MEDIUM | LOW")
    personnel_detail: str = Field(..., example="Continuous unconditioned shift exposure exceeds 4 hours")
    cooling_demand: str = Field(..., example="HIGH", description="CRITICAL | HIGH | MEDIUM | LOW")
    cooling_detail: str = Field(..., example="HVAC and evaporative chillers operating near peak capacity")
    outdoor_work_risk: str = Field(..., example="CRITICAL", description="CRITICAL | HIGH | MEDIUM | LOW")
    outdoor_detail: str = Field(..., example="Direct solar load above 900 W/m² poses severe exertion hazard")
    equipment_thermal_stress: str = Field(..., example="MEDIUM", description="CRITICAL | HIGH | MEDIUM | LOW")
    equipment_detail: str = Field(..., example="Auxiliary motors and compressors susceptible to thermal tripping")
    disruption_risk: str = Field(..., example="HIGH", description="CRITICAL | HIGH | MEDIUM | LOW")
    disruption_detail: str = Field(..., example="High likelihood of mandatory operational pacing slowdowns")

class RiskAssessment(BaseModel):
    facility_id: str
    score: float = Field(..., ge=0, le=100)
    level: str = Field(..., example="CRITICAL", description="SAFE | MODERATE | HIGH | CRITICAL")
    headline: str = Field(..., example="CRITICAL HEAT EXPOSURE DETECTED")
    summary: str
    exposure_duration_hours: float = Field(..., example=4.5)
    threshold_exceedance_hours: float = Field(..., example=4.8, description="Expected hours above safety threshold")
    peak_thermal_period: str = Field(..., example="14:00 - 16:00")
    temperature_anomaly_c: float = Field(..., example=3.4, description="Local thermal anomaly above regional baseline (°C)")
    primary_factors: List[str] = Field(default_factory=list)
    factors: List[RiskFactor]
    why_it_matters: List[str]
    recommended_actions: List[str]
    structured_recommendations: List[ActionRecommendation] = Field(default_factory=list)
    operational_impact: Optional[OperationalImpact] = None
    model_version: str = "HeatShield Risk Model — Prototype"
    is_demo_data: bool = True

