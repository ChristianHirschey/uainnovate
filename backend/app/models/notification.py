# app/models/notification.py
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class NotificationBase(BaseModel):
    message: str
    supply_id: Optional[UUID] = None
    request_id: Optional[UUID] = None
    seen: Optional[bool] = False

class NotificationCreate(NotificationBase):
    pass

class NotificationRead(NotificationBase):
    id: UUID

class NotificationUpdate(NotificationBase):
    id: UUID

class NotificationDelete(NotificationBase):
    id: UUID
    

'''
@app.post("/notifications")
def add_notification(notification: NotificationCreate):
    result = create_notification_record(notification)
    if result["success"]:
        return {"message": result["message"]}
    return {"error": result["error"]}

@app.get("/notifications/{notification_id}")
def read_notification(notification_id: UUID):
    result = read_notification_record(notification_id)
    if result["success"]:
        return {"notification": result["notification"]}
    return {"error": result["error"]}

@app.get("/notifications")
def read_all_notifications():
    result = read_all_notification_records()
    if result["success"]:
        return {"notifications": result["notifications"]}
    return {"error": result["error"]}

@app.put("/notifications/{notification_id}")
def update_notification(notification: NotificationUpdate):
    result = update_notification_record(notification.id)
    if result["success"]:
        return {"message": result["message"]}
    return {"error": result["error"]}

@app.delete("/notifications/{notification_id}")
def delete_notification(notification_id: UUID):
    result = delete_notification_record(notification_id)
    if result["success"]:
        return {"message": result["message"]}
    return {"error": result["error"]}
'''