from fastapi import APIRouter, HTTPException
from app.models.request import Request
from app.models.typings import RequestType, RequestStatus, RequestPriority
from app.supabase.supabaseClient import supabase
from typing import Optional, List
from uuid import UUID
from app.utils.request_ops import create_request_record, get_all_requests, get_request_by_id
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

@router.post("/")
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
    
@router.get("/get-all")
def get_requests():
    result = get_all_requests()
    if result["success"]:
        return result
    else:
        raise HTTPException(status_code=400, detail=result["error"])

@router.get("/all", response_model=List[Request])
def list_all_requests():
    result = get_all_requests()
    print(result)
    if result["success"]:
        return result["data"]
    else:
        raise HTTPException(status_code=400, detail=result["error"])
    
@router.get("/{request_id}", response_model=Request)
async def get_request(request_id: UUID):
    result = get_request_by_id(request_id)
    if result["success"]:
        return result["request"]
    else:
        raise HTTPException(status_code=400, detail=result["error"])
