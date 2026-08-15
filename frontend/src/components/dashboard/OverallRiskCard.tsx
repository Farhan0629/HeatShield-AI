import React from 'react';
import { ShieldAlert, Flame, Clock, ThermometerSun } from 'lucide-react';
import { RiskBadge } from '../common/Badge';
import type { RiskAssessment } from '../../types/risk';

interface Props {
  assessment: RiskAssessment | null;
  facilityName: string;
}

export const OverallRiskCard: React.FC<Props> = ({ assessment, facilityName }) => {
  if (!assessment) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400">Operational Heat Risk</h2>
          </div>
          <p className="text-sm font-bold text-gray-100 mt-1">{facilityName}</p>
        </div>
        <RiskBadge level={assessment.level}>{assessment.level}</RiskBadge>
      </div>

      <div className="my-2 flex flex-col sm:flex-row sm:items-baseline gap-4">
        <div className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-mono">
          {assessment.score.toFixed(0)}
          <span className="text-xl text-gray-400 font-normal"> / 100</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-red-400 flex items-center gap-1.5 uppercase">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            {assessment.headline}
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5">
            Deterministic Decision Engine — OSHA & Wet-Bulb Calibrated
          </span>
        </div>
      </div>

      {/* Exceedance & Microclimate Anomaly Quick Metrics */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/80 text-xs">
        <div className="p-2.5 rounded-xl bg-surface-muted/70 border border-gray-800 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Threshold Exceedance</div>
            <div className="font-bold text-gray-100">{assessment.threshold_exceedance_hours} Continuous Hrs</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-muted/70 border border-gray-800 flex items-center space-x-2">
          <ThermometerSun className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Peak Heat Period</div>
            <div className="font-bold text-amber-300">{assessment.peak_thermal_period}</div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-800/60 flex items-center justify-between text-[10px] font-mono text-gray-400">
        <span>Shift Window: <strong className="text-gray-200">{assessment.exposure_duration_hours}h</strong></span>
        <span>Local Anomaly: <strong className="text-red-400">+{assessment.temperature_anomaly_c}°C UHI</strong></span>
        <span className="hidden sm:inline">{assessment.model_version}</span>
      </div>
    </div>
  );
};

