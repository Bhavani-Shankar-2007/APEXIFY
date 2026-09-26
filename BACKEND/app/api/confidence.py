from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_confidence():
    return {"message": "Confidence general data"}

@router.get("/map")
def get_confidence_map():
    return {"map": "confidence map data"}

@router.get("/{region}")
def get_confidence_region(region: str):
    return {"region": region, "confidence": 38, "bust_probability": 0.74, "expected_error": 31.7}
