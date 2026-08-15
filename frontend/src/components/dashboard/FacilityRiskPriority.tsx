import React from 'react';
import { AlertOctagon, ArrowUpRight, Building2 } from 'lucide-react';
import type { Facility } from '../../types/facility';
import { RiskBadge } from '../common/Badge';

interface Props {
  facilities: Facility[];
  selectedFacilityId: string;
  onSelectFacility: (id: string) => void;
  onNavigateDetails: (id: string) => void;
}

export const FacilityRiskPriority: React.FC<Props> = ({
  facilities,
  selectedFacilityId,
  onSelectFacility,
  onNavigateDetails
}) => {
  // Sort facilities descending by risk score
  const sortedFacilities = [...facilities].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0));

  return (
    <div className="glass-panel p-5 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 text-orange-400" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-300 font-semibold">
            Enterprise Facility Risk Prioritization
          </h3>
        </div>
        <span className="text-[11px] font-mono text-gray-400">
          Ranked by Thermal Urgency
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {sortedFacilities.map((fac, idx) => {
          const isSelected = fac.id === selectedFacilityId;

          return (
            <div
              key={fac.id}
              onClick={() => onSelectFacility(fac.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 shadow-lg'
                  : 'bg-surface-muted/60 border-gray-800/80 hover:border-gray-700 hover:bg-surface-hover/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    idx === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gray-800 text-gray-400'
                  }`}>
                    #{idx + 1} PRIORITY
                  </span>
                  <RiskBadge level={fac.risk_level}>{fac.risk_level}</RiskBadge>
                </div>

                <div className="font-bold text-gray-100 text-xs truncate flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{fac.name}</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5 truncate">{fac.location}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase">Operational Risk</div>
                  <div className="font-mono font-extrabold text-sm text-white">
                    {fac.risk_score.toFixed(0)} <span className="text-[10px] text-gray-400 font-normal">/ 100</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">Ambient</div>
                  <div className="font-mono font-bold text-amber-400 text-sm">
                    {fac.current_temperature}°C
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-indigo-500/30 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-300 font-medium font-mono">● Active Context</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateDetails(fac.id);
                    }}
                    className="text-indigo-400 hover:text-indigo-200 inline-flex items-center gap-0.5 font-semibold"
                  >
                    Deep Dive <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
