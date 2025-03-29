from fastapi import APIRouter, HTTPException
from uuid import UUID
from app.models.notification import NotificationCreate, NotificationUpdate
from app.utils.notification_ops import (
    create_notification_record,
    read_notification_record,
    read_all_notification_records,
    update_notification_record,
    delete_notification_record,
) 
router = APIRouter()

@router.post("/")
def add_notification(notification: NotificationCreate):
    result = create_notification_record(notification)
    if result["success"]:
        return {"message": result["message"]}
    return {"error": result["error"]}

@router.get("/get-all")
def read_all_notifications():
    result = read_all_notification_records()
    if result["success"]:
        return {"notifications": result["notifications"]}
    return {"error": result["error"]}

@router.get("/{notification_id}")
def read_notification(notification_id: UUID):
    result = read_notification_record(notification_id)
    if result["success"]:
        return {"notification": result["notification"]}
    return {"error": result["error"]}

@router.put("/{notification_id}")
def update_notification(notification: NotificationUpdate):
    result = update_notification_record(notification.id)
    if result["success"]:
        return {"message": result["message"]}
    return {"error": result["error"]}

@router.delete("/{notification_id}")
def delete_notification(notification_id: UUID):
    result = delete_notification_record(notification_id)
    if result["success"]:
        return {"message": result["message"]}
    return {"error": result["error"]}