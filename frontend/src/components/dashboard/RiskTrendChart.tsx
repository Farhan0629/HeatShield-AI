import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';
import type { HeatForecastResponse } from '../../types/heat';

interface Props {
  forecast: HeatForecastResponse | null;
}

export const RiskTrendChart: React.FC<Props> = ({ forecast }) => {
  if (!forecast) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">Heat Risk Forecast Trend</h3>
          </div>
          <p className="text-sm font-semibold text-gray-200 mt-1">12-Hour Operational Outlook</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2.5 py-1 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 font-mono flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Peak at {forecast.peak_time} ({forecast.peak_risk_score.toFixed(0)}/100)
          </span>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast.hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                <stop offset="50%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-surface-DEFAULT border border-surface-border p-3 rounded-lg shadow-xl text-xs font-mono">
                      <p className="font-bold text-gray-100">{data.time} IST {data.is_peak && '⭐ PEAK'}</p>
                      <p className="text-red-400 mt-1">Risk Score: {data.risk_score} / 100 ({data.risk_level})</p>
                      <p className="text-gray-300">Temp: {data.temperature}°C | Heat Index: {data.heat_index}°C</p>
                      <p className="text-gray-400">Wet Bulb: {data.wet_bulb}°C | Humidity: {data.humidity}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={80} label={{ value: 'CRITICAL (80)', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="risk_score" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          FortyGuard Real-Time 12h Thermal Forecast
        </span>
        <span className="text-amber-400 font-sans text-[11px]">Recommended Break Window: {forecast?.peak_time || '13:30'} – 16:30</span>
      </div>
    </div>
  );
};
