from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class NWPProvider(ABC):
    def __init__(self):
        self.name = "base"
        
    @abstractmethod
    def is_configured(self) -> bool:
        pass
        
    @abstractmethod
    async def get_forecast(self, lat: float, lon: float, lead_time_days: int) -> Optional[Dict[str, Any]]:
        pass
