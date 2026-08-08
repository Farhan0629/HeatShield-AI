import type { Facility, FacilityCreate } from '../types/facility';
import type { EnvironmentalMetrics, HeatForecastResponse, HeatmapGeoJSONResponse } from '../types/heat';
import type { RiskAssessment } from '../types/risk';
import type { AIChatRequest, AIChatResponse } from '../types/ai';
import type { Alert } from '../types/alert';
import type { ReportRequest, ReportResponse } from '../types/report';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export class BackendUnavailableError extends Error {
  constructor(message: string = 'HeatShield FastAPI backend service is unavailable.') {
    super(message);
    this.name = 'BackendUnavailableError';
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error [${res.status}]: ${errorText || res.statusText}`);
    }

    return await res.json();
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message.includes('Failed to fetch') || err.code === 'ECONNREFUSED') {
      throw new BackendUnavailableError(
        'Backend unavailable. Please ensure the HeatShield FastAPI backend server is running on http://localhost:8000.'
      );
    }
    throw err;
  }
}

export const apiService = {
  // Health
  getHealth: () => request<{ status: string; fortyguard_mode: string; fortyguard_connected: boolean; ai_provider: string }>('/health'),

  // Facilities
  getFacilities: () => request<Facility[]>('/facilities'),
  getFacility: (id: string) => request<Facility>(`/facilities/${id}`),
  createFacility: (data: FacilityCreate) => request<Facility>('/facilities', { method: 'POST', body: JSON.stringify(data) }),

  // Heat & Forecast
  getCurrentConditions: (facilityId: string) => request<EnvironmentalMetrics>(`/heat/current/${facilityId}`),
  getForecast: (facilityId: string, hours: number = 12) => request<HeatForecastResponse>(`/heat/forecast/${facilityId}?hours=${hours}`),
  getHeatmap: (facilityId: string) => request<HeatmapGeoJSONResponse>(`/heat/heatmap/${facilityId}`),

  // Risk
  getRiskAssessment: (facilityId: string) => request<RiskAssessment>(`/risk/${facilityId}`),

  // AI Assistant
  postAIChat: (data: AIChatRequest) => request<AIChatResponse>('/ai/chat', { method: 'POST', body: JSON.stringify(data) }),

  // Alerts
  getAlerts: () => request<Alert[]>('/alerts'),
  acknowledgeAlert: (alertId: string) => request<Alert>(`/alerts/${alertId}/acknowledge`, { method: 'POST' }),
  resolveAlert: (alertId: string) => request<Alert>(`/alerts/${alertId}/resolve`, { method: 'POST' }),

  // Reports
  generateReport: (data: ReportRequest) => request<ReportResponse>('/reports/generate', { method: 'POST', body: JSON.stringify(data) }),
  downloadReportPDFUrl: (facilityId: string, reportType: string) => `${API_BASE_URL}/reports/pdf?facility_id=${facilityId}&report_type=${encodeURIComponent(reportType)}`
};
