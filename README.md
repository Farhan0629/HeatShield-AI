# HeatShield AI — Enterprise Heat Risk Operations Platform

An intelligent heat-risk monitoring and decision-support platform built for **FortyGuard Hackathon '26 — Building the World's Temperature AI**. HeatShield AI transforms FortyGuard's high-resolution temperature intelligence into real-time operational safety decisions, risk assessments, automated alerts, and incident reports.

---

## 🌡️ Problem Statement

Extreme urban heat and heatwaves pose accelerating operational disruptions, safety risks, and severe physiological heat burden on workforce personnel across logistics, construction, manufacturing, and municipal infrastructure. Standard weather dashboards only report basic air temperatures without analyzing combined wet-bulb heat stress, shift exposure duration, or operational safety guardrails.

---

## 🛡️ Solution

**HeatShield AI** acts as an AI-powered enterprise heat-risk operations assistant. It ingests environmental data, computes deterministic risk scores across 5 atmospheric vectors via the **HeatShield Risk Engine**, provides grounded AI operational advice, issues automated alerts, and generates executive incident reports for facility safety managers.

---

## ✨ Key Features

- **Operational Heat Dashboard**: Real-time monitoring of dry bulb temperature, perceived heat index, relative humidity, wet bulb globe stress, AQI, and solar irradiance.
- **Deterministic Risk Engine**: Weighted operational scoring model (`SAFE`, `MODERATE`, `HIGH`, `CRITICAL`) with factor breakdowns (Heat Index 30%, Wet Bulb 25%, Air Temp 20%, Exposure 15%, Humidity 10%).
- **12-Hour Thermal Forecast**: Recharts visualization aligned with FortyGuard 12-hour forecast windows, highlighting peak thermal stress hours.
- **Geospatial Thermal Heatmap**: Interactive Leaflet map with GeoJSON thermal zone polygons, 80m spatial granularity, and risk popups.
- **Grounded AI Operations Assistant**: Context-aware conversational assistant grounded in live telemetry that answers operational queries without fabricating environmental metrics.
- **Alert Management**: Real-time push alert registry with severity filters, acknowledgment, and resolution workflows.
- **Executive Incident Reports**: On-demand report generator with structured document previews and instant PDF byte stream export.
- **Backend Provider Abstraction**: Seamless transition between `FORTYGUARD_MODE=mock` (hackathon demo mode) and `FORTYGUARD_MODE=live` (live FortyGuard API).

---

## 📐 System Architecture

```mermaid
graph TD
    subgraph Client ["Frontend (React 18 + Vite + TypeScript + Tailwind CSS)"]
        UI[Main App Layout]
        Dash[Dashboard & Details]
        Map[Leaflet GeoJSON Heatmap]
        AIUI[AI Operations Assistant]
        Alerts[Alert Registry]
        Reports[Report Generator]
        APIService[Frontend API Service]
    end

    subgraph Server ["Backend (Python FastAPI + Pydantic)"]
        Routes[API Router /api/*]
        RiskEngine[Deterministic Risk Engine]
        AIEngine[AI Reasoning Engine]
        ReportService[PDF & Report Generator]
        ProviderFactory[Provider Factory]
        MockProv[Mock FortyGuard Provider]
        LiveProv[FortyGuard Live API Provider (Async Polling)]
    end

    UI --> APIService
    APIService -->|HTTP JSON| Routes
    Routes --> RiskEngine
    Routes --> AIEngine
    Routes --> ReportService
    Routes --> ProviderFactory
    ProviderFactory -->|FORTYGUARD_MODE=mock| MockProv
    ProviderFactory -->|FORTYGUARD_MODE=live| LiveProv
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, TypeScript, Tailwind CSS v4, Lucide React, Recharts, Leaflet, React-Leaflet, FPDF/jsPDF.
- **Backend**: Python 3.14, FastAPI, Pydantic v2, httpx, uvicorn, fpdf2.
- **Persistence**: In-memory repository pattern ready for PostgreSQL / Supabase expansion.

---

## 🚀 Running Locally

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 1. Start the Backend API
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Backend API will be active at: `http://localhost:8000`  
API Swagger Docs: `http://localhost:8000/docs`

### 2. Run Backend Unit & Route Verification Tests
```bash
cd backend
python test_api.py
```

### 3. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Frontend will be active at: `http://localhost:5173`

---

## 🔐 Environment Variables

Create `.env` in `backend/`:

```env
# Provider Mode: "mock" (default for demo) or "live"
FORTYGUARD_MODE=mock

# FortyGuard API Configuration (used when FORTYGUARD_MODE=live)
FORTYGUARD_API_KEY=
FORTYGUARD_BASE_URL=https://api.fortyguard.com/v1

# AI Provider Configuration: "mock" or "openai" / "anthropic" / "gemini"
AI_PROVIDER=mock
AI_API_KEY=

# Server Config
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## ⚡ FortyGuard Live Integration Architecture

The live FortyGuard integration provider `FortyGuardProvider` in `backend/app/services/providers/fortyguard.py` strictly follows the official [FortyGuard API Documentation](https://docs-api.fortyguard.com/docs/introduction):

1. **Authentication**: `api-key: YOUR_API_KEY` header.
2. **Asynchronous Polling**:
   - `POST /v1/env_params` -> returns `activity_id`
   - `POST /v1/heatmap` -> returns `activity_id`
   - `GET /v1/status/{activity_id}` -> polls task status until completed.
3. **Switching to Live Mode**: Set `FORTYGUARD_MODE=live` and supply `FORTYGUARD_API_KEY`. No frontend code changes required.

---

## 🔒 Security & Medical Disclaimers

- **Credential Isolation**: All API keys are isolated strictly in backend environment variables (`.env`). Secret keys are never exposed to client bundles.
- **Operational Advisory**: Recommendations generated by HeatShield AI are operational precautions and non-medical advisories.

---

## 🎯 Phase 2 Roadmap

- Integration with live FortyGuard production API keys.
- Supabase / PostgreSQL database migration.
- Webhook push alerts via Slack / SMS.
- Multi-building indoor BIM sensor integration.
