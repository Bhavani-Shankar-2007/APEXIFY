from typing import Dict, Any
from app.services.weather.openmeteo import OpenMeteoProvider
from app.services.weather.openweather import OpenWeatherProvider

class WeatherService:
    def __init__(self):
        self.providers = {
            "open_meteo": OpenMeteoProvider(),
            "openweather": OpenWeatherProvider(),
        }
        
    def get_status(self) -> Dict[str, str]:
        return {name: "available" if provider.is_configured() else "not_configured" 
                for name, provider in self.providers.items()}
                
weather_service = WeatherService()
