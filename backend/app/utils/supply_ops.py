# app/utils/supply_ops.py

from typing import Optional
from app.supabase.supabaseClient import supabase
from app.models.supply import SupplyCreate, SupplyUpdate, SupplyOut
from datetime import datetime, timezone

def create_supply_record(supply: SupplyCreate) -> dict:
    try:
        response = supabase.from_("supplies").insert(supply.dict()).execute()
        if hasattr(response, "data") and response.data:
            return {"success": True, "message": "Supply added", "id": response.data[0].get("id")}
        return {"success": False, "error": "Insert failed. No data returned."}
    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}


def get_all_supplies():
    try:
        response = supabase.from_("supplies").select("*").execute()
        return response.data or []
    except Exception as e:
        print("Exception:", e)
        return []


def get_supply_by_id(supply_id: str):
    try:
        response = supabase.from_("supplies").select("*").eq("id", supply_id).single().execute()
        return response.data
    except Exception as e:
        print("Exception:", e)
        return None


def update_supply(supply_id: str, supply: SupplyUpdate):
    try:
        update_data = supply.dict(exclude_unset=True)

        # Convert datetime to string
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

        response = (
            supabase
            .from_("supplies")
            .update(update_data)
            .eq("id", supply_id)
            .execute()
        )

        if hasattr(response, "data") and response.data:
            return {"success": True, "data": response.data}

        return {"success": False, "error": "No data returned from update"}

    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}


def delete_supply(supply_id: str):
    try:
        response = supabase.from_("supplies").delete().eq("id", supply_id).execute()
        if hasattr(response, "data") and response.data:
            return {"success": True, "message": "Supply deleted"}
        return {"success": False, "error": "Supply not found"}
    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}
    

def restock_supply(supply_id: str, quantity: int, user_id: Optional[str] = None):
    try:
        supply = get_supply_by_id(supply_id)
        if not supply:
            return {"success": False, "error": "Supply not found"}

        new_stock = supply["current_stock"] + quantity

        # Update stock
        update_result = update_supply(supply_id, SupplyUpdate(current_stock=new_stock))
        if not update_result.get("success"):
            return {"success": False, "error": "Failed to update stock"}

        # Log restock
        supabase.from_("supply_logs").insert({
            "supply_id": supply_id,
            "user_id": user_id,
            "change": quantity,
            "reason": "restock",
            "message": f"Restocked {quantity} units",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }).execute()

        return {"success": True, "new_stock": new_stock}

    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}


def consume_supply(supply_id: str, quantity: int, user_id: Optional[str] = None):
    try:
        supply = get_supply_by_id(supply_id)
        if not supply:
            return {"success": False, "error": "Supply not found"}

        if supply["current_stock"] < quantity:
            return {"success": False, "error": "Not enough stock"}

        new_stock = supply["current_stock"] - quantity

        # Update stock
        update_result = update_supply(supply_id, SupplyUpdate(current_stock=new_stock))
        if not update_result.get("success"):
            return {"success": False, "error": "Failed to update stock"}

        # Log usage
        supabase.from_("supply_logs").insert({
            "supply_id": supply_id,
            "user_id": user_id,
            "change": -quantity,
            "reason": "usage",
            "message": f"Consumed {quantity} units",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }).execute()

        return {"success": True, "new_stock": new_stock}

    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}


def get_supplies_below_threshold():
    try:
        # Grab all supplies
        response = supabase.from_("supplies").select("*").execute()

        if not hasattr(response, "data"):
            return []

        all_supplies = response.data

        # Manually filter: current_stock <= threshold
        low_stock = [
            supply for supply in all_supplies
            if supply["current_stock"] <= supply["threshold"]
        ]

        return low_stock

    except Exception as e:
        print("Exception in get_supplies_below_threshold:", e)
        return []