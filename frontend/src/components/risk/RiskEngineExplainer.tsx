import React from 'react';
import { BookOpen, Shield, Calculator, Info } from 'lucide-react';

export const RiskEngineExplainer: React.FC = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-xl space-y-6">
      <div className="flex items-center space-x-2 border-b border-gray-800 pb-4">
        <BookOpen className="w-5 h-5 text-indigo-400" />
        <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">Scoring Methodology & Guardrails</h3>
      </div>

      <div className="space-y-4 text-xs text-gray-300">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 flex-shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-100 text-sm">Deterministic Mathematical Foundation</h4>
            <p className="mt-1 leading-relaxed text-gray-400">
              The risk score is calculated via a deterministic algorithm rather than arbitrary LLM generation. 
              The score combines Heat Index (30%), Wet Bulb Globe Index (25%), Ambient Temperature (20%), Shift Exposure Duration (15%), and Humidity Burden (10%).
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-100 text-sm">Facility Vulnerability Multipliers</h4>
            <p className="mt-1 leading-relaxed text-gray-400">
              Facility classification adjusts baseline risk exposure: Outdoor Construction (1.25x), Factories (1.15x), Warehouses (1.10x), and Office Campuses (0.85x).
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-surface-muted/70 border border-gray-800 text-[11px] text-gray-400 space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-amber-400 font-mono">
          <Info className="w-3.5 h-3.5" />
          HeatShield Risk Model — Prototype Notice
        </div>
        <p className="leading-relaxed">
          This scoring model is an operational decision prototype developed for FortyGuard Hackathon '26. 
          It does not claim scientific or medical validation. Operational safety precautions should be validated against regional occupational safety regulations (e.g. OSHA / ISO 7243 WBGT standards).
        </p>
      </div>
    </div>
  );
};
