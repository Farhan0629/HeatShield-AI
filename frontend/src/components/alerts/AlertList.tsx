import React, { useState } from 'react';
import { Bell, CheckCircle2, ShieldCheck, Filter } from 'lucide-react';
import type { Alert } from '../../types/alert';
import { RiskBadge } from '../common/Badge';

interface Props {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export const AlertList: React.FC<Props> = ({ alerts, onAcknowledge, onResolve }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">Enterprise Thermal Risk Alerts</h3>
        </div>

        <div className="flex items-center space-x-2 bg-surface-muted p-1 rounded-xl border border-gray-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400 ml-2" />
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-lg font-mono transition-colors ${
                filterSeverity === sev
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-mono text-xs">
            No active thermal risk alerts match the selected severity filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.resolved
                  ? 'bg-surface-muted/40 border-gray-800/60 opacity-60'
                  : alert.severity === 'CRITICAL'
                  ? 'bg-red-950/20 border-red-800/40'
                  : 'bg-surface-muted/80 border-gray-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <RiskBadge level={alert.severity}>{alert.severity}</RiskBadge>
                    <span className="font-bold text-sm text-gray-100">{alert.facility_name}</span>
                    <span className="text-xs text-gray-500 font-mono">• {alert.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-gray-200 mt-1">{alert.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{alert.message}</p>

                  {alert.recommended_action && (
                    <div className="mt-2.5 p-2 rounded-lg bg-indigo-950/40 border border-indigo-800/30 text-[11px] text-indigo-300">
                      <strong>Operational Action:</strong> {alert.recommended_action}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 flex-shrink-0 text-xs">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Acknowledge
                    </button>
                  )}
                  {!alert.resolved ? (
                    <button
                      onClick={() => onResolve(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
