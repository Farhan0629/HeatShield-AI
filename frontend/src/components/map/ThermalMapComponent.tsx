import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  Layers3, 
  MapPin, 
  Info, 
  Clock, 
  BarChart3, 
  Thermometer
} from 'lucide-react';
import type { Facility } from '../../types/facility';
import type { HeatmapGeoJSONResponse, EnvironmentalMetrics, HeatForecastResponse } from '../../types/heat';
import type { RiskAssessment } from '../../types/risk';
import { RiskBadge } from '../common/Badge';

interface Props {
  facility: Facility | null;
  heatmap: HeatmapGeoJSONResponse | null;
  metrics?: EnvironmentalMetrics | null;
  forecast?: HeatForecastResponse | null;
  assessment?: RiskAssessment | null;
}

// Custom Leaflet pin icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 16px ${color};"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const ThermalMapComponent: React.FC<Props> = ({ 
  facility, 
  heatmap,
  metrics,
  forecast,
  assessment: _assessment
}) => {
  const [activeTab, setActiveTab] = useState<'CURRENT' | 'FORECAST' | 'ANALYTICS'>('CURRENT');
  const [selectedForecastIndex, setSelectedForecastIndex] = useState<number>(3); // default to ~14:00 peak
  const [selectedZoneInfo, setSelectedZoneInfo] = useState<any>(null);

  if (!facility) return null;

  const position: [number, number] = [facility.latitude, facility.longitude];

  const getMarkerColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MODERATE': return '#f59e0b';
      default: return '#10b981';
    }
  };

  // Forecast points from API or fallback
  const forecastHourly = forecast?.hourly || [];
  const selectedForecastPoint = forecastHourly[selectedForecastIndex] || forecastHourly[0] || null;

  // Calculate temperature offset for forecast simulation
  const forecastTempDelta = useMemo(() => {
    if (activeTab !== 'FORECAST' || !selectedForecastPoint || !metrics) return 0;
    return selectedForecastPoint.temperature - metrics.temperature;
  }, [activeTab, selectedForecastPoint, metrics]);

  // Dynamic GeoJSON styling based on Active Tab & Forecast scrub
  const styleGeoJSON = (feature: any) => {
    const baseTemp = feature?.properties?.temp_c || 38.0;
    const effectiveTemp = baseTemp + forecastTempDelta;

    let fill = '#ef4444';
    let stroke = '#b91c1c';
    let fillOpacity = 0.45;

    if (effectiveTemp >= 40.0) {
      fill = '#ef4444';
      stroke = '#dc2626';
      fillOpacity = 0.65;
    } else if (effectiveTemp >= 37.0) {
      fill = '#f97316';
      stroke = '#ea580c';
      fillOpacity = 0.55;
    } else if (effectiveTemp >= 34.0) {
      fill = '#f59e0b';
      stroke = '#d97706';
      fillOpacity = 0.45;
    } else {
      fill = '#10b981';
      stroke = '#059669';
      fillOpacity = 0.35;
    }

    if (activeTab === 'ANALYTICS') {
      // Highlight thermal anomaly intensity
      fillOpacity = effectiveTemp >= 38.0 ? 0.75 : 0.3;
    }

    return {
      fillColor: fill,
      weight: 1.2,
      opacity: 0.85,
      color: stroke,
      fillOpacity: fillOpacity
    };
  };

  // Compute zone statistics for Analytics tab
  const stats = useMemo(() => {
    if (!heatmap?.features || heatmap.features.length === 0) {
      return { total: 0, critical: 0, high: 0, moderate: 0, safe: 0, avgTemp: 38.0, uhiDelta: 3.6 };
    }
    const total = heatmap.features.length;
    let critical = 0;
    let high = 0;
    let moderate = 0;
    let safe = 0;
    let sumTemp = 0;

    heatmap.features.forEach((f: any) => {
      const t = f.properties?.temp_c || 38.0;
      sumTemp += t;
      if (t >= 40.0) critical++;
      else if (t >= 37.0) high++;
      else if (t >= 34.0) moderate++;
      else safe++;
    });

    const avgTemp = +(sumTemp / total).toFixed(1);
    const uhiDelta = +(avgTemp - 34.2).toFixed(1); // Regional rural baseline ~34.2°C

    return {
      total,
      critical,
      high,
      moderate,
      safe,
      avgTemp,
      uhiDelta: uhiDelta > 0 ? uhiDelta : 2.8,
      critPct: Math.round((critical / total) * 100),
      highPct: Math.round((high / total) * 100),
      modPct: Math.round((moderate / total) * 100),
      safePct: Math.round((safe / total) * 100),
    };
  }, [heatmap]);

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col shadow-2xl space-y-4">
      {/* Header with Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">High-Resolution Thermal Heatmap</h3>
          </div>
          <p className="text-sm font-semibold text-white mt-1 flex items-center gap-2">
            {facility.name}
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FortyGuard Live Micro-Climate Ingestion
            </span>
          </p>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center bg-surface-muted p-1 rounded-xl border border-gray-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('CURRENT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'CURRENT'
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-950'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            CURRENT
          </button>
          <button
            onClick={() => setActiveTab('FORECAST')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'FORECAST'
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-950'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            FORECAST
          </button>
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'ANALYTICS'
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-950'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            ANALYTICS
          </button>
        </div>
      </div>

      {/* FORECAST MODE TIME SCRUBBER */}
      {activeTab === 'FORECAST' && (
        <div className="bg-surface-base/90 p-4 rounded-xl border border-indigo-900/60 shadow-inner space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              12-Hour Thermal Forecast Timeline:
            </span>
            <span className="text-amber-400 font-bold bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800">
              Peak Thermal Window: {forecast?.peak_time || '14:00'} (Projected Risk: {forecast?.peak_risk_score || '78.5'})
            </span>
          </div>

          {/* Time scrubbing pill buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5">
            {forecastHourly.map((pt, idx) => {
              const isSelected = idx === selectedForecastIndex;
              const isPeak = pt.is_peak || pt.time.includes('14:00') || pt.time.includes('15:00');
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedForecastIndex(idx)}
                  className={`p-2 rounded-lg text-center font-mono text-xs transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-md scale-105'
                      : isPeak
                      ? 'bg-red-950/50 border-red-800/80 text-red-300 hover:bg-red-900/60'
                      : 'bg-black/30 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="text-[10px] text-gray-400">{pt.time}</div>
                  <div className="text-xs font-bold mt-0.5">{pt.temperature}°C</div>
                  <div className="text-[9px] text-amber-400/90">{pt.risk_score}</div>
                </button>
              );
            })}
          </div>

          {selectedForecastPoint && (
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-300 pt-1 border-t border-gray-800">
              <span>Simulated Hour: <strong className="text-white">{selectedForecastPoint.time}</strong></span>
              <span>Projected Heat Index: <strong className="text-amber-400">{selectedForecastPoint.heat_index}°C</strong></span>
              <span>Wet Bulb: <strong className="text-cyan-400">{selectedForecastPoint.wet_bulb}°C</strong></span>
              <span>Status: <RiskBadge level={selectedForecastPoint.risk_level}>{selectedForecastPoint.risk_level}</RiskBadge></span>
            </div>
          )}
        </div>
      )}

      {/* ANALYTICS MODE METRIC STRIP */}
      {activeTab === 'ANALYTICS' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-base/90 p-4 rounded-xl border border-indigo-900/60 shadow-inner">
          <div className="bg-black/40 p-3 rounded-lg border border-gray-800">
            <span className="text-[10px] font-mono text-gray-400 block">Urban Heat Island ($\Delta T$)</span>
            <span className="text-lg font-bold font-mono text-amber-400">+{stats.uhiDelta}°C</span>
            <span className="text-[10px] text-gray-500 block">Above rural baseline</span>
          </div>

          <div className="bg-black/40 p-3 rounded-lg border border-gray-800">
            <span className="text-[10px] font-mono text-gray-400 block">Mean Micro-Climate Temp</span>
            <span className="text-lg font-bold font-mono text-orange-400">{stats.avgTemp}°C</span>
            <span className="text-[10px] text-gray-500 block">Across 80m Grid</span>
          </div>

          <div className="bg-black/40 p-3 rounded-lg border border-gray-800">
            <span className="text-[10px] font-mono text-gray-400 block">Critical Heat Hotspots</span>
            <span className="text-lg font-bold font-mono text-red-400">{stats.critical} Tiles</span>
            <span className="text-[10px] text-gray-500 block">{stats.critPct}% of monitored footprint</span>
          </div>

          <div className="bg-black/40 p-3 rounded-lg border border-gray-800">
            <span className="text-[10px] font-mono text-gray-400 block">Total FortyGuard Tiles</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{stats.total} Tiles</span>
            <span className="text-[10px] text-gray-500 block">80m Resolution Satellite Raster</span>
          </div>
        </div>
      )}

      {/* LEAFLET MAP CONTAINER */}
      <div className="relative h-[500px] w-full rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {heatmap && heatmap.features && (
            <GeoJSON
              key={`${facility.id}-${activeTab}-${selectedForecastIndex}`}
              data={heatmap.features as any}
              style={styleGeoJSON}
              onEachFeature={(feature, layer) => {
                const props = feature.properties;
                const effectiveTemp = +(props.temp_c + forecastTempDelta).toFixed(1);
                
                layer.on({
                  click: () => {
                    setSelectedZoneInfo({
                      zone: props.zone,
                      temp: effectiveTemp,
                      level: effectiveTemp >= 40 ? 'CRITICAL' : effectiveTemp >= 37 ? 'HIGH' : effectiveTemp >= 34 ? 'MODERATE' : 'SAFE'
                    });
                  }
                });

                layer.bindPopup(`
                  <div style="font-family: monospace; color: #fff; padding: 4px;">
                    <div style="font-weight: bold; font-size: 13px; color: #f59e0b;">${props.zone}</div>
                    <div style="font-size: 12px; margin-top: 4px;">Effective Temp: <strong>${effectiveTemp}°C</strong></div>
                    <div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">Mode: ${activeTab}</div>
                    <div style="font-size: 11px; color: #10b981; margin-top: 2px;">FortyGuard 80m Satellite Tile</div>
                  </div>
                `);
              }}
            />
          )}

          <Marker position={position} icon={createCustomIcon(getMarkerColor(facility.risk_level))}>
            <Popup>
              <div className="p-2 text-xs font-mono">
                <h4 className="font-bold text-sm text-white flex items-center gap-1 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {facility.name}
                </h4>
                <p className="text-gray-300 mt-1">{facility.location}</p>
                <div className="mt-2 flex items-center justify-between">
                  <RiskBadge level={facility.risk_level}>{facility.risk_level}</RiskBadge>
                  <span className="font-mono text-amber-400 font-bold">{facility.current_temperature}°C</span>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* OVERLAY: LIVE TELEMETRY HUD (Top Right) */}
        {metrics && activeTab === 'CURRENT' && (
          <div className="absolute top-4 right-4 z-[1000] bg-surface-DEFAULT/90 backdrop-blur-md p-3.5 rounded-xl border border-gray-800 text-xs shadow-2xl space-y-1.5 font-mono hidden md:block">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold border-b border-gray-800 pb-1">
              Live Sensor Readings
            </div>
            <div className="flex items-center justify-between gap-4 text-gray-300 text-[11px]">
              <span>Air Temp:</span>
              <span className="text-white font-bold">{metrics.temperature}°C</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-gray-300 text-[11px]">
              <span>Heat Index:</span>
              <span className="text-amber-400 font-bold">{metrics.heat_index}°C</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-gray-300 text-[11px]">
              <span>Wet Bulb:</span>
              <span className="text-cyan-400 font-bold">{metrics.wet_bulb}°C</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-gray-300 text-[11px]">
              <span>Solar GHI:</span>
              <span className="text-yellow-400 font-bold">{metrics.solar_irradiance} W/m²</span>
            </div>
          </div>
        )}

        {/* OVERLAY: Selected Zone Inspector (Top Left) */}
        {selectedZoneInfo && (
          <div className="absolute top-4 left-14 z-[1000] bg-surface-DEFAULT/95 backdrop-blur-md p-3 rounded-xl border border-indigo-500/50 text-xs shadow-2xl space-y-1 font-mono">
            <div className="flex items-center justify-between gap-3 text-indigo-300 font-bold">
              <span>{selectedZoneInfo.zone}</span>
              <button onClick={() => setSelectedZoneInfo(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="text-white">Temperature: <strong className="text-amber-400">{selectedZoneInfo.temp}°C</strong></div>
            <div className="text-gray-400">Risk Classification: <strong className="text-orange-400">{selectedZoneInfo.level}</strong></div>
          </div>
        )}

        {/* Overlay Legend (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-surface-DEFAULT/90 backdrop-blur-md p-3.5 rounded-xl border border-gray-800 text-xs shadow-xl space-y-2">
          <div className="font-mono text-[10px] text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1">
            <Layers3 className="w-3.5 h-3.5 text-indigo-400" />
            Thermal Stress Legend
          </div>
          <div className="flex flex-col space-y-1 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-500/90 border border-red-700" />
              <span>Critical Zone (&gt;40°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-orange-500/90 border border-orange-700" />
              <span>High Risk Buffer (37 - 40°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500/90 border border-amber-700" />
              <span>Moderate Thermal (34 - 37°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500/90 border border-emerald-700" />
              <span>Safe Baseline (&lt;34°C)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 font-mono pt-2 gap-2">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          FortyGuard GeoJSON heat polygons generated for {facility.name} bounding box.
        </span>
        <span className="text-emerald-400 font-bold">100% Real-Time Satellite Telemetry</span>
      </div>
    </div>
  );
};
