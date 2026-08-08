import React from 'react';
import { AlertList } from '../components/alerts/AlertList';
import type { Alert } from '../types/alert';

interface Props {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export const AlertsPage: React.FC<Props> = ({ alerts, onAcknowledge, onResolve }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white font-mono">
          OPERATIONAL RISK ALERTS
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Automated push notifications and safety hazard warnings triggered by thermal threshold breaches.
        </p>
      </div>

      <AlertList
        alerts={alerts}
        onAcknowledge={onAcknowledge}
        onResolve={onResolve}
      />
    </div>
  );
};
