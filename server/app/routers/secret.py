from fastapi import APIRouter, Depends, HTTPException
from app.db.base import get_session
from sqlmodel import Session, select
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/secret", tags=["secret"])

class Secret(BaseModel):
    name: str
    value: str
    expires_at: datetime

@router.post("/")
async def create_secret(
        *, session: Session = Depends(get_session), request: Secret
):
    return ""