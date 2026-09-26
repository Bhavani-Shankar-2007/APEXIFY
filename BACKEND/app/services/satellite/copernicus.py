from app.services.satellite.base import SatelliteProvider
from app.core.config import settings

class CopernicusProvider(SatelliteProvider):
    def __init__(self):
        self.name = "copernicus"
        self.client_id = settings.COPERNICUS_CLIENT_ID
        self.client_secret = settings.COPERNICUS_CLIENT_SECRET
        
    def is_configured(self) -> bool:
        return bool(self.client_id) and bool(self.client_secret)
