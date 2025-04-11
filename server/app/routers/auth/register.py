from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.base import get_session
from pydantic import BaseModel
from app.utils.security import hash_password, verify_password
from datetime import datetime
from app.models.user import User
from app.utils.auth import create_access_token
from datetime import timedelta 

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    username: str
    password: str


@router.post("/register")
async def register_user(
    *, session: Session = Depends(get_session), request: RegisterRequest
):
    try:
        # Check if the username already exists
        existing_user = session.exec(
            select(User).where(User.username == request.username)
        ).first()

        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

        # Hash the password and create a new user
        password_hash = hash_password(request.password)
        created_at = datetime.now()

        new_user = User(
            username=request.username,
            password=password_hash,
            created_at=created_at,
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        # 🔐 Create JWT token after successful registration
        token = create_access_token(
            data={"sub": new_user.username}, expires_delta=timedelta(days=1)
        )

        return {
            "status": "success",
            "message": "User registered successfully",
            "access_token": token,
            "token_type": "bearer",
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500, detail=f"User registration failed: {str(e)}"
        )
