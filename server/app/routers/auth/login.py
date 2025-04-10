from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login_user():
    return {"message": "User logined successfully"}
