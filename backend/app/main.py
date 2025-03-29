from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from app.supabase.supabaseClient import supabase
from app.routes.supplies import router as supplies_router
from app.routes.requests import router as request_router
from app.routes import requests
from app.supabase.supabaseClient import supabase
from app.models.notification import NotificationCreate, NotificationUpdate
from app.utils.notification_ops import create_notification_record, read_notification_record, read_all_notification_records, update_notification_record, delete_notification_record
from uuid import UUID
from app.routes import logs, notifications, supplies

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(supplies_router, prefix="/api/supplies", tags=["supplies"])
app.include_router(request_router, prefix="/api/requests", tags=["requests"])

@app.get("/")
async def root():
    return {"message": "Hello World"}
