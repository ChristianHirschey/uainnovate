# seed/seed_logs.py
import random
from datetime import datetime, timedelta, timezone
from app.supabase.supabaseClient import supabase

def seed_logs(supply_ids: dict, num_logs: int = 60):
    logs = []
    now = datetime.now(timezone.utc)

    weekday_usage_map = {
        0: 0.2,  # Monday
        1: 0.05,
        2: 0.05,
        3: 0.1,
        4: 0.2,  # Friday
        5: 0.05,
        6: 0.05,
    }

    understock_counter = {}  # supply_id -> count of under-threshold cycles

    for _ in range(num_logs):
        supply_name = random.choice(list(supply_ids.keys()))
        supply_id = supply_ids[supply_name]

        stock_response = supabase.from_("supplies").select("current_stock, max_stock").eq("id", supply_id).single().execute()
        if not hasattr(stock_response, "data") or not stock_response.data:
            print(f"⚠️ Supply with ID {supply_id} not found. Skipping...")
            continue

        current_stock = stock_response.data["current_stock"]
        max_stock = stock_response.data["max_stock"]

        days_ago = random.randint(0, 60)
        timestamp = now - timedelta(days=days_ago)

        weekday_weights = [weekday_usage_map[i] for i in range(7)]
        biased_weekday = random.choices(range(7), weights=weekday_weights, k=1)[0]
        while timestamp.weekday() != biased_weekday:
            timestamp -= timedelta(days=1)

        change = -random.randint(1, 30)
        if current_stock + change < 0:
            change = -current_stock
        updated_stock = current_stock + change

        # Decide restock timing
        threshold = 0.2 * max_stock
        supply_low = updated_stock < threshold

        restock = False
        if supply_low:
            understock_counter[supply_id] = understock_counter.get(supply_id, 0) + 1
            if understock_counter[supply_id] >= 2:  # wait 2 understock cycles
                restock = True
        else:
            understock_counter[supply_id] = 0

        # Apply usage update first
        supabase.from_("supplies").update({
            "current_stock": updated_stock,
            "updated_at": now.isoformat()
        }).eq("id", supply_id).execute()

        logs.append({
            "supply_id": supply_id,
            "user_id": None,
            "change": change,
            "reason": "usage",
            "message": f"Consumed {abs(change)} units of {supply_name}",
            "timestamp": timestamp.isoformat()
        })

        if restock:
            restock_change = max_stock - updated_stock
            restock_timestamp = timestamp + timedelta(hours=1)

            supabase.from_("supplies").update({
                "current_stock": max_stock,
                "updated_at": now.isoformat()
            }).eq("id", supply_id).execute()

            logs.append({
                "supply_id": supply_id,
                "user_id": None,
                "change": restock_change,
                "reason": "restock",
                "message": f"Auto-restocked {restock_change} units to reach full capacity for {supply_name}",
                "timestamp": restock_timestamp.isoformat()
            })

            understock_counter[supply_id] = 0  # reset counter after restock

    response = supabase.from_("supply_logs").insert(logs).execute()
    if hasattr(response, "data"):
        print(f"\n✅ Seeded {len(logs)} usage + delayed restock logs")
    else:
        print("❌ Failed to insert logs")

