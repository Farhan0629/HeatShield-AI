import React from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

interface Props {
  onRetry?: () => void;
  message?: string;
}

export const BackendOfflineBanner: React.FC<Props> = ({ onRetry, message }) => {
  return (
    <div className="rounded-xl bg-red-950/40 border border-red-800/60 p-6 my-6 shadow-xl backdrop-blur-md">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-red-900/50 rounded-lg text-red-400 border border-red-700/50">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-200 flex items-center gap-2">
            Backend Service Unavailable
            <span className="text-xs px-2 py-0.5 rounded bg-red-900/80 text-red-300 font-mono">503 Disconnected</span>
          </h3>
          <p className="mt-1 text-sm text-red-300/90 leading-relaxed">
            {message || "HeatShield AI requires an active connection to its FastAPI backend server (http://localhost:8000). The frontend does not silently fall back to client mock data."}
          </p>

          <div className="mt-4 bg-surface-muted p-3 rounded-lg border border-red-900/40 font-mono text-xs text-gray-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>cd backend && uvicorn app.main:app --reload</span>
            </div>
          </div>

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 inline-flex items-center px-4 py-2 bg-red-800 hover:bg-red-700 text-white font-medium text-xs rounded-lg transition-colors shadow-md"
            >
              <RefreshCw className="w-4 h-4 mr-2 animate-spin-slow" />
              Retry Connection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
