from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_alerts():
    return []

@router.get("/active")
def get_active_alerts():
    return []
