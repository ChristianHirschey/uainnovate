# seed/seed_requests.py
from app.supabase.supabaseClient import supabase
from datetime import datetime, timezone

def seed_requests(poop):
    seed_data = [
        {
            "type": "supply",
            "description": "Replenish HDMI cables for conference room A.",
            "priority": "medium",
            "status": "open",
        },
        {
            "type": "maintenance",
            "description": "Fix flickering lights on second floor hallway.",
            "priority": "high",
            "status": "in_progress",
        },
        {
            "type": "suggestion",
            "description": "Install more recycling bins in the break room.",
            "priority": "low",
            "status": "open",
        },
        {
            "type": "supply",
            "description": "Order more sticky notes for design team.",
            "priority": "very_high",
            "status": "resolved",
        },
        {
            "type": "other",
            "description": "Team requests standing desks.",
            "priority": "high",
            "status": "open",
        },
    ]

    now = datetime.now(timezone.utc).isoformat()

    for req in seed_data:
        req["created_at"] = now
        req["resolved_at"] = now if req["status"] in ["resolved", "closed"] else None
        req["supply_id"] = None
        req["user_id"] = None

        response = supabase.from_("requests").insert(req).execute()
        if response.data:
            print(f"✅ Seeded request: {req['description']}")
        else:
            print(f"❌ Failed to insert request: {req['description']}")

if __name__ == "__main__":
    seed_requests()
