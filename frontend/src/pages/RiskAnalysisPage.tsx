import React from 'react';
import { RiskFactorBreakdown } from '../components/risk/RiskFactorBreakdown';
import { RiskEngineExplainer } from '../components/risk/RiskEngineExplainer';
import type { RiskAssessment } from '../types/risk';

interface Props {
  assessment: RiskAssessment | null;
}

export const RiskAnalysisPage: React.FC<Props> = ({ assessment }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white font-mono">
          HEATSHIELD RISK ENGINE AUDIT
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Deterministic mathematical scoring model evaluating multi-variable environmental heat burden.
        </p>
      </div>

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
