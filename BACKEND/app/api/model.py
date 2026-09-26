from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
def get_model_status():
    return {
      "model": "APEXIFY-XGB",
      "version": "1.0",
      "status": "active",
      "trained_at": "2026-09-26T00:00:00Z",
      "features": 27,
      "training_samples": 12450
    }

@router.get("/metrics")
def get_model_metrics():
    return {"accuracy": 0.85}
