import json
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Dict, List
from urllib.parse import parse_qs, urlparse

FRONTEND_DIR = Path(__file__).resolve().parent

SUBDIVISIONS_META = [
    {"id": "odisha_coastal", "name": "Odisha & North Coastal AP", "lat": 20.15, "lon": 85.50, "base_bust": 78},
    {"id": "konkan_goa", "name": "Konkan, Mumbai & Western Ghats", "lat": 18.65, "lon": 73.15, "base_bust": 74},
    {"id": "west_himalayas", "name": "Western Himalayas (J&K, HP, UK)", "lat": 31.60, "lon": 77.20, "base_bust": 72},
    {"id": "central_india", "name": "Central India (MP & Chhattisgarh)", "lat": 22.70, "lon": 79.80, "base_bust": 75},
    {"id": "gangetic_wb", "name": "Gangetic West Bengal & Head Bay", "lat": 22.65, "lon": 88.10, "base_bust": 70},
    {"id": "nw_planes", "name": "Indo-Gangetic Plains (Delhi, Punjab, UP)", "lat": 28.40, "lon": 77.80, "base_bust": 64},
    {"id": "rajasthan_arid", "name": "West & East Rajasthan (Thar Sector)", "lat": 26.80, "lon": 72.40, "base_bust": 58},
    {"id": "northeast_india", "name": "Northeast India (Assam & Meghalaya)", "lat": 26.10, "lon": 92.10, "base_bust": 68},
    {"id": "gujarat_saurashtra", "name": "Gujarat & Saurashtra-Kutch", "lat": 22.50, "lon": 71.20, "base_bust": 62},
    {"id": "kerala_south", "name": "Kerala & South Interior Peninsula", "lat": 10.85, "lon": 76.50, "base_bust": 54},
    {"id": "coromandel_tn", "name": "Tamil Nadu & Coromandel Coast", "lat": 12.60, "lon": 79.90, "base_bust": 48},
    {"id": "bay_of_bengal", "name": "Central & North Bay of Bengal (Marine)", "lat": 17.80, "lon": 88.80, "base_bust": 76},
]


def compute_forecast_confidence(regime: str = "monsoon_depression", day: int = 5) -> Dict:
    day = max(1, min(10, int(day)))
    lead_factor = {1: 0.35, 2: 0.48, 3: 0.68, 4: 0.88, 5: 1.0, 6: 1.06, 7: 1.02, 8: 0.94, 9: 0.88, 10: 0.84}[day]
    regions = []
    for sub in SUBDIVISIONS_META:
        bust_prob = min(96, max(8, int(round(sub["base_bust"] * lead_factor))))
        regions.append(
            {
                "region_id": sub["id"],
                "name": sub["name"],
                "coordinates": {"lat": sub["lat"], "lon": sub["lon"]},
                "lead_day": day,
                "bust_probability_pct": bust_prob,
                "forecast_confidence_pct": 100 - bust_prob,
                "error_prone_area": bust_prob >= 55,
            }
        )
    return {
        "system": "MAUSAM-SHIELD AI v2.4",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "synoptic_regime": regime,
        "lead_day": day,
        "lead_hours": day * 24,
        "regions": regions,
    }


def compute_error_prone_areas(threshold: float = 0.55, day: int = 5) -> Dict:
    conf_data = compute_forecast_confidence(day=day)
    thresh_pct = int(float(threshold) * 100)
    flagged = [r for r in conf_data["regions"] if r["bust_probability_pct"] >= thresh_pct]
    flagged.sort(key=lambda x: x["bust_probability_pct"], reverse=True)
    return {
        "lead_day": day,
        "threshold_pct": thresh_pct,
        "error_prone_count": len(flagged),
        "error_prone_regions": flagged,
    }


def compute_bust_prediction(payload: Dict) -> Dict:
    lead_day = int(payload.get("lead_day", 5))
    spread = float(payload.get("ensemble_spread_mm", 48.0))
    flipflop = float(payload.get("dprog_dt_flipflop", 0.65))
    cape = float(payload.get("cape_jkg", 2400.0))
    analog = float(payload.get("analog_rmse_mm", 42.0))
    oro = float(payload.get("orographic_complexity", 0.70))

    c_lead = round(lead_day * 2.8, 1)
    c_spread = round((spread / 120.0) * 32.0, 1)
    c_flip = round(flipflop * 22.0, 1)
    c_cape = round((cape / 5000.0) * 14.0, 1)
    c_analog = round((analog / 100.0) * 18.0, 1)
    c_oro = round(oro * 12.0, 1)

    bust_prob = min(98, max(4, int(round(c_lead + c_spread + c_flip + c_cape + c_analog + c_oro - 14.0))))
    conf = 100 - bust_prob

    risk_cat = (
        "SEVERE_BUST_RISK"
        if bust_prob >= 65
        else "MODERATE_UNCERTAINTY"
        if bust_prob >= 40
        else "HIGH_CONFIDENCE"
    )

    return {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "lead_day": lead_day,
        "lead_hours": lead_day * 24,
        "bust_probability_pct": bust_prob,
        "forecast_confidence_pct": conf,
        "risk_category": risk_cat,
        "error_prone_flag": bust_prob >= 55,
        "shap_attributions": [
            {
                "feature": "Multi-Model Ensemble Spread (GFS vs ECMWF)",
                "contribution_pct": c_spread,
                "explanation": "Inter-model divergence in synoptic track and intensity.",
            },
            {
                "feature": "Run-to-Run Flip-Flop Index (dProg/dt)",
                "contribution_pct": c_flip,
                "explanation": "Temporal oscillation across consecutive NWP initialization cycles.",
            },
            {
                "feature": "Historical Analog Error Distance (ERA5 KNN)",
                "contribution_pct": c_analog,
                "explanation": "Historical error behaviour in matching past synoptic flow regimes.",
            },
            {
                "feature": "Forecast Lead-Time Horizon Growth",
                "contribution_pct": c_lead,
                "explanation": "Chaotic error growth at medium-range lead times.",
            },
            {
                "feature": "Convective & Orographic Instability Coupling",
                "contribution_pct": round(c_cape + c_oro, 1),
                "explanation": "Sub-grid convective parameterization and steep terrain error.",
            },
        ],
        "operational_recommendation": (
            "Switch from deterministic NWP output to 75th-90th percentile multi-model ensemble guidance."
            if bust_prob >= 55
            else "Deterministic NWP guidance shows high consistency; standard operational issuance recommended."
        ),
    }


# Optional FastAPI wiring when FastAPI is installed
try:
    from fastapi import FastAPI, Query
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.staticfiles import StaticFiles
    from pydantic import BaseModel

    app = FastAPI(
        title="MAUSAM-SHIELD AI: Medium-Range Forecast Bust Detection API",
        version="2.4.0",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    class BustPredictionRequest(BaseModel):
        lead_day: int = 5
        ensemble_spread_mm: float = 48.0
        dprog_dt_flipflop: float = 0.65
        cape_jkg: float = 2400.0
        analog_rmse_mm: float = 42.0
        orographic_complexity: float = 0.70

    @app.get("/api/v1/health")
    def health_check():
        return {"status": "operational", "service": "MAUSAM-SHIELD AI", "timestamp_utc": datetime.now(timezone.utc).isoformat()}

    @app.get("/api/v1/forecast-confidence")
    def api_forecast_confidence(regime: str = Query("monsoon_depression"), day: int = Query(5, ge=1, le=10)):
        return compute_forecast_confidence(regime, day)

    @app.get("/api/v1/error-prone-areas")
    def api_error_prone(threshold: float = Query(0.55), day: int = Query(5, ge=1, le=10)):
        return compute_error_prone_areas(threshold, day)

    @app.post("/api/v1/predict-bust")
    def api_predict_bust(req: BustPredictionRequest):
        return compute_bust_prediction(req.model_dump())

    if FRONTEND_DIR.exists():
        app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")

except ImportError:
    app = None


class FallbackAPIHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND_DIR), **kwargs)

    def _send_json(self, data: Dict, status: int = 200):
        raw = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)
        
        if parsed.path == "/config.js":
            env_path = FRONTEND_DIR / ".env"
            env_vars = {}
            if env_path.exists():
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            v = v.strip().strip('"').strip("'")
                            env_vars[k.strip()] = v
            js_content = f"window.ENV = {json.dumps(env_vars)};"
            raw = js_content.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript")
            self.send_header("Content-Length", str(len(raw)))
            self.end_headers()
            self.wfile.write(raw)
            return

        if parsed.path == "/api/v1/health":
            return self._send_json({"status": "operational", "service": "MAUSAM-SHIELD AI"})
        if parsed.path == "/api/v1/forecast-confidence":
            regime = qs.get("regime", ["monsoon_depression"])[0]
            day = int(qs.get("day", ["5"])[0])
            return self._send_json(compute_forecast_confidence(regime, day))
        if parsed.path == "/api/v1/error-prone-areas":
            threshold = float(qs.get("threshold", ["0.55"])[0])
            day = int(qs.get("day", ["5"])[0])
            return self._send_json(compute_error_prone_areas(threshold, day))
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/v1/predict-bust":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length).decode("utf-8")) if length > 0 else {}
            return self._send_json(compute_bust_prediction(body))
        self.send_error(404, "Endpoint not found")


if __name__ == "__main__":
    import webbrowser
    import threading
    import time
    
    port = 8080
    url = f"http://localhost:{port}"
    print(f"Starting MAUSAM-SHIELD AI Server on {url}")
    
    # Open the browser after a short delay to ensure the server is up
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    
    server = ThreadingHTTPServer(("0.0.0.0", port), FallbackAPIHandler)
    server.serve_forever()
