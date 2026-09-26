from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class WeatherProvider(ABC):
    def __init__(self):
        self.name = "base"
    
    @abstractmethod
    def is_configured(self) -> bool:
        pass
        
    @abstractmethod
    async def get_current_weather(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    async def get_forecast(self, lat: float, lon: float, days: int) -> Optional[Dict[str, Any]]:
        pass
