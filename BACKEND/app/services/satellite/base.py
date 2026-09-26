from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class SatelliteProvider(ABC):
    def __init__(self):
        self.name = "base"
        
    @abstractmethod
    def is_configured(self) -> bool:
        pass
