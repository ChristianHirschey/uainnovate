from app.supabase.supabaseClient import supabase
from datetime import datetime, timezone

def seed_supplies():
    seed_data = [
        {
            "name": "Doritos Cool Ranch",
            "description": "Snack-sized office fuel",
            "current_stock": 8,
            "max_stock": 20,
            "threshold": 5,
            "unit": "bags",
            "purchase_url": "https://example.com/doritos",
            "purchase_price": 1.99
        },
        {
            "name": "Printer Paper",
            "description": "500-sheet white reams",
            "current_stock": 300,
            "max_stock": 500,
            "threshold": 100,
            "unit": "reams",
            "purchase_url": "https://example.com/paper",
            "purchase_price": 5.49
        },
        {
            "name": "Sticky Notes",
            "description": "3x3 yellow, 100 sheets per pad",
            "current_stock": 50,
            "max_stock": 100,
            "threshold": 20,
            "unit": "pads",
            "purchase_url": "https://example.com/stickies",
            "purchase_price": 2.49
        },
        {
            "name": "Coffee Pods",
            "description": "Medium roast, single-serve",
            "current_stock": 24,
            "max_stock": 100,
            "threshold": 30,
            "unit": "pods",
            "purchase_url": "https://example.com/coffee",
            "purchase_price": 0.79
        },
        {
            "name": "Ballpoint Pens",
            "description": "Blue ink, box of 12",
            "current_stock": 60,
            "max_stock": 120,
            "threshold": 25,
            "unit": "boxes",
            "purchase_url": "https://example.com/pens",
            "purchase_price": 3.99
        },
        {
            "name": "Whiteboard Markers",
            "description": "Assorted colors, low-odor",
            "current_stock": 15,
            "max_stock": 40,
            "threshold": 10,
            "unit": "packs",
            "purchase_url": "https://example.com/markers",
            "purchase_price": 4.49
        },
        {
            "name": "Sanitizing Wipes",
            "description": "Lemon scent, 75 count",
            "current_stock": 5,
            "max_stock": 25,
            "threshold": 5,
            "unit": "canisters",
            "purchase_url": "https://example.com/wipes",
            "purchase_price": 6.29
        },
        {
            "name": "Tissues",
            "description": "Facial tissues, 2-ply",
            "current_stock": 30,
            "max_stock": 60,
            "threshold": 10,
            "unit": "boxes",
            "purchase_url": "https://example.com/tissues",
            "purchase_price": 1.99
        },
        {
            "name": "HDMI Cables",
            "description": "6ft, 4K-ready",
            "current_stock": 12,
            "max_stock": 30,
            "threshold": 5,
            "unit": "cables",
            "purchase_url": "https://example.com/hdmi",
            "purchase_price": 7.99
        },
        {
            "name": "Charging Cables (USB-C)",
            "description": "Fast-charging, braided",
            "current_stock": 20,
            "max_stock": 40,
            "threshold": 10,
            "unit": "cables",
            "purchase_url": "https://example.com/usb-c",
            "purchase_price": 9.99
        },
        {
            "name": "Bottled Water",
            "description": "16.9 oz spring water",
            "current_stock": 72,
            "max_stock": 120,
            "threshold": 30,
            "unit": "bottles",
            "purchase_url": "https://example.com/water",
            "purchase_price": 0.89
        },
        {
            "name": "Dry Erase Boards",
            "description": "11x17 portable size",
            "current_stock": 3,
            "max_stock": 10,
            "threshold": 2,
            "unit": "boards",
            "purchase_url": "https://example.com/whiteboards",
            "purchase_price": 14.99
        },
        {
            "name": "Keyboard Batteries (AA)",
            "description": "High-capacity alkaline",
            "current_stock": 18,
            "max_stock": 40,
            "threshold": 8,
            "unit": "batteries",
            "purchase_url": "https://example.com/batteries",
            "purchase_price": 0.50
        },
        {
            "name": "USB Flash Drives",
            "description": "32GB 3.0 USB",
            "current_stock": 6,
            "max_stock": 20,
            "threshold": 4,
            "unit": "drives",
            "purchase_url": "https://example.com/flashdrive",
            "purchase_price": 6.99
        },
        {
            "name": "Granola Bars",
            "description": "Assorted variety pack",
            "current_stock": 40,
            "max_stock": 80,
            "threshold": 15,
            "unit": "bars",
            "purchase_url": "https://example.com/granola",
            "purchase_price": 0.99
        }
    ]

    supply_ids = {}
    now = datetime.now(timezone.utc).isoformat()

    for item in seed_data:
        item["created_at"] = now
        item["updated_at"] = now

        response = supabase.from_("supplies").insert(item).execute()
        if response.data:
            supply_ids[item["name"]] = response.data[0]["id"]
            print(f"Seeded: {item['name']}")
        else:
            print(f"Failed to insert: {item['name']}")

    return supply_ids


if __name__ == "__main__":
    seed_supplies()
