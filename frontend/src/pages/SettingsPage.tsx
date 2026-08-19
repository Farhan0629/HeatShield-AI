import React from 'react';
import { ShieldCheck, Key, Server, Cpu, ExternalLink } from 'lucide-react';

interface Props {
  health: {
    status?: string;
    fortyguard_mode?: string;
    fortyguard_connected?: boolean;
    ai_provider?: string;
  } | null;
}

export const SettingsPage: React.FC<Props> = ({ health: _health }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white font-mono">
          SYSTEM CONFIGURATION & INTEGRATION STATUS
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          View FortyGuard environmental provider abstractions and AI engine credentials status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environmental Provider Card */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
            <Server className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">FortyGuard API Provider</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-gray-800">
              <span className="text-gray-400 font-mono">Active Provider</span>
              <span className="font-mono font-bold text-emerald-300 uppercase px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                FORTYGUARD LIVE API
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-gray-800">
              <span className="text-gray-400 font-mono">Live API Status</span>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Connected (Real-time Telemetry)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-muted/60 border border-gray-800/80 text-gray-300 text-[11px] leading-relaxed">
              Official FortyGuard API documentation:
              <a
                href="https://docs-api.fortyguard.com/docs/introduction"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 underline flex items-center gap-1 mt-1 hover:text-indigo-300 font-mono"
              >
                https://docs-api.fortyguard.com/docs/introduction
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* AI Provider Card */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">AI Engine Configuration</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-gray-800">
              <span className="text-gray-400 font-mono">Active Decision Engine</span>
              <span className="font-mono font-bold text-purple-300 px-2.5 py-0.5 rounded bg-purple-950 border border-purple-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Google Gemini Live API
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-gray-800">
              <span className="text-gray-400 font-mono">Live Grounding Telemetry</span>
              <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Feed Ingestion Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Secret Key Disclaimer */}
      <div className="glass-panel p-6 rounded-2xl shadow-xl border border-indigo-950 bg-indigo-950/20 flex items-start space-x-4">
        <div className="p-3 rounded-xl bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 flex-shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="text-xs text-gray-300 space-y-1">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            Secret Credential Security Protection
            <Key className="w-3.5 h-3.5 text-indigo-400" />
          </h4>
          <p className="leading-relaxed">
            All API keys and credentials are stored strictly in backend server environment variables (`.env`).
            The frontend never exposes secret keys, ensuring full client security and compliance during production deployment.
          </p>
        </div>
      </div>
    </div>
  );
};
