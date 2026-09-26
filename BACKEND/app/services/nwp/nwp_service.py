from typing import Dict, Any
from app.services.nwp.imd import IMDProvider
from app.services.nwp.base import NWPProvider

class NWPService:
    def __init__(self):
        self.providers = {
            "imd": IMDProvider(),
            # "ncmrwf": NCMRWFProvider(),
            # "ecmwf": ECMWFProvider()
        }
        
    def get_status(self) -> Dict[str, str]:
        status = {}
        for name, provider in self.providers.items():
            status[name] = "available" if provider.is_configured() else "not_configured"
        return status

nwp_service = NWPService()
