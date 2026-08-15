"""
HeatShield Risk Engine — Deterministic Operational Scoring & Decision Support System
Model Name: HeatShield Risk Model — Enterprise v1.2

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
- Why this risk intelligence (dynamic factual points)
- Structured prioritized action recommendations (P1/P2/P3)
- Operational impact matrix (Personnel, Cooling, Outdoor, Equipment, Disruption)
- Threshold exceedance & Peak thermal period
"""

from typing import Dict, Any, List
from app.schemas.risk import RiskAssessment, RiskFactor, ActionRecommendation, OperationalImpact

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
    exposure_duration_hours: float = 4.5,
    facility_type: str = "Warehouse"
) -> RiskAssessment:
    # 1. Temperature Burden (Baseline 28°C to Max 45°C) -> 0..100
    temp_score = min(100.0, max(0.0, ((temperature - 28.0) / 17.0) * 100.0))

    # 2. Heat Index Burden (Baseline 30°C to Max 50°C) -> 0..100
    hi_score = min(100.0, max(0.0, ((heat_index - 30.0) / 20.0) * 100.0))

    # 3. Relative Humidity Burden (Baseline 30% to 85%) -> 0..100
    rh_score = min(100.0, max(0.0, ((humidity - 30.0) / 55.0) * 100.0))

    # 4. Wet Bulb Burden (Baseline 22°C to 33°C - critical thermal stress) -> 0..100
    wb_score = min(100.0, max(0.0, ((wet_bulb - 22.0) / 11.0) * 100.0))

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
        headline = "CRITICAL OPERATIONAL HEAT HAZARD"
        threshold_hours = round(max(3.5, min(7.5, (temperature - 36.0) * 0.8 + 3.8)), 1)
        peak_period = "13:30 - 16:30"
        anomaly_c = round(2.8 + (temperature * 0.03), 1)
    elif final_score >= 60.0:
        level = "HIGH"
        headline = "ELEVATED THERMAL STRESS RISK"
        threshold_hours = round(max(2.0, min(5.0, (temperature - 32.0) * 0.6 + 2.0)), 1)
        peak_period = "14:00 - 16:00"
        anomaly_c = round(2.1 + (temperature * 0.02), 1)
    elif final_score >= 40.0:
        level = "MODERATE"
        headline = "MODERATE OPERATIONAL HEAT PRECAUTION"
        threshold_hours = round(max(0.5, (temperature - 28.0) * 0.4), 1)
        peak_period = "14:30 - 15:30"
        anomaly_c = 1.4
    else:
        level = "SAFE"
        headline = "NORMAL ENVIRONMENTAL THERMAL PROFILE"
        threshold_hours = 0.0
        peak_period = "N/A (Within Safe Envelope)"
        anomaly_c = 0.6

    summary = (
        f"Real-time FortyGuard environmental telemetry at {facility_type.lower()} indicates {level.lower()} thermal burden. "
        f"Air temperature of {temperature}°C combined with an apparent heat index of {heat_index}°C and wet-bulb reading of {wet_bulb}°C "
        f"creates sustained operational stress requiring proactive shift management."
    )

    factors: List[RiskFactor] = [
        RiskFactor(
            name="Heat Index Burden",
            value=round(hi_score, 1),
            weight=w_hi,
            contribution=round(hi_score * w_hi, 1),
            description=f"Apparent heat index of {heat_index}°C exceeds standard industrial thermal thresholds."
        ),
        RiskFactor(
            name="Wet Bulb Stress",
            value=round(wb_score, 1),
            weight=w_wb,
            contribution=round(wb_score * w_wb, 1),
            description=f"Wet bulb temperature of {wet_bulb}°C restricts physiological sweat evaporation efficiency."
        ),
        RiskFactor(
            name="Ambient Air Temperature",
            value=round(temp_score, 1),
            weight=w_temp,
            contribution=round(temp_score * w_temp, 1),
            description=f"Direct dry-bulb temperature measured at {temperature}°C."
        ),
        RiskFactor(
            name="Shift Exposure Duration",
            value=round(exp_score, 1),
            weight=w_exp,
            contribution=round(exp_score * w_exp, 1),
            description=f"Continuous shift exposure window of {exposure_duration_hours} hours in active thermal zone."
        ),
        RiskFactor(
            name="Relative Humidity Burden",
            value=round(rh_score, 1),
            weight=w_rh,
            contribution=round(rh_score * w_rh, 1),
            description=f"Relative humidity at {humidity}% influences convective cooling and latent heat retention."
        )
    ]

    # Primary Factors Bulleted
    primary_factors = [
        f"Sustained elevated temperature reaching {temperature}°C during peak daytime hours.",
        f"Expected threshold exceedance duration of {threshold_hours} hours above OSHA/NIOSH heat index guidelines.",
        f"Elevated wet bulb thermal stress ({wet_bulb}°C) impairing natural evaporative cooling.",
        f"{facility_type} infrastructure vulnerability factor ({vuln_multiplier}x multiplier)."
    ]

    # Why this risk matters (Factual, operational reasoning)
    why_it_matters = [
        f"Temperature is projected to exceed baseline safety limits for {threshold_hours} continuous hours.",
        f"Peak thermal intensity occurs between {peak_period}, compounding shift worker fatigue.",
        f"At {wet_bulb}°C wet bulb, standard evaporative cooling systems lose up to 40% efficiency.",
        f"Without intervention, unconditioned zones risk rapid escalation in heat-related operational pacing delays."
    ]

    # Structured Prioritized Action Recommendations
    if level == "CRITICAL":
        structured_recommendations = [
            ActionRecommendation(
                priority="P1 - Immediate",
                action="Reschedule all heavy outdoor and unconditioned manual tasks to before 10:30 or after 17:00",
                reason=f"Direct radiant heat and {heat_index}°C heat index create severe heat exhaustion risk during afternoon hours",
                expected_benefit="Reduces direct workforce thermal strain exposure by ~65%"
            ),
            ActionRecommendation(
                priority="P1 - Immediate",
                action="Enforce mandatory 15-minute cool rest cycles every 45 minutes with active hydration monitoring",
                reason="Prevents core body temperature buildup during continuous physical exertion",
                expected_benefit="Maintains cognitive alertness and eliminates preventable heat-stress incidents"
            ),
            ActionRecommendation(
                priority="P2 - High",
                action="Deploy auxiliary misting fans and high-volume low-speed (HVLS) spot cooling at high-density staging areas",
                reason="Counteracts localized heat entrapment near loading bays and structural steel zones",
                expected_benefit="Lowers micro-climate perceived temperature by 3°C to 5°C in staging docks"
            ),
            ActionRecommendation(
                priority="P3 - Standard",
                action="Issue real-time SMS/Radio thermal risk advisories to shift supervisors and dispatch leads",
                reason="Ensures immediate protocol alignment across all operational site units",
                expected_benefit="Establishes transparent audit trail for safety compliance and risk mitigation"
            )
        ]
        recommended_actions = [rec.action for rec in structured_recommendations]

    elif level == "HIGH":
        structured_recommendations = [
            ActionRecommendation(
                priority="P1 - Immediate",
                action="Shift non-critical physical labor away from the 14:00 - 16:00 peak thermal window",
                reason=f"Heat index of {heat_index}°C elevates physiological cardiovascular strain",
                expected_benefit="Mitigates afternoon productivity slump and prevents physical exhaustion"
            ),
            ActionRecommendation(
                priority="P2 - High",
                action="Increase scheduled hydration intervals to 10 minutes every hour in shaded relief areas",
                reason="Maintains optimal electrolyte balance during moderate continuous exertion",
                expected_benefit="Lowers cumulative dehydration risk across shift personnel"
            ),
            ActionRecommendation(
                priority="P2 - High",
                action="Pre-cool indoor facility zones and verify chiller setpoints ahead of afternoon peak",
                reason="Prevents HVAC system thermal overload during peak grid demand",
                expected_benefit="Maintains stable indoor ambient envelope and stabilizes HVAC power draw"
            ),
            ActionRecommendation(
                priority="P3 - Standard",
                action="Conduct regular buddy-system checks on high-exposure workers",
                reason="Early detection of mild heat fatigue before symptoms escalate",
                expected_benefit="Ensures rapid response if any team member displays fatigue signs"
            )
        ]
        recommended_actions = [rec.action for rec in structured_recommendations]

    elif level == "MODERATE":
        structured_recommendations = [
            ActionRecommendation(
                priority="P2 - High",
                action="Monitor ventilation airflow and optimize air handling unit (AHU) economizer cycles",
                reason=f"Moderate heat index ({heat_index}°C) increases building cooling demand",
                expected_benefit="Improves internal air circulation and maintains comfort setpoints"
            ),
            ActionRecommendation(
                priority="P3 - Standard",
                action="Ensure all water and electrolyte distribution stations are fully stocked and accessible",
                reason="Promotes proactive voluntary hydration before afternoon temperature rise",
                expected_benefit="Sustains steady operational workflow throughout shift changes"
            ),
            ActionRecommendation(
                priority="P3 - Standard",
                action="Review shift schedule in anticipation of potential heat index increases tomorrow",
                reason="Proactive workforce planning prevents last-minute schedule disruptions",
                expected_benefit="Minimizes downtime and maintains project timelines"
            )
        ]
        recommended_actions = [rec.action for rec in structured_recommendations]

    else:
        structured_recommendations = [
            ActionRecommendation(
                priority="P3 - Standard",
                action="Maintain standard operational safety procedures and normal shift rotations",
                reason=f"Current environmental conditions ({temperature}°C) are within safe baseline operating limits",
                expected_benefit="Ensures smooth uninterrupted facility operations"
            ),
            ActionRecommendation(
                priority="P3 - Standard",
                action="Continue routine monitoring of local thermal forecasts for upcoming weather shifts",
                reason="Early detection of multi-day heatwave trends",
                expected_benefit="Provides 24-48 hour advance preparation window"
            )
        ]
        recommended_actions = [rec.action for rec in structured_recommendations]

    # Operational Impact Matrix (Rule-based deterministic calculation)
    if level == "CRITICAL":
        operational_impact = OperationalImpact(
            personnel_exposure="CRITICAL",
            personnel_detail="Unconditioned zone personnel face severe heat stress; mandatory rest pacing required",
            cooling_demand="CRITICAL",
            cooling_detail="Chillers and evaporative units operating at 95%+ rated capacity",
            outdoor_work_risk="CRITICAL",
            outdoor_detail="Direct radiant sun load poses immediate heat exhaustion risk",
            equipment_thermal_stress="HIGH",
            equipment_detail="Compressors and conveyor motors operating near thermal cut-off limits",
            disruption_risk="HIGH",
            disruption_detail="High probability of shift throughput reduction and task rescheduling"
        )
    elif level == "HIGH":
        operational_impact = OperationalImpact(
            personnel_exposure="HIGH",
            personnel_detail="Elevated fatigue rates expected during continuous physical shifts",
            cooling_demand="HIGH",
            cooling_detail="HVAC cooling load elevated 25-35% above seasonal average",
            outdoor_work_risk="HIGH",
            outdoor_detail="Outdoor tasks require active shade rotations and water monitoring",
            equipment_thermal_stress="MEDIUM",
            equipment_detail="Moderate heat dissipation load on electrical transformers and drives",
            disruption_risk="MEDIUM",
            disruption_detail="Minor shift pacing adjustments needed to protect workforce safety"
        )
    elif level == "MODERATE":
        operational_impact = OperationalImpact(
            personnel_exposure="MEDIUM",
            personnel_detail="Comfort thresholds approached; routine hydration recommended",
            cooling_demand="MEDIUM",
            cooling_detail="Standard cooling loads with moderate peak afternoon demand",
            outdoor_work_risk="MEDIUM",
            outdoor_detail="Outdoor tasks manageable with standard rest intervals",
            equipment_thermal_stress="LOW",
            equipment_detail="Equipment operating well within nominal temperature ratings",
            disruption_risk="LOW",
            disruption_detail="No expected operational disruptions under current conditions"
        )
    else:
        operational_impact = OperationalImpact(
            personnel_exposure="LOW",
            personnel_detail="Physiological heat strain is negligible under current ambient conditions",
            cooling_demand="LOW",
            cooling_detail="HVAC operating at nominal baseline energy consumption",
            outdoor_work_risk="LOW",
            outdoor_detail="All outdoor physical and crane operations proceed normally",
            equipment_thermal_stress="LOW",
            equipment_detail="Normal operating temperatures across all mechanical equipment",
            disruption_risk="LOW",
            disruption_detail="Zero operational disruption expected"
        )

    return RiskAssessment(
        facility_id=facility_id,
        score=final_score,
        level=level,
        headline=headline,
        summary=summary,
        exposure_duration_hours=exposure_duration_hours,
        threshold_exceedance_hours=threshold_hours,
        peak_thermal_period=peak_period,
        temperature_anomaly_c=anomaly_c,
        primary_factors=primary_factors,
        factors=factors,
        why_it_matters=why_it_matters,
        recommended_actions=recommended_actions,
        structured_recommendations=structured_recommendations,
        operational_impact=operational_impact,
        model_version="HeatShield Risk Model — Enterprise v1.2",
        is_demo_data=True
    )

