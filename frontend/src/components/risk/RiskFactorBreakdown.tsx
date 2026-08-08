import React from 'react';
import { Sliders, Cpu } from 'lucide-react';
import type { RiskAssessment } from '../../types/risk';

interface Props {
  assessment: RiskAssessment | null;
}

export const RiskFactorBreakdown: React.FC<Props> = ({ assessment }) => {
  if (!assessment) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">HeatShield Deterministic Risk Engine</h3>
          </div>
          <p className="text-sm font-semibold text-white mt-1">Contributing Operational Factors</p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800 flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5" />
          Deterministic Model
        </span>
      </div>

      <div className="space-y-5">
        {assessment.factors.map((factor, idx) => {
          let barColor = 'bg-emerald-500';
          if (factor.value >= 80) barColor = 'bg-red-500';
          else if (factor.value >= 60) barColor = 'bg-orange-500';
          else if (factor.value >= 40) barColor = 'bg-amber-500';

          return (
            <div key={idx} className="bg-surface-muted/50 p-4 rounded-xl border border-gray-800/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-gray-200">{factor.name}</span>
                <div className="flex items-center space-x-3 font-mono">
                  <span className="text-gray-400 text-[11px]">Weight: {(factor.weight * 100).toFixed(0)}%</span>
                  <span className="font-bold text-gray-100">{factor.value.toFixed(0)}%</span>
                </div>
              </div>

              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all duration-700 ease-out`}
                  style={{ width: `${Math.min(100, Math.max(5, factor.value))}%` }}
                />
              </div>

              <p className="mt-2 text-[11px] text-gray-400">{factor.description}</p>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200">
        <p className="leading-relaxed">
          "Risk score is calculated by HeatShield's deterministic risk engine using available environmental signals."
        </p>
      </div>
    </div>
  );
};
