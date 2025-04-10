from sqlmodel import Field, SQLModel
from datetime import datetime

class AccessLog(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    secret_id: int = Field(foreign_key="secret.id")
    action: str 
    timestamp: datetime = Field(default_factory=datetime.now)