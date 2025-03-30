from datetime import datetime, timedelta, timezone
from uuid import uuid4
import random

from app.supabase.supabaseClient import supabase  # Adjust path as needed

def generate_event_seeds():
    now = datetime.now(timezone.utc)
    seeds = []

    # Weekly recurring team syncs
    for week in range(4):
        start = now + timedelta(days=(1 + 7 * week), hours=9)
        end = start + timedelta(minutes=45)
        seeds.append({
            "title": "Weekly Team Sync",
            "description": "Discuss project progress and blockers",
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
            "type": "meeting",
            "estimated_duration": 45,
            "attendees": ["Maria", "Devon", "Kira"],
            "notes": None,
        })

    # Monthly cleaning
    cleaning_date = now + timedelta(days=5)
    seeds.append({
        "title": "Monthly Cleaning Session",
        "description": "Routine deep cleaning of common areas",
        "start_time": (cleaning_date.replace(hour=14)).isoformat(),
        "end_time": (cleaning_date.replace(hour=16)).isoformat(),
        "type": "cleaning",
        "estimated_duration": 120,
        "attendees": ["Maintenance Crew"],
        "notes": "Focus on windows and air vents",
    })

    # Random maintenance tasks
    seeds.append({
        "title": "AC Filter Maintenance",
        "description": "Change filters in west wing units",
        "start_time": (now + timedelta(days=7, hours=10)).isoformat(),
        "end_time": (now + timedelta(days=7, hours=11)).isoformat(),
        "type": "maintenance",
        "estimated_duration": 60,
        "attendees": ["Facilities"],
        "notes": "Last changed 3 months ago",
    })

    seeds.append({
        "title": "Elevator Inspection",
        "description": "Routine safety check",
        "start_time": (now + timedelta(days=9, hours=8)).isoformat(),
        "end_time": (now + timedelta(days=9, hours=9)).isoformat(),
        "type": "maintenance",
        "estimated_duration": 60,
        "attendees": ["Safety Inspector"],
        "notes": "Ensure proper signage is posted",
    })

    # Scattered user meetings and reminders
    for i in range(5):
        offset_days = random.randint(0, 20)
        start = now + timedelta(days=offset_days, hours=random.randint(9, 15))
        end = start + timedelta(minutes=random.choice([30, 60, 90]))
        seeds.append({
            "title": f"Project Sync #{i+1}",
            "description": f"Catch-up on project phase {i+1}",
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
            "type": "meeting",
            "estimated_duration": (end - start).seconds // 60,
            "attendees": ["Devon", "Kira"],
            "notes": None,
        })

    # Notes scattered throughout
    notes = [
        "Reminder: Check fire extinguisher expiration dates",
        "Buy red/blue whiteboard markers",
        "Schedule intern onboarding",
        "Post weekly bulletin",
        "Reserve cafeteria for team lunch",
    ]

    for i, note in enumerate(notes):
        dt = now + timedelta(days=random.randint(0, 15))
        seeds.append({
            "title": f"Note #{i+1}",
            "description": note,
            "start_time": dt.isoformat(),
            "end_time": dt.isoformat(),
            "type": "note",
            "estimated_duration": 0,
            "attendees": None,
            "notes": note,
        })

    return seeds

def seed_events():
    rows = []
    now = datetime.now(timezone.utc).isoformat()
    event_seeds = generate_event_seeds()

    for event in event_seeds:
        rows.append({
            "id": str(uuid4()),
            "created_at": now,
            **event
        })

    response = supabase.table("events").insert(rows).execute()
    if response.error:
        print("❌ Failed to seed events:", response.error.message)
    else:
        print(f"✅ Seeded {len(rows)} events successfully.")

if __name__ == "__main__":
    seed_events()
