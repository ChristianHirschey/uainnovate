from datetime import datetime, timedelta, timezone
from uuid import uuid4

from app.supabase.supabaseClient import supabase  # Adjust if your path differs

event_seeds = [
    {
        "title": "Weekly Team Sync",
        "description": "Discuss project progress and blockers",
        "start_time": (datetime.now(timezone.utc) + timedelta(days=1, hours=9)).isoformat(),
        "end_time": (datetime.now(timezone.utc) + timedelta(days=1, hours=9, minutes=45)).isoformat(),
        "type": "meeting",
        "estimated_duration": 45,
        "attendees": ["Maria", "Devon", "Kira"],
        "notes": None,
    },
    {
        "title": "Monthly Cleaning Session",
        "description": "Routine deep cleaning of common areas",
        "start_time": (datetime.now(timezone.utc) + timedelta(days=5, hours=14)).isoformat(),
        "end_time": (datetime.now(timezone.utc) + timedelta(days=5, hours=16)).isoformat(),
        "type": "cleaning",
        "estimated_duration": 120,
        "attendees": ["Maintenance Crew"],
        "notes": "Focus on windows and air vents",
    },
    {
        "title": "AC Filter Maintenance",
        "description": "Change filters in west wing units",
        "start_time": (datetime.now(timezone.utc) + timedelta(days=7, hours=10)).isoformat(),
        "end_time": (datetime.now(timezone.utc) + timedelta(days=7, hours=11)).isoformat(),
        "type": "maintenance",
        "estimated_duration": 60,
        "attendees": ["Facilities"],
        "notes": "Last changed 3 months ago",
    },
    {
        "title": "Request: Move tables to Room B",
        "description": "User request to shift layout",
        "start_time": (datetime.now(timezone.utc) - timedelta(days=1, hours=15)).isoformat(),
        "end_time": (datetime.now(timezone.utc) - timedelta(days=1, hours=16)).isoformat(),
        "type": "delivery",  # changed from "request"
        "estimated_duration": 60,
        "attendees": ["Logistics"],
        "notes": "Confirm room is free",
    },
    {
        "title": "Reminder: Reorder markers",
        "description": "Note for admin",
        "start_time": datetime.now(timezone.utc).isoformat(),
        "end_time": datetime.now(timezone.utc).isoformat(),
        "type": "note",
        "estimated_duration": 0,
        "attendees": None,
        "notes": "Out of red + blue markers",
    },
]

def seed_events():
    rows = []
    now = datetime.now(timezone.utc).isoformat()
    for event in event_seeds:
        rows.append({
            "id": str(uuid4()),
            "created_at": now,
            **event
        })

    response = supabase.table("events").insert(rows).execute()
    print(response)

if __name__ == "__main__":
    seed_events()
