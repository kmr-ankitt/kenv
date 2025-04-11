from fastapi import APIRouter, Depends
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {"username": current_user.username}
