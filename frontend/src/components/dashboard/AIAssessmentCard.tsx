import React from 'react';
import { Bot, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { RiskAssessment } from '../../types/risk';

interface Props {
  assessment: RiskAssessment | null;
  onAskAI?: () => void;
}

export const AIAssessmentCard: React.FC<Props> = ({ assessment, onAskAI }) => {
  if (!assessment) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-2xl relative border-indigo-900/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-300">HeatShield AI Assessment</h3>
            <p className="text-sm font-semibold text-white mt-0.5">{assessment.headline}</p>
          </div>
        </div>
        <button
          onClick={onAskAI}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-md flex items-center gap-1.5"
        >
          <Bot className="w-3.5 h-3.5" />
          Ask Assistant
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-300 leading-relaxed bg-surface-muted/60 p-3.5 rounded-xl border border-gray-800/80">
        "{assessment.summary}"
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div className="bg-surface-muted/40 p-4 rounded-xl border border-gray-800/60">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5 mb-2.5">
            <AlertTriangle className="w-4 h-4" />
            Why This Matters
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            {assessment.why_it_matters.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-muted/40 p-4 rounded-xl border border-gray-800/60">
          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 className="w-4 h-4" />
            Recommended Actions
          </h4>
          <ol className="space-y-2 text-xs text-gray-300 list-decimal list-inside">
            {assessment.recommended_actions.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="text-gray-200 ml-1">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
        <span className="flex items-center gap-1 text-gray-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          Recommended Operational Precaution — Non-Medical Advisory
        </span>
        <span className="text-gray-400">Model: {assessment.model_version}</span>
      </div>
    </div>
  );
};
