import React from 'react';
import { ReportGenerator } from '../components/reports/ReportGenerator';
import type { Facility } from '../types/facility';
import type { ReportResponse } from '../types/report';

interface Props {
  facility: Facility | null;
  report: ReportResponse | null;
  isLoading: boolean;
  onGenerate: (type: 'Incident Report' | 'Daily Heat Summary' | 'Facility Risk Report') => void;
  onDownloadPDF: () => void;
}

export const ReportsPage: React.FC<Props> = ({
  facility,
  report,
  isLoading,
  onGenerate,
  onDownloadPDF
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white font-mono">
          DECISION SUPPORT REPORTS
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Automated executive summary generation and official PDF exports for audit and safety compliance.
        </p>
      </div>

      <ReportGenerator
        facilityName={facility?.name || 'Selected Facility'}
        report={report}
        isLoading={isLoading}
        onGenerate={onGenerate}
        onDownloadPDF={onDownloadPDF}
      />
    </div>
  );
};
