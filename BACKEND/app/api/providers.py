from fastapi import APIRouter
from app.services.weather.weather_service import weather_service
from app.services.nwp.nwp_service import nwp_service
from app.services.satellite.satellite_service import satellite_service

router = APIRouter()

@router.get("/status")
def get_providers_status():
    return {
        "weather": weather_service.get_status(),
        "nwp": nwp_service.get_status(),
        "satellite": satellite_service.get_status()
    }
