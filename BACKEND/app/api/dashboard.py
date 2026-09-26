from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_dashboard_data():
    return {"status": "ok", "message": "Dashboard data"}
