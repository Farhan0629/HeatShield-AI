import React from 'react';
import { Activity, Users, Zap, Sun, Cpu, AlertTriangle } from 'lucide-react';
import type { OperationalImpact } from '../../types/risk';
import { RiskBadge } from '../common/Badge';

interface Props {
  impact?: OperationalImpact;
}

export const OperationalImpactMatrix: React.FC<Props> = ({ impact }) => {
  if (!impact) return null;

  const items = [
    {
      label: 'Personnel Exposure',
      level: impact.personnel_exposure,
      detail: impact.personnel_detail,
      icon: Users,
      color: 'text-rose-400'
    },
    {
      label: 'Cooling System Demand',
      level: impact.cooling_demand,
      detail: impact.cooling_detail,
      icon: Zap,
      color: 'text-amber-400'
    },
    {
      label: 'Outdoor Work Risk',
      level: impact.outdoor_work_risk,
      detail: impact.outdoor_detail,
      icon: Sun,
      color: 'text-orange-400'
    },
    {
      label: 'Equipment Thermal Stress',
      level: impact.equipment_thermal_stress,
      detail: impact.equipment_detail,
      icon: Cpu,
      color: 'text-purple-400'
    },
    {
      label: 'Disruption / Pacing Risk',
      level: impact.disruption_risk,
      detail: impact.disruption_detail,
      icon: AlertTriangle,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-300 font-semibold">
            Operational Impact Assessment
          </h3>
        </div>
        <span className="text-[11px] font-mono text-gray-400">
          Rule-Based Facility Risk Propagation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-surface-muted/60 border border-gray-800/80 flex flex-col justify-between space-y-2 text-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg bg-surface-DEFAULT border border-gray-800 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <RiskBadge level={item.level}>{item.level}</RiskBadge>
                </div>
                <div className="font-bold text-gray-200 text-xs">{item.label}</div>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed pt-1 border-t border-gray-800/60">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
