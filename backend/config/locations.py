import os, json

LOCATIONS_FILE = os.path.join(os.path.dirname(__file__), "..", "locations.json")
with open(LOCATIONS_FILE, "r", encoding="utf-8") as f:
    pakistan_data = json.load(f)
