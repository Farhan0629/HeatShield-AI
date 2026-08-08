from typing import Dict, Any, List
from app.services.providers.base import AIProvider
from app.schemas.ai import AIChatRequest, AIChatResponse

class MockAIProvider(AIProvider):
    async def generate_response(self, request: AIChatRequest, context: Dict[str, Any]) -> AIChatResponse:
        user_msg = request.message.lower()
        
        facility_name = context.get("facility_name", "Selected Facility")
        facility_type = context.get("facility_type", "Facility")
        risk_score = context.get("risk_score", 0.0)
        risk_level = context.get("risk_level", "UNKNOWN")
        temp = context.get("temperature", 0.0)
        hi = context.get("heat_index", 0.0)
        wb = context.get("wet_bulb", 0.0)
        rh = context.get("humidity", 0.0)
        peak_time = context.get("peak_time", "14:00")
        
        if not temp or temp == 0.0:
            return AIChatResponse(
                reply="I don't have enough environmental data to determine that yet.",
                facility_id=request.facility_id,
                suggested_followups=["When will environmental metrics be loaded?"],
                provider="MockAIProvider (Deterministic)",
                is_demo_data=True
            )

        # Grounded intelligent responses based on exact metrics and query pattern
        if "why" in user_msg or "reason" in user_msg or "critical" in user_msg or "cause" in user_msg:
            reply = (
                f"The heat risk level at **{facility_name}** ({facility_type}) is currently **{risk_level} ({risk_score}/100)**. "
                f"This elevated rating is primarily driven by an apparent heat index of **{hi}°C** and a wet bulb temperature of **{wb}°C**. "
                f"With relative humidity at **{rh}%**, sweating efficiency is severely reduced, accelerating thermal buildup during shifts."
            )
            suggested = ["What should we do right now?", "When is the peak heat period?"]

        elif "do" in user_msg or "action" in user_msg or "recommend" in user_msg or "reduce" in user_msg or "precaution" in user_msg:
            reply = (
                f"For **{facility_name}** under **{risk_level}** heat risk ({temp}°C air temp, {hi}°C heat index):\n\n"
                f"1. **Hydration & Breaks**: Implement mandatory 15-minute rest breaks every 45-60 minutes in shaded or climate-controlled areas.\n"
                f"2. **Operational Shift**: Reschedule heavy outdoor tasks away from peak heat around {peak_time}.\n"
                f"3. **Cooling Infrastructure**: Activate auxiliary evaporative fans and air circulators immediately.\n"
                f"4. **Monitoring**: Conduct active buddy-checks for heat fatigue or dizziness."
            )
            suggested = ["Generate an incident summary", "When will conditions improve?"]

        elif "peak" in user_msg or "when" in user_msg or "safest" in user_msg or "time" in user_msg or "forecast" in user_msg:
            reply = (
                f"Based on the 12-hour thermal forecast for **{facility_name}**, the peak thermal stress period is projected at **{peak_time}** "
                f"with a maximum risk score near **{max(risk_score, 88.0)}/100**. "
                f"The safest operating windows for outdoor or high-exertion shifts are early morning before 10:00 or late afternoon after 17:00."
            )
            suggested = ["Should outdoor operations be reduced?", "What precautions are required?"]

        elif "summary" in user_msg or "report" in user_msg or "incident" in user_msg:
            reply = (
                f"**HeatShield Incident Executive Summary — {facility_name}**\n\n"
                f"• **Facility**: {facility_name} ({facility_type})\n"
                f"• **Thermal Status**: {risk_level} Risk ({risk_score}/100)\n"
                f"• **Ambient Temp / Heat Index**: {temp}°C / {hi}°C\n"
                f"• **Wet Bulb Index**: {wb}°C (High sweating dissipation deficit)\n"
                f"• **Key Precaution**: Restrict continuous physical labor and ensure cool breaks until risk drops below 60/100."
            )
            suggested = ["Export official PDF report", "Why is the risk score high?"]

        else:
            reply = (
                f"I am analyzing live environmental signals for **{facility_name}**. "
                f"Current conditions show **{temp}°C** temperature, **{hi}°C** heat index, and **{risk_level}** heat risk. "
                f"How can I assist your operational thermal safety decisions?"
            )
            suggested = [
                "Why is the current risk critical?",
                "What should we do right now?",
                "When is the peak heat period?",
                "Generate an incident summary"
            ]

        return AIChatResponse(
            reply=reply,
            facility_id=request.facility_id,
            suggested_followups=suggested,
            provider="MockAIProvider (Grounded Context)",
            is_demo_data=True
        )
