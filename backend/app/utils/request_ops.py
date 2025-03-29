#

from app.supabase.supabaseClient import supabase
from app.models.request import Request

def create_request_record(request: Request) -> dict:
    try:
        response = supabase.from_("requests").insert({
            "type": request.type,
            "description": request.description,
            "priority": request.priority,
            "status": request.status,
            "supply_id": request.supply_id,
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
