from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import dashboard, forecast, confidence, bust, satellite, terrain, alerts, explanations, model, providers
from app.core.config import settings
from app.database.session import engine, Base
from app.database import models  # to ensure models are registered

# Create all tables if they don't exist
Base.metadata.create_all(bind=engine)

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
app.include_router(providers.router, prefix="/api/providers", tags=["providers"])
app.include_router(explanations.router, prefix="/api/explanations", tags=["explanations"])
app.include_router(model.router, prefix="/api/model", tags=["model"])
