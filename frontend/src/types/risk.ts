export interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  description: string;
}

export interface ActionRecommendation {
  priority: 'P1 - Immediate' | 'P2 - High' | 'P3 - Standard' | string;
  action: string;
  reason: string;
  expected_benefit: string;
}

export interface OperationalImpact {
  personnel_exposure: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  personnel_detail: string;
  cooling_demand: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cooling_detail: string;
  outdoor_work_risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  outdoor_detail: string;
  equipment_thermal_stress: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  equipment_detail: string;
  disruption_risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  disruption_detail: string;
}

export interface RiskAssessment {
  facility_id: string;
  score: number;
  level: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  headline: string;
  summary: string;
  exposure_duration_hours: number;
  threshold_exceedance_hours: number;
  peak_thermal_period: string;
  temperature_anomaly_c: number;
  primary_factors: string[];
  factors: RiskFactor[];
  why_it_matters: string[];
  recommended_actions: string[];
  structured_recommendations: ActionRecommendation[];
  operational_impact?: OperationalImpact;
  model_version: string;
  is_demo_data: boolean;
}

