from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.base import get_session
from app.models.user import User
from app.utils.security import verify_password
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login_user(*, session: Session = Depends(get_session), request: LoginRequest):
    try:
        # Check if the user exists
        user = session.exec(
            select(User).where(User.username == request.username)
        ).first()

        if not user:
            raise HTTPException(status_code=400, detail="Invalid username or password")

        # Verify the password
        if not verify_password(request.password, user.password):
            raise HTTPException(status_code=400, detail="Invalid username or password")

        session.commit()
        return {"status": "success", "message": "Login successful"}

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
