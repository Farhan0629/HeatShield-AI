import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import type { Facility } from '../../types/facility';
import { RiskBadge } from '../common/Badge';

interface Props {
  facilities: Facility[];
  selectedFacilityId: string;
  onSelectFacility: (id: string) => void;
  onNavigateDetails: (id: string) => void;
}

export const FacilityStatusTable: React.FC<Props> = ({
  facilities,
  selectedFacilityId,
  onSelectFacility,
  onNavigateDetails
}) => {
  return (
    <div className="glass-panel p-6 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">Enterprise Facility Heat Status</h3>
        </div>
        <span className="text-xs font-mono text-gray-400">{facilities.length} Monitored Locations</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-surface-muted text-gray-400 font-mono text-[11px] uppercase border-b border-gray-800">
            <tr>
              <th className="py-3 px-4">Facility</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Air Temp</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {facilities.map((fac) => {
              const isSelected = fac.id === selectedFacilityId;
              return (
                <tr
                  key={fac.id}
                  onClick={() => onSelectFacility(fac.id)}
                  className={`hover:bg-surface-hover/80 cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-semibold text-gray-100 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {fac.name}
                  </td>
                  <td className="py-3.5 px-4 text-gray-400">{fac.type}</td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={fac.risk_level}>{fac.risk_level}</RiskBadge>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-200">
                    {fac.risk_score.toFixed(0)} <span className="text-[10px] text-gray-400">/ 100</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-amber-400 font-semibold">{fac.current_temperature}°C</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateDetails(fac.id);
                      }}
                      className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-xs font-medium"
                    >
                      Details
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
