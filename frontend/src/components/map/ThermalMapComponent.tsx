import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Layers, Info, Layers3 } from 'lucide-react';
import type { Facility } from '../../types/facility';
import type { HeatmapGeoJSONResponse } from '../../types/heat';
import { RiskBadge } from '../common/Badge';

interface Props {
  facility: Facility | null;
  heatmap: HeatmapGeoJSONResponse | null;
}

// Custom Leaflet pin icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px ${color};"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

export const ThermalMapComponent: React.FC<Props> = ({ facility, heatmap }) => {
  const [activeTab, setActiveTab] = useState<'CURRENT' | 'FORECAST' | 'ANALYTICS'>('CURRENT');

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

  const styleGeoJSON = (feature: any) => {
    return {
      fillColor: feature?.properties?.fill || '#ef4444',
      weight: 1.5,
      opacity: 0.8,
      color: feature?.properties?.stroke || '#b91c1c',
      fillOpacity: feature?.properties?.fillOpacity || 0.35
    };
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
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
          {(['CURRENT', 'FORECAST', 'ANALYTICS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[480px] w-full rounded-xl overflow-hidden border border-gray-800">
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {heatmap && heatmap.features && (
            <GeoJSON
              key={`${facility.id}-${activeTab}`}
              data={heatmap.features as any}
              style={styleGeoJSON}
              onEachFeature={(feature, layer) => {
                const props = feature.properties;
                layer.bindPopup(`
                  <div class="p-2">
                    <h4 class="font-bold text-sm text-gray-100">${props.zone}</h4>
                    <p class="text-xs text-amber-400 mt-1">Temperature: ${props.temp_c}°C</p>
                    <p class="text-xs font-mono text-gray-300">Risk Zone: ${props.risk_level}</p>
                  </div>
                `);
              }}
            />
          )}

          <Marker position={position} icon={createCustomIcon(getMarkerColor(facility.risk_level))}>
            <Popup>
              <div className="p-2 text-xs">
                <h4 className="font-bold text-sm text-white flex items-center gap-1">
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

        {/* Overlay Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-surface-DEFAULT/90 backdrop-blur-md p-3 rounded-xl border border-gray-800 text-xs shadow-xl space-y-2">
          <div className="font-mono text-[10px] text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1">
            <Layers3 className="w-3.5 h-3.5 text-indigo-400" />
            Thermal Stress Zones
          </div>
          <div className="flex flex-col space-y-1 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-500/80 border border-red-700" />
              <span>Critical Zone (&gt;40°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-orange-500/80 border border-orange-700" />
              <span>High Risk Buffer (37 - 40°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500/80 border border-amber-700" />
              <span>Moderate Thermal (34 - 37°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500/80 border border-emerald-700" />
              <span>Safe Baseline (&lt;34°C)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 font-mono pt-2">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          FortyGuard GeoJSON heat polygons generated for facility bounding box.
        </span>
        <span>Resolution: 80m Granularity</span>
      </div>
    </div>
  );
};
