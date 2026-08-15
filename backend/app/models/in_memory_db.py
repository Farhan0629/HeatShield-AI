from typing import Dict, List, Optional
from app.schemas.facility import Facility, FacilityCreate, FacilityUpdate
from app.schemas.alert import Alert

INITIAL_FACILITIES: List[Dict] = [
    {
        "id": "f1",
        "name": "Phoenix Logistics Center",
        "type": "Warehouse",
        "location": "Phoenix, Arizona, USA",
        "latitude": 33.4484,
        "longitude": -112.0740,
        "workers_count": 280,
        "operating_hours": "06:00 - 22:00 MST",
        "exposure_type": "Hybrid (Indoor/Outdoor Staging)",
        "cooling_availability": "Partial Evaporative Cooling",
        "risk_score": 88.5,
        "risk_level": "CRITICAL",
        "current_temperature": 42.8,
        "status": "OPERATIONAL_STRESS"
    },
    {
        "id": "f2",
        "name": "Dallas Construction Hub",
        "type": "Construction Site",
        "location": "Dallas, Texas, USA",
        "latitude": 32.7767,
        "longitude": -96.7970,
        "workers_count": 195,
        "operating_hours": "07:00 - 18:00 CST",
        "exposure_type": "Outdoor Direct Sun",
        "cooling_availability": "Mobile Shade Tents & Hydration Stations",
        "risk_score": 91.0,
        "risk_level": "CRITICAL",
        "current_temperature": 39.6,
        "status": "STOP_HIGH_EXERTION"
    },
    {
        "id": "f3",
        "name": "Austin Operations Campus",
        "type": "Office",
        "location": "Austin, Texas, USA",
        "latitude": 30.2672,
        "longitude": -97.7431,
        "workers_count": 520,
        "operating_hours": "08:00 - 20:00 CST",
        "exposure_type": "Indoor Climate Controlled",
        "cooling_availability": "Full Central High-Efficiency HVAC",
        "risk_score": 56.0,
        "risk_level": "MODERATE",
        "current_temperature": 34.2,
        "status": "NORMAL"
    },
    {
        "id": "f4",
        "name": "Seattle Regional Fulfillment",
        "type": "Factory",
        "location": "Seattle, Washington, USA",
        "latitude": 47.6062,
        "longitude": -122.3321,
        "workers_count": 310,
        "operating_hours": "24/7 Automated Shift Rotation",
        "exposure_type": "Indoor High Ventilation",
        "cooling_availability": "Industrial Fan & Air Filtration System",
        "risk_score": 28.0,
        "risk_level": "SAFE",
        "current_temperature": 24.5,
        "status": "NORMAL"
    }
]

INITIAL_ALERTS: List[Dict] = [
    {
        "id": "alt-1",
        "facility_id": "f1",
        "facility_name": "Phoenix Logistics Center",
        "severity": "CRITICAL",
        "title": "Severe Ambient Heat Exceedance Threshold",
        "message": "Ambient temperature has reached 42.8°C with peak solar irradiance of 960 W/m². Mandatory shift pacing required.",
        "timestamp": "2 minutes ago",
        "acknowledged": False,
        "resolved": False,
        "recommended_action": "Enforce mandatory 15-minute cool rest break per 45 minutes for all unconditioned dock staging personnel."
    },
    {
        "id": "alt-2",
        "facility_id": "f2",
        "facility_name": "Dallas Construction Hub",
        "severity": "CRITICAL",
        "title": "High Heat Index & Wet Bulb Surge",
        "message": "Apparent Heat Index surged to 47.2°C with wet bulb at 30.2°C, severely impairing sweat evaporation.",
        "timestamp": "14 minutes ago",
        "acknowledged": False,
        "resolved": False,
        "recommended_action": "Halt heavy outdoor crane & steel structural manual handling until 16:30 CST."
    },
    {
        "id": "alt-3",
        "facility_id": "f3",
        "facility_name": "Austin Operations Campus",
        "severity": "MODERATE",
        "title": "Chiller Thermal Load Precaution",
        "message": "Outdoor dry bulb at 34.2°C. Facility HVAC cooling load is elevated above 80% capacity.",
        "timestamp": "38 minutes ago",
        "acknowledged": True,
        "resolved": False,
        "recommended_action": "Pre-cool interior zones and stage backup air handling units for afternoon peak."
    }
]

class InMemoryDB:
    def __init__(self):
        self.facilities: Dict[str, Facility] = {
            item["id"]: Facility(**item) for item in INITIAL_FACILITIES
        }
        self.alerts: Dict[str, Alert] = {
            item["id"]: Alert(**item) for item in INITIAL_ALERTS
        }

    def get_facilities(self) -> List[Facility]:
        return list(self.facilities.values())

    def get_facility(self, facility_id: str) -> Optional[Facility]:
        if facility_id in self.facilities:
            return self.facilities[facility_id]
        # Resolve common aliases like fac-001 -> f1, fac-1 -> f1
        normalized = facility_id.lower().replace("fac-00", "f").replace("fac-0", "f").replace("fac-", "f")
        return self.facilities.get(normalized)

    def create_facility(self, payload: FacilityCreate) -> Facility:
        new_id = f"f{len(self.facilities) + 1}"
        facility = Facility(
            id=new_id,
            risk_score=45.0,
            risk_level="MODERATE",
            current_temperature=32.0,
            status="NORMAL",
            **payload.model_dump()
        )
        self.facilities[new_id] = facility
        return facility

    def update_facility(self, facility_id: str, payload: FacilityUpdate) -> Optional[Facility]:
        existing = self.facilities.get(facility_id)
        if not existing:
            return None
        updated_data = existing.model_dump()
        for k, v in payload.model_dump(exclude_unset=True).items():
            if v is not None:
                updated_data[k] = v
        updated_facility = Facility(**updated_data)
        self.facilities[facility_id] = updated_facility
        return updated_facility

    def get_alerts(self) -> List[Alert]:
        return list(self.alerts.values())

    def acknowledge_alert(self, alert_id: str) -> Optional[Alert]:
        alert = self.alerts.get(alert_id)
        if alert:
            alert.acknowledged = True
        return alert

    def resolve_alert(self, alert_id: str) -> Optional[Alert]:
        alert = self.alerts.get(alert_id)
        if alert:
            alert.acknowledged = True
            alert.resolved = True
        return alert

db = InMemoryDB()
