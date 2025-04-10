from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db import base
from app.routers.auth import routers as auth_routers


@asynccontextmanager
async def lifespan(app: FastAPI):
    base.create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

# Register all auth routers
for router in auth_routers:
    app.include_router(router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
