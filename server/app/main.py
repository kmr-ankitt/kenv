from fastapi import FastAPI

app = FastAPI(title="Secrets Vault API")

@app.get("/")
async def root():
    return {"message": "Welcome to the Secrets Vault API!"}