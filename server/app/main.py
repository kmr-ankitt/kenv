from fastapi import FastAPI
from contextlib import asynccontextmanager
from server.app.db import base

@asynccontextmanager
async def lifespan(app: FastAPI):
    base.create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)
    
@app.get("/")
async def root():
    return {"message": "Hello World"}