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
from google.cloud import recaptchaenterprise_v1
from datetime import datetime, timedelta
from geopy.geocoders import Nominatim

# --- GEOLOCATOR ---
geolocator = Nominatim(user_agent="APlusAcademy/1.0")

# --- FASTAPI APP ---
app = FastAPI(title="APlus Home Tutors API", version="4.1.0")

# --- CORS CONFIG ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------
#           GOOGLE SHEETS SETUP
# -----------------------------------------
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
GOOGLE_SHEETS_SERVICE_ACCOUNT = json.loads(os.environ["SERVICE_ACCOUNT_JSON"])
creds = Credentials.from_service_account_info(GOOGLE_SHEETS_SERVICE_ACCOUNT, scopes=SCOPES)
gspread_client = gspread.authorize(creds)
SHEET_ID = "1wBmbImTrliHEIKk5YxM5PN4eOfkz6XLS28bjxRjmZvY"
sheet = gspread_client.open_by_key(SHEET_ID).sheet1
cached_tutors = []
last_fetch_time = datetime.min
CACHE_DURATION = timedelta(minutes=5)

# -----------------------------------------
#              IMGBB CONFIG
# -----------------------------------------
IMGBB_API_KEY = os.environ.get("IMGBB_API_KEY", "")

# -----------------------------------------
#      LOCATION JSON (province > district > tehsil)
# -----------------------------------------
LOCATIONS_FILE = os.path.join(os.path.dirname(__file__), "locations.json")
with open(LOCATIONS_FILE, "r", encoding="utf-8") as f:
    pakistan_data = json.load(f)

# -----------------------------------------
#       GOOGLE RECAPTCHA ENTERPRISE
# -----------------------------------------
RECAPTCHA_PROJECT_ID = os.environ.get("GCLOUD_PROJECT_ID")
RECAPTCHA_SITE_KEY = os.environ.get("RECAPTCHA_SITE_KEY")
RECAPTCHA_SERVICE_ACCOUNT = json.loads(os.environ["RECAPTCHA_API_KEY_JSON"])

recaptcha_client = recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient.from_service_account_info(
    RECAPTCHA_SERVICE_ACCOUNT
)

# --------------------------
# Generate token placeholder for frontend
# --------------------------
@app.get("/recaptcha/token")
def generate_recaptcha_token(action: str = Query(...)):
    """
    Return SITE_KEY for frontend. The frontend JS SDK will use this.
    """
    return {"site_key": RECAPTCHA_SITE_KEY, "token": f"placeholder-token-for-{action}"}

# --------------------------
# Verify reCAPTCHA token
# --------------------------
def verify_recaptcha(token: str, expected_action: str):
    try:
        # Create the Event object
        event = recaptchaenterprise_v1.Event(token=token, site_key=RECAPTCHA_SITE_KEY)
        assessment = recaptchaenterprise_v1.Assessment(event=event)
        request = recaptchaenterprise_v1.CreateAssessmentRequest(
            parent=f"projects/{RECAPTCHA_PROJECT_ID}", assessment=assessment
        )
        response = recaptcha_client.create_assessment(request=request)

        # Validate token
        if not response.token_properties.valid:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid reCAPTCHA token: {response.token_properties.invalid_reason}",
            )
        if response.token_properties.action != expected_action:
            raise HTTPException(status_code=400, detail="Invalid reCAPTCHA action")
        if response.risk_analysis.score < 0.5:
            raise HTTPException(status_code=400, detail="reCAPTCHA verification failed (bot detected)")

        return True
    except Exception as e:
        print("⚠️ reCAPTCHA validation error:", e)
        raise HTTPException(status_code=400, detail="reCAPTCHA validation error")


# -----------------------------------------
#      UTILITY FUNCTIONS
# -----------------------------------------
def random_point_within_radius(center_lat, center_lng, radius_m=1000):
    radius_in_degrees = radius_m / 111320.0
    u = random.random()
    v = random.random()
    w = radius_in_degrees * math.sqrt(u)
    t = 2 * math.pi * v
    lat_offset = w * math.cos(t)
    lng_offset = w * math.sin(t) / math.cos(math.radians(center_lat))
    return round(center_lat + lat_offset, 6), round(center_lng + lng_offset, 6)

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

# -----------------------------------------
#           ROUTES
# -----------------------------------------
@app.get("/")
def home():
    return {"message": "APlus API running with reCAPTCHA Enterprise!"}

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

# --------------------------
# TUTOR REGISTRATION
# --------------------------
@app.post("/tutors/register")
async def register_tutor(
    recaptcha_token: str = Form(...),
    name: str = Form(...),
    subject: str = Form(None),
    major_subjects: str = Form(None),
    qualification: str = Form(...),
    experience: int = Form(...),
    phone: str = Form(...),
    bio: str = Form(...),
    exactLocation: str = Form(None),
    lat: str = Form(None),
    lng: str = Form(None),
    image: UploadFile = File(None),
    profile_url: str = Form(None),
):
    try:
        # ✅ Verify reCAPTCHA token
        verify_recaptcha(recaptcha_token, "tutor_register")

        # --- Image upload ---
        image_url = "N/A"
        if image and image.filename:
            image_bytes = await image.read()
            encoded_image = base64.b64encode(image_bytes).decode("utf-8")
            payload = {"key": IMGBB_API_KEY, "image": encoded_image, "name": image.filename}
            response = requests.post("https://api.imgbb.com/1/upload", data=payload)
            result = response.json()
            if result.get("success"):
                raw_url = result["data"]["url"]
                image_url = f"https://cold-truth-e620.irfan-karor-mi.workers.dev/?url={raw_url}"

        # --- Determine coordinates ---
        if lat and lng:
            latitude, longitude = float(lat), float(lng)
        else:
            latitude, longitude = (None, None)
            if exactLocation:
                latitude, longitude = None, None  # Can implement geocoding

        # --- Reverse geocode ---
        city = district = province = tehsil = ""
        if latitude and longitude:
            try:
                location = geolocator.reverse(f"{latitude}, {longitude}", language="en", exactly_one=True)
                address = location.raw.get("address", {})
                city = address.get("city") or address.get("town") or address.get("village") or ""
                district = address.get("county") or ""
                province = address.get("state") or ""
                tehsil = address.get("suburb") or ""
            except Exception:
                pass

        area1 = area2 = area3 = city
        qualification_value = f"{qualification} {subject}" if subject else qualification
        major_subjects_str = major_subjects or ""

        # --- Append to Google Sheet ---
        sheet.append_row([
            name,
            subject or "",
            qualification_value,
            major_subjects_str,
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
            "No",
            datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            profile_url or ""
        ])

        return {
            "message": "Tutor registered successfully!",
            "image_url": image_url,
            "province": province,
            "district": district,
            "tehsil": tehsil,
            "city": city,
            "areas": [area1, area2, area3],
            "coordinates": {"lat": latitude, "lng": longitude},
            "profile_url": profile_url or ""
        }

    except Exception as e:
        print("❌ Error submitting tutor form:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------------------------
# GET VERIFIED TUTORS
# ---------------------------------------------------------
@app.get("/tutors")
def get_tutors():
    global cached_tutors, last_fetch_time
    now = datetime.utcnow()
    if now - last_fetch_time < CACHE_DURATION:
        return cached_tutors

    try:
        records = sheet.get_all_records(empty2zero=False, head=1)
        verified = []
        for r in records:
            if str(r.get("Verified", "")).strip().lower() != "yes":
                continue

            def safe_str(v): return str(v).strip() if v else ""
            subjects_list = []
            if safe_str(r.get("Subject")):
                subjects_list.append(safe_str(r.get("Subject")))
            if safe_str(r.get("Major Subjects")):
                subjects_list.extend([s.strip() for s in safe_str(r.get("Major Subjects")).split(",") if s.strip()])

            verified.append({
                "Name": safe_str(r.get("Name")),
                "Subjects": subjects_list,
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
                "Verified": "Yes"
            })

        cached_tutors = verified
        last_fetch_time = now
        return verified

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------------------------
# GET SINGLE TEACHER
# ---------------------------------------------------------
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

        def safe_str(val): return str(val).strip() if val is not None else ""
        subjects_list = []
        if safe_str(teacher.get("Subject")):
            subjects_list.append(safe_str(teacher.get("Subject")))
        if safe_str(teacher.get("Major Subjects")):
            subjects_list.extend([s.strip() for s in safe_str(teacher.get("Major Subjects")).split(",") if s.strip()])

        return {
            "Name": safe_str(teacher.get("Name")),
            "Subjects": subjects_list,
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
