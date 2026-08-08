import React, { useState } from 'react';
import { FileText, Download, CheckCircle } from 'lucide-react';
import type { ReportResponse } from '../../types/report';
import { RiskBadge } from '../common/Badge';

interface Props {
  facilityName: string;
  report: ReportResponse | null;
  isLoading: boolean;
  onGenerate: (type: 'Incident Report' | 'Daily Heat Summary' | 'Facility Risk Report') => void;
  onDownloadPDF: () => void;
}

export const ReportGenerator: React.FC<Props> = ({
  facilityName,
  report,
  isLoading,
  onGenerate,
  onDownloadPDF
}) => {
  const [selectedType, setSelectedType] = useState<'Incident Report' | 'Daily Heat Summary' | 'Facility Risk Report'>('Incident Report');

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">Enterprise Incident & Risk Reports</h3>
          </div>
          <p className="text-sm font-semibold text-white mt-1">Official Decision Support Documentation</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onGenerate(selectedType)}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition-colors shadow-md flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
          {report && (
            <button
              onClick={onDownloadPDF}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-md flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['Incident Report', 'Daily Heat Summary', 'Facility Risk Report'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
              selectedType === type
                ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                : 'bg-surface-muted/50 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className="font-semibold text-sm">{type}</div>
            <div className="text-[11px] text-gray-400 mt-1">
              {type === 'Incident Report' && 'Detailed thermal trigger telemetry & response actions.'}
              {type === 'Daily Heat Summary' && '24-hour heat index trend & shift exposures.'}
              {type === 'Facility Risk Report' && 'Infrastructure vulnerability & cooling audit.'}
            </div>
          </button>
        ))}
      </div>

      {/* Report Preview Document */}
      {report ? (
        <div className="p-6 rounded-2xl bg-surface-muted border border-gray-800 text-xs space-y-6 shadow-inner font-sans">
          <div className="flex items-center justify-between border-b border-gray-700/80 pb-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white uppercase font-mono">HEATSHIELD AI</h2>
              <p className="text-xs text-indigo-400 font-mono">Enterprise Heat Risk Operations Report</p>
            </div>
            <div className="text-right">
              <RiskBadge level={report.risk_level}>{report.risk_level}</RiskBadge>
              <div className="text-[10px] font-mono text-gray-400 mt-1">Report ID: {report.id}</div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-100">{report.title}</h3>
            <p className="text-gray-400 font-mono text-[11px] mt-0.5">Facility: {facilityName} | Date: {report.generated_at}</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-DEFAULT border border-gray-800 leading-relaxed text-gray-300">
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-300 font-mono mb-1">Executive Summary</h4>
            <p>{report.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-DEFAULT border border-gray-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 font-mono mb-2">Key Risk Findings</h4>
              <ul className="space-y-1.5 text-gray-300">
                {report.key_findings.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-surface-DEFAULT border border-gray-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 font-mono mb-2">Operational Action Taken</h4>
              <ul className="space-y-1.5 text-gray-300">
                {report.actions_taken.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-500 font-mono">
            <span>Generated by {report.generated_by}</span>
            <span>Document Authentication Token: 0x8F92...B12</span>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-gray-500 font-mono text-xs border border-dashed border-gray-800 rounded-2xl">
          Click "Generate Report" to build an official operational incident document for {facilityName}.
        </div>
      )}
    </div>
  );
};
