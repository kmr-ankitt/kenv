from fastapi import APIRouter, Depends, HTTPException
from app.db.base import get_session
from sqlmodel import Session, select
from pydantic import BaseModel
from datetime import datetime
from app.utils.auth import get_current_user
from app.models.user import User
from app.models.secret import Secret as SecretModel
from app.utils.security import encrypt_secret, decrypt_secret

router = APIRouter(prefix="/secret", tags=["secret"])


class Secret(BaseModel):
    name: str
    value: str
    expires_at: datetime


@router.post("/")
async def create_secret(
    *,
    session: Session = Depends(get_session),
    request: Secret,
    current_user: User = Depends(get_current_user),
):
    try:
        # Find the current user by username
        curr_user = session.exec(
            select(User).where(User.username == current_user.username)
        ).first()

        if not curr_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Encryption of secret value
        encrypted_value = encrypt_secret(request.value)

        # Create a new secret
        new_secret = SecretModel(
            owner_id=curr_user.id,
            name=request.name,
            value=encrypted_value,
            expires_at=request.expires_at,
        )
        print(new_secret)

        session.add(new_secret)
        session.commit()
        session.refresh(new_secret)

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Secret creation failed: {str(e)}")

    return {"message": "Secret created successfully", "secret": new_secret.name}


@router.get("/all")
async def get_all_secrets(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    try:
        # Fetch all secrets for the current user
        secrets = session.exec(
            select(SecretModel).where(SecretModel.owner_id == current_user.id)
        ).all()

        return {
            "secrets": [
                {
                    "id": secret.id,
                    "name": secret.name,
                    "value": decrypt_secret(secret.value),
                    "expires_at": secret.expires_at,
                }
                for secret in secrets
            ]
        }

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error fetching secrets: {str(e)}")
