# app/utils/notification_ops.py

from app.supabase.supabaseClient import supabase
from app.models.notification import NotificationCreate, NotificationRead, NotificationUpdate, NotificationDelete
from uuid import UUID

def create_notification_record(notification: NotificationCreate) -> dict:
    try:
        response = supabase.from_("notifications").insert({
            "message": notification.message,
            "supply_id": notification.supply_id,
            "request_id": notification.request_id,
            "seen": notification.seen
        }).execute()

        if hasattr(response, "data") and response.data:
            return {"success": True, "message": "Notification added", "id": response.data[0].get("id")}

        return {
            "success": False,
            "error": "Insert failed. No data returned.",
        }

    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}
    
def read_notification_record(notification_id: UUID) -> dict:
    try:
        response = supabase.from_("notifications").select("*").eq("id", notification_id).execute()

        if hasattr(response, "data") and response.data:
            return {"success": True, "notification": response.data[0]}

        return {
            "success": False,
            "error": "No notification found with the given ID.",
        }

    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}
    
def read_all_notification_records() -> dict:
    try:
        response = supabase.from_("notifications").select("*").execute()

        if hasattr(response, "data") and response.data:
            return {"success": True, "notifications": response.data}
        
        return {
            "success": False,
            "error": "No notifications found.",
        }
    
    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}
    
def update_notification_record(notification_id: UUID) -> dict:
    try:
        response = supabase.from_("notifications").update({"seen": True}).eq("id", notification_id).execute()

        if hasattr(response, "data") and response.data:
            return {"success": True, "message": "Notification updated"}

        return {
            "success": False,
            "error": "Update failed. No data returned.",
        }

    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}
    
def delete_notification_record(notification_id: UUID) -> dict:
    try:
        response = supabase.from_("notifications").delete().eq("id", notification_id).execute()

        if hasattr(response, "data") and response.data:
            return {"success": True, "message": "Notification deleted"}

        return {
            "success": False,
            "error": "Delete failed. No data returned.",
        }

    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}