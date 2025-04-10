from sqlmodel import Field, SQLModel
from datetime import datetime

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str
    created_at: datetime = Field(default_factory=datetime.now)
