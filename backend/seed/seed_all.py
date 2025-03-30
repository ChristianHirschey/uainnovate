from seed.seed_supplies import seed_supplies
from seed.seed_logs import seed_logs
from seed.seed_calendar import seed_events
from delete_all import delete_all_seed_data

def run_all_seeds():
    delete_all_seed_data()
    supply_ids = seed_supplies()
    seed_logs(supply_ids, num_logs=100)  # you can increase this number
    seed_events()

if __name__ == "__main__":
    run_all_seeds()
