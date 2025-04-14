from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db import base
from app.routers.auth import routers as auth_routers
from app.routers.secret import router as secret_router
from app.routers.access_log import router as access_log_router
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    base.create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register all auth and secret routers
for router in auth_routers:
    app.include_router(router)
app.include_router(secret_router)
app.include_router(access_log_router)

@app.get("/")
async def root():
    return {"message": "Hello World"}
