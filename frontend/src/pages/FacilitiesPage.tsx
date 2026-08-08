import React, { useState } from 'react';
import { Building2, Plus, ArrowRight } from 'lucide-react';
import type { Facility, FacilityCreate } from '../types/facility';
import { RiskBadge } from '../components/common/Badge';
import { FacilityFormModal } from '../components/facilities/FacilityFormModal';

interface Props {
  facilities: Facility[];
  selectedFacilityId: string;
  onSelectFacility: (id: string) => void;
  onCreateFacility: (data: FacilityCreate) => void;
  onNavigateDetails: (id: string) => void;
}

export const FacilitiesPage: React.FC<Props> = ({
  facilities,
  selectedFacilityId,
  onSelectFacility,
  onCreateFacility,
  onNavigateDetails
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-mono">
            FACILITY REGISTRY & MANAGEMENT
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Monitor, configure, and register operational assets under thermal stress tracking.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Facility
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((fac) => {
          const isSelected = fac.id === selectedFacilityId;
          return (
            <div
              key={fac.id}
              onClick={() => onSelectFacility(fac.id)}
              className={`glass-panel p-6 rounded-2xl cursor-pointer transition-all shadow-xl hover:border-indigo-500/50 relative ${
                isSelected ? 'border-l-4 border-indigo-500 bg-indigo-950/20' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-base text-white">{fac.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{fac.location}</p>
                </div>
                <RiskBadge level={fac.risk_level}>{fac.risk_level}</RiskBadge>
              </div>

              <div className="grid grid-cols-3 gap-3 my-4 py-3 border-y border-gray-800/80 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Type</span>
                  <span className="font-semibold text-gray-200">{fac.type}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Workers</span>
                  <span className="font-semibold text-gray-200">{fac.workers_count}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Risk Score</span>
                  <span className="font-mono font-bold text-amber-400">{fac.risk_score.toFixed(0)} / 100</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 text-[11px] font-mono">Cooling: {fac.cooling_availability}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateDetails(fac.id);
                  }}
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <FacilityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onCreateFacility}
      />
    </div>
  );
};
