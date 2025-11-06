import os
import json
import gspread
from fastapi import FastAPI, Form, File, Query, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2.service_account import Credentials
import requests
import base64
import traceback
import random
import math
from functools import lru_cache
import time

app = FastAPI(title="APlus Home Tutors API", version="2.3.0")

# Cache tutors for 5 minutes
_tutor_cache = {"data": None, "timestamp": 0}

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace * with your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GOOGLE SHEETS SETUP ---
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
creds_dict = json.loads(os.environ["GOOGLE_CREDENTIALS"])
creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
gspread_client = gspread.authorize(creds)

SHEET_ID = "1wBmbImTrliHEIKk5YxM5PN4eOfkz6XLS28bjxRjmZvY"
sheet = gspread_client.open_by_key(SHEET_ID).sheet1

# --- IMGBB CONFIG ---
IMGBB_API_KEY = "5b09de418289beb41cde5d28d5934047"

# --- CITY AREAS ---
city_areas = {
    "Lahore": ["Gulberg", "DHA", "Johar Town", "Model Town", "Shadman"],
    "Karachi": ["Clifton", "PECHS", "Gulshan-e-Iqbal"],
    "Islamabad": ["F-6", "G-10", "Blue Area"],
    "Rawalpindi": ["Satellite Town", "Chaklala", "Bahria Town"],
    "Faisalabad": ["Madina Town", "Gulistan Colony", "People Colony"],
    "Multan": ["Shah Rukn-e-Alam", "Cantt", "Township"],
    "Peshawar": ["Hayatabad", "University Town", "Saddar"],
    "Quetta": ["Satellite Town", "Jinnah Town", "Sariab Road"],
    "Gujranwala": ["Bahria Town", "Civil Lines", "Cantt"],
    "Sialkot": ["Daska Road", "Model Town", "Cantt"],
}


# --- Utility: random point within given radius ---
def random_point_within_radius(center_lat, center_lng, radius_m=1000):
    radius_in_degrees = radius_m / 111320.0
    u = random.random()
    v = random.random()
    w = radius_in_degrees * math.sqrt(u)
    t = 2 * math.pi * v
    lat_offset = w * math.cos(t)
    lng_offset = w * math.sin(t) / math.cos(math.radians(center_lat))
    return round(center_lat + lat_offset, 6), round(center_lng + lng_offset, 6)


# --- Utility: Get area coordinates from OpenStreetMap ---
def get_area_coordinates(area_name: str, city: str):
    try:
        query = f"{area_name}, {city}, Pakistan"
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": query, "format": "json", "limit": 1}
        headers = {"User-Agent": "APlusAcademy/1.0"}
        res = requests.get(url, params=params, headers=headers, timeout=10)
        res.raise_for_status()
        data = res.json()
        if data and len(data) > 0:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"⚠️ Error fetching coordinates for {area_name}: {e}")
    return None, None


@app.get("/")
def home():
    return {"message": "✅ APlus Home Tutors API is running!"}


@app.post("/tutors/register")
async def register_tutor(
    name: str = Form(...),
    subject: str = Form(...),
    qualification: str = Form(...),
    experience: int = Form(...),
    city: str = Form(...),
    phone: str = Form(...),
    bio: str = Form(...),
    area1: str = Form(None),
    area2: str = Form(None),
    area3: str = Form(None),
    exactLocation: str = Form(None),
    lat: str = Form(None),
    lng: str = Form(None),
    image: UploadFile = File(None),
):
    try:
        image_url = "N/A"

        # --- Upload image to ImgBB ---
        if image and image.filename:
            image_bytes = await image.read()
            encoded_image = base64.b64encode(image_bytes).decode("utf-8")
            payload = {"key": IMGBB_API_KEY, "image": encoded_image, "name": image.filename}
            response = requests.post("https://api.imgbb.com/1/upload", data=payload)
            result = response.json()
            if result.get("success"):
                image_url = result["data"]["url"]
            else:
                print("❌ ImgBB upload failed:", result)

        # --- Default areas ---
        areas = city_areas.get(city, [city])
        if not area1:
            area1 = areas[0]
        if not area2:
            area2 = areas[1] if len(areas) > 1 else area1
        if not area3:
            area3 = areas[2] if len(areas) > 2 else area1

        # --- Coordinates ---
        if lat and lng:
            latitude, longitude = float(lat), float(lng)
        else:
            base_lat, base_lng = get_area_coordinates(exactLocation or area1, city)
            if base_lat and base_lng:
                latitude, longitude = random_point_within_radius(base_lat, base_lng, 1000)
            else:
                latitude, longitude = None, None

        # --- Save to Google Sheet ---
        sheet.append_row([
            name,
            subject,
            qualification,
            experience,
            city,
            phone,
            bio,
            area1,
            area2,
            area3,
            image_url,
            latitude or "",
            longitude or "",
        ])

        return {
            "message": "✅ Tutor registered successfully!",
            "image_url": image_url,
            "areas": [area1, area2, area3],
            "coordinates": {"lat": latitude, "lng": longitude},
        }

    except Exception as e:
        print("❌ Error submitting form:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/tutors")
def get_tutors(
    city: str = Query(None),
    subject: str = Query(None)
):
    try:
        global _tutor_cache
        now = time.time()
        if not _tutor_cache["data"] or now - _tutor_cache["timestamp"] > 300:
            records = sheet.get_all_values()
            headers = records[0]
            tutors = []
            for row in records[1:]:
                data = dict(zip(headers, row))
                if str(data.get("Verified", "")).strip().lower() == "yes":
                    tutors.append({
                        "Name": data.get("Name", ""),
                        "Subject": data.get("Subject", ""),
                        "Qualification": data.get("Qualification", ""),
                        "Experience": data.get("Experience", ""),
                        "City": data.get("City", ""),
                        "Phone": data.get("Phone", ""),
                        "Bio": data.get("Bio", ""),
                        "Area1": data.get("Area1", ""),
                        "Area2": data.get("Area2", ""),
                        "Area3": data.get("Area3", ""),
                        "Image URL": data.get("Image URL", ""),
                        "Latitude": data.get("Latitude", ""),
                        "Longitude": data.get("Longitude", ""),
                        "Verified": "Yes",
                    })
            _tutor_cache = {"data": tutors, "timestamp": now}

        tutors = _tutor_cache["data"]

        if city:
            tutors = [t for t in tutors if t["City"].lower() == city.lower()]
        if subject:
            tutors = [t for t in tutors if subject.lower() in t["Subject"].lower()]

        return tutors[:100]  # Limit to first 100
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/areas")
def get_areas(city: str = Query(..., description="City name")):
    return {"areas": city_areas.get(city, [city])}
