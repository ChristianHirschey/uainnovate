from app.supabase.supabaseClient import supabase
from app.models.log import Log

def get_all_logs() -> dict:
    try:
        response = supabase.from_("supply_logs").select("*").execute()

        if hasattr(response, "data") and response.data:
            filtered_data = [
                {
                    "message": log.get("message"),
                    "supply_id": log.get("supply_id"),
                    "user_id": log.get("user_id"),
                    "change": log.get("change"),
                    "reason": log.get("reason"),
                    "timestamp": log.get("timestamp"),
                }
                for log in response.data
            ]
            return {"success": True, "message": 'Logs retrieved successfully', "data": filtered_data}
        
        return {
            "success": False,
            "error": "No logs found or query failed.",
        }
    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}