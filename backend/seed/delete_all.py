from app.supabase.supabaseClient import supabase  # adjust import if needed

TABLES = ["events", "supply_logs", "requests", "supplies"]

def delete_all_seed_data():
    for table in TABLES:
        print(f"🔸 Deleting from '{table}'...")
        supabase.from_(table).delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()

if __name__ == "__main__":
    delete_all_seed_data()
