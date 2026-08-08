import React, { useState } from 'react';
import { X, Building2, Save } from 'lucide-react';
import type { FacilityCreate } from '../../types/facility';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FacilityCreate) => void;
}

export const FacilityFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FacilityCreate>({
    name: '',
    type: 'Warehouse',
    location: '',
    latitude: 22.5726,
    longitude: 88.3639,
    workers_count: 100,
    operating_hours: '08:00 - 18:00 IST',
    exposure_type: 'Hybrid (Indoor/Outdoor)',
    cooling_availability: 'Partial Evaporative Cooling'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-800 animate-in fade-in zoom-in duration-200">
        <div className="p-4 bg-surface-muted border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Add Enterprise Facility</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-mono mb-1">Facility Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Pune Logistics Hub"
              className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

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
                value={formData.workers_count}
                onChange={(e) => setFormData({ ...formData, workers_count: parseInt(e.target.value) || 0 })}
                className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-mono mb-1">Location Address *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Pune, Maharashtra, India"
              className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-mono mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-mono mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-mono mb-1">Operating Hours</label>
              <input
                type="text"
                value={formData.operating_hours}
                onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-mono mb-1">Cooling Availability</label>
              <input
                type="text"
                value={formData.cooling_availability}
                onChange={(e) => setFormData({ ...formData, cooling_availability: e.target.value })}
                className="w-full bg-surface-muted text-gray-100 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-muted hover:bg-surface-hover text-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Facility
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
