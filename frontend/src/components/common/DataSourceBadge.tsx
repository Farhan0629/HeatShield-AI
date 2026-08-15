import React from 'react';
import { Database, Zap } from 'lucide-react';

interface Props {
  mode?: string;
  isLive?: boolean;
  className?: string;
}

export const DataSourceBadge: React.FC<Props> = ({ mode = 'mock', isLive = false, className = '' }) => {
  if (isLive || mode === 'live') {
    return (
      <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-950/70 border border-emerald-600/40 text-emerald-300 text-[11px] font-mono font-medium shadow-sm ${className}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <Zap className="w-3.5 h-3.5 text-emerald-400" />
        <span>DATA SOURCE: <strong className="text-white">FortyGuard Live API</strong></span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-700/40 text-indigo-300 text-[11px] font-mono font-medium shadow-sm ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
      <Database className="w-3.5 h-3.5 text-indigo-400" />
      <span>DATA SOURCE: <strong className="text-gray-200">Demo Simulation (FortyGuard Schema Aligned)</strong></span>
      <span className="text-[10px] text-gray-400 hidden sm:inline">• US Hackathon Coverage</span>
    </div>
  );
};
