import React from 'react';
import { Zap } from 'lucide-react';

interface Props {
  mode?: string;
  isLive?: boolean;
  className?: string;
}

export const DataSourceBadge: React.FC<Props> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-medium shadow-sm ${className}`}>
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <Zap className="w-3.5 h-3.5 text-emerald-400" />
      <span>DATA SOURCE: <strong className="text-white">FortyGuard Live Enterprise API</strong></span>
      <span className="text-[10px] text-emerald-400/80 hidden sm:inline">• Verified Live Ingestion</span>
    </div>
  );
};

