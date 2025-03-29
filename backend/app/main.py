from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from app.supabase.supabaseClient import supabase
from app.models.supply import Supply
from app.utils.supply_ops import create_supply_record
from app.routes import requests
from app.supabase.supabaseClient import supabase
from app.routes.requests import router as request_router

app = FastAPI()
# app.include_router(logs.router, prefix="/api", tags=["logs"])
# app.include_router(notifications.router, prefix="/api", tags=["notifications"])
# app.include_router(supplies.router, prefix="/api", tags=["supplies"])
app.include_router(request_router, prefix="/api", tags=["requests"])
# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/supplies")
def add_supply(supply: Supply):
    result = create_supply_record(supply)
    if result["success"]:
        return {"message": result["message"]}
    return {"error": result["error"]}