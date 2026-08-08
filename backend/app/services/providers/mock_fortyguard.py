import datetime
from typing import Dict, Any, List
from app.services.providers.base import TemperatureDataProvider
from app.schemas.heat import EnvironmentalMetrics, HeatForecastResponse, HourlyForecastPoint, HeatmapGeoJSONResponse

FACILITY_MOCK_ENV: Dict[str, Dict[str, Any]] = {
    "f1": { # Kolkata Distribution Warehouse
        "temperature": 39.4,
        "heat_index": 48.2,
        "humidity": 72.0,
        "wet_bulb": 30.1,
        "aqi": 164,
        "solar_irradiance": 850.0,
        "wind_speed": 11.2,
    },
    "f2": { # Delhi Construction Site
        "temperature": 42.1,
        "heat_index": 51.5,
        "humidity": 58.0,
        "wet_bulb": 31.5,
        "aqi": 210,
        "solar_irradiance": 920.0,
        "wind_speed": 8.5,
    },
    "f3": { # Mumbai Office Campus
        "temperature": 33.5,
        "heat_index": 41.0,
        "humidity": 82.0,
        "wet_bulb": 28.2,
        "aqi": 118,
        "solar_irradiance": 740.0,
        "wind_speed": 16.0,
    },
    "f4": { # Bengaluru Manufacturing Unit
        "temperature": 31.0,
        "heat_index": 34.2,
        "humidity": 64.0,
        "wet_bulb": 24.5,
        "aqi": 82,
        "solar_irradiance": 810.0,
        "wind_speed": 14.5,
    }
}

class MockFortyGuardProvider(TemperatureDataProvider):
    async def get_current_conditions(self, facility_id: str, lat: float, lng: float) -> EnvironmentalMetrics:
        base = FACILITY_MOCK_ENV.get(facility_id, FACILITY_MOCK_ENV["f1"])
        return EnvironmentalMetrics(
            facility_id=facility_id,
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            temperature=base["temperature"],
            heat_index=base["heat_index"],
            humidity=base["humidity"],
            wet_bulb=base["wet_bulb"],
            aqi=base["aqi"],
            solar_irradiance=base["solar_irradiance"],
            wind_speed=base["wind_speed"],
            is_demo_data=True
        )

    async def get_forecast(self, facility_id: str, lat: float, lng: float, hours: int = 12) -> HeatForecastResponse:
        base = FACILITY_MOCK_ENV.get(facility_id, FACILITY_MOCK_ENV["f1"])
        hourly_points: List[HourlyForecastPoint] = []
        
        start_hour = 8
        peak_score = 0.0
        peak_time = "14:00"

        # Generate exactly 12 hours forecast aligned with FortyGuard heatmap forecasting
        for i in range(12):
            hour_val = (start_hour + i) % 24
            time_str = f"{hour_val:02d}:00"
            
            # Simulated daytime bell curve peaking around 14:00 - 15:00
            if hour_val <= 14:
                factor = (i / 6.0)
            else:
                factor = max(0.2, 1.0 - ((i - 6) / 6.0))

            temp = round(base["temperature"] - 4.0 + (factor * 5.5), 1)
            hi = round(base["heat_index"] - 5.0 + (factor * 6.8), 1)
            rh = round(max(40.0, base["humidity"] + (1.0 - factor) * 15.0), 1)
            wb = round(base["wet_bulb"] - 2.5 + (factor * 3.2), 1)
            
            # Simple score curve for display
            score = round(min(100.0, max(20.0, (hi - 30.0) * 4.2 + (wb - 22.0) * 2.5)), 1)
            
            if score >= 80:
                level = "CRITICAL"
            elif score >= 60:
                level = "HIGH"
            elif score >= 40:
                level = "MODERATE"
            else:
                level = "SAFE"

            is_peak = False
            if score > peak_score:
                peak_score = score
                peak_time = time_str
                is_peak = True

            hourly_points.append(HourlyForecastPoint(
                time=time_str,
                temperature=temp,
                heat_index=hi,
                humidity=rh,
                wet_bulb=wb,
                risk_score=score,
                risk_level=level,
                is_peak=is_peak
            ))

        return HeatForecastResponse(
            facility_id=facility_id,
            generated_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            forecast_hours=12,
            hourly=hourly_points,
            peak_time=peak_time,
            peak_risk_score=peak_score,
            is_demo_data=True
        )

    async def get_heatmap(self, facility_id: str, lat: float, lng: float) -> HeatmapGeoJSONResponse:
        # Create realistic thermal zone concentric polygons around facility coordinates
        features = [
            {
                "type": "Feature",
                "properties": {
                    "zone": "Critical Thermal Core",
                    "temp_c": 41.2,
                    "risk_level": "CRITICAL",
                    "fill": "#ef4444",
                    "fillOpacity": 0.45,
                    "stroke": "#b91c1c"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [lng - 0.008, lat - 0.008],
                        [lng + 0.008, lat - 0.008],
                        [lng + 0.008, lat + 0.008],
                        [lng - 0.008, lat + 0.008],
                        [lng - 0.008, lat - 0.008]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "zone": "High Heat Stress Buffer",
                    "temp_c": 38.5,
                    "risk_level": "HIGH",
                    "fill": "#f97316",
                    "fillOpacity": 0.35,
                    "stroke": "#c2410c"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [lng - 0.016, lat - 0.016],
                        [lng + 0.016, lat - 0.016],
                        [lng + 0.016, lat + 0.016],
                        [lng - 0.016, lat + 0.016],
                        [lng - 0.016, lat - 0.016]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "zone": "Moderate Thermal Perimeter",
                    "temp_c": 35.0,
                    "risk_level": "MODERATE",
                    "fill": "#f59e0b",
                    "fillOpacity": 0.25,
                    "stroke": "#b45309"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [lng - 0.028, lat - 0.028],
                        [lng + 0.028, lat - 0.028],
                        [lng + 0.028, lat + 0.028],
                        [lng - 0.028, lat + 0.028],
                        [lng - 0.028, lat - 0.028]
                    ]]
                }
            }
        ]

        return HeatmapGeoJSONResponse(
            facility_id=facility_id,
            features=features,
            is_demo_data=True
        )
