from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # APPLICATION
    APP_ENV: str = "development"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"
    PROJECT_NAME: str = "APEXIFY"
    API_V1_STR: str = "/api"

    # DATABASE (SUPABASE)
    DATABASE_URL: Optional[str] = None # Still needed for SQLAlchemy engine if used
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_JWT_SECRET: Optional[str] = None

    # WEATHER & TERRAIN
    OPEN_METEO_API_KEY: Optional[str] = None
    OPEN_TOPOGRAPHY_API_KEY: Optional[str] = None
    CESIUM_ION_TOKEN: Optional[str] = None
    NASA_GIBS_BASE_URL: str = "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
