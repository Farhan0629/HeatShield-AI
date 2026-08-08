from pydantic import BaseModel, Field
from typing import List, Optional

class AIChatMessage(BaseModel):
    role: str = Field(..., example="user", description="user | assistant | system")
    content: str
    timestamp: Optional[str] = None

class AIChatRequest(BaseModel):
    facility_id: str
    message: str
    history: List[AIChatMessage] = []

class AIChatResponse(BaseModel):
    reply: str
    facility_id: str
    suggested_followups: List[str] = []
    provider: str = "MockAIProvider"
    is_demo_data: bool = True
