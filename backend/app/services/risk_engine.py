"""
HeatShield Risk Engine — Deterministic Operational Scoring System
Model Name: HeatShield Risk Model — Prototype

Inputs:
- temperature (°C)
- heat_index (°C)
- humidity (%)
- wet_bulb (°C)
- exposure_duration (hours)
- facility_type (Warehouse, Construction Site, Factory, Office, School, Hospital, Other)

Returns:
- Score (0-100)
- Level (SAFE | MODERATE | HIGH | CRITICAL)
- Factor breakdown
- Operational recommendations
"""

from typing import Dict, Any, List
from app.schemas.risk import RiskAssessment, RiskFactor

FACILITY_VULNERABILITY = {
    "Construction Site": 1.25,
    "Factory": 1.15,
    "Warehouse": 1.10,
    "School": 1.05,
    "Hospital": 1.05,
    "Other": 1.00,
    "Office": 0.85
}

def calculate_heat_risk(
    facility_id: str,
    temperature: float,
    heat_index: float,
    humidity: float,
    wet_bulb: float,
    exposure_duration_hours: float = 4.0,
    facility_type: str = "Warehouse"
) -> RiskAssessment:
    # 1. Temperature Burden (Baseline 30°C to Max 45°C) -> 0..100
    temp_score = min(100.0, max(0.0, ((temperature - 30.0) / 15.0) * 100.0))

    # 2. Heat Index Burden (Baseline 32°C to Max 50°C) -> 0..100
    hi_score = min(100.0, max(0.0, ((heat_index - 32.0) / 18.0) * 100.0))

    # 3. Relative Humidity Burden (Baseline 40% to 90%) -> 0..100
    rh_score = min(100.0, max(0.0, ((humidity - 40.0) / 50.0) * 100.0))

    # 4. Wet Bulb Burden (Baseline 24°C to 34°C - critical thermal stress) -> 0..100
    wb_score = min(100.0, max(0.0, ((wet_bulb - 24.0) / 10.0) * 100.0))

    # 5. Exposure Duration Burden (Baseline 1h to 8h) -> 0..100
    exp_score = min(100.0, max(0.0, (exposure_duration_hours / 8.0) * 100.0))

    # Weights
    w_hi = 0.30
    w_wb = 0.25
    w_temp = 0.20
    w_exp = 0.15
    w_rh = 0.10

    raw_weighted = (
        (hi_score * w_hi) +
        (wb_score * w_wb) +
        (temp_score * w_temp) +
        (exp_score * w_exp) +
        (rh_score * w_rh)
    )

    vuln_multiplier = FACILITY_VULNERABILITY.get(facility_type, 1.0)
    final_score = round(min(100.0, max(0.0, raw_weighted * vuln_multiplier)), 1)

    # Determine Risk Level
    if final_score >= 80.0:
        level = "CRITICAL"
        headline = "CRITICAL HEAT EXPOSURE DETECTED"
    elif final_score >= 60.0:
        level = "HIGH"
        headline = "ELEVATED THERMAL STRESS RISK"
    elif final_score >= 40.0:
        level = "MODERATE"
        headline = "MODERATE OPERATIONAL HEAT PRECAUTION"
    else:
        level = "SAFE"
        headline = "NORMAL ENVIRONMENTAL HEAT PROFILE"

    summary = (
        f"Current environmental conditions at this {facility_type.lower()} indicate {level.lower()} thermal stress. "
        f"High temperature ({temperature}°C) combined with heat index ({heat_index}°C) and wet bulb ({wet_bulb}°C) "
        f"substantially increases worker physiological heat burden."
    )

    factors: List[RiskFactor] = [
        RiskFactor(
            name="Heat Index Burden",
            value=round(hi_score, 1),
            weight=w_hi,
            contribution=round(hi_score * w_hi, 1),
            description=f"Apparent heat index of {heat_index}°C creates severe perceived heat load."
        ),
        RiskFactor(
            name="Wet Bulb Stress",
            value=round(wb_score, 1),
            weight=w_wb,
            contribution=round(wb_score * w_wb, 1),
            description=f"Wet bulb temperature of {wet_bulb}°C limits sweat evaporation cooling efficiency."
        ),
        RiskFactor(
            name="Ambient Air Temperature",
            value=round(temp_score, 1),
            weight=w_temp,
            contribution=round(temp_score * w_temp, 1),
            description=f"Direct air temperature measured at {temperature}°C."
        ),
        RiskFactor(
            name="Exposure Duration",
            value=round(exp_score, 1),
            weight=w_exp,
            contribution=round(exp_score * w_exp, 1),
            description=f"Continuous shift duration of {exposure_duration_hours} hours in high thermal zone."
        ),
        RiskFactor(
            name="Humidity Burden",
            value=round(rh_score, 1),
            weight=w_rh,
            contribution=round(rh_score * w_rh, 1),
            description=f"Relative moisture content of {humidity}% retards thermal dissipation."
        )
    ]

    why_it_matters = [
        f"Combinatorial impact of {heat_index}°C heat index and high humidity severely restricts sweat evaporation.",
        f"Worker core temperature risk rises significantly during continuous shifts above {exposure_duration_hours} hours.",
        f"Dehydration and heat exhaustion potential is elevated for physical tasks in this facility class.",
        "Operational efficiency drops as heat fatigue reduces alertness and physical throughput."
    ]

    recommended_actions = [
        "Increase mandatory hydration and cool-rest break intervals to 15 mins every hour.",
        "Shift non-essential heavy manual labor to early morning hours.",
        "Deploy auxiliary air movers and evaporative cooling units in unconditioned zones.",
        "Issue real-time thermal alert notifications to site floor managers."
    ]

    return RiskAssessment(
        facility_id=facility_id,
        score=final_score,
        level=level,
        headline=headline,
        summary=summary,
        exposure_duration_hours=exposure_duration_hours,
        factors=factors,
        why_it_matters=why_it_matters,
        recommended_actions=recommended_actions,
        model_version="HeatShield Risk Model — Prototype",
        is_demo_data=True
    )
