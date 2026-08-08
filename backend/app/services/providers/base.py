from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.schemas.heat import EnvironmentalMetrics, HeatForecastResponse, HeatmapGeoJSONResponse
from app.schemas.ai import AIChatRequest, AIChatResponse

class TemperatureDataProvider(ABC):
    @abstractmethod
    async def get_current_conditions(self, facility_id: str, lat: float, lng: float) -> EnvironmentalMetrics:
        pass

    @abstractmethod
    async def get_forecast(self, facility_id: str, lat: float, lng: float, hours: int = 12) -> HeatForecastResponse:
        pass

    @abstractmethod
    async def get_heatmap(self, facility_id: str, lat: float, lng: float) -> HeatmapGeoJSONResponse:
        pass

class AIProvider(ABC):
    @abstractmethod
    async def generate_response(self, request: AIChatRequest, context: Dict[str, Any]) -> AIChatResponse:
        pass
