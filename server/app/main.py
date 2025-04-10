from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db import model

@asynccontextmanager
async def lifespan(app: FastAPI):
    model.create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)
    
@app.get("/")
async def root():
    return {"message": "Hello World"}