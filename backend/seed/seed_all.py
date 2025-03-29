from seed.seed_supplies import seed_supplies
from seed.seed_logs import seed_logs

def run_all_seeds():
    supply_ids = seed_supplies()
    seed_logs(supply_ids, num_logs=100)  # you can increase this number

if __name__ == "__main__":
    run_all_seeds()
