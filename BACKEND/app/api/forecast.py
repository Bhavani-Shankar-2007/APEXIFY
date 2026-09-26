from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_forecast():
    return {"message": "Global forecast"}

@router.get("/{region}")
def get_region_forecast(region: str):
    return {"region": region, "forecast": []}

@router.get("/{region}/days/{day}")
def get_region_forecast_day(region: str, day: int):
    return {"region": region, "day": day, "forecast": []}
