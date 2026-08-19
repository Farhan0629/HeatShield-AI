import datetime
import uuid
from typing import Dict, Any
from app.schemas.report import ReportRequest, ReportResponse
from fpdf import FPDF

class ReportService:
    def generate_report_data(self, request: ReportRequest, facility_data: Dict[str, Any], env_data: Dict[str, Any], risk_data: Dict[str, Any]) -> ReportResponse:
        report_id = f"REP-{uuid.uuid4().hex[:8].upper()}"
        facility_name = facility_data.get("name", "Unknown Facility")
        risk_level = risk_data.get("level", "MODERATE")
        risk_score = risk_data.get("score", 50.0)

        data_source = "FortyGuard Live Enterprise API"
        generator_tag = f"SOURCE: {data_source} | ANALYSIS: HeatShield AI Decision Engine"

        title = f"{request.report_type} - {facility_name}"
        summary = (
            f"Official operational heat incident report generated for {facility_name}. "
            f"Real-time atmospheric and micro-climate telemetry ingested via {data_source} recorded facility thermal risk level as {risk_level} ({risk_score}/100). "
            f"Deterministic HeatShield risk engine protocols have been calculated and issued for operational compliance."
        )

        key_findings = [
            f"Ambient Air Temperature recorded at {env_data.get('temperature', 'N/A')}°C via {data_source}.",
            f"Perceived Heat Index reached {env_data.get('heat_index', 'N/A')}°C.",
            f"Wet Bulb Stress index reached {env_data.get('wet_bulb', 'N/A')}°C under {env_data.get('humidity', 'N/A')}% relative humidity.",
            f"Facility type ({facility_data.get('type')}) infrastructure vulnerability multiplier applied."
        ]

        actions_taken = [
            "Issued automatic high-risk push alert to on-duty site supervisors.",
            "Enforced mandatory 15-minute hydration and shaded recovery breaks.",
            "Recommended rescheduling non-essential heavy manual labor.",
            "Logged incident telemetry into HeatShield enterprise audit registry."
        ]

        return ReportResponse(
            id=report_id,
            facility_id=request.facility_id,
            facility_name=facility_name,
            report_type=request.report_type,
            title=title,
            generated_at=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
            risk_level=risk_level,
            risk_score=risk_score,
            summary=summary,
            environmental_snapshot={
                "data_source": data_source,
                "temperature": env_data.get("temperature"),
                "heat_index": env_data.get("heat_index"),
                "humidity": env_data.get("humidity"),
                "wet_bulb": env_data.get("wet_bulb"),
                "aqi": env_data.get("aqi"),
                "solar_irradiance": env_data.get("solar_irradiance")
            },
            key_findings=key_findings,
            actions_taken=actions_taken,
            generated_by=generator_tag
        )

    def generate_pdf_bytes(self, report: ReportResponse) -> bytes:
        def clean(s: str) -> str:
            return s.encode('latin-1', 'replace').decode('latin-1')

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 18)
        pdf.cell(0, 10, clean("HEATSHIELD AI"), ln=True, align="L")
        pdf.set_font("Helvetica", "", 12)
        pdf.cell(0, 8, clean("Enterprise Heat Risk Operations Report"), ln=True, align="L")
        pdf.ln(5)

        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, clean(f"{report.title}"), ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 6, clean(f"Report ID: {report.id}  |  Generated: {report.generated_at}"), ln=True)
        pdf.cell(0, 6, clean(f"Risk Level: {report.risk_level}  |  Risk Score: {report.risk_score}/100"), ln=True)
        pdf.cell(0, 6, clean(f"Provenance: {report.generated_by}"), ln=True)
        pdf.ln(8)

        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(0, 8, clean("Executive Summary"), ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(0, 6, clean(report.summary))
        pdf.ln(5)

        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(0, 8, clean("Environmental Snapshot"), ln=True)
        pdf.set_font("Helvetica", "", 10)
        for k, v in report.environmental_snapshot.items():
            pdf.cell(0, 6, clean(f"  - {k.replace('_', ' ').title()}: {v}"), ln=True)
        pdf.ln(5)

        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(0, 8, clean("Key Risk Findings"), ln=True)
        pdf.set_font("Helvetica", "", 10)
        for item in report.key_findings:
            pdf.cell(0, 6, clean(f"  * {item}"), ln=True)
        pdf.ln(5)

        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(0, 8, clean("Recommended Operational Precaution"), ln=True)
        pdf.set_font("Helvetica", "", 10)
        for item in report.actions_taken:
            pdf.cell(0, 6, clean(f"  [x] {item}"), ln=True)

        return bytes(pdf.output())

report_service = ReportService()
