from fastapi import APIRouter, HTTPException
from app.models.request import Request
from app.models.typings import RequestType, RequestStatus, RequestPriority
from app.supabase.supabaseClient import supabase
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel

# Create a request model for the input data
class RequestCreate(BaseModel):
    type: RequestType
    description: str
    priority: RequestPriority = RequestPriority.medium
    supply_id: Optional[UUID] = None
    user_id: Optional[UUID] = None

router = APIRouter()

@router.post("/requests", response_model=Request)
async def create_request(request: RequestCreate):  # Changed to use request body
    try:
        data = {
            "type": request.type,
            "description": request.description,
            "priority": request.priority,
            "status": RequestStatus.open,
            "supply_id": str(request.supply_id) if request.supply_id else None,
            "user_id": str(request.user_id) if request.user_id else None
        }
        
        response = supabase.table("requests").insert(data).execute()
        
        if response.data:
            return response.data[0]
        else:
            raise HTTPException(status_code=400, detail="Failed to create request")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/requests/{request_id}", response_model=Request)
async def get_request(request_id: UUID):
    try:
        response = supabase.table("requests").select("*").eq("id", request_id).execute()
        
        if response.data:
            return response.data[0]
        else:
            raise HTTPException(status_code=404, detail="Request not found")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/requests/get-all", response_model=List[Request]   )
async def get_all_requests():
    try:
        response = supabase.table("requests").select("*").execute()
        
        if response.data:
            return response.data
        else:
            raise HTTPException(status_code=404, detail="No requests found")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
