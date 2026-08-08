export interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  description: string;
}

export interface RiskAssessment {
  facility_id: string;
  score: number;
  level: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  headline: string;
  summary: string;
  exposure_duration_hours: number;
  factors: RiskFactor[];
  why_it_matters: string[];
  recommended_actions: string[];
  model_version: string;
  is_demo_data: boolean;
}
