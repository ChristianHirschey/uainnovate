from app.supabase.supabaseClient import supabase
from app.models.calendar import EventCreate
from uuid import uuid4
from datetime import datetime, timezone

def get_all_events():
    try:
        response = supabase.table("events").select("*").order("start_time", desc=False).execute()
        if hasattr(response, "data") and response.data:
            return {"success": True, "data": response.data, "message": "Events retrieved"}  # ✅ this!
        
        return {"success": False, "error": "No events found."}
    except Exception as e:
        return {"success": False, "error": str(e)}


def create_event(event: EventCreate):
    try:
        new_id = str(uuid4())
        payload = {
            "id": new_id,
            "title": event.title,
            "description": event.description,
            "start_time": event.start.isoformat(),
            "end_time": event.end.isoformat(),
            "type": event.type,
            "estimated_duration": event.estimated_duration,
            "attendees": event.attendees,
            "supply_id": event.supply_id,
            "notes": event.notes,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        response = supabase.table("events").insert(payload).execute()
        if response.error:
            return {"success": False, "error": response.error.message}
        return {"success": True, "data": payload, "message": "Event created"}
    except Exception as e:
        return {"success": False, "error": str(e)}
