# seed/seed_logs.py
import random
from datetime import datetime, timedelta, timezone
from app.supabase.supabaseClient import supabase

def seed_logs(supply_ids: dict, num_logs: int = 50):
    logs = []
    now = datetime.now(timezone.utc)

    # Define coherent usage patterns (e.g., snacks are consumed every Monday/Friday morning)
    weekday_usage_map = {
        0: 0.2,  # Monday
        1: 0.05,  # Tuesday
        2: 0.05,  # Wednesday
        3: 0.1,  # Thursday
        4: 0.2,  # Friday
        5: 0.05,  # Saturday
        6: 0.05   # Sunday
    }

    for _ in range(num_logs):
        supply_name = random.choice(list(supply_ids.keys()))
        supply_id = supply_ids[supply_name]

        # Get current stock and max stock
        stock_response = supabase.from_("supplies").select("current_stock, max_stock").eq("id", supply_id).single().execute()
        if not stock_response.data:
            print(f"⚠️ Supply with ID {supply_id} not found. Skipping...")
            continue

        current_stock = stock_response.data["current_stock"]
        max_stock = stock_response.data["max_stock"]

        # Assign realistic timestamp
        days_ago = random.randint(0, 60)
        timestamp = now - timedelta(days=days_ago)

        # Usage simulation bias
        weekday_weights = [weekday_usage_map[i] for i in range(7)]
        biased_weekday = random.choices(range(7), weights=weekday_weights, k=1)[0]
        while timestamp.weekday() != biased_weekday:
            timestamp -= timedelta(days=1)

        # Simulate usage
        change = -random.randint(1, 30)
        if current_stock + change < 0:
            change = -current_stock
        message = f"Consumed {abs(change)} units of {supply_name}"
        updated_stock = current_stock + change

        # Restock if below threshold
        if updated_stock < (0.2 * max_stock):
            restock_change = max_stock - updated_stock
            restock_message = f"Auto-restocked {restock_change} units to reach full capacity for {supply_name}"
            restock_timestamp = timestamp + timedelta(hours=1)

            # Apply restock
            updated_stock = max_stock
            supabase.from_("supplies").update({
                "current_stock": updated_stock,
                "updated_at": now.isoformat()
            }).eq("id", supply_id).execute()

            # Log restock
            logs.append({
                "supply_id": supply_id,
                "user_id": None,
                "change": restock_change,
                "reason": "restock",
                "message": restock_message,
                "timestamp": restock_timestamp.isoformat()
            })
        else:
            # Update stock value
            supabase.from_("supplies").update({
                "current_stock": updated_stock,
                "updated_at": now.isoformat()
            }).eq("id", supply_id).execute()

        # Log usage
        logs.append({
            "supply_id": supply_id,
            "user_id": None,
            "change": change,
            "reason": "usage",
            "message": message,
            "timestamp": timestamp.isoformat()
        })

    response = supabase.from_("supply_logs").insert(logs).execute()
    print(f"\n✅ Smart-seeded {len(logs)} coherent supply usage and restock log entries")