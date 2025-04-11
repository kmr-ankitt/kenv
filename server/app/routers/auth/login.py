from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.base import get_session
from app.models.user import User
from app.utils.security import verify_password
from pydantic import BaseModel
from app.utils.auth import create_access_token
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    try:
        # Check if the user exists
        user = session.exec(
            select(User).where(User.username == form_data.username)
        ).first()

        if not user or not verify_password(form_data.password, user.password):
            raise HTTPException(status_code=400, detail="Invalid username or password")

        token = create_access_token(
            data={"sub": user.username}, expires_delta=timedelta(days=1)
        )

        return {
            "status": "success",
            "access_token": token,
            "token_type": "bearer",
            "message": "Login successful",
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
