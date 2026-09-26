import os

# Backend root directory
root = r"d:\SIH\APEXIFY\BACKEND"

# Directory structure
dirs = [
    "app",
    "app/api",
    "app/services",
    "app/services/weather",
    "app/services/nwp",
    "app/services/satellite",
    "app/services/terrain",
    "app/services/prediction",
    "app/services/explanation",
    "app/services/alerts",
    "app/ml",
    "app/ml/preprocessing",
    "app/ml/training",
    "app/ml/inference",
    "app/ml/models",
    "app/database",
    "app/database/models",
    "app/database/repositories",
    "app/schemas",
    "app/core",
    "app/utils",
    "data",
    "data/raw",
    "data/processed",
    "data/historical",
    "models",
    "scripts",
    "tests",
]

for d in dirs:
    os.makedirs(os.path.join(root, d), exist_ok=True)

# Generate basic files
files = {
    "requirements.txt": """fastapi
uvicorn
pydantic
pydantic-settings
sqlalchemy
psycopg2-binary
alembic
httpx
numpy
pandas
scikit-learn
xgboost
shap
joblib
rasterio
geopandas
pyproj
APScheduler
python-dotenv
""",
    ".env.example": """DATABASE_URL=postgresql://user:password@localhost:5432/apexify
API_V1_STR=/api/v1
PROJECT_NAME=APEXIFY
""",
    "Dockerfile": """FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
""",
    "README.md": """# APEXIFY BACKEND

This is the FastAPI backend for the APEXIFY system.

## Setup

1. Create virtual environment and install requirements:
   `pip install -r requirements.txt`
2. Configure `.env` file from `.env.example`.
3. Run the development server:
   `uvicorn app.main:app --reload`
""",
    "app/main.py": """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import dashboard, forecast, confidence, bust, satellite, terrain, alerts, explanations, model
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected", # TODO check actual DB
        "weather_service": "available",
        "ml_model": "loaded"
    }

# Include routers
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(forecast.router, prefix="/api/forecast", tags=["forecast"])
app.include_router(confidence.router, prefix="/api/confidence", tags=["confidence"])
app.include_router(bust.router, prefix="/api/bust", tags=["bust"])
app.include_router(satellite.router, prefix="/api/satellite", tags=["satellite"])
app.include_router(terrain.router, prefix="/api/terrain", tags=["terrain"])
# app.include_router(terrain.router_3d, prefix="/api/3d/weather", tags=["3d"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(explanations.router, prefix="/api/explanations", tags=["explanations"])
app.include_router(model.router, prefix="/api/model", tags=["model"])
""",
    "app/core/config.py": """from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "APEXIFY"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./test.db" # Default for local dev

    class Config:
        env_file = ".env"

settings = Settings()
""",
    "app/api/dashboard.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_dashboard_data():
    return {"status": "ok", "message": "Dashboard data"}
""",
    "app/api/forecast.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_forecast():
    return {"message": "Global forecast"}

@router.get("/{region}")
def get_region_forecast(region: str):
    return {"region": region, "forecast": []}

@router.get("/{region}/days/{day}")
def get_region_forecast_day(region: str, day: int):
    return {"region": region, "day": day, "forecast": []}
""",
    "app/api/confidence.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_confidence():
    return {"message": "Confidence general data"}

@router.get("/map")
def get_confidence_map():
    return {"map": "confidence map data"}

@router.get("/{region}")
def get_confidence_region(region: str):
    return {"region": region, "confidence": 38, "bust_probability": 0.74, "expected_error": 31.7}
""",
    "app/api/bust.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("/map")
def get_bust_map():
    return {"map": "bust map data"}

@router.get("/{region}")
def get_bust_region(region: str):
    return {"region": region, "bust_probability": 0.78}
""",
    "app/api/satellite.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_satellite():
    return {"message": "Satellite data"}

@router.get("/{region}")
def get_satellite_region(region: str):
    return {"region": region}

@router.get("/imagery")
def get_imagery():
    return {"message": "imagery"}

@router.get("/indices")
def get_indices():
    return {"message": "indices"}
""",
    "app/api/terrain.py": """from fastapi import APIRouter

router = APIRouter()
# router_3d = APIRouter()

@router.get("/{region}")
def get_terrain(region: str):
    return {
      "region": region,
      "bounds": [],
      "points": [
        {
          "lat": 10.2,
          "lon": 76.4,
          "elevation": 812,
          "confidence": 42,
          "rainfall": 88.2,
          "bust_probability": 0.68
        }
      ]
    }
""",
    "app/api/alerts.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_alerts():
    return []

@router.get("/active")
def get_active_alerts():
    return []
""",
    "app/api/explanations.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("/{region}")
def get_explanations(region: str):
    return {
      "confidence": 38,
      "factors": [
        {
          "feature": "ensemble_spread",
          "impact": "high",
          "direction": "negative"
        }
      ]
    }
""",
    "app/api/model.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
def get_model_status():
    return {
      "model": "APEXIFY-XGB",
      "version": "1.0",
      "status": "active",
      "trained_at": "2026-09-26T00:00:00Z",
      "features": 27,
      "training_samples": 12450
    }

@router.get("/metrics")
def get_model_metrics():
    return {"accuracy": 0.85}
"""
}

for filepath, content in files.items():
    full_path = os.path.join(root, filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Backend skeleton created successfully.")
