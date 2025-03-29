from app.supabase.supabaseClient import supabase
from app.models.request import Request
from uuid import UUID

def create_request_record(request: Request) -> dict:
    try:
        response = supabase.from_("requests").insert({
            "user_id": str(request.user_id) if request.user_id else None,
            "type": request.type.value,
            "description": request.description,
            "priority": request.priority.value,
            "status": request.status.value,
            "supply_id": str(request.supply_id) if request.supply_id else None,
            "created_at": request.created_at.isoformat() if request.created_at else None,
            "resolved_at": request.resolved_at.isoformat() if request.resolved_at else None,
        }).execute()

        if hasattr(response, "data") and response.data:
            return {"success": True, "message": "Supply added", "id": response.data[0].get("id")}

        return {
            "success": False,
            "error": "Insert failed. No data returned.",
        }

    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}
    
def get_all_requests() -> dict:
    try:
        response = supabase.from_("requests").select("*").execute()
        
        if hasattr(response, "data") and response.data:
            return {"success": True, "data": response.data}
        
        return {
            "success": False,
            "error": "No requests found."
        }
    
    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}
    
def get_request_by_id(request_id: UUID) -> dict:
    try:
        response = supabase.from_("requests").select("*").eq("id", request_id).execute()
        
        if hasattr(response, "data") and response.data:
            return {"success": True, "request": response.data[0]}

        return {
            "success": False,
            "error": "Request not found.",
        }
    
    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}