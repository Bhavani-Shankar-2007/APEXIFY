from typing import Dict, Any
from app.services.satellite.copernicus import CopernicusProvider

class SatelliteService:
    def __init__(self):
        self.providers = {
            "copernicus": CopernicusProvider(),
        }
        
    def get_status(self) -> Dict[str, str]:
        return {name: "available" if provider.is_configured() else "not_configured" 
                for name, provider in self.providers.items()}

satellite_service = SatelliteService()
