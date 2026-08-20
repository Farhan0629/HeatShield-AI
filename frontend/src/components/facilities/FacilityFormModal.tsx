import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Building2, 
  Save, 
  Search, 
  MapPin, 
  Loader2, 
  PenTool, 
  CheckCircle2, 
  ArrowLeft, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import type { FacilityCreate } from '../../types/facility';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FacilityCreate) => void;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  type?: string;
  class?: string;
  address?: {
    building?: string;
    industrial?: string;
    commercial?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

const DEFAULT_FORM_DATA: FacilityCreate = {
  name: '',
  type: 'Warehouse',
  location: '',
  latitude: 32.8998,
  longitude: -97.0403,
  workers_count: 100,
  operating_hours: '08:00 - 18:00',
  exposure_type: 'Hybrid (Indoor/Outdoor)',
  cooling_availability: 'Partial Evaporative Cooling'
};

export const FacilityFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  // Modal Mode: 'search' (default search list), 'form' (filling/editing form details)
  const [activeTab, setActiveTab] = useState<'search' | 'manual'>('search');
  const [formData, setFormData] = useState<FacilityCreate>(DEFAULT_FORM_DATA);
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(null);

  // Stale request cancellation ref
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset all modal state when closed or opened
  const resetState = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setActiveTab('search');
    setFormData(DEFAULT_FORM_DATA);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setSearchError(null);
    setHasSearched(false);
    setSelectedPlaceName(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetState();
    } else {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [isOpen, resetState]);

  // Execute search with AbortController
  const performSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;

    // Abort previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmed
      )}&format=json&addressdetails=1&limit=5`;

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en'
        }
      });

      if (!response.ok) {
        throw new Error(`Location search service returned status ${response.status}`);
      }

      const data: NominatimResult[] = await response.json();
      setSearchResults(data || []);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was cancelled; do nothing
        return;
      }
      console.warn('Nominatim location search error:', err);
      setSearchError('Unable to load place results. You can enter details manually below.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced auto-search when typing (1.2 seconds debounce)
  useEffect(() => {
    if (activeTab !== 'search') return;
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = searchQuery.trim();
    if (trimmed.length >= 3) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(trimmed);
      }, 1200);
    } else if (trimmed.length === 0) {
      setSearchResults([]);
      setHasSearched(false);
      setSearchError(null);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, activeTab, performSearch]);

  // Handle explicit search submission (pressing Enter or Search button)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    performSearch(searchQuery);
  };

  // Handle selecting a search result
  const handleSelectResult = (result: NominatimResult) => {
    // Extract clean name and address
    const mainName = result.name || result.display_name.split(',')[0].trim() || 'Enterprise Facility';
    const cleanLocation = result.display_name;
    const lat = Number(parseFloat(result.lat).toFixed(6));
    const lon = Number(parseFloat(result.lon).toFixed(6));

    setFormData(prev => ({
      ...prev,
      name: mainName,
      location: cleanLocation,
      latitude: isNaN(lat) ? prev.latitude : lat,
      longitude: isNaN(lon) ? prev.longitude : lon
    }));

    setSelectedPlaceName(mainName);
    // Switch to the form view to review and fill operational details
    setActiveTab('manual');
  };

  // Final Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim()) {
      return;
    }
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-800 animate-in fade-in zoom-in duration-200 my-8">
        
        {/* Modal Header */}
        <div className="p-4 bg-surface-muted/90 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800/80 text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Add Enterprise Facility</h3>
              <p className="text-[11px] font-mono text-gray-400">Register facility for FortyGuard thermal monitoring</p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-4 flex items-center justify-between border-b border-gray-800/80 pb-3">
          <div className="flex items-center bg-surface-muted p-1 rounded-xl border border-gray-800">
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Search & Auto-Fill
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeTab === 'manual'
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              {selectedPlaceName ? 'Edit Facility Details' : 'Manual Entry'}
            </button>
          </div>

          {selectedPlaceName && activeTab === 'search' && (
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Resume Form →
            </button>
          )}
        </div>

        {/* TAB 1: SEARCH & AUTO-FILL MODE */}
        {activeTab === 'search' && (
          <div className="p-6 space-y-5">
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <label className="block text-xs font-mono text-gray-300">
                Search Facility Name, Landmark, or Address
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Amazon Fulfillment Dallas, Tesla Austin, or 123 Main St..."
                  className="w-full bg-surface-muted text-gray-100 pl-10 pr-24 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 text-xs font-sans"
                  autoFocus
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-mono text-[11px] font-semibold transition-colors flex items-center gap-1"
                >
                  {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 font-mono">
                Press Enter or wait ~1s to search OpenStreetMap global geographic registry.
              </p>
            </form>

            {/* Searching State */}
            {isSearching && (
              <div className="py-8 flex flex-col items-center justify-center space-y-2 text-gray-400">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                <span className="text-xs font-mono">Searching OpenStreetMap database...</span>
              </div>
            )}

            {/* Search Error State */}
            {searchError && !isSearching && (
              <div className="p-3.5 bg-amber-950/40 border border-amber-800/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>{searchError}</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('manual')}
                    className="text-amber-400 hover:underline font-semibold font-mono text-[11px]"
                  >
                    Switch to manual form entry →
                  </button>
                </div>
              </div>
            )}

            {/* Results List */}
            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Found {searchResults.length} locations (click to select):</span>
                  <span>OpenStreetMap</span>
                </div>

                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {searchResults.map((result) => {
                    const title = result.name || result.display_name.split(',')[0].trim();
                    const latNum = parseFloat(result.lat).toFixed(4);
                    const lonNum = parseFloat(result.lon).toFixed(4);

                    return (
                      <div
                        key={result.place_id}
                        onClick={() => handleSelectResult(result)}
                        className="p-3.5 rounded-xl bg-surface-muted hover:bg-surface-hover border border-gray-800 hover:border-indigo-500/70 transition-all cursor-pointer group flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-white font-semibold text-xs group-hover:text-indigo-300 transition-colors">
                            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>{title}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 line-clamp-2 pl-5 font-sans leading-relaxed">
                            {result.display_name}
                          </p>
                          <div className="pl-5 pt-0.5 flex items-center gap-2 text-[10px] font-mono text-gray-500">
                            <span>Lat: <strong className="text-gray-300">{latNum}</strong></span>
                            <span>Lon: <strong className="text-gray-300">{lonNum}</strong></span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="shrink-0 px-2.5 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-[11px] font-mono font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                        >
                          Select →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty Results State */}
            {!isSearching && hasSearched && searchResults.length === 0 && !searchError && (
              <div className="p-6 text-center space-y-3 bg-surface-muted/50 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-300">
                  No matching locations found for <strong className="text-white font-mono">"{searchQuery}"</strong>.
                </p>
                <p className="text-[11px] text-gray-400">
                  Try searching with city/state, postal code, or exact street address.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors inline-flex items-center gap-1.5"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  Add Facility Manually
                </button>
              </div>
            )}

            {/* Initial Prompt State */}
            {!isSearching && !hasSearched && (
              <div className="p-4 bg-surface-muted/40 rounded-xl border border-gray-800/80 text-xs text-gray-400 space-y-2">
                <p className="font-semibold text-gray-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Fast Coordinate & Address Auto-Fill
                </p>
                <p className="text-[11px] leading-relaxed">
                  Search any global location or enterprise facility to automatically populate verified coordinates and address for FortyGuard micro-climate modeling.
                </p>
                <div className="pt-2 border-t border-gray-800/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('manual')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-mono"
                  >
                    Prefer to enter coordinates manually? Click here →
                  </button>
                </div>
              </div>
            )}

            {/* Attribution Footer */}
            <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>Data © OpenStreetMap contributors, ODbL 1.0</span>
              <span className="flex items-center gap-1">
                Nominatim Geocoding
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: FORM / MANUAL ENTRY MODE */}
        {activeTab === 'manual' && (
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Auto-filled notification banner if populated via search */}
            {selectedPlaceName && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Auto-filled from: <strong className="text-white">{selectedPlaceName}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('search')}
                  className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Change Location
                </button>
              </div>
            )}

            {/* Facility Name */}
            <div>
              <label className="block text-gray-300 font-mono mb-1">Facility Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Amazon DFW7 Logistics Hub"
                className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Facility Type & Worker Count */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-mono mb-1">Facility Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Warehouse">Warehouse</option>
                  <option value="Factory">Factory</option>
                  <option value="Office">Office</option>
                  <option value="School">School</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Construction Site">Construction Site</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-mono mb-1">Worker Count</label>
                <input
                  type="number"
                  min="1"
                  value={formData.workers_count}
                  onChange={(e) => setFormData({ ...formData, workers_count: parseInt(e.target.value) || 0 })}
                  className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Location Address */}
            <div>
              <label className="block text-gray-300 font-mono mb-1">Location Address *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Dallas/Fort Worth, Texas, USA"
                className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Coordinates (Latitude & Longitude) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-mono mb-1">
                  Latitude <span className="text-gray-500 text-[10px]">(-90 to 90)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-mono mb-1">
                  Longitude <span className="text-gray-500 text-[10px]">(-180 to 180)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Operating Hours & Cooling */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-mono mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={formData.operating_hours}
                  onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                  placeholder="e.g. 08:00 - 18:00"
                  className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-mono mb-1">Cooling Availability</label>
                <input
                  type="text"
                  value={formData.cooling_availability}
                  onChange={(e) => setFormData({ ...formData, cooling_availability: e.target.value })}
                  placeholder="e.g. Industrial HVLS Fans"
                  className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                Back to Search
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-surface-muted hover:bg-surface-hover text-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Facility
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
