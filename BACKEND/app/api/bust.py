from fastapi import APIRouter

router = APIRouter()

@router.get("/map")
def get_bust_map():
    return {"map": "bust map data"}

@router.get("/{region}")
def get_bust_region(region: str):
    return {"region": region, "bust_probability": 0.78}
