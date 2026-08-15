import React from 'react';
import { HelpCircle, AlertTriangle, ThermometerSun, Clock } from 'lucide-react';
import type { RiskAssessment } from '../../types/risk';

interface Props {
  assessment: RiskAssessment | null;
  facilityName: string;
}

export const WhyThisRisk: React.FC<Props> = ({ assessment, facilityName }) => {
  if (!assessment) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-300 font-semibold">
            Why This Risk? Root-Cause Intelligence — {facilityName}
          </h3>
        </div>
        <span className="text-[11px] font-mono text-indigo-400">
          Deterministic Factor Analysis
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Primary Contributing Environmental Drivers */}
        <div className="p-4 rounded-xl bg-surface-muted/70 border border-gray-800 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold font-mono text-xs">
            <ThermometerSun className="w-4 h-4" />
            <span>PRIMARY THERMAL DRIVERS</span>
          </div>

          <ul className="space-y-2 text-gray-300">
            {assessment.primary_factors && assessment.primary_factors.length > 0 ? (
              assessment.primary_factors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{factor}</span>
                </li>
              ))
            ) : (
              assessment.factors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span><strong>{factor.name}</strong>: {factor.description}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Operational Consequences & Exposure Mechanics */}
        <div className="p-4 rounded-xl bg-surface-muted/70 border border-gray-800 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold font-mono text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>OPERATIONAL EXPOSURE MECHANICS</span>
          </div>

          <ul className="space-y-2 text-gray-300">
            {assessment.why_it_matters.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gray-400 bg-surface-muted/40 p-3 rounded-xl border border-gray-800/60">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          Safety Threshold Exceedance: <strong className="text-gray-200">{assessment.threshold_exceedance_hours} Continuous Hours</strong>
        </span>
        <span>
          Peak Thermal Window: <strong className="text-amber-400">{assessment.peak_thermal_period}</strong>
        </span>
        <span>
          Micro-Climate Anomaly: <strong className="text-red-400">+{assessment.temperature_anomaly_c}°C above regional baseline</strong>
        </span>
      </div>
    </div>
  );
};
