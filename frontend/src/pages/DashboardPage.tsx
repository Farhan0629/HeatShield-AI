import React from 'react';
import { OverallRiskCard } from '../components/dashboard/OverallRiskCard';
import { EnvironmentalMetricsGrid } from '../components/dashboard/EnvironmentalMetricsGrid';
import { RiskTrendChart } from '../components/dashboard/RiskTrendChart';
import { AIAssessmentCard } from '../components/dashboard/AIAssessmentCard';
import { FacilityStatusTable } from '../components/dashboard/FacilityStatusTable';
import type { Facility } from '../types/facility';
import type { EnvironmentalMetrics, HeatForecastResponse } from '../types/heat';
import type { RiskAssessment } from '../types/risk';

interface Props {
  facilities: Facility[];
  selectedFacility: Facility | null;
  metrics: EnvironmentalMetrics | null;
  assessment: RiskAssessment | null;
  forecast: HeatForecastResponse | null;
  onSelectFacility: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<Props> = ({
  facilities,
  selectedFacility,
  metrics,
  assessment,
  forecast,
  onSelectFacility,
  onNavigate
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner / Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-mono">
            OPERATIONAL HEAT DASHBOARD
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time environmental intelligence and decision support powered by FortyGuard API.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => onNavigate('map')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-colors shadow"
          >
            🗺️ View Thermal Map
          </button>
          <button
            onClick={() => onNavigate('ai')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-md"
          >
            🤖 Open AI Assistant
          </button>
        </div>
      </div>

      {/* Top Grid: Overall Risk Card + Recharts Risk Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <OverallRiskCard
            assessment={assessment}
            facilityName={selectedFacility?.name || 'Selected Facility'}
          />
        </div>

        <div className="lg:col-span-7">
          <RiskTrendChart forecast={forecast} />
        </div>
      </div>

      {/* Environmental Metrics 6-Card Grid */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
          FortyGuard Environmental Metrics
        </h3>
        <EnvironmentalMetricsGrid metrics={metrics} />
      </div>

      {/* AI Assessment Banner */}
      <AIAssessmentCard
        assessment={assessment}
        onAskAI={() => onNavigate('ai')}
      />

      {/* Enterprise Facilities Table */}
      <FacilityStatusTable
        facilities={facilities}
        selectedFacilityId={selectedFacility?.id || 'f1'}
        onSelectFacility={onSelectFacility}
        onNavigateDetails={() => onNavigate('details')}
      />
    </div>
  );
};
