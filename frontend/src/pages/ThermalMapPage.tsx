import React from 'react';
import { ThermalMapComponent } from '../components/map/ThermalMapComponent';
import type { Facility } from '../types/facility';
import type { HeatmapGeoJSONResponse } from '../types/heat';

interface Props {
  facility: Facility | null;
  heatmap: HeatmapGeoJSONResponse | null;
}

export const ThermalMapPage: React.FC<Props> = ({ facility, heatmap }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white font-mono">
          GEOSPATIAL THERMAL INTELLIGENCE
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          High-resolution micro-climate heat map powered by FortyGuard GeoJSON satellite & ground telemetry.
        </p>
      </div>

      <ThermalMapComponent facility={facility} heatmap={heatmap} />
    </div>
  );
};
