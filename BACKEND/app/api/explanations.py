from fastapi import APIRouter

router = APIRouter()

@router.get("/{region}")
def get_explanations(region: str):
    return {
      "confidence": 38,
      "factors": [
        {
          "feature": "ensemble_spread",
          "impact": "high",
          "direction": "negative"
        }
      ]
    }
