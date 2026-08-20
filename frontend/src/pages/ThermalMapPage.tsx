import React from 'react';
import { ThermalMapComponent } from '../components/map/ThermalMapComponent';
import { TelemetryLoadingBuffer } from '../components/common/TelemetryLoadingBuffer';
import type { Facility } from '../types/facility';
import type { HeatmapGeoJSONResponse, EnvironmentalMetrics, HeatForecastResponse } from '../types/heat';
import type { RiskAssessment } from '../types/risk';

interface Props {
  facility: Facility | null;
  heatmap: HeatmapGeoJSONResponse | null;
  metrics?: EnvironmentalMetrics | null;
  forecast?: HeatForecastResponse | null;
  assessment?: RiskAssessment | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const ThermalMapPage: React.FC<Props> = ({ 
  facility, 
  heatmap, 
  metrics,
  forecast,
  assessment,
  isLoading = false, 
  error = null, 
  onRetry 
}) => {
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

      {isLoading ? (
        <TelemetryLoadingBuffer facilityName={facility?.name} />
      ) : error ? (
        <TelemetryLoadingBuffer facilityName={facility?.name} isError={true} errorMessage={error} onRetry={onRetry} />
      ) : (
        <ThermalMapComponent 
          facility={facility} 
          heatmap={heatmap}
          metrics={metrics}
          forecast={forecast}
          assessment={assessment}
        />
      )}
    </div>
  );
};
