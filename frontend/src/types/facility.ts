export interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  latitude: number;
  longitude: number;
  workers_count: number;
  operating_hours: string;
  exposure_type: string;
  cooling_availability: string;
  risk_score: number;
  risk_level: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  current_temperature: number;
  status: string;
}

export interface FacilityCreate {
  name: string;
  type: string;
  location: string;
  latitude: number;
  longitude: number;
  workers_count: number;
  operating_hours: string;
  exposure_type: string;
  cooling_availability: string;
}
