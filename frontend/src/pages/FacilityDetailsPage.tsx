import React from 'react';
import { Building2, MapPin, Users, Clock, ShieldAlert, Bot, FileText, Activity } from 'lucide-react';
import type { Facility } from '../types/facility';
import type { EnvironmentalMetrics, HeatForecastResponse } from '../types/heat';
import type { RiskAssessment } from '../types/risk';
import type { Alert } from '../types/alert';
import { RiskBadge } from '../components/common/Badge';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { OverallRiskCard } from '../components/dashboard/OverallRiskCard';
import { WhyThisRisk } from '../components/risk/WhyThisRisk';
import { ActionRecommendationsCard } from '../components/risk/ActionRecommendationsCard';
import { OperationalImpactMatrix } from '../components/risk/OperationalImpactMatrix';
import { EnvironmentalMetricsGrid } from '../components/dashboard/EnvironmentalMetricsGrid';
import { RiskTrendChart } from '../components/dashboard/RiskTrendChart';
import { TelemetryLoadingBuffer } from '../components/common/TelemetryLoadingBuffer';

interface Props {
  facility: Facility | null;
  metrics: EnvironmentalMetrics | null;
  assessment: RiskAssessment | null;
  forecast: HeatForecastResponse | null;
  alerts: Alert[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onNavigate: (tab: string) => void;
}

export const FacilityDetailsPage: React.FC<Props> = ({
  facility,
  metrics,
  assessment,
  forecast,
  alerts,
  isLoading = false,
  error = null,
  onRetry,
  onNavigate
}) => {
  if (!facility) return null;
  if (isLoading) return <TelemetryLoadingBuffer facilityName={facility.name} />;
  if (error) return <TelemetryLoadingBuffer facilityName={facility.name} isError={true} errorMessage={error} onRetry={onRetry} />;

  const facilityAlerts = alerts.filter(a => a.facility_id === facility.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl font-extrabold text-white">{facility.name}</h2>
                <RiskBadge level={facility.risk_level}>{facility.risk_level}</RiskBadge>
                <DataSourceBadge mode="live" isLive={true} className="hidden sm:inline-flex" />
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {facility.location} (Lat: {facility.latitude}, Lng: {facility.longitude})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => onNavigate('ai')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-md flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4" />
            Ask Decision Assistant
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-md flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            Executive Report
          </button>
        </div>
      </div>

      {/* Facility Attributes Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-xl flex items-center space-x-3">
          <Users className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-[10px] font-mono uppercase text-gray-400">Worker Capacity</div>
            <div className="text-sm font-bold text-gray-100">{facility.workers_count} Personnel</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center space-x-3">
          <Clock className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] font-mono uppercase text-gray-400">Operating Hours</div>
            <div className="text-sm font-bold text-gray-100">{facility.operating_hours}</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center space-x-3">
          <Activity className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-[10px] font-mono uppercase text-gray-400">Exposure Profile</div>
            <div className="text-sm font-bold text-gray-100">{facility.exposure_type}</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] font-mono uppercase text-gray-400">Cooling Systems</div>
            <div className="text-sm font-bold text-gray-100">{facility.cooling_availability}</div>
          </div>
        </div>
      </div>

      {/* Operational Risk & Forecast Projection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <OverallRiskCard
            assessment={assessment}
            facilityName={facility.name}
          />
        </div>

        <div className="lg:col-span-7">
          <RiskTrendChart forecast={forecast} />
        </div>
      </div>

      {/* Why This Risk? Intelligence */}
      <WhyThisRisk
        assessment={assessment}
        facilityName={facility.name}
      />

      {/* Actionable Recommendations */}
      <ActionRecommendationsCard
        recommendations={assessment?.structured_recommendations || []}
        facilityName={facility.name}
      />

      {/* Operational Impact Matrix */}
      <OperationalImpactMatrix
        impact={assessment?.operational_impact}
      />

      {/* Environmental Metrics */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
          FortyGuard Atmospheric & Micro-Climate Telemetry
        </h3>
        <EnvironmentalMetricsGrid metrics={metrics} />
      </div>

      {/* Facility Alerts */}
      <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-2">
          Facility Alerts Log ({facilityAlerts.length})
        </h3>
        {facilityAlerts.length === 0 ? (
          <p className="text-xs text-gray-500 font-mono py-8 text-center">No active alerts for this facility.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {facilityAlerts.map((alt) => (
              <div key={alt.id} className="p-4 rounded-xl bg-surface-muted/80 border border-gray-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <RiskBadge level={alt.severity}>{alt.severity}</RiskBadge>
                  <span className="text-[10px] font-mono text-gray-400">{alt.timestamp}</span>
                </div>
                <h4 className="font-bold text-gray-100">{alt.title}</h4>
                <p className="text-gray-300">{alt.message}</p>
                <div className="p-2.5 rounded-lg bg-surface-DEFAULT border border-gray-800 text-[11px] text-emerald-300">
                  <strong>Recommended:</strong> {alt.recommended_action}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

