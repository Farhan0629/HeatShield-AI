import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { FacilityDetailsPage } from './pages/FacilityDetailsPage';
import { ThermalMapPage } from './pages/ThermalMapPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

import { apiService, BackendUnavailableError } from './services/api';
import type { Facility, FacilityCreate } from './types/facility';
import type { EnvironmentalMetrics, HeatForecastResponse, HeatmapGeoJSONResponse } from './types/heat';
import type { RiskAssessment } from './types/risk';
import type { AIChatMessage } from './types/ai';
import type { Alert } from './types/alert';
import type { ReportResponse } from './types/report';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('f1');
  
  const [metrics, setMetrics] = useState<EnvironmentalMetrics | null>(null);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [forecast, setForecast] = useState<HeatForecastResponse | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapGeoJSONResponse | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [health, setHealth] = useState<any>(null);

  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am HeatShield Assistant. I monitor real-time environmental thermal data and calculated operational risk levels. How can I assist your heat safety decisions today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isAIChatLoading, setIsAIChatLoading] = useState(false);

  const [report, setReport] = useState<ReportResponse | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  const [isBackendOffline, setIsBackendOffline] = useState(false);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(false);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);

  const fetchInitialData = useCallback(async () => {
    setIsBackendOffline(false);
    try {
      const [healthData, facilityList, alertList] = await Promise.all([
        apiService.getHealth(),
        apiService.getFacilities(),
        apiService.getAlerts()
      ]);

      setHealth(healthData);
      setFacilities(facilityList);
      setAlerts(alertList);

      if (facilityList.length > 0 && !facilityList.some(f => f.id === selectedFacilityId)) {
        setSelectedFacilityId(facilityList[0].id);
      }
    } catch (err: any) {
      if (err instanceof BackendUnavailableError || err.name === 'BackendUnavailableError') {
        setIsBackendOffline(true);
      } else {
        console.error('Failed to load initial application data:', err);
      }
    }
  }, [selectedFacilityId]);

  const fetchFacilityTelemetry = useCallback(async (facilityId: string) => {
    setIsTelemetryLoading(true);
    setTelemetryError(null);
    try {
      const [envMetrics, riskData, heatForecast, heatmapData] = await Promise.all([
        apiService.getCurrentConditions(facilityId),
        apiService.getRiskAssessment(facilityId),
        apiService.getForecast(facilityId, 12),
        apiService.getHeatmap(facilityId)
      ]);

      setMetrics(envMetrics);
      setAssessment(riskData);
      setForecast(heatForecast);
      setHeatmap(heatmapData);

      // Update facilities list cached score locally
      setFacilities(prev => prev.map(f => f.id === facilityId ? {
        ...f,
        risk_score: riskData.score,
        risk_level: riskData.level,
        current_temperature: envMetrics.temperature
      } : f));

      setIsTelemetryLoading(false);
    } catch (err: any) {
      setIsTelemetryLoading(false);
      if (err instanceof BackendUnavailableError || err.name === 'BackendUnavailableError') {
        setIsBackendOffline(true);
      } else {
        console.error(`Failed to load telemetry for facility ${facilityId}:`, err);
        setTelemetryError(err?.message || `FortyGuard Live API communication error for ${facilityId}`);
      }
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (selectedFacilityId && !isBackendOffline) {
      fetchFacilityTelemetry(selectedFacilityId);
    }
  }, [selectedFacilityId, isBackendOffline, fetchFacilityTelemetry]);

  const handleCreateFacility = async (data: FacilityCreate) => {
    try {
      const newFacility = await apiService.createFacility(data);
      setFacilities(prev => [...prev, newFacility]);
      setSelectedFacilityId(newFacility.id);
    } catch (err: any) {
      if (err instanceof BackendUnavailableError) setIsBackendOffline(true);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: AIChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsAIChatLoading(true);

    try {
      const res = await apiService.postAIChat({
        facility_id: selectedFacilityId,
        message: text,
        history: chatMessages
      });

      const assistantMsg: AIChatMessage = {
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      if (err instanceof BackendUnavailableError) {
        setIsBackendOffline(true);
      } else {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I ran into an issue communicating with Google Gemini AI.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } finally {
      setIsAIChatLoading(false);
    }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      const updated = await apiService.acknowledgeAlert(id);
      setAlerts(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err: any) {
      if (err instanceof BackendUnavailableError) setIsBackendOffline(true);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      const updated = await apiService.resolveAlert(id);
      setAlerts(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err: any) {
      if (err instanceof BackendUnavailableError) setIsBackendOffline(true);
    }
  };

  const handleGenerateReport = async (type: 'Incident Report' | 'Daily Heat Summary' | 'Facility Risk Report') => {
    setIsReportLoading(true);
    try {
      const res = await apiService.generateReport({
        facility_id: selectedFacilityId,
        report_type: type
      });
      setReport(res);
    } catch (err: any) {
      if (err instanceof BackendUnavailableError) setIsBackendOffline(true);
    } finally {
      setIsReportLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!report) return;
    const downloadUrl = apiService.downloadReportPDFUrl(selectedFacilityId, report.report_type);
    window.open(downloadUrl, '_blank');
  };

  const selectedFacility = facilities.find(f => f.id === selectedFacilityId) || null;
  const unreadAlertsCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      facilities={facilities}
      selectedFacilityId={selectedFacilityId}
      onSelectFacility={setSelectedFacilityId}
      isBackendOffline={isBackendOffline}
      onRetryBackend={fetchInitialData}
      unreadAlertsCount={unreadAlertsCount}
      fortyguardMode={health?.fortyguard_mode}
      isLive={metrics ? !metrics.is_demo_data : (health?.fortyguard_mode === 'live')}
    >
      {activeTab === 'dashboard' && (
        <DashboardPage
          facilities={facilities}
          selectedFacility={selectedFacility}
          metrics={metrics}
          assessment={assessment}
          forecast={forecast}
          isLoading={isTelemetryLoading}
          error={telemetryError}
          onRetry={() => fetchFacilityTelemetry(selectedFacilityId)}
          onSelectFacility={setSelectedFacilityId}
          onNavigate={setActiveTab}
        />
      )}

      {activeTab === 'facilities' && (
        <FacilitiesPage
          facilities={facilities}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={setSelectedFacilityId}
          onCreateFacility={handleCreateFacility}
          onNavigateDetails={(id) => {
            setSelectedFacilityId(id);
            setActiveTab('details');
          }}
        />
      )}

      {activeTab === 'details' && (
        <FacilityDetailsPage
          facility={selectedFacility}
          metrics={metrics}
          assessment={assessment}
          forecast={forecast}
          alerts={alerts}
          isLoading={isTelemetryLoading}
          error={telemetryError}
          onRetry={() => fetchFacilityTelemetry(selectedFacilityId)}
          onNavigate={setActiveTab}
        />
      )}

      {activeTab === 'map' && (
        <ThermalMapPage
          facility={selectedFacility}
          heatmap={heatmap}
          metrics={metrics}
          forecast={forecast}
          assessment={assessment}
          isLoading={isTelemetryLoading}
          error={telemetryError}
          onRetry={() => fetchFacilityTelemetry(selectedFacilityId)}
        />
      )}

      {activeTab === 'risk' && (
        <RiskAnalysisPage
          assessment={assessment}
          facilityName={selectedFacility?.name}
          isLoading={isTelemetryLoading}
          error={telemetryError}
          onRetry={() => fetchFacilityTelemetry(selectedFacilityId)}
        />
      )}

      {activeTab === 'ai' && (
        <AIAssistantPage
          facility={selectedFacility}
          metrics={metrics}
          assessment={assessment}
          messages={chatMessages}
          isLoading={isAIChatLoading}
          onSendMessage={handleSendMessage}
        />
      )}

      {activeTab === 'alerts' && (
        <AlertsPage
          alerts={alerts}
          onAcknowledge={handleAcknowledgeAlert}
          onResolve={handleResolveAlert}
        />
      )}

      {activeTab === 'reports' && (
        <ReportsPage
          facility={selectedFacility}
          report={report}
          isLoading={isReportLoading}
          onGenerate={handleGenerateReport}
          onDownloadPDF={handleDownloadPDF}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsPage health={health} />
      )}
    </MainLayout>
  );
}

export default App;
