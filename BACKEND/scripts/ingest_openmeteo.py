import asyncio
import httpx
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.database.models import Region, ForecastError

REGIONS = [
    {"id": "odisha_coastal", "name": "Odisha & North Coastal AP", "lat": 20.15, "lon": 85.50},
    {"id": "konkan_goa", "name": "Konkan, Mumbai & Western Ghats", "lat": 18.65, "lon": 73.15}
]

async def fetch_open_meteo(lat, lon):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, timeout=10.0)
        if resp.status_code == 200:
            return resp.json()
    return None

async def ingest():
    db: Session = SessionLocal()
    print("Populating Regions...")
    for r in REGIONS:
        existing = db.query(Region).filter(Region.id == r["id"]).first()
        if not existing:
            db.add(Region(**r))
    db.commit()
    
    print("Fetching Open-Meteo data...")
    for r in REGIONS:
        data = await fetch_open_meteo(r["lat"], r["lon"])
        if data and "current_weather" in data:
            print(f"Got data for {r['name']}: {data['current_weather']['temperature']}C")
            # In a real pipeline, we'd store historical errors here.
            
    print("Ingestion complete.")
    db.close()

if __name__ == "__main__":
    asyncio.run(ingest())
