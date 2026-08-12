from typing import Dict, List, Optional
from app.schemas.facility import Facility, FacilityCreate, FacilityUpdate
from app.schemas.alert import Alert

INITIAL_FACILITIES: List[Dict] = [
    {
        "id": "f1",
        "name": "Kolkata Distribution Warehouse",
        "type": "Warehouse",
        "location": "Kolkata, West Bengal, India",
        "latitude": 22.5726,
        "longitude": 88.3639,
        "workers_count": 240,
        "operating_hours": "06:00 - 22:00 IST",
        "exposure_type": "Hybrid (Indoor/Outdoor)",
        "cooling_availability": "Partial Evaporative Cooling",
        "risk_score": 87.0,
        "risk_level": "CRITICAL",
        "current_temperature": 39.4,
        "status": "OPERATIONAL_STRESS"
    },
    {
        "id": "f2",
        "name": "Delhi Construction Site",
        "type": "Construction Site",
        "location": "New Delhi, Delhi, India",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "workers_count": 180,
        "operating_hours": "07:00 - 19:00 IST",
        "exposure_type": "Outdoor Direct Sun",
        "cooling_availability": "Shade Tents Only",
        "risk_score": 92.5,
        "risk_level": "CRITICAL",
        "current_temperature": 42.1,
        "status": "STOP_HIGH_EXERTION"
    },
    {
        "id": "f3",
        "name": "Mumbai Office Campus",
        "type": "Office",
        "location": "Mumbai, Maharashtra, India",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "workers_count": 520,
        "operating_hours": "08:00 - 20:00 IST",
        "exposure_type": "Indoor Climate Controlled",
        "cooling_availability": "Full Central AC",
        "risk_score": 42.0,
        "risk_level": "MODERATE",
        "current_temperature": 33.5,
        "status": "NORMAL"
    },
    {
        "id": "f4",
        "name": "Bengaluru Manufacturing Unit",
        "type": "Factory",
        "location": "Bengaluru, Karnataka, India",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "workers_count": 310,
        "operating_hours": "24/7 Shift Rotation",
        "exposure_type": "Indoor High Ventilation",
        "cooling_availability": "Industrial HVAC Fans",
        "risk_score": 38.5,
        "risk_level": "SAFE",
        "current_temperature": 31.0,
        "status": "NORMAL"
    }
]

INITIAL_ALERTS: List[Dict] = [
    {
        "id": "alt-1",
        "facility_id": "f1",
        "facility_name": "Kolkata Distribution Warehouse",
        "severity": "CRITICAL",
        "title": "Critical Thermal Stress Threshold Exceeded",
        "message": "Apparent heat index reached 48.2°C with wet bulb temperature of 30.1°C. Mandatory rest cycles required.",
        "timestamp": "2 minutes ago",
        "acknowledged": False,
        "resolved": False,
        "recommended_action": "Enforce 15-minute cool rest break per hour for all shift personnel."
    },
    {
        "id": "alt-2",
        "facility_id": "f2",
        "facility_name": "Delhi Construction Site",
        "severity": "HIGH",
        "title": "Extended Direct Sun Exposure Warning",
        "message": "Direct solar irradiance of 920 W/m² combined with 42.1°C ambient air temp.",
        "timestamp": "18 minutes ago",
        "acknowledged": False,
        "resolved": False,
        "recommended_action": "Halt heavy structural manual lifting until 16:30 IST."
    },
    {
        "id": "alt-3",
        "facility_id": "f3",
        "facility_name": "Mumbai Office Campus",
        "severity": "MODERATE",
        "title": "Rising Coastal Humidity Burden",
        "message": "Relative humidity elevated to 82%, increasing indoor cooling load.",
        "timestamp": "42 minutes ago",
        "acknowledged": True,
        "resolved": False,
        "recommended_action": "Optimize chiller setpoints to maintain 23°C indoor dry bulb."
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
