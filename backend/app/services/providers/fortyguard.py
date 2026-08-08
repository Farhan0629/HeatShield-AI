import httpx
import asyncio
import datetime
from typing import Dict, Any
from app.config import settings
from app.services.providers.base import TemperatureDataProvider
from app.schemas.heat import EnvironmentalMetrics, HeatForecastResponse, HeatmapGeoJSONResponse

class FortyGuardProvider(TemperatureDataProvider):
    """
    Live FortyGuard Enterprise API Integration Provider.
    Documentation: https://docs-api.fortyguard.com/docs/introduction
    
    Endpoints:
    - POST /v1/env_params -> submit environmental parameters task (returns activity_id)
    - POST /v1/heatmap    -> submit GeoJSON heatmap task (returns activity_id)
    - GET /v1/status/{activity_id} -> poll task status and retrieve final output
    """

    def __init__(self):
        self.api_key = settings.FORTYGUARD_API_KEY
        self.base_url = settings.FORTYGUARD_BASE_URL.rstrip('/')

    def _headers(self) -> Dict[str, str]:
        return {
            "api-key": self.api_key,
            "Content-Type": "application/json"
        }

    async def _poll_activity(self, activity_id: str, timeout_seconds: int = 30) -> Dict[str, Any]:
        url = f"{self.base_url}/status/{activity_id}"
        start_time = asyncio.get_event_loop().time()
        
        async with httpx.AsyncClient() as client:
            while (asyncio.get_event_loop().time() - start_time) < timeout_seconds:
                response = await client.get(url, headers=self._headers(), timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    status = data.get("status", "").lower()
                    if status in ("completed", "success", "done"):
                        return data.get("result", data)
                    elif status in ("failed", "error"):
                        raise ValueError(f"FortyGuard task failed: {data.get('error', 'Unknown error')}")
                await asyncio.sleep(2.0)
        
        raise TimeoutError(f"FortyGuard task polling timed out for activity_id: {activity_id}")

    async def get_current_conditions(self, facility_id: str, lat: float, lng: float) -> EnvironmentalMetrics:
        if not self.api_key:
            raise ValueError("FORTYGUARD_API_KEY is not configured for live mode.")

        url = f"{self.base_url}/env_params"
        payload = {
            "latitude": lat,
            "longitude": lng,
            "parameters": ["temperature", "heat_index", "humidity", "wet_bulb", "aqi", "solar_irradiance"]
        }

        async with httpx.AsyncClient() as client:
            res = await client.post(url, json=payload, headers=self._headers(), timeout=10.0)
            res.raise_for_status()
            data = res.json()
            
            activity_id = data.get("activity_id")
            if not activity_id:
                # Direct response fallback if endpoint behaves synchronously
                result = data
            else:
                result = await self._poll_activity(activity_id)

            return EnvironmentalMetrics(
                facility_id=facility_id,
                timestamp=result.get("timestamp", datetime.datetime.now(datetime.timezone.utc).isoformat()),
                temperature=float(result.get("temperature", 0.0)),
                heat_index=float(result.get("heat_index", 0.0)),
                humidity=float(result.get("humidity", 0.0)),
                wet_bulb=float(result.get("wet_bulb", 0.0)),
                aqi=int(result.get("aqi", 0)),
                solar_irradiance=float(result.get("solar_irradiance", 0.0)),
                wind_speed=float(result.get("wind_speed", 0.0)),
                is_demo_data=False
            )

    async def get_forecast(self, facility_id: str, lat: float, lng: float, hours: int = 12) -> HeatForecastResponse:
        # Stub for live forecast polling via FortyGuard API
        if not self.api_key:
            raise ValueError("FORTYGUARD_API_KEY is not configured for live mode.")
        raise NotImplementedError("Live FortyGuard forecast integration pending API key activation.")

    async def get_heatmap(self, facility_id: str, lat: float, lng: float) -> HeatmapGeoJSONResponse:
        if not self.api_key:
            raise ValueError("FORTYGUARD_API_KEY is not configured for live mode.")
            
        url = f"{self.base_url}/heatmap"
        payload = {
            "type": "Polygon",
            "coordinates": [[
                [lng - 0.02, lat - 0.02],
                [lng + 0.02, lat - 0.02],
                [lng + 0.02, lat + 0.02],
                [lng - 0.02, lat + 0.02],
                [lng - 0.02, lat - 0.02]
            ]],
            "granularity": "80m"
        }

        async with httpx.AsyncClient() as client:
            res = await client.post(url, json=payload, headers=self._headers(), timeout=10.0)
            res.raise_for_status()
            data = res.json()
            activity_id = data.get("activity_id")
            if activity_id:
                result = await self._poll_activity(activity_id)
            else:
                result = data

            return HeatmapGeoJSONResponse(
                facility_id=facility_id,
                features=result.get("features", []),
                is_demo_data=False
            )
