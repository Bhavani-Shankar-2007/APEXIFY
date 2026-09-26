from app.services.weather.base import WeatherProvider
from app.core.config import settings
from typing import Dict, Any, Optional

class OpenWeatherProvider(WeatherProvider):
    def __init__(self):
        self.name = "openweather"
        self.api_key = settings.OPENWEATHER_API_KEY
        
    def is_configured(self) -> bool:
        return bool(self.api_key)

    async def get_current_weather(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        if not self.is_configured():
            return None
        return {"status": "mocked", "provider": self.name}

    async def get_forecast(self, lat: float, lon: float, days: int) -> Optional[Dict[str, Any]]:
        if not self.is_configured():
            return None
        return {"status": "mocked", "provider": self.name}
