from sqlmodel import Field, SQLModel
from datetime import datetime
from typing import Optional

class Secret(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    owner_id: int | None = Field(foreign_key="user.id")
    name: str = Field(index=True)
    value: str
    expires_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
