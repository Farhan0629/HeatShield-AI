from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class EnvironmentalMetrics(BaseModel):
    facility_id: str
    timestamp: str
    temperature: float = Field(..., description="Air Temperature in °C")
    heat_index: float = Field(..., description="Heat Index in °C")
    humidity: float = Field(..., description="Relative Humidity %")
    wet_bulb: float = Field(..., description="Wet Bulb Temperature in °C")
    aqi: int = Field(..., description="Air Quality Index")
    solar_irradiance: float = Field(..., description="Global Horizontal Irradiance in W/m²")
    wind_speed: float = Field(..., description="Wind Speed in km/h")
    is_demo_data: bool = True

class HourlyForecastPoint(BaseModel):
    time: str = Field(..., example="14:00")
    temperature: float
    heat_index: float
    humidity: float
    wet_bulb: float
    risk_score: float
    risk_level: str
    is_peak: bool = False

class HeatForecastResponse(BaseModel):
    facility_id: str
    generated_at: str
    forecast_hours: int = 12
    hourly: List[HourlyForecastPoint]
    peak_time: str
    peak_risk_score: float
    is_demo_data: bool = True

class HeatmapGeoJSONResponse(BaseModel):
    facility_id: str
    type: str = "FeatureCollection"
    features: List[Dict[str, Any]]
    is_demo_data: bool = True
