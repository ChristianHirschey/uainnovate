from app.supabase.supabaseClient import supabase
from app.models.log import Log

def read_logs() -> dict:
    try:
        response = supabase.from_("supply_logs").select("*").execute()
        if hasattr(response, "data") and response.data:
            filtered_data = [
                {key: value for key, value in log.items() if key != "id"}
                for log in response.data
            ]
            return {"success": True, "message": "Logs retrieved successfully", "data": filtered_data}
        
        return {
            "success": False,
            "error": "No logs found or query failed.",
        }
    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}