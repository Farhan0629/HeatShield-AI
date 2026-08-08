export interface EnvironmentalMetrics {
  facility_id: string;
  timestamp: string;
  temperature: number;
  heat_index: number;
  humidity: number;
  wet_bulb: number;
  aqi: number;
  solar_irradiance: number;
  wind_speed: number;
  is_demo_data: boolean;
}

export interface HourlyForecastPoint {
  time: string;
  temperature: number;
  heat_index: number;
  humidity: number;
  wet_bulb: number;
  risk_score: number;
  risk_level: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  is_peak?: boolean;
}

export interface HeatForecastResponse {
  facility_id: string;
  generated_at: string;
  forecast_hours: number; // 12 hours
  hourly: HourlyForecastPoint[];
  peak_time: string;
  peak_risk_score: number;
  is_demo_data: boolean;
}

export interface HeatmapFeature {
  type: string;
  properties: {
    zone: string;
    temp_c: number;
    risk_level: string;
    fill: string;
    fillOpacity: number;
    stroke: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface HeatmapGeoJSONResponse {
  facility_id: string;
  type: string;
  features: HeatmapFeature[];
  is_demo_data: boolean;
}
