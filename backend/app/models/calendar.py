from pydantic import BaseModel
from typing import Optional, Literal
from uuid import UUID
from datetime import datetime

class Event(BaseModel):
    id: Optional[UUID]  # Optional on create
    title: str
    description: Optional[str]
    type: Literal["restock", "delivery", "cleaning", "maintenance", "meeting", "note"]
    start_time: datetime
    end_time: datetime
    estimated_duration: Optional[int]
    attendees: Optional[list[str]]
    created_at: Optional[datetime]

class EventCreate(BaseModel):
    title: str
    description: Optional[str]
    type: Literal["restock", "delivery", "cleaning", "maintenance", "meeting", "note"]
    start_time: datetime
    end_time: datetime
    estimated_duration: Optional[int]
    attendees: Optional[list[str]]

class EventRead(Event):
    id: UUID
    created_at: datetime
