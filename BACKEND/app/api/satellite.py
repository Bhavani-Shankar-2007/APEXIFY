from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_satellite():
    return {"message": "Satellite data"}

@router.get("/{region}")
def get_satellite_region(region: str):
    return {"region": region}

@router.get("/imagery")
def get_imagery():
    return {"message": "imagery"}

@router.get("/indices")
def get_indices():
    return {"message": "indices"}
