from typing import Dict, Any
from app.config import settings
from app.services.providers.base import AIProvider
from app.services.providers.ai_provider import MockAIProvider
from app.schemas.ai import AIChatRequest, AIChatResponse

class AIEngine:
    def __init__(self):
        # Extendable factory pattern for future LLMs
        if settings.AI_PROVIDER == "mock":
            self.provider: AIProvider = MockAIProvider()
        else:
            self.provider: AIProvider = MockAIProvider()

    async def chat(self, request: AIChatRequest, context: Dict[str, Any]) -> AIChatResponse:
        return await self.provider.generate_response(request, context)

ai_engine = AIEngine()
