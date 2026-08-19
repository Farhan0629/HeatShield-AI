import React from 'react';
import { RiskFactorBreakdown } from '../components/risk/RiskFactorBreakdown';
import { RiskEngineExplainer } from '../components/risk/RiskEngineExplainer';
import { WhyThisRisk } from '../components/risk/WhyThisRisk';
import { OperationalImpactMatrix } from '../components/risk/OperationalImpactMatrix';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import type { RiskAssessment } from '../types/risk';

interface Props {
  assessment: RiskAssessment | null;
}

export const RiskAnalysisPage: React.FC<Props> = ({ assessment }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold tracking-tight text-white font-mono">
              HEAT-RISK ENGINE AUDIT
            </h2>
            <DataSourceBadge mode="live" isLive={true} className="hidden sm:inline-flex" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Deterministic mathematical scoring model evaluating multi-variable environmental heat burden and operational exposure factors.
          </p>
        </div>
      </div>

      {/* Why This Risk Root-Cause Intelligence */}
      <WhyThisRisk
        assessment={assessment}
        facilityName="Active Monitored Facility"
      />

      {/* Operational Impact Propagation */}
      <OperationalImpactMatrix
        impact={assessment?.operational_impact}
      />

      {/* Mathematical Factor Breakdown + Formula Explainer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RiskFactorBreakdown assessment={assessment} />
        </div>
        <div className="lg:col-span-5">
          <RiskEngineExplainer />
        </div>
      </div>
    </div>
  );
};

