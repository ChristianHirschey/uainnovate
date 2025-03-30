from datetime import datetime, timedelta, timezone
from uuid import uuid4
import random

from app.supabase.supabaseClient import supabase  # Adjust the import if needed

TYPES = ["meeting", "maintenance", "cleaning", "delivery", "note"]
ATTENDEE_POOL = ["Maria", "Devon", "Kira", "Logistics", "Facilities", "Admin", "James", "Alex", "Sam"]

def random_attendees():
    return random.sample(ATTENDEE_POOL, k=random.randint(1, 4))

def generate_random_event():
    now = datetime.now(timezone.utc)

    # Get a weekday within the next 30 days, skipping weekends
    while True:
        days_offset = random.randint(-30, 30)
        proposed_date = now + timedelta(days=days_offset)
        if proposed_date.weekday() < 5:  # Monday-Friday only
            break

    # Pick an event start time between 8 AM and 5 PM
    valid_start_hours = list(range(8, 17))  # 8 AM to 4 PM latest start
    start_hour = random.choice(valid_start_hours)
    start_minute = random.choice([0, 15, 30, 45])  # quarter-hour precision

    start_time = proposed_date.replace(hour=start_hour, minute=start_minute, second=0, microsecond=0)
    duration_minutes = random.choice([15, 30, 45, 60, 90, 120])
    end_time = start_time + timedelta(minutes=duration_minutes)

    event_type = random.choice(TYPES)

    title_bank = {
        "meeting": ["Team Standup", "Project Kickoff", "Sprint Planning", "Weekly Sync", "1:1 Check-in"],
        "maintenance": ["Filter Replacement", "Power System Check", "Restroom Repair", "Vent Cleaning"],
        "cleaning": ["Janitorial Sweep", "Floor Mopping", "Trash Removal", "Monthly Sanitation"],
        "delivery": ["Supply Drop", "Hardware Arrival", "Desk Equipment Move", "Inventory Unload"],
        "note": ["Reminder: Marker Refill", "Note: Schedule Fire Drill", "Post-it Reorder", "Label new boxes"]
    }

    title = random.choice(title_bank[event_type])
    description = f"{title} scheduled as part of standard ops."
    attendees = random_attendees() if event_type != "note" else None
    notes = random.choice([
        None,
        "Bring checklist",
        "Coordinate with admin",
        "Check supplies before",
        "Ping Slack channel"
    ]) if event_type != "note" else description

    return {
        "id": str(uuid4()),
        "title": title,
        "description": description,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "type": event_type,
        "estimated_duration": duration_minutes,
        "attendees": attendees,
        "notes": notes,
        "created_at": now.isoformat()
    }

def seed_events():
    events = [generate_random_event() for _ in range(50)]

    response = supabase.table("events").insert(events).execute()
    if not hasattr(response, "data") or not response.data:
        print("❌ Failed to seed events")
    else:
        print(f"✅ Seeded {len(events)} events successfully")

if __name__ == "__main__":
    seed_events()
