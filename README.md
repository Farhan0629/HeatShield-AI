<div align="center">

![HeatShield AI Banner](./heatshield_banner.jpg)

# 🛡️ HeatShield AI
### *Enterprise Heat Risk Intelligence & Operational Decision Support Platform*

[![FortyGuard Hackathon '26](https://img.shields.io/badge/FortyGuard_Hackathon-'26-orange?style=for-the-badge&logo=fire)](https://docs-api.fortyguard.com/docs/introduction)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge&logo=githubactions)](https://github.com/Farhan0629/HeatShield-AI)
[![FortyGuard API](https://img.shields.io/badge/FortyGuard_API-100%25_LIVE_VERIFIED-emerald?style=for-the-badge&logo=fastapi)](https://docs-api.fortyguard.com/docs/introduction)
[![AI Engine](https://img.shields.io/badge/AI_Engine-Google_Gemini_Live-purple?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Live App](https://img.shields.io/badge/Live_App-Vercel_Hosted-blue?style=for-the-badge&logo=vercel)](https://heat-shield-ai.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

---

**HeatShield AI** is an intelligent operational heat-risk monitoring and decision-support platform engineered for **FortyGuard Hackathon '26 — Building the World's Temperature AI**. Instead of functioning as a simple passive weather dashboard, HeatShield AI ingests real-time FortyGuard environmental telemetry, executes a deterministic multi-vector risk engine, predicts micro-climate thermal exceedance windows, delivers prioritized operational precautions (P1/P2/P3), evaluates facility operational impacts, and leverages Google Gemini AI to generate context-grounded operational decisions and certified executive incident reports.

[Live Demo](https://heat-shield-ai.vercel.app) • [Core Pipeline](#-the-operational-intelligence-pipeline) • [Monitored Fleet](#-monitored-enterprise-portfolio-us-coverage) • [Risk Model](#-deterministic-risk-engine-specification) • [Key Features](#-enterprise-feature-matrix) • [API Reference](#-backend-api-reference) • [Setup Guide](#-quickstart--local-setup)

</div>

---

## 🚨 The Heat Risk Problem

Extreme heatwaves and urban thermal islands represent one of the fastest-growing industrial hazards across the global economy:

- **Invisible Wet-Bulb Stress**: Standard weather dashboards only report dry-bulb air temperature, completely ignoring how ambient moisture retards human sweat dissipation.
- **Delayed Operational Decisions**: Facility and safety directors lack real-time decision support, leading to delayed shift pacing adjustments, emergency hospitalizations, and costly downtime.
- **Unstructured Sensor Telemetry**: Raw sensor numbers do not communicate actionable operational directives (e.g., specific rest-to-work cycle durations, HVAC pre-cooling intervals, or high-exertion task rescheduling).

---

## 💡 The Operational Intelligence Pipeline

HeatShield AI operationalizes environmental numbers into immediate, auditable enterprise safety directives:

```
FortyGuard Environmental Telemetry (Temp, Heat Index, WBGT, AQI, Irradiance, Wind)
                                      ↓
           HeatShield Deterministic Risk Engine (Enterprise Model v1.2)
                                      ↓
        Categorizes Risk Level (SAFE | MODERATE | HIGH | CRITICAL)
                                      ↓
           ┌──────────────────────────┼──────────────────────────┐
           ↓                          ↓                          ↓
    Why This Risk?           Prioritized Actions        Operational Impact
 (Root-Cause Drivers)       (P1/P2/P3 Directives)      (5 Facility Vectors)
           └──────────────────────────┬──────────────────────────┘
                                      ↓
     Google Gemini Multi-Turn Decision Assistant & 80m Micro-Climate Heatmap
                                      ↓
       Real-Time Push Alerts & Official Executive Decision Reports (PDF)
```

---

## 🏢 Monitored Enterprise Portfolio (US Coverage)

Aligned with the FortyGuard Hackathon US data coverage, HeatShield AI monitors verified enterprise assets spanning varied micro-climates and industrial exposure profiles:

| Facility Asset | Location | Facility Type | Real-Time Telemetry ($T_{air}$ / $HI$) | Risk Status | Primary Operational Focus |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Amazon DFW7 Air & Logistics Hub** | Dallas/Fort Worth, TX | Air Logistics Hub | **38.0°C / 40.2°C** | 🟡 `MODERATE (46.7/100)` | High tarmac radiant load; enforce rest cycles for cargo apron crews. |
| **Tesla Giga Texas Advanced Manufacturing** | Austin, TX | Heavy Automotive Fab | **36.5°C / 37.7°C** | 🟠 `HIGH (62.5/100)` | High stamping thermal load; transition outdoor logistics to shade. |
| **Intel Ocotillo Semiconductor Fab Complex** | Chandler / Phoenix, AZ | Cleanroom Semiconductor | **41.5°C / 43.6°C** | 🟠 `HIGH (78.0/100)` | Extreme desert heat; pre-cool chiller loops for peak afternoon intake. |
| **Boeing Everett Commercial Assembly Center**| Everett / Seattle, WA | Aerospace Widebody | **24.0°C / 24.2°C** | 🟢 `SAFE (28.0/100)` | Nominal baseline envelope; standard assembly shift rotation. |

---

## ✨ Enterprise Feature Matrix

### 🎯 1. Operational Heat Intelligence & Hierarchy
- **Enterprise Multi-Facility Risk Prioritization**: Live triage board ranking monitored facilities by thermal urgency with 1-click facility switching.
- **Why This Risk? Root-Cause Intelligence**: Concise, factual breakdown of underlying thermodynamic drivers (Heat Index, Wet Bulb sweat limit, continuous threshold exceedance).
- **Prioritized Action Recommendations (P1/P2/P3)**:
  - `P1 - Immediate`: Shift restructuring, mandatory 15-min rest cycles, and task rescheduling.
  - `P2 - High`: Spot cooling deployment, AHU economizer adjustments, and hydration pacing.
  - `P3 - Standard`: Baseline monitoring, buddy checks, and supervisor alerts.
  - *Includes explicit Action, Reason, and Quantified Operational Benefit tags.*
- **5-Dimensional Operational Impact Matrix**:
  1. *Personnel Heat Exposure*
  2. *Facility Cooling Infrastructure Demand*
  3. *Outdoor & Unconditioned Work Hazard*
  4. *Equipment Thermal Overload Stress*
  5. *Operational Disruption / Pacing Risk*

### 🗺️ 2. Hyperlocal Temperature Intelligence & Thermal Map
- **80m Granularity Satellite Heatmap**: Dynamic GeoJSON polygons (1,380+ tiles per facility) displaying localized thermal micro-climates, heat island cores, and buffer zones from FortyGuard.
- **Micro-Climate Anomaly ($\Delta T$)**: Real-time urban heat island differential tracking above regional baseline temperatures.
- **12-Hour Thermal Forecast Projection**: Hour-by-hour heat index, wet bulb, and risk score progression highlighting peak hazard windows (e.g. `13:30 – 16:30`).

### 🤖 3. Google Gemini AI Decision Assistant
- **Multi-Turn Grounded Reasoning**: Conversational decision support powered by Google Gemini (`gemini-flash-lite-latest` / `gemini-flash-latest`), grounded directly in active FortyGuard telemetry vectors.
- **Multi-Turn Memory**: Preserves dialog history and provides immediate actionable answers to complex operational scenarios.
- **Suggested Follow-up Prompts**: 1-click prompt triggers for rapid operational decision workflows.

### 📋 4. Enterprise Compliance & Reports
- **Executive Decision Reports**: Structured incident documentation with instant downloadable **binary PDF stream** exports.
- **Real-Time Alerts Registry**: Acknowledge, resolve, and audit active hazard triggers across all locations.
- **Data Source Transparency Badge**: Visual indicator displaying `DATA SOURCE: FortyGuard Live Enterprise API • Verified Live Ingestion`.
- **Telemetry Ingestion Loading Buffer**: Smooth radar synchronization state preventing sudden UI jumps during API requests.

---

## 🧮 Deterministic Risk Engine Specification

The **HeatShield Risk Engine** (`backend/app/services/risk_engine.py`) implements *HeatShield Risk Model — Enterprise v1.2*, ensuring reproducible, auditable operational scoring:

$$\text{Raw Score} = (HI \times 0.30) + (WBGT \times 0.25) + (T_{air} \times 0.20) + (\text{Shift Exp} \times 0.15) + (RH \times 0.10)$$

$$\text{Final Operational Risk Score} = \min\left(100, \text{Raw Score} \times \text{Facility Vulnerability Multiplier}\right)$$

### Facility Vulnerability Multipliers
- **Construction Site (Outdoor Direct Sun)**: `1.25x`
- **Industrial Factory (High Internal Heat Exertion)**: `1.15x`
- **Warehouse / Logistics (Partial Evaporative Staging)**: `1.10x`
- **Educational / Hospital Campus**: `1.05x`
- **Office / Tech Campus (Central Climate Control)**: `0.85x`

### Risk Classification Tiers
- **80.0 – 100.0**: 🔴 `CRITICAL` — Mandatory 15-minute cool rest breaks per 45 minutes; halt heavy manual labor during peak window.
- **60.0 – 79.9**: 🟠 `HIGH` — Enforce hydration intervals; shift non-essential outdoor work away from peak afternoon hours.
- **40.0 – 59.9**: 🟡 `MODERATE` — Pre-cool indoor facilities; monitor chiller loads and auxiliary ventilation.
- **0.0 – 39.9**: 🟢 `SAFE` — Normal baseline operational envelope.

---

## 🛰️ FortyGuard Environmental Telemetry Ingestion

HeatShield AI normalizes 7 core environmental parameters specified in the official FortyGuard documentation:

| Parameter | Unit | Symbol | Operational Threshold & Impact |
| :--- | :---: | :---: | :--- |
| **Ambient Air Temperature** | °C | $T_{air}$ | Baseline 28°C — Hazardous above 40°C |
| **Apparent Heat Index** | °C | $HI$ | Combined temperature and humidity perceived thermal burden |
| **Wet Bulb Temperature** | °C | $WBGT$ | Sweating dissipation limit (Severe impairment above 29°C) |
| **Relative Humidity** | % | $RH$ | Atmospheric moisture restricting convective cooling |
| **Air Quality Index (AQI)** | Index | $AQI$ | Particulate & ozone burden compounding respiratory strain |
| **Solar Irradiance (GHI)** | W/m² | $GHI$ | Direct radiant solar load on outdoor workforce |
| **Wind Speed** | km/h | $V_{wind}$ | Convective air movement assistance |

---

## 🏗️ System Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Supervisor as Facility Safety Director
    participant React as React 18 Enterprise UI (Vercel)
    participant FastAPI as FastAPI Backend Router (Render)
    participant Engine as Deterministic Risk Engine (v1.2)
    participant FortyGuard as FortyGuard Enterprise API
    participant Gemini as Google Gemini AI

    Supervisor->>React: Select Facility / View Decision Dashboard
    React->>FastAPI: GET /api/heat/current/{id} & GET /api/risk/{id}
    FastAPI->>FortyGuard: POST /v1/env_params (lat, lng, baseline_temp)
    FortyGuard-->>FastAPI: Return activity_id
    loop Async Status Polling
        FastAPI->>FortyGuard: GET /v1/status/{activity_id}
    end
    FortyGuard-->>FastAPI: Return Live Environmental Telemetry
    FastAPI->>Engine: calculate_heat_risk(metrics, facility_type)
    Engine-->>FastAPI: Return RiskAssessment (Score, P1/P2/P3 Actions, Impact Matrix)
    FastAPI-->>React: Deliver Normalized JSON Payload
    React-->>Supervisor: Render Facility Prioritization & Root-Cause Cards
    
    Supervisor->>React: Send Inquiry to AI Assistant
    React->>FastAPI: POST /api/ai/chat (Message + History + Facility Context)
    FastAPI->>Gemini: POST /v1beta/models/gemini-flash-lite-latest:generateContent
    Gemini-->>FastAPI: Grounded Operational Directive Response
    FastAPI-->>React: Render AI Operational Decision
```

---

## 🔌 Backend API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check & FortyGuard / Gemini connection status |
| `GET` | `/api/facilities` | List all monitored enterprise facilities |
| `POST` | `/api/facilities` | Register new facility asset with live coordinates |
| `GET` | `/api/facilities/{id}` | Get specific facility details |
| `GET` | `/api/heat/current/{facility_id}` | Retrieve real-time 7-parameter environmental telemetry |
| `GET` | `/api/heat/forecast/{facility_id}?hours=12` | Retrieve 12-hour hourly forecast & peak thermal window |
| `GET` | `/api/heat/heatmap/{facility_id}` | Retrieve GeoJSON thermal polygon zones (1,380+ tiles) |
| `GET` | `/api/risk/{facility_id}` | Calculate deterministic risk assessment & recommendations |
| `POST` | `/api/ai/chat` | Query the multi-turn Google Gemini Decision Assistant |
| `GET` | `/api/alerts` | List active thermal hazard alerts |
| `POST` | `/api/alerts/{id}/acknowledge` | Acknowledge active alert |
| `POST` | `/api/alerts/{id}/resolve` | Mark thermal alert resolved |
| `POST` | `/api/reports/generate` | Generate structured executive report JSON |
| `POST` | `/api/reports/pdf` | Download official executive decision report as PDF byte stream |

---

## 💻 Quickstart & Local Setup

### Prerequisites
- **Node.js** v18+ & npm
- **Python** 3.10+

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```
- API Health: `http://localhost:8000/api/health`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 2. Run Test Suite
```bash
cd backend
python test_api_live.py
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🌐 Official Production Deployments

- 🚀 **Live Production Platform (Vercel)**: [https://heat-shield-ai.vercel.app](https://heat-shield-ai.vercel.app)
- 📡 **Live Backend API (Render)**: [https://heatshield-ai-r0f7.onrender.com](https://heatshield-ai-r0f7.onrender.com)
- 📖 **Interactive OpenAPI Documentation**: [https://heatshield-ai-r0f7.onrender.com/docs](https://heatshield-ai-r0f7.onrender.com/docs)
- 📂 **GitHub Source Code**: [https://github.com/Farhan0629/HeatShield-AI.git](https://github.com/Farhan0629/HeatShield-AI.git)

---

## 🔒 Security & Compliance Disclaimers

- **Credential Isolation**: All API keys (`FORTYGUARD_API_KEY`, `GEMINI_API_KEY`) remain isolated in server environment variables. Zero credentials exist in client bundles.
- **Operational Safety Advisory**: Recommendations generated by HeatShield AI represent operational shift management and facility engineering precautions, not medical advice.

---

<div align="center">

**HeatShield AI** — Built for **FortyGuard Hackathon '26: Building the World's Temperature AI**

</div>
