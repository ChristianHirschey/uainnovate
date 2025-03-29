# seed/seed_logs.py
import random
from datetime import datetime, timedelta, timezone
from app.supabase.supabaseClient import supabase

def seed_logs(supply_ids: dict, num_logs: int = 50):
    reasons = ["restock", "usage", "audit", "correction"]
    logs = []
    now = datetime.now(timezone.utc)

    for _ in range(num_logs):
        supply_name = random.choice(list(supply_ids.keys()))
        supply_id = supply_ids[supply_name]
        reason = random.choice(reasons)

        # Get current stock and max stock
        stock_response = supabase.from_("supplies").select("current_stock, max_stock").eq("id", supply_id).single().execute()
        current_stock = stock_response.data["current_stock"] if stock_response.data else 0
        max_stock = stock_response.data["max_stock"] if stock_response.data else 100

        if reason == "restock":
            change = random.randint(5, 50)
            if current_stock + change > max_stock:
                change = max_stock - current_stock  # cap to max_stock
            message = f"Restocked {change} units of {supply_name}"
        elif reason == "usage":
            change = -random.randint(1, 30)
            if current_stock + change < 0:
                change = -current_stock  # consume only what exists
            message = f"Consumed {abs(change)} units of {supply_name}"
        elif reason == "audit":
            change = random.randint(-10, 10)
            if current_stock + change < 0:
                change = -current_stock
            elif current_stock + change > max_stock:
                change = max_stock - current_stock
            message = f"Stock adjustment of {change} units during audit for {supply_name}"
        else:  # correction
            change = random.randint(-5, 5)
            if current_stock + change < 0:
                change = -current_stock
            elif current_stock + change > max_stock:
                change = max_stock - current_stock
            message = f"Manual correction of {change} units for {supply_name}"

        # Update the stock value in the DB
        updated_stock = current_stock + change
        supabase.from_("supplies").update({
            "current_stock": updated_stock,
            "updated_at": now.isoformat()
        }).eq("id", supply_id).execute()

        log_entry = {
            "supply_id": supply_id,
            "user_id": None,  # Add users if needed
            "change": change,
            "reason": reason,
            "message": message,
            "timestamp": (now - timedelta(days=random.randint(0, 60))).isoformat()
        }
        logs.append(log_entry)

    response = supabase.from_("supply_logs").insert(logs).execute()
    print(f"\n✅ Smart-seeded {len(logs)} supply log entries with live stock updates")
