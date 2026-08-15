import React from 'react';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Sliders,
  Bot,
  Bell,
  FileText,
  Settings,
  Flame,
  ChevronDown,
  User,
  Activity
} from 'lucide-react';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { BackendOfflineBanner } from '../components/common/BackendOfflineBanner';
import type { Facility } from '../types/facility';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  facilities: Facility[];
  selectedFacilityId: string;
  onSelectFacility: (id: string) => void;
  isBackendOffline: boolean;
  onRetryBackend: () => void;
  unreadAlertsCount: number;
  children: React.ReactNode;
}

export const MainLayout: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  facilities,
  selectedFacilityId,
  onSelectFacility,
  isBackendOffline,
  onRetryBackend,
  unreadAlertsCount,
  children
}) => {
  const currentFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, tier: 'Tier 1' },
    { id: 'facilities', label: 'Facility Inventory', icon: Building2, tier: 'Tier 2' },
    { id: 'details', label: 'Facility Deep Dive', icon: MapPin, tier: 'Tier 1' },
    { id: 'map', label: 'Micro-Climate Map', icon: Activity, tier: 'Tier 1' },
    { id: 'risk', label: 'Risk Engine Audit', icon: Sliders, tier: 'Tier 1' },
    { id: 'ai', label: 'Decision Assistant', icon: Bot, tier: 'Tier 1' },
    { id: 'alerts', label: 'Alerts Registry', icon: Bell, badge: unreadAlertsCount, tier: 'Tier 2' },
    { id: 'reports', label: 'Executive Reports', icon: FileText, tier: 'Tier 2' },
    { id: 'settings', label: 'System Settings', icon: Settings, tier: 'Tier 3' },
  ];

  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="h-16 bg-surface-DEFAULT/90 backdrop-blur-md border-b border-surface-border sticky top-0 z-[1500] px-4 md:px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 text-white shadow-lg shadow-orange-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white font-mono leading-none flex items-center gap-1.5">
                HEATSHIELD <span className="text-indigo-400">AI</span>
              </h1>
              <p className="text-[10px] font-mono text-gray-400 tracking-wider uppercase mt-0.5">
                Enterprise Heat Risk Intelligence & Decision Support
              </p>
            </div>
          </div>

          <div className="hidden xl:block">
            <DataSourceBadge mode="mock" />
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-3">
          {/* Active Facility Selector */}
          <div className="relative">
            <select
              value={selectedFacilityId}
              onChange={(e) => onSelectFacility(e.target.value)}
              className="bg-surface-muted text-gray-200 text-xs font-semibold px-3 py-2 pr-8 rounded-xl border border-surface-border focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none shadow-sm"
            >
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  📍 {fac.name} ({fac.current_temperature}°C)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Alert Notification Bell */}
          <button
            onClick={() => setActiveTab('alerts')}
            className="p-2 rounded-xl bg-surface-muted hover:bg-surface-hover text-gray-300 border border-surface-border relative transition-colors"
            title="Active Risk Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold font-mono flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Profile / System status */}
          <div className="flex items-center space-x-2 pl-2 border-l border-surface-border">
            <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-700/60 text-indigo-300 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold text-gray-200">Solo Participant</div>
              <div className="text-[10px] text-gray-400 font-mono">FortyGuard Hackathon '26</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-surface-DEFAULT/60 border-r border-surface-border flex-shrink-0 hidden lg:flex flex-col justify-between p-4 shadow-xl">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest font-semibold">
              Operational Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm font-semibold'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover/70'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-surface-muted/80 border border-surface-border text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span>Active Context</span>
              <span className="text-emerald-400">● Realtime</span>
            </div>
            <div className="font-bold text-gray-100 truncate">{currentFacility?.name}</div>
            <div className="text-[11px] text-gray-400 flex items-center justify-between">
              <span>Risk Rating:</span>
              <span className="font-mono font-bold text-amber-400">{currentFacility?.risk_level} ({currentFacility?.risk_score?.toFixed(0)}/100)</span>
            </div>
            <div className="text-[11px] text-gray-400 flex items-center justify-between">
              <span>Ambient Temp:</span>
              <span className="font-mono text-gray-200">{currentFacility?.current_temperature}°C</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Explicit Backend Offline Banner */}
          {isBackendOffline && <BackendOfflineBanner onRetry={onRetryBackend} />}

          {children}
        </main>
      </div>
    </div>
  );
};
