from fastapi import APIRouter, Depends, HTTPException
from app.db.base import get_session
from sqlmodel import Session, select
from pydantic import BaseModel
from datetime import datetime
from app.utils.auth import get_current_user
from app.models.user import User
from app.models.secret import Secret as SecretModel
from app.utils.security import encrypt_secret, decrypt_secret
from app.models.access_log import AccessLog

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
        # Encryption of secret value
        encrypted_value = encrypt_secret(request.value)

        # Create a new secret
        new_secret = SecretModel(
            owner_id=current_user.id,
            name=request.name,
            value=encrypted_value,
            expires_at=request.expires_at,
        )

        session.add(new_secret)
        session.commit()
        session.refresh(new_secret)

        new_access_log = AccessLog(
            user_id=current_user.id,
            secret_id=new_secret.id,
            secret_name=new_secret.name,
            action="created",
            timestamp=datetime.now(),
        )

        session.add(new_access_log)
        session.commit()

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
        secrets = session.exec(
            select(SecretModel).where(SecretModel.owner_id == current_user.id)
        ).all()

        return {
            "secrets": [
                {
                    "id": secret.id,
                    "name": secret.name,
                    "value": secret.name + "(hidden)",
                    "expires_at": secret.expires_at,
                }
                for secret in secrets
            ]
        }

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error fetching secrets: {str(e)}")


@router.get("/{secret_id}")
async def get_secret_by_id(
    secret_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    try:
        secret = session.exec(
            select(SecretModel).where(
                SecretModel.id == secret_id, SecretModel.owner_id == current_user.id
            )
        ).first()

        if not secret:
            raise HTTPException(status_code=404, detail="Secret not found")

        set_access_log = AccessLog(
            user_id=current_user.id,
            secret_id=secret_id,
            secret_name=secret.name,
            action="retrived",
            timestamp=datetime.now(),
        )

        session.add(set_access_log)
        session.commit()
        session.refresh(set_access_log)


        return {
            "id": secret.id,
            "name": secret.name,
            "value": decrypt_secret(secret.value),
            "expires_at": secret.expires_at,
        }

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error fetching secret: {str(e)}")


@router.delete("/{secret_id}")
async def delete_secret(
    secret_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    try:
        secret = session.exec(
            select(SecretModel).where(
                SecretModel.id == secret_id, SecretModel.owner_id == current_user.id
            )
        ).first()


        if not secret:
            raise HTTPException(status_code=404, detail="Secret not found")

        session.delete(secret)
        session.commit()

        set_access_log = AccessLog(
            user_id=current_user.id,
            secret_id=secret_id,
            secret_name=secret.name,
            action="Deleted",
            timestamp=datetime.now(),
        )

        session.add(set_access_log)
        session.commit()
        session.refresh(set_access_log)

        return {"message": "Secret deleted successfully"}

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting secret: {str(e)}")
