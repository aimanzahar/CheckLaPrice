import json
import os
from pathlib import Path

import requests
from dotenv import load_dotenv

# 1. SETUP YOUR CONFIGURATION
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(env_path)

API_TOKEN = os.getenv("API_TOKEN")
if not API_TOKEN:
    raise RuntimeError("Missing API_TOKEN in environment (.env)")

ACTOR_URL = f"https://api.apify.com/v2/acts/fatihtahta~shopee-scraper/run-sync-get-dataset-items?token={API_TOKEN}"

# 1. PASTE YOUR **NEW** RAW COOKIES HERE
# (Do not use the old ones, they are likely blocked)
raw_cookie_string = """PASTE_NEW_COOKIES_HERE"""

# --- HELPER: CONVERT STRING TO JSON ---
def convert_cookies_to_json(raw_string):
    cookie_list = []
    parts = raw_string.replace('\n', '').split(';')
    for part in parts:
        if '=' in part:
            name, value = part.strip().split('=', 1)
            cookie_obj = {
                "name": name.strip(),
                "value": value.strip(),
                "domain": ".shopee.com.my", 
                "path": "/"
            }
            cookie_list.append(cookie_obj)
    return json.dumps(cookie_list)

# 2. GENERATE COOKIES
formatted_cookies = convert_cookies_to_json(raw_cookie_string)

# 3. DEFINE INPUT 
# Switched to 'deep' mode and removed proxy config
payload = {
    "shopeeCookies": formatted_cookies,
    "searchKeywords": ["iphone 15"],
    "country": "MY",
    "scrapeMode": "deep",  # <--- CHANGED TO DEEP (Slower but safer)
    "maxProductsPerSearch": 10
}

# 4. SEND
print("Sending request in DEEP mode...")
try:
    response = requests.post(ACTOR_URL, json=payload)
    if response.status_code in [200, 201]:
        print("Success! Scraper is running.")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error {response.status_code}: {response.text}")
except Exception as e:
    print(e)