from typing import Dict, List, Optional
from app.schemas.facility import Facility, FacilityCreate, FacilityUpdate
from app.schemas.alert import Alert

INITIAL_FACILITIES: List[Dict] = [
    {
        "id": "f1",
        "name": "Amazon DFW7 Air & Logistics Hub",
        "type": "Warehouse",
        "location": "Dallas/Fort Worth, Texas, USA",
        "latitude": 32.8998,
        "longitude": -97.0403,
        "workers_count": 1850,
        "operating_hours": "24/7 Multi-Shift Logistics",
        "exposure_type": "Air Cargo Apron & Dock Staging",
        "cooling_availability": "Industrial HVLS Fans & Evaporative Staging",
        "risk_score": 70.3,
        "risk_level": "HIGH",
        "current_temperature": 38.0,
        "status": "OPERATIONAL_PACING"
    },
    {
        "id": "f2",
        "name": "Tesla Giga Texas Advanced Manufacturing",
        "type": "Factory",
        "location": "Austin, Texas, USA",
        "latitude": 30.2223,
        "longitude": -97.6171,
        "workers_count": 3400,
        "operating_hours": "06:00 - 22:00 CST Shifts",
        "exposure_type": "Heavy Industrial & Outdoor Yard",
        "cooling_availability": "Closed-Loop HVAC & Thermal Chillers",
        "risk_score": 62.5,
        "risk_level": "HIGH",
        "current_temperature": 36.5,
        "status": "CHILLER_ALERT"
    },
    {
        "id": "f3",
        "name": "Intel Ocotillo Semiconductor Fab Complex",
        "type": "Factory",
        "location": "Chandler / Phoenix, Arizona, USA",
        "latitude": 33.2435,
        "longitude": -111.8841,
        "workers_count": 2200,
        "operating_hours": "Continuous Cleanroom Operations",
        "exposure_type": "High Thermal Cleanroom Load & Desert Air Intake",
        "cooling_availability": "Multi-Stage Industrial Chilled Water System",
        "risk_score": 78.0,
        "risk_level": "HIGH",
        "current_temperature": 41.5,
        "status": "HIGH_COOLING_DEMAND"
    },
    {
        "id": "f4",
        "name": "Boeing Everett Commercial Assembly Center",
        "type": "Factory",
        "location": "Everett / Seattle, Washington, USA",
        "latitude": 47.9252,
        "longitude": -122.2743,
        "workers_count": 4100,
        "operating_hours": "07:00 - 19:00 PST",
        "exposure_type": "Widebody Aerospace Assembly Bay",
        "cooling_availability": "High-Volume Industrial Air Induction",
        "risk_score": 28.0,
        "risk_level": "SAFE",
        "current_temperature": 24.0,
        "status": "NORMAL"
    }
]

INITIAL_ALERTS: List[Dict] = [
    {
        "id": "alt-1",
        "facility_id": "f1",
        "facility_name": "Amazon DFW7 Air & Logistics Hub",
        "severity": "HIGH",
        "title": "Air Cargo Apron Thermal Exceedance",
        "message": "Ambient temperature has reached 38.0°C with Heat Index at 50.6°C. High thermal radiant load on cargo tarmac.",
        "timestamp": "3 minutes ago",
        "acknowledged": False,
        "resolved": False,
        "recommended_action": "Enforce mandatory 15-minute cool rest break per 45 minutes for all unconditioned tarmac personnel."
    },
    {
        "id": "alt-2",
        "facility_id": "f2",
        "facility_name": "Tesla Giga Texas Advanced Manufacturing",
        "severity": "HIGH",
        "title": "High Heat Index & Industrial Exertion Surge",
        "message": "Apparent Heat Index surged above 45°C. Outdoor logistics and heavy stamping staging require pacing.",
        "timestamp": "12 minutes ago",
        "acknowledged": False,
        "resolved": False,
        "recommended_action": "Transition heavy outdoor forklift and material handling tasks to covered staging areas."
    },
    {
        "id": "alt-3",
        "facility_id": "f3",
        "facility_name": "Intel Ocotillo Semiconductor Fab Complex",
        "severity": "HIGH",
        "title": "Desert Air Intake & Chiller Load Warning",
        "message": "Outdoor ambient dry bulb at 41.5°C. Cleanroom chillers operating above 85% capacity.",
        "timestamp": "25 minutes ago",
        "acknowledged": True,
        "resolved": False,
        "recommended_action": "Pre-cool primary chiller loop and stage auxiliary heat dissipation units for peak afternoon."
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
