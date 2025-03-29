from fastapi import APIRouter, HTTPException
from app.models.request import Request
from app.models.typings import RequestType, RequestStatus, RequestPriority
from app.supabase.supabaseClient import supabase
from typing import Optional, List
from uuid import UUID
from app.utils.request_ops import create_request_record
from pydantic import BaseModel
from datetime import datetime

# New model for request creation
class RequestCreate(BaseModel):
    type: RequestType
    description: str
    priority: RequestPriority = RequestPriority.medium
    status: RequestStatus = RequestStatus.open
    supply_id: Optional[UUID] = None
    user_id: Optional[UUID] = None

router = APIRouter()

@router.post("/requests")
def create_request(request_data: RequestCreate):
    # Convert RequestCreate to Request
    request = Request(
        id=UUID(int=0),  # Temporary ID, will be replaced by database
        type=request_data.type,
        description=request_data.description,
        priority=request_data.priority,
        status=request_data.status,
        supply_id=request_data.supply_id,
        user_id=request_data.user_id,
        created_at=datetime.now(),
        resolved_at=None
    )
    
    result = create_request_record(request)
    if result["success"]:
        return result
    else:
        raise HTTPException(status_code=400, detail=result["error"])
    
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

@router.put("/requests/get-all"   )
async def get_all_requests():
    try:
        response = (supabase.table("requests").select("*").execute())
        print(response)
        
        if response:
            return response
        else:
            raise HTTPException(status_code=404, detail="No requests found")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
