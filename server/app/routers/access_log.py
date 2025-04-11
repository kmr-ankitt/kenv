from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.utils.auth import get_session
from app.models.access_log import AccessLog
from app.models.secret import Secret

router = APIRouter(prefix="/log", tags=["log"])


@router.get("/")
async def get_access_log(
    session: Session = Depends(get_session),
):
    try:
        logs = session.exec(select(AccessLog)).all()
        secrets = {
            secret.id: secret.name for secret in session.exec(select(Secret)).all()
        }
        merged_logs = [
            {"secret_name": secrets.get(log.secret_id), **log.model_dump()}
            for log in logs
        ]

        return merged_logs

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while fetching access logs. Please try again later.",
        )
