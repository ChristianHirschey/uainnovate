from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.typings import RequestType, RequestStatus, RequestPriority

class Request(BaseModel):
    id: UUID
    user_id: Optional[UUID]
    type: RequestType
    description: str
    priority: RequestPriority = RequestPriority.medium
    status: RequestStatus = RequestStatus.open
    supply_id: Optional[UUID]
    created_at: Optional[datetime]
    resolved_at: Optional[datetime]