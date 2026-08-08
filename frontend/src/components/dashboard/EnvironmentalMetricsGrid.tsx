import React from 'react';
import { Thermometer, Sun, Droplets, Wind, Activity, Gauge } from 'lucide-react';
import type { EnvironmentalMetrics } from '../../types/heat';

interface Props {
  metrics: EnvironmentalMetrics | null;
}

export const EnvironmentalMetricsGrid: React.FC<Props> = ({ metrics }) => {
  if (!metrics) return null;

  const items = [
    {
      label: 'Air Temperature',
      value: `${metrics.temperature}°C`,
      sub: 'Dry Bulb Ambient',
      icon: Thermometer,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    {
      label: 'Heat Index',
      value: `${metrics.heat_index}°C`,
      sub: 'Apparent Thermal Load',
      icon: Sun,
      color: 'text-red-400',
      bg: 'bg-red-500/10'
    },
    {
      label: 'Relative Humidity',
      value: `${metrics.humidity}%`,
      sub: 'Atmospheric Moisture',
      icon: Droplets,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Wet Bulb Temp',
      value: `${metrics.wet_bulb}°C`,
      sub: 'Sweat Dissipation Index',
      icon: Gauge,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      label: 'Air Quality (AQI)',
      value: `${metrics.aqi}`,
      sub: metrics.aqi > 150 ? 'Unhealthy' : 'Moderate',
      icon: Activity,
      color: metrics.aqi > 150 ? 'text-orange-400' : 'text-emerald-400',
      bg: 'bg-indigo-500/10'
    },
    {
      label: 'Solar Irradiance',
      value: `${metrics.solar_irradiance} W/m²`,
      sub: 'Global Horizontal GHI',
      icon: Wind,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="glass-panel p-4 rounded-xl flex flex-col justify-between hover:border-gray-700 transition-all shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">{item.label}</span>
              <div className={`p-1.5 rounded-lg ${item.bg} ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-mono text-gray-100">{item.value}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{item.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
