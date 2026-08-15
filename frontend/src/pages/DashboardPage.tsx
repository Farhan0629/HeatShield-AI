import React from 'react';
import { OverallRiskCard } from '../components/dashboard/OverallRiskCard';
import { FacilityRiskPriority } from '../components/dashboard/FacilityRiskPriority';
import { WhyThisRisk } from '../components/risk/WhyThisRisk';
import { ActionRecommendationsCard } from '../components/risk/ActionRecommendationsCard';
import { OperationalImpactMatrix } from '../components/risk/OperationalImpactMatrix';
import { EnvironmentalMetricsGrid } from '../components/dashboard/EnvironmentalMetricsGrid';
import { RiskTrendChart } from '../components/dashboard/RiskTrendChart';
import { FacilityStatusTable } from '../components/dashboard/FacilityStatusTable';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
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
  const facilityName = selectedFacility?.name || 'Selected Facility';

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline with Data Source Transparency */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold tracking-tight text-white font-mono">
              OPERATIONAL HEAT INTELLIGENCE
            </h2>
            <DataSourceBadge mode="mock" className="hidden sm:inline-flex" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time heat-risk assessment and decision-support platform powered by FortyGuard Temperature Intelligence.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => onNavigate('map')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-colors shadow"
          >
            🗺️ Micro-Climate Heatmap
          </button>
          <button
            onClick={() => onNavigate('ai')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-md flex items-center gap-1.5"
          >
            🤖 Decision Assistant
          </button>
        </div>
      </div>

      {/* 1. Multi-Facility Risk Prioritization Strip */}
      <FacilityRiskPriority
        facilities={facilities}
        selectedFacilityId={selectedFacility?.id || 'f1'}
        onSelectFacility={onSelectFacility}
        onNavigateDetails={(id) => {
          onSelectFacility(id);
          onNavigate('details');
        }}
      />

      {/* 2. Top Grid: Overall Risk Card + 12h Forecast Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <OverallRiskCard
            assessment={assessment}
            facilityName={facilityName}
          />
        </div>

        <div className="lg:col-span-7">
          <RiskTrendChart forecast={forecast} />
        </div>
      </div>

      {/* 3. Why This Risk? Root-Cause Intelligence */}
      <WhyThisRisk
        assessment={assessment}
        facilityName={facilityName}
      />

      {/* 4. Actionable Prioritized Recommendations */}
      <ActionRecommendationsCard
        recommendations={assessment?.structured_recommendations || []}
        facilityName={facilityName}
      />

      {/* 5. Operational Impact Matrix */}
      <OperationalImpactMatrix
        impact={assessment?.operational_impact}
      />

      {/* 6. Supporting Environmental Telemetry */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">
            FortyGuard Atmospheric & Micro-Climate Telemetry
          </h3>
          <span className="text-[11px] font-mono text-gray-500">
            High-Resolution Street-Level Ingestion
          </span>
        </div>
        <EnvironmentalMetricsGrid metrics={metrics} />
      </div>

      {/* 7. Enterprise Facility Inventory Table */}
      <FacilityStatusTable
        facilities={facilities}
        selectedFacilityId={selectedFacility?.id || 'f1'}
        onSelectFacility={onSelectFacility}
        onNavigateDetails={(id) => {
          onSelectFacility(id);
          onNavigate('details');
        }}
      />
    </div>
  );
};

