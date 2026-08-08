import React from 'react';
import { ShieldAlert, Flame, Clock } from 'lucide-react';
import { RiskBadge } from '../common/Badge';
import type { RiskAssessment } from '../../types/risk';

interface Props {
  assessment: RiskAssessment | null;
  facilityName: string;
}

export const OverallRiskCard: React.FC<Props> = ({ assessment, facilityName }) => {
  if (!assessment) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400">Heat Risk Status</h2>
          </div>
          <p className="text-sm font-semibold text-gray-200 mt-1">{facilityName}</p>
        </div>
        <RiskBadge level={assessment.level}>{assessment.level}</RiskBadge>
      </div>

      <div className="my-6 flex items-baseline space-x-4">
        <div className="text-6xl font-extrabold tracking-tight text-white font-mono">
          {assessment.score.toFixed(0)}
          <span className="text-xl text-gray-400 font-normal"> / 100</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-red-400 flex items-center gap-1">
            <ShieldAlert className="w-4 h-4" />
            {assessment.headline}
          </span>
          <span className="text-xs text-gray-400 mt-0.5">HeatShield Risk Engine — Deterministic Operational Score</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
          Shift Exposure Duration: <strong className="text-gray-200 ml-1">{assessment.exposure_duration_hours} hrs</strong>
        </span>
        <span className="font-mono text-[11px] text-gray-400">{assessment.model_version}</span>
      </div>
    </div>
  );
};
