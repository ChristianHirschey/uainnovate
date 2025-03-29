# app/models/notification.py
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class NotificationBase(BaseModel):
    message: str
    supply_id: Optional[int] = None
    request_id: Optional[int] = None
    seen: Optional[bool] = False

class NotificationCreate(NotificationBase):
    pass

class NotificationRead(NotificationBase):
    id: UUID

class NotificationUpdate(NotificationBase):
    id: UUID

class NotificationDelete(NotificationBase):
    id: UUID
    