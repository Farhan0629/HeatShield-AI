import httpx
import logging
from typing import Dict, Any, List
from app.config import settings
from app.services.providers.base import AIProvider
from app.schemas.ai import AIChatRequest, AIChatResponse
from app.services.providers.ai_provider import LiveDecisionAIProvider

logger = logging.getLogger("heatshield.gemini")

class GeminiAIProvider(AIProvider):
    """
    Google Gemini AI Decision Support Provider for HeatShield AI.
    Grounded in real-time FortyGuard environmental telemetry.
    """
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or settings.AI_API_KEY
        self.candidate_models = [
            "gemini-flash-lite-latest",
            "gemini-flash-latest",
            "gemini-pro-latest"
        ]
        self.fallback_provider = LiveDecisionAIProvider()

    async def generate_response(self, request: AIChatRequest, context: Dict[str, Any]) -> AIChatResponse:
        if not self.api_key:
            logger.warning("[Gemini] GEMINI_API_KEY is not configured; using LiveDecisionAIProvider.")
            return await self.fallback_provider.generate_response(request, context)

        facility_name = context.get("facility_name", "Monitored Facility")
        facility_type = context.get("facility_type", "Industrial Facility")
        risk_score = context.get("risk_score", 70.0)
        risk_level = context.get("risk_level", "HIGH")
        temp = context.get("temperature", 38.0)
        hi = context.get("heat_index", 48.0)
        wb = context.get("wet_bulb", 24.0)
        rh = context.get("humidity", 50.0)
        peak_time = context.get("peak_time", "13:30 - 16:30")
        threshold_hours = context.get("threshold_exceedance_hours", 4.5)
        operating_hours = context.get("operating_hours", "Standard Shifts")

        system_prompt = (
            "You are HeatShield AI, an enterprise-grade operational heat-risk intelligence and decision-support assistant.\n"
            "Your role is to protect workforce safety, optimize facility operations, and provide clear, prioritized operational actions.\n\n"
            "CURRENT LIVE FORTYGUARD ENVIRONMENTAL TELEMETRY:\n"
            f"- Facility Name: {facility_name}\n"
            f"- Facility Type: {facility_type}\n"
            f"- Ambient Air Temperature: {temp}°C\n"
            f"- Apparent Heat Index: {hi}°C\n"
            f"- Wet Bulb Temperature: {wb}°C\n"
            f"- Relative Humidity: {rh}%\n"
            f"- Operational Risk Score: {risk_score} / 100 ({risk_level})\n"
            f"- Projected Peak Hazard Window: {peak_time}\n"
            f"- Thermal Threshold Exceedance: {threshold_hours} continuous hours\n"
            f"- Operating Schedule: {operating_hours}\n\n"
            "INSTRUCTIONS:\n"
            "1. Answer concisely, professionally, and directly in markdown format.\n"
            "2. Base all calculations and reasoning strictly on the live FortyGuard metrics provided above.\n"
            "3. Format recommendations with Priority tags ([P1 - Immediate], [P2 - High], [P3 - Standard]), Action, Reason, and Expected Benefit.\n"
            "4. Remind that recommendations represent operational safety precautions and facility engineering protocols."
        )

        full_prompt = f"{system_prompt}\n\nUser Inquiry: {request.message}"

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": full_prompt}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 800
            }
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            for model_name in self.candidate_models:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
                headers = {
                    "Content-Type": "application/json",
                    "x-goog-api-key": self.api_key
                }

                try:
                    res = await client.post(url, headers=headers, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                reply_text = parts[0].get("text", "").strip()
                                if reply_text:
                                    logger.info(f"[Gemini] Successfully generated decision response via {model_name}")
                                    return AIChatResponse(
                                        reply=reply_text,
                                        facility_id=request.facility_id,
                                        suggested_followups=[
                                            "What specific actions should we take right now?",
                                            "What is the operational impact on cooling and equipment?",
                                            "When will conditions return to safe baseline levels?",
                                            "Summarize today's heat situation across all facilities"
                                        ],
                                        provider=f"Google Gemini ({model_name}) + FortyGuard Live Feeds",
                                        is_demo_data=False
                                    )
                    elif res.status_code in (429, 503):
                        logger.warning(f"[Gemini] Model {model_name} busy or rate limited ({res.status_code}), trying next candidate...")
                        continue
                    else:
                        logger.warning(f"[Gemini] Model {model_name} returned status {res.status_code}: {res.text[:200]}")
                except Exception as e:
                    logger.warning(f"[Gemini] Exception during {model_name} request: {e}")
                    continue

        logger.warning("[Gemini] All Gemini candidate models failed; falling back to deterministic live engine.")
        fallback_res = await self.fallback_provider.generate_response(request, context)
        fallback_res.provider = "HeatShield Live Decision Engine (Gemini Fallback)"
        return fallback_res
