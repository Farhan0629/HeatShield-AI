export interface Alert {
  id: string;
  facility_id: string;
  facility_name: string;
  severity: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
  recommended_action?: string;
}
