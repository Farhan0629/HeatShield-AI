from typing import Dict, Any, List
from app.services.providers.base import AIProvider
from app.schemas.ai import AIChatRequest, AIChatResponse

class MockAIProvider(AIProvider):
    async def generate_response(self, request: AIChatRequest, context: Dict[str, Any]) -> AIChatResponse:
        user_msg = request.message.lower().strip()
        
        facility_name = context.get("facility_name", "Phoenix Logistics Center")
        facility_type = context.get("facility_type", "Warehouse")
        risk_score = context.get("risk_score", 88.5)
        risk_level = context.get("risk_level", "CRITICAL")
        temp = context.get("temperature", 42.8)
        hi = context.get("heat_index", 46.5)
        wb = context.get("wet_bulb", 26.2)
        rh = context.get("humidity", 24.0)
        peak_time = context.get("peak_time", "13:30 - 16:30")
        threshold_hours = context.get("threshold_exceedance_hours", 4.8)
        
        # 1. Multi-facility comparison / ranking / prioritization
        if any(k in user_msg for k in ["which facility", "greatest risk", "highest risk", "most attention", "prioritize", "priority", "attention first", "ranking"]):
            reply = (
                "**Enterprise Heat Risk Priority Ranking across Monitored US Facilities:**\n\n"
                "1. 🔴 **Dallas Construction Hub** — **CRITICAL (91.0 / 100)**\n"
                "   • *Primary Hazard*: 39.6°C air temp + 62% humidity = **47.2°C Heat Index** and **30.2°C Wet Bulb**.\n"
                "   • *Key Action*: Immediate halt on structural manual lifting during 13:00–16:30 peak; enforce 15-min rest cycles.\n\n"
                "2. 🔴 **Phoenix Logistics Center** — **CRITICAL (88.5 / 100)**\n"
                "   • *Primary Hazard*: Extreme desert dry bulb (**42.8°C**) with 960 W/m² solar load on unconditioned loading docks.\n"
                "   • *Key Action*: Deploy spot misting fans at staging bays; move heavy freight loading to before 10:30.\n\n"
                "3. 🟡 **Austin Operations Campus** — **MODERATE (56.0 / 100)**\n"
                "   • *Primary Hazard*: 34.2°C ambient causing high HVAC chiller demand (>82% load).\n"
                "   • *Key Action*: Pre-cool interior lab zones; verify backup chiller staging.\n\n"
                "4. 🟢 **Seattle Regional Fulfillment** — **SAFE (28.0 / 100)**\n"
                "   • *Primary Hazard*: Normal baseline conditions (24.5°C). All standard workflows operating without heat constraints.\n\n"
                "👉 **Decision Directive**: Allocate emergency portable cooling assets and site safety officer audits to **Dallas** and **Phoenix** immediately."
            )
            suggested = [
                "What specific actions should Phoenix take?",
                "What is the operational impact for Dallas?",
                "Summarize today's heat situation"
            ]

        # 2. Executive Daily Situation Summary
        elif any(k in user_msg for k in ["summarize", "summary", "situation", "briefing", "overall status", "overview"]):
            reply = (
                f"**HeatShield Enterprise Operational Heat Intelligence Briefing**\n\n"
                f"• **Active Monitored Fleet**: 4 Regional Facilities across the US Sunbelt & Pacific Northwest.\n"
                f"• **Current High-Alert Sites**: 2 Facilities under **CRITICAL** advisory (**Dallas Construction Hub** & **Phoenix Logistics Center**).\n"
                f"• **Maximum Regional Heat Index**: **47.2°C (Dallas, TX)** with severe wet bulb sweating impairment (**30.2°C**).\n"
                f"• **Peak Exposure Window**: **13:30 – 16:30 local time** with expected threshold exceedance of **4.8 to 5.2 hours**.\n"
                f"• **Operational Impacts**: Personnel heat exhaustion risk is elevated in outdoor/unconditioned staging; facility cooling loads in Texas and Arizona are at 90%+ rated capacity.\n"
                f"• **Recommended Action**: Enforce OSHA/HeatShield 15-min cool rest pacing and reschedule high-exertion manual tasks to morning hours."
            )
            suggested = [
                "Which facility requires attention first?",
                f"Why is {facility_name} at {risk_level.lower()} risk?",
                "Export executive PDF incident report"
            ]

        # 3. "Why is this risk high?"
        elif any(k in user_msg for k in ["why", "reason", "critical", "cause", "factors", "driver"]):
            reply = (
                f"**Root-Cause Heat Risk Intelligence for {facility_name} ({facility_type}):**\n\n"
                f"Current Risk Level: **{risk_level} ({risk_score}/100)**\n\n"
                f"1. **Apparent Heat Index ({hi}°C)**: Combines ambient temperature ({temp}°C) and relative humidity ({rh}%) into severe perceived thermal stress.\n"
                f"2. **Wet Bulb Threshold ({wb}°C)**: At this level, human physiological sweat evaporation efficiency drops significantly, accelerating core heat storage.\n"
                f"3. **Threshold Exceedance Duration**: Temperature is projected to remain above the facility's safety envelope for **{threshold_hours} continuous hours**.\n"
                f"4. **Facility Exposure Profile**: As a *{facility_type}*, structural solar radiation absorption and physical labor demands magnify vulnerability."
            )
            suggested = [
                f"What actions should we take for {facility_name}?",
                "When is the peak thermal period?",
                "What is the operational impact on equipment?"
            ]

        # 4. Actionable Recommendations
        elif any(k in user_msg for k in ["do", "action", "recommend", "reduce", "precaution", "step", "mitigate", "protect"]):
            reply = (
                f"**Prioritized Operational Decision Plan for {facility_name} ({risk_level} Risk):**\n\n"
                f"🔴 **[P1 - Immediate] Reschedule High-Exertion Tasks**\n"
                f"   • *Action*: Move unconditioned and outdoor physical tasks to before 10:30 or after 17:00.\n"
                f"   • *Reason*: Avoids the critical afternoon thermal peak ({peak_time}).\n"
                f"   • *Expected Benefit*: Reduces worker physiological heat strain by ~65%.\n\n"
                f"🔴 **[P1 - Immediate] Enforce Mandatory Hydration & Rest Pacing**\n"
                f"   • *Action*: Implement 15-minute cool rest breaks every 45 minutes with electrolyte access.\n"
                f"   • *Reason*: Prevents core body temperature buildup during continuous exertion.\n"
                f"   • *Expected Benefit*: Eliminates preventable heat-stress safety incidents.\n\n"
                f"🟠 **[P2 - High] Deploy Spot Cooling Infrastructure**\n"
                f"   • *Action*: Position auxiliary high-velocity misting fans at high-density staging zones.\n"
                f"   • *Reason*: Mitigates radiant heat pockets near metal roofs and loading docks.\n"
                f"   • *Expected Benefit*: Lowers localized micro-climate perceived temperature by 3°C to 5°C."
            )
            suggested = [
                "What is the operational impact on cooling?",
                "When will conditions return to safe levels?",
                "Generate executive PDF report"
            ]

        # 5. Timing / Peak Period
        elif any(k in user_msg for k in ["peak", "when", "time", "forecast", "worst", "hours", "improve", "safe"]):
            reply = (
                f"**Thermal Timing & Forecast Projection for {facility_name}:**\n\n"
                f"• **Peak Thermal Hazard Period**: **{peak_time}**.\n"
                f"• **Expected Safety Threshold Exceedance**: **{threshold_hours} continuous hours** above baseline.\n"
                f"• **Projected Peak Risk Score**: **{min(100.0, risk_score + 3.5)} / 100** around 14:30.\n"
                f"• **Safest Operational Windows**: Early morning before **10:00** or evening after **18:00**.\n\n"
                f"Proactive shift adjustments should be executed before 12:00 to prevent sudden workflow stoppages."
            )
            suggested = [
                "What actions should we take during the peak window?",
                "Which facility has the worst heat conditions?"
            ]

        # 6. Operational Impact (Cooling, Equipment, Disruption, Personnel)
        elif any(k in user_msg for k in ["impact", "equipment", "cooling", "disruption", "personnel", "hvac", "power"]):
            reply = (
                f"**Operational Impact Matrix for {facility_name}:**\n\n"
                f"• **Personnel Exposure**: **{risk_level}** — Continuous shift exposure requires mandatory supervisor rest pacing.\n"
                f"• **Cooling Infrastructure Demand**: **HIGH / CRITICAL** — Facility chillers and evaporative units operating at 90%+ rated load.\n"
                f"• **Outdoor Work Risk**: **{risk_level}** — Direct solar irradiance and high heat index create extreme exertion hazard.\n"
                f"• **Equipment Thermal Stress**: **ELEVATED** — Conveyor drives, compressors, and transformers require temperature spot-checks.\n"
                f"• **Operational Disruption Risk**: **HIGH** — Expect ~20-30% pacing slowdown if mandatory rest breaks are enforced."
            )
            suggested = [
                "What actions should we take right now?",
                "Which facility requires attention first?"
            ]

        # 7. Default Context-Grounded Response
        else:
            reply = (
                f"I am analyzing real-time FortyGuard environmental telemetry for **{facility_name}** ({facility_type}).\n\n"
                f"• **Current Air Temp / Heat Index**: {temp}°C / {hi}°C\n"
                f"• **Wet Bulb Thermal Reading**: {wb}°C\n"
                f"• **Operational Risk Level**: **{risk_level} ({risk_score}/100)**\n"
                f"• **Expected Exceedance Window**: {threshold_hours} hours (Peak: {peak_time})\n\n"
                f"How can I assist your operational heat safety and facility protection decisions?"
            )
            suggested = [
                "Which facility is currently at greatest risk?",
                f"Why is {facility_name} at {risk_level.lower()} risk?",
                f"What actions should we take for {facility_name}?",
                "Summarize today's heat situation"
            ]

        return AIChatResponse(
            reply=reply,
            facility_id=request.facility_id,
            suggested_followups=suggested,
            provider="MockAIProvider (Deterministic Enterprise Context)",
            is_demo_data=True
        )

