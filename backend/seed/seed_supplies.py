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
            "purchase_url": "https://www.amazon.com/Doritos-Ranch-Flavored-Tortilla-Chips/dp/B07262XS4K/ref=asc_df_B07262XS4K?mcid=f2f712ac07573787a83b1929038bf62a&hvocijid=16444628032395614288-B07262XS4K-&hvexpln=73&tag=hyprod-20&linkCode=df0&hvadid=721245378154&hvpos=&hvnetw=g&hvrand=16444628032395614288&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1013139&hvtargid=pla-2281435175938&th=1",
            "purchase_price": 21.86
        },
        {
            "name": "Printer Paper",
            "description": "500-sheet white reams",
            "current_stock": 300,
            "max_stock": 500,
            "threshold": 100,
            "unit": "reams",
            "purchase_url": "https://www.staples.com/staples-multiuse-copy-paper-8-5-x-11-20-lbs-94-brightness-500-sheets-ream-8-reams-carton-26860-cc/product_1149611",
            "purchase_price": 41.99
        },
        {
            "name": "Sticky Notes",
            "description": "3x3 yellow, 100 sheets per pad",
            "current_stock": 50,
            "max_stock": 100,
            "threshold": 20,
            "unit": "pads",
            "purchase_url": "https://www.staples.com/staples-recycled-sticky-notes-3-x-3-sunshine-collection-100-sheets-pad-18-pads-pack-s-33yr18-52569/product_860852",
            "purchase_price": 9.79
        },
        {
            "name": "Coffee Pods",
            "description": "Medium roast, single-serve",
            "current_stock": 24,
            "max_stock": 100,
            "threshold": 30,
            "unit": "pods",
            "purchase_url": "https://www.staples.com/pick-me-up-provisions-french-roast-k-cup-pods-24-per-box-52966/product_24323958",
            "purchase_price": 8.99
        },
        {
            "name": "Pens",
            "description": "Blue ink, box of 12",
            "current_stock": 60,
            "max_stock": 120,
            "threshold": 25,
            "unit": "boxes",
            "purchase_url": "https://www.staples.com/staples-progel-retractable-gel-pen-fine-point-0-7mm-blue-ink-36-pack-st62108/product_24581661",
            "purchase_price": 35.99
        },
        {
            "name": "Whiteboard Markers",
            "description": "Assorted colors, low-odor",
            "current_stock": 15,
            "max_stock": 40,
            "threshold": 10,
            "unit": "packs",
            "purchase_url": "https://www.staples.com/expo-dry-erase-markers-chisel-tip-assorted-4-pack-80174/product_379465?cid=ps:gs:dot:nb:pla:os&gad_source=1&gclid=Cj0KCQjw16O_BhDNARIsAC3i2GBYZlTmvZOYfYn05cymgUsCh_Ye9ne1t8j2wAkz9jSfCH4l4GNXV2AaAoI_EALw_wcB",
            "purchase_price": 5.49
        },
        {
            "name": "Sanitizing Wipes",
            "description": "Lemon scent, 75 count",
            "current_stock": 5,
            "max_stock": 25,
            "threshold": 5,
            "unit": "canisters",
            "purchase_url": "https://www.staples.com/clorox-disinfecting-wipes-value-pack-75-wipes-container-3-pack-30208/product_1949018?cid=ps:gs:dot:nb:pla:clean&gad_source=1&gclid=Cj0KCQjw16O_BhDNARIsAC3i2GDkYHZQTKRA5d0gWPOC9uYH1vPEDDUajP7fAKb7nDZdVjcYmVTua7MaAlNkEALw_wcB",
            "purchase_price": 13.00
        },
        {
            "name": "Tissues",
            "description": "Facial tissues, 2-ply",
            "current_stock": 30,
            "max_stock": 60,
            "threshold": 10,
            "unit": "boxes",
            "purchase_url": "https://www.staples.com/kleenex-boutique-standard-facial-tissues-2-ply-90-sheets-box-6-pack-21271/product_826830?cid=ps:gs:dot:nb:pla:clean&gad_source=1&gclid=Cj0KCQjw16O_BhDNARIsAC3i2GCe3JB3UT-9_dBZMCBpGkeED22yiMl4IuYK6-GLnh3SsLzcEJ84n7AaApUwEALw_wcB",
            "purchase_price": 19.19
        },
        {
            "name": "HDMI Cables",
            "description": "6ft, 4K-ready",
            "current_stock": 12,
            "max_stock": 30,
            "threshold": 5,
            "unit": "cables",
            "purchase_url": "https://www.staples.com/staples-tech-4ft-hdmi-to-hdmi-audio-video-cable-male-to-male-black-st62468/product_24589256?cid=ps:gs:dot:nb:pla:transtech&gad_source=1&gclid=Cj0KCQjw16O_BhDNARIsAC3i2GA1Jd7zhvwHPAY5bIJT3k974fuRDIKS9q1JN_IUzumRAJXhJBZZtXwaAs5_EALw_wcB",
            "purchase_price": 4.99
        },
        {
            "name": "Charging Cables (USB-C)",
            "description": "Fast-charging, braided",
            "current_stock": 20,
            "max_stock": 40,
            "threshold": 10,
            "unit": "cables",
            "purchase_url": "https://www.staples.com/staples-tech-usb-c-to-usb-c-charging-cable-3-3-ft-white-st62334/product_24584671?cid=ps:gs:dot:nb:pla:transtech&gad_source=1&gclid=Cj0KCQjw16O_BhDNARIsAC3i2GA4IkaU1gXiczvGAiDzF6NSM1WFK1KgY1zhC8q5lEBYdnJilKlHbeEaAiFmEALw_wcB",
            "purchase_price": 9.99
        },
        {
            "name": "Bottled Water",
            "description": "16.9 oz spring water",
            "current_stock": 72,
            "max_stock": 120,
            "threshold": 30,
            "unit": "bottles",
            "purchase_url": "https://www.staples.com/pure-life-purified-water-16-9-fl-oz-plastic-bottled-water-24-carton-110109/product_571863?cid=ps:gs:dot:nb:pla:fb&gad_source=1&gclid=Cj0KCQjw16O_BhDNARIsAC3i2GBYlFjYqQB1oBbBC0PMrlqMVdzmMa-OfccPLc_EF4HhcKEgcP5USv0aAkTUEALw_wcB",
            "purchase_price": 16.69
        },
        {
            "name": "Dry Erase Boards",
            "description": "11x17 portable size",
            "current_stock": 3,
            "max_stock": 10,
            "threshold": 2,
            "unit": "boards",
            "purchase_url": "https://www.staples.com/expo-block-eraser-81505/product_272153?cid=ps:gs:dot:nb:pla:furn&gad_source=1&gclid=Cj0KCQjw16O_BhDNARIsAC3i2GBO8dI_5C81r1_IANl8CC5wGVqp3Cjjg6NZdXFqAuxUUq43zF5-z-waArR_EALw_wcB",
            "purchase_price": 2.96
        },
        {
            "name": "Keyboard Batteries (AA)",
            "description": "High-capacity alkaline",
            "current_stock": 18,
            "max_stock": 40,
            "threshold": 8,
            "unit": "batteries",
            "purchase_url": "https://www.dickssportinggoods.com/p/duracell-coppertop-aa-alkaline-batteries-4-pack-17aj0u4pckxxxxxxxgaa/17aj0u4pckxxxxxxxgaa?color=",
            "purchase_price": 5.99
        },
        {
            "name": "USB Flash Drives",
            "description": "32GB 3.0 USB",
            "current_stock": 6,
            "max_stock": 20,
            "threshold": 4,
            "unit": "drives",
            "purchase_url": "https://www.amazon.com/Aiibe-Memory-Backup-Single-Laptop/dp/B08CGXYNKV/ref=asc_df_B08CGXYNKV?mcid=583957ada0e630109abca87f0e9120f4&hvocijid=15301884928193055525-B08CGXYNKV-&hvexpln=73&tag=hyprod-20&linkCode=df0&hvadid=721245378154&hvpos=&hvnetw=g&hvrand=15301884928193055525&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1013139&hvtargid=pla-2281435180778&psc=1",
            "purchase_price": 9.99
        },
        {
            "name": "Granola Bars",
            "description": "Assorted variety pack",
            "current_stock": 40,
            "max_stock": 80,
            "threshold": 15,
            "unit": "bars",
            "purchase_url": "https://www.walmart.com/ip/Nature-Valley-Oats-N-Honey-Cereal-Granola-Bars-18-ct/15686374?wmlspartner=wlpa&selectedSellerId=101086023&adid=2222222222715686374_101086023_174021560348_21529094779&wl0=&wl1=g&wl2=c&wl3=707830964045&wl4=pla-2334121596130&wl5=1013139&wl6=&wl7=&wl8=&wl9=pla&wl10=458668551&wl11=online&wl12=15686374_101086023&veh=sem&gad_source=1&gclid=Cj0KCQjw16O_BhDNARIsAC3i2GBBE8V21ZMLiu4KwMKNB1s2OzhQbJmYjTUVdRKLOOLjYqcv5bFjZT8aAnS6EALw_wcB",
            "purchase_price": 11.99
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
