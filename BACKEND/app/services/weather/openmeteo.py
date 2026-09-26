from app.services.weather.base import WeatherProvider
from app.core.config import settings
from typing import Dict, Any, Optional
import httpx

class OpenMeteoProvider(WeatherProvider):
    def __init__(self):
        self.name = "open_meteo"
        self.base_url = settings.OPEN_METEO_BASE_URL
        
    def is_configured(self) -> bool:
        return True  # OpenMeteo works without an API key

    async def get_current_weather(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            try:
                # Basic implementation
                url = f"{self.base_url}/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
                response = await client.get(url, timeout=10.0)
                if response.status_code == 200:
                    return response.json()
            except Exception as e:
                print(f"OpenMeteo Error: {e}")
        return None

    async def get_forecast(self, lat: float, lon: float, days: int) -> Optional[Dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            try:
                url = f"{self.base_url}/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days={days}"
                response = await client.get(url, timeout=10.0)
                if response.status_code == 200:
                    return response.json()
            except Exception as e:
                print(f"OpenMeteo Error: {e}")
        return None
