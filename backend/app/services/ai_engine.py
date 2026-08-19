from typing import Dict, Any
from app.config import settings
from app.services.providers.base import AIProvider
from app.services.providers.ai_provider import LiveDecisionAIProvider
from app.schemas.ai import AIChatRequest, AIChatResponse

class AIEngine:
    def __init__(self):
        self.provider: AIProvider = LiveDecisionAIProvider()

    async def chat(self, request: AIChatRequest, context: Dict[str, Any]) -> AIChatResponse:
        return await self.provider.generate_response(request, context)

ai_engine = AIEngine()

