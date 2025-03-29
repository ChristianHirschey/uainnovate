from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class Log(BaseModel):
    message: str
    supply_id: Optional[UUID]
    user_id: Optional[UUID]
    change: int 
    reason: str
    timestamp: Optional[datetime]


