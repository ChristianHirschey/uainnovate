# app/utils/supply_ops.py

from app.supabase.supabaseClient import supabase
from app.models.supply import Supply

def create_supply_record(supply: Supply) -> dict:
    try:
        response = supabase.from_("supplies").insert({
            "name": supply.name,
            "description": supply.description,
            "current_stock": supply.current_stock,
            "max_stock": supply.max_stock,
            "threshold": supply.threshold,
            "unit": supply.unit,
            "purchase_url": supply.purchase_url,
            "purchase_price": supply.purchase_price
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
