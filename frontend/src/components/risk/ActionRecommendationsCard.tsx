import React from 'react';
import { CheckSquare, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import type { ActionRecommendation } from '../../types/risk';

interface Props {
  recommendations: ActionRecommendation[];
  facilityName: string;
}

export const ActionRecommendationsCard: React.FC<Props> = ({ recommendations, facilityName }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
        <div className="flex items-center space-x-2">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-300 font-semibold">
            Actionable Operational Recommendations
          </h3>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Decision Support for {facilityName}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {recommendations.map((rec, idx) => {
          const isP1 = rec.priority.includes('P1');
          const isP2 = rec.priority.includes('P2');

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all text-xs space-y-2 ${
                isP1
                  ? 'bg-red-950/20 border-red-500/30'
                  : isP2
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-surface-muted/60 border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    isP1
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : isP2
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  }`}
                >
                  {rec.priority}
                </span>
                <span className="text-[10px] font-mono text-gray-500">Step {idx + 1}</span>
              </div>

              <div className="text-sm font-bold text-gray-100 leading-snug flex items-start gap-2 pt-0.5">
                <ArrowRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{rec.action}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-surface-DEFAULT/70 border border-gray-800/80 text-gray-300">
                  <span className="font-mono text-[10px] text-gray-400 uppercase block mb-0.5">Underlying Reason:</span>
                  <span>{rec.reason}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-200">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase block mb-0.5">Expected Operational Benefit:</span>
                  <span className="font-medium">{rec.expected_benefit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5 pt-1">
        <AlertCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span>Operational safety decision support. Non-medical engineering & shift scheduling protocols.</span>
      </div>
    </div>
  );
};
