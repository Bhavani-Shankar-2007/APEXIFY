from app.services.nwp.base import NWPProvider
from app.core.config import settings
from typing import Dict, Any, Optional

class IMDProvider(NWPProvider):
    def __init__(self):
        self.name = "imd"
        self.api_key = settings.IMD_API_KEY
        self.api_url = settings.IMD_API_URL
        
    def is_configured(self) -> bool:
        return bool(self.api_key) and bool(self.api_url)
        
    async def get_forecast(self, lat: float, lon: float, lead_time_days: int) -> Optional[Dict[str, Any]]:
        if not self.is_configured():
            return None
        return {"provider": self.name, "status": "mocked"}
