import React from 'react';
import { Activity, WifiOff } from 'lucide-react';

interface Props {
  facilityName?: string;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export const TelemetryLoadingBuffer: React.FC<Props> = ({
  facilityName = 'Selected Facility',
  isError = false,
  errorMessage = 'Unable to establish live connection to FortyGuard Enterprise API.',
  onRetry
}) => {
  if (isError) {
    return (
      <div className="glass-panel p-10 rounded-2xl border border-red-500/30 bg-red-950/20 text-center max-w-xl mx-auto my-12 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-900/40 border border-red-500/50 flex items-center justify-center mx-auto mb-4 text-red-400">
          <WifiOff className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white font-mono mb-2">
          FORTYGUARD LIVE API OUTAGE
        </h3>
        <p className="text-sm text-gray-300 mb-6 font-mono leading-relaxed">
          {errorMessage}
        </p>
        <div className="p-3 bg-black/40 border border-red-900/60 rounded-xl text-xs font-mono text-red-300 text-left mb-6">
          <span className="text-red-400 font-bold block mb-1">STRICT LIVE POLICY:</span>
          HeatShield AI operates strictly in live mode with zero mock fallbacks. Data will only render when live API telemetry is successfully ingested.
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-red-950/50"
          >
            Retry Live Ingestion
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel p-12 rounded-3xl border border-emerald-500/30 bg-surface-base/80 backdrop-blur-xl text-center max-w-lg mx-auto my-16 shadow-2xl relative overflow-hidden">
      {/* Radar scanning beam */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent animate-pulse pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
          <div className="w-20 h-20 rounded-full bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-inner">
            <Activity className="w-9 h-9 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE TELEMETRY INGESTION
          </div>
          <h3 className="text-lg font-extrabold text-white font-mono tracking-tight">
            Syncing FortyGuard Live Telemetry
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Grounding environmental vectors for <strong className="text-white">{facilityName}</strong>
          </p>
        </div>

        <div className="space-y-2 text-left bg-black/40 p-4 rounded-xl border border-gray-800 text-[11px] font-mono">
          <div className="flex items-center justify-between text-gray-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Satellite Spatial Heatmap
            </span>
            <span className="text-emerald-400 font-bold">POLLING 1,382 TILES</span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Wet-Bulb & WBGT Profiler
            </span>
            <span className="text-emerald-400 font-bold">COMPUTING</span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Gemini Decision Engine
            </span>
            <span className="text-purple-400 font-bold">INITIALIZING</span>
          </div>
        </div>

        <p className="text-[10px] font-mono text-gray-500">
          Strict Live Ingestion Policy • No synthetic / mock placeholders
        </p>
      </div>
    </div>
  );
};
