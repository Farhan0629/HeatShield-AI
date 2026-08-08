export interface ReportRequest {
  facility_id: string;
  report_type: 'Incident Report' | 'Daily Heat Summary' | 'Facility Risk Report';
  notes?: string;
}

export interface ReportResponse {
  id: string;
  facility_id: string;
  facility_name: string;
  report_type: string;
  title: string;
  generated_at: string;
  risk_level: string;
  risk_score: number;
  summary: string;
  environmental_snapshot: Record<string, any>;
  key_findings: string[];
  actions_taken: string[];
  generated_by: string;
}
