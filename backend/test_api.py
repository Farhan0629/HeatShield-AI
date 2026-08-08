from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing HeatShield AI FastAPI Endpoints with TestClient...")

    # 1. Health
    res = client.get("/api/health")
    print(f"GET /api/health status: {res.status_code}, data: {res.json()}")
    assert res.status_code == 200

    # 2. Facilities
    res = client.get("/api/facilities")
    facilities = res.json()
    print(f"GET /api/facilities count: {len(facilities)}")
    assert res.status_code == 200 and len(facilities) > 0
    facility_id = facilities[0]["id"]

    # 3. Heat Current & 12-Hour Forecast & Heatmap
    res_current = client.get(f"/api/heat/current/{facility_id}")
    res_forecast = client.get(f"/api/heat/forecast/{facility_id}?hours=12")
    res_heatmap = client.get(f"/api/heat/heatmap/{facility_id}")
    print(f"GET /api/heat/current/{facility_id}: Temp={res_current.json().get('temperature')}°C")
    print(f"GET /api/heat/forecast/{facility_id}: 12h points={len(res_forecast.json().get('hourly'))}, Peak={res_forecast.json().get('peak_time')}")
    print(f"GET /api/heat/heatmap/{facility_id}: GeoJSON Features={len(res_heatmap.json().get('features'))}")
    assert res_current.status_code == 200
    assert res_forecast.status_code == 200 and len(res_forecast.json()["hourly"]) == 12
    assert res_heatmap.status_code == 200

    # 4. Risk Engine
    res_risk = client.get(f"/api/risk/{facility_id}")
    risk_data = res_risk.json()
    print(f"GET /api/risk/{facility_id}: Score={risk_data.get('score')}, Level={risk_data.get('level')}")
    assert res_risk.status_code == 200

    # 5. AI Chat
    res_ai = client.post("/api/ai/chat", json={"facility_id": facility_id, "message": "Why is the current risk critical?"})
    print(f"POST /api/ai/chat reply: {res_ai.json().get('reply')[:120]}...")
    assert res_ai.status_code == 200

    # 6. Alerts & Reports
    res_alerts = client.get("/api/alerts")
    res_report = client.post("/api/reports/generate", json={"facility_id": facility_id, "report_type": "Incident Report"})
    res_pdf = client.post("/api/reports/pdf", json={"facility_id": facility_id, "report_type": "Incident Report"})
    print(f"GET /api/alerts count: {len(res_alerts.json())}")
    print(f"POST /api/reports/generate ID: {res_report.json().get('id')}")
    print(f"POST /api/reports/pdf Bytes received: {len(res_pdf.content)}")
    assert res_alerts.status_code == 200
    assert res_report.status_code == 200
    assert res_pdf.status_code == 200 and len(res_pdf.content) > 0

    print("\n[SUCCESS] All 6 core FastAPI backend endpoint tests PASSED successfully!")

if __name__ == "__main__":
    test_endpoints()
