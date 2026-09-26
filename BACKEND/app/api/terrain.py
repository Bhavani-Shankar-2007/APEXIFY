from fastapi import APIRouter

router = APIRouter()
# router_3d = APIRouter()

@router.get("/{region}")
def get_terrain(region: str):
    return {
      "region": region,
      "bounds": [],
      "points": [
        {
          "lat": 10.2,
          "lon": 76.4,
          "elevation": 812,
          "confidence": 42,
          "rainfall": 88.2,
          "bust_probability": 0.68
        }
      ]
    }
