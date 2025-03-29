from fastapi import APIRouter, HTTPException
from app.models.request import Request
from app.models.typings import RequestType, RequestStatus, RequestPriority
from app.main import supabase
from typing import Optional
from uuid import UUID

router = APIRouter()

@router.post("/requests", response_model=Request)
async def create_request(
    type: RequestType,
    description: str,
    priority: RequestPriority = RequestPriority.medium,
    supply_id: Optional[UUID] = None,
    user_id: Optional[UUID] = None
):
    try:
        data = {
            "type": type,
            "description": description,
            "priority": priority,
            "status": RequestStatus.open,
            "supply_id": str(supply_id) if supply_id else None,
            "user_id": str(user_id) if user_id else None
        }
        
        response = supabase.table("requests").insert(data).execute()
        
        if response.data:
            return response.data[0]
        else:
            raise HTTPException(status_code=400, detail="Failed to create request")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
