from app.supabase.supabaseClient import supabase
from app.models.log import Log

def read_logs(log: Log) -> dict:
    try:
        response = supabase.from_("supply_logs").select({
            "message": log.message,
            "supply_id": log.supply_id,
            "user_id": log.user_id,
            "change": log.change,
            "reason": log.reason,
            "timestamp": log.timestamp
        }).execute()

        if hasattr(response, "data") and response.data:
            return {"success": True, "message": 'Logs retrieved successfully', "data": response.data}
        
        return {
            "success": False,
            "error": "No logs found or query failed.",
        }
    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}