import React from 'react';

interface BadgeProps {
  level?: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL' | string;
  className?: string;
  children?: React.ReactNode;
}

export const RiskBadge: React.FC<BadgeProps> = ({ level, className = '', children }) => {
  const normLevel = (level || '').toUpperCase();
  
  let colorStyle = 'bg-surface-border text-gray-300 border-gray-700';
  if (normLevel === 'CRITICAL') {
    colorStyle = 'risk-badge-critical';
  } else if (normLevel === 'HIGH') {
    colorStyle = 'risk-badge-high';
  } else if (normLevel === 'MODERATE') {
    colorStyle = 'risk-badge-moderate';
  } else if (normLevel === 'SAFE') {
    colorStyle = 'risk-badge-safe';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${colorStyle} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {children || normLevel}
    </span>
  );
};

export const DemoModeBadge: React.FC<{ mode?: string }> = () => {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
      FORTYGUARD_API: LIVE
    </span>
  );
};
