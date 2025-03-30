from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import requests
from app.routes import logs, notifications, supplies, requests, users

app = FastAPI()
app.include_router(logs.router, prefix="/api/logs", tags=["logs"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(supplies.router, prefix="/api/supplies", tags=["supplies"])
app.include_router(requests.router, prefix="/api/requests", tags=["requests"])
app.include_router(users.router, prefix="/api/users", tags=["requests"])
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
