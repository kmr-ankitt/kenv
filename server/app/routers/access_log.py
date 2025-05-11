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
        merged_logs = [
            {
                "id": log.id,
                "user_id": log.user_id,
                "secret_id": log.secret_id,
                "secret_name": log.secret_name or "[Deleted]",
                "action": log.action,
                "timestamp": log.timestamp.isoformat(),
            }
            for log in logs
        ]

        return merged_logs

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while fetching access logs. Please try again later.",
        )
