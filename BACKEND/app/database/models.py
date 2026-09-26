from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database.session import Base
from datetime import datetime

class Region(Base):
    __tablename__ = "regions"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    lat = Column(Float)
    lon = Column(Float)

class ForecastError(Base):
    __tablename__ = "forecast_errors"
    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(String, index=True)
    lead_time_days = Column(Integer)
    variable = Column(String) # e.g. "precip_24h"
    forecast_value = Column(Float)
    observed_value = Column(Float)
    absolute_error = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    provider = Column(String)

class ModelPrediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(String, index=True)
    lead_time_days = Column(Integer)
    bust_probability = Column(Float)
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
