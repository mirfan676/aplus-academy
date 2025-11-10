import os
import json
import gspread
import requests
import base64
import traceback
import random
import math
from fastapi import FastAPI, Form, File, Query, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2.service_account import Credentials

app = FastAPI(title="APlus Home Tutors API", version="3.0.0")

# --- CORS CONFIG ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
IMGBB_API_KEY = os.environ.get("IMGBB_API_KEY", "")

# --- LOAD LOCATIONS JSON ---
LOCATIONS_FILE = os.path.join(os.path.dirname(__file__), "locations.json")
with open(LOCATIONS_FILE, "r", encoding="utf-8") as f:
    pakistan_data = json.load(f)

# --- Utility: Random nearby point ---
def random_point_within_radius(center_lat, center_lng, radius_m=1000):
    radius_in_degrees = radius_m / 111320.0
    u = random.random()
    v = random.random()
    w = radius_in_degrees * math.sqrt(u)
    t = 2 * math.pi * v
    lat_offset = w * math.cos(t)
    lng_offset = w * math.sin(t) / math.cos(math.radians(center_lat))
    return round(center_lat + lat_offset, 6), round(center_lng + lng_offset, 6)

# --- Utility: Get coordinates from OpenStreetMap ---
def get_area_coordinates(area_name: str, city: str, province: str):
    try:
        query = f"{area_name}, {city}, {province}, Pakistan"
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": query, "format": "json", "limit": 1}
        headers = {"User-Agent": "APlusAcademy/1.0"}
        res = requests.get(url, params=params, headers=headers, timeout=10)
        res.raise_for_status()
        data = res.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"⚠️ Error fetching coordinates for {area_name}: {e}")
    return None, None

# --- Utility: Fallback IP-based geolocation ---
def get_ip_geolocation(ip: str):
    try:
        url = f"https://ipapi.co/{ip}/json/"
        res = requests.get(url, timeout=8)
        if res.status_code == 200:
            data = res.json()
            return data.get("latitude"), data.get("longitude"), data.get("city"), data.get("region")
    except Exception as e:
        print("⚠️ IP geolocation error:", e)
    return None, None, None, None

# --- ROUTES ---
@app.get("/")
def home():
    return {"message": "APlus Home Tutors API is running with province-district-tehsil support!"}

@app.get("/locations")
def get_locations():
    return pakistan_data

@app.get("/districts")
def get_districts(province: str = Query(...)):
    return {"districts": list(pakistan_data.get(province, {}).keys())}

@app.get("/tehsils")
def get_tehsils(province: str = Query(...), district: str = Query(...)):
    return {"tehsils": list(pakistan_data.get(province, {}).get(district, {}).keys())}

@app.get("/areas")
def get_areas(province: str = Query(...), district: str = Query(...), tehsil: str = Query(...)):
    return {"areas": pakistan_data.get(province, {}).get(district, {}).get(tehsil, [])}

# --- Tutor Registration Endpoint ---
@app.post("/tutors/register")
async def register_tutor(
    request: Request,
    name: str = Form(...),
    subject: str = Form(...),
    major_subjects: str = Form(None),
    qualification: str = Form(...),
    experience: int = Form(...),
    province: str = Form(...),
    district: str = Form(...),
    tehsil: str = Form(...),
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
    profile_url: str = Form(None),
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

        # --- Determine default areas if missing ---
        default_areas = pakistan_data.get(province, {}).get(district, {}).get(tehsil, [])
        if not area1:
            area1 = default_areas[0] if len(default_areas) > 0 else city
        if not area2:
            area2 = default_areas[1] if len(default_areas) > 1 else area1
        if not area3:
            area3 = default_areas[2] if len(default_areas) > 2 else area1

        # --- Location logic ---
        if lat and lng:
            latitude, longitude = float(lat), float(lng)
        else:
            base_lat, base_lng = get_area_coordinates(exactLocation or area1, city, province)
            if not base_lat or not base_lng:
                client_ip = request.client.host
                base_lat, base_lng, ip_city, ip_region = get_ip_geolocation(client_ip)
                if not city and ip_city:
                    city = ip_city
                if not province and ip_region:
                    province = ip_region
            latitude, longitude = random_point_within_radius(base_lat, base_lng, 800) if base_lat else (None, None)

        # --- Save to Google Sheet ---
        sheet.append_row([
            name,
            subject if subject else major_subjects,
            qualification,
            experience,
            province,
            district,
            tehsil,
            city,
            phone,
            bio,
            area1,
            area2,
            area3,
            exactLocation or "",
            image_url,
            latitude or "",
            longitude or "",
            "No",  # Verified by default
            "",    # Date Added
            profile_url or ""
        ])

        return {
            "message": "✅ Tutor registered successfully!",
            "image_url": image_url,
            "province": province,
            "district": district,
            "tehsil": tehsil,
            "areas": [area1, area2, area3],
            "coordinates": {"lat": latitude, "lng": longitude},
            "profile_url": profile_url or ""
        }

    except Exception as e:
        print("❌ Error submitting tutor form:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# --- Get All Verified Tutors ---
@app.get("/tutors")
def get_tutors():
    try:
        records = sheet.get_all_records(empty2zero=False, head=1)
        verified_tutors = []

        for r in records:
            if not any(r.values()):
                continue
            if str(r.get("Verified", "")).strip().lower() != "yes":
                continue

            def safe_str(val):
                return str(val).strip() if val is not None else ""

            verified_tutors.append({
                "Name": safe_str(r.get("Name")),
                "Subject": safe_str(r.get("Subject")),
                "Qualification": safe_str(r.get("Qualification")),
                "Experience": safe_str(r.get("Experience")),
                "Province": safe_str(r.get("Province")),
                "District": safe_str(r.get("District")),
                "Tehsil": safe_str(r.get("Tehsil")),
                "City": safe_str(r.get("City")),
                "Bio": safe_str(r.get("Bio")),
                "Area1": safe_str(r.get("Area1")),
                "Area2": safe_str(r.get("Area2")),
                "Area3": safe_str(r.get("Area3")),
                "ExactLocation": safe_str(r.get("ExactLocation")),
                "Image URL": safe_str(r.get("Image URL")),
                "Latitude": safe_str(r.get("Latitude")),
                "Longitude": safe_str(r.get("Longitude")),
                "Profile URL": safe_str(r.get("Profile URL")),
                "Verified": "Yes",
            })

        return verified_tutors

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tutors: {str(e)}")

# --- Get Single Teacher ---
@app.get("/tutors/{teacher_id}")
def get_teacher(teacher_id: int):
    try:
        records = sheet.get_all_records(empty2zero=False, head=1)
        teacher = None
        for idx, r in enumerate(records):
            if idx == teacher_id:
                teacher = r
                break
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")

        def safe_str(val):
            return str(val).strip() if val is not None else ""

        return {
            "Name": safe_str(teacher.get("Name")),
            "Subject": safe_str(teacher.get("Subject")),
            "Qualification": safe_str(teacher.get("Qualification")),
            "Experience": safe_str(teacher.get("Experience")),
            "Province": safe_str(teacher.get("Province")),
            "District": safe_str(teacher.get("District")),
            "Tehsil": safe_str(teacher.get("Tehsil")),
            "City": safe_str(teacher.get("City")),
            "Bio": safe_str(teacher.get("Bio")),
            "Area1": safe_str(teacher.get("Area1")),
            "Area2": safe_str(teacher.get("Area2")),
            "Area3": safe_str(teacher.get("Area3")),
            "ExactLocation": safe_str(teacher.get("ExactLocation")),
            "Image URL": safe_str(teacher.get("Image URL")),
            "Latitude": safe_str(teacher.get("Latitude")),
            "Longitude": safe_str(teacher.get("Longitude")),
            "Profile URL": safe_str(teacher.get("Profile URL")),
            "Verified": safe_str(teacher.get("Verified")),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
