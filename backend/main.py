import os
import json
import gspread
import requests
import base64
import traceback
import random
import math

from fastapi import FastAPI, Form, File, Query, UploadFile, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from google.oauth2.service_account import Credentials
from google.cloud import recaptchaenterprise_v1

from datetime import datetime, timedelta
from geopy.geocoders import Nominatim

# -----------------------------------------
#              FASTAPI APP
# -----------------------------------------
app = FastAPI(title="APlus Home Tutors API", version="4.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------
#              GOOGLE SHEETS
# -----------------------------------------
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
GOOGLE_SHEETS_SA = json.loads(os.environ["SERVICE_ACCOUNT_JSON"])

creds = Credentials.from_service_account_info(GOOGLE_SHEETS_SA, scopes=SCOPES)
gspread_client = gspread.authorize(creds)

SHEET_ID = "1wBmbImTrliHEIKk5YxM5PN4eOfkz6XLS28bjxRjmZvY"
sheet = gspread_client.open_by_key(SHEET_ID).sheet1

# Caches
cached_tutors_first12 = []
cached_tutors_full = []
preload_in_progress = False
CACHE_DURATION = timedelta(minutes=5)
last_fetch_time = datetime.min

# Preload settings
MAX_PRELOAD = 120
CHUNK_SIZE = 12

# -----------------------------------------
#              IMGBB
# -----------------------------------------
IMGBB_API_KEY = os.environ.get("IMGBB_API_KEY", "")

# -----------------------------------------
#       LOCATION JSON LOADING
# -----------------------------------------
LOCATIONS_FILE = os.path.join(os.path.dirname(__file__), "locations.json")
with open(LOCATIONS_FILE, "r", encoding="utf-8") as f:
    pakistan_data = json.load(f)

# -----------------------------------------
#       RECAPTCHA ENTERPRISE CLIENT
# -----------------------------------------
RECAPTCHA_PROJECT_ID = os.environ["GCLOUD_PROJECT_ID"]
RECAPTCHA_SITE_KEY = os.environ["RECAPTCHA_SITE_KEY"]
RECAPTCHA_SA_JSON = json.loads(os.environ["RECAPTCHA_SERVICE_ACCOUNT_JSON"])

recaptcha_client = recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient.from_service_account_info(
    RECAPTCHA_SA_JSON
)

# -----------------------------------------
#       GEOCODER
# -----------------------------------------
geolocator = Nominatim(user_agent="APlusAcademy/1.0")

# -----------------------------------------
#      HELPER: VERIFY RECAPTCHA
# -----------------------------------------
def verify_recaptcha(token: str, expected_action: str):
    try:
        event = recaptchaenterprise_v1.Event(
            token=token,
            site_key=RECAPTCHA_SITE_KEY,
        )
        assessment = recaptchaenterprise_v1.Assessment(event=event)
        request = recaptchaenterprise_v1.CreateAssessmentRequest(
            parent=f"projects/{RECAPTCHA_PROJECT_ID}",
            assessment=assessment,
        )
        response = recaptcha_client.create_assessment(request=request)
        props = response.token_properties
        if not props.valid:
            raise HTTPException(status_code=400, detail=f"Invalid token: {props.invalid_reason}")
        if props.action != expected_action:
            raise HTTPException(status_code=400, detail="Invalid reCAPTCHA action")
        score = response.risk_analysis.score
        if score < 0.5:
            raise HTTPException(status_code=400, detail="Bot detected (low score)")
        return True
    except Exception as e:
        print("❌ reCAPTCHA error:", e)
        raise HTTPException(status_code=400, detail="reCAPTCHA validation error")

# -----------------------------------------
#      UTIL: RANDOM POINT
# -----------------------------------------
def random_point_within_radius(center_lat, center_lng, radius_m=1000):
    radius_deg = radius_m / 111320.0
    u, v = random.random(), random.random()
    w = radius_deg * math.sqrt(u)
    t = 2 * math.pi * v
    lat_offset = w * math.cos(t)
    lng_offset = w * math.sin(t) / math.cos(math.radians(center_lat))
    return round(center_lat + lat_offset, 6), round(center_lng + lng_offset, 6)

# -----------------------------------------
#      UTIL: AREA COORDINATES
# -----------------------------------------
def get_area_coordinates(area_name: str, city: str, province: str):
    try:
        query = f"{area_name}, {city}, {province}, Pakistan"
        url = "https://nominatim.openstreetmap.org/search"
        res = requests.get(
            url,
            params={"q": query, "format": "json", "limit": 1},
            headers={"User-Agent": "APlusAcademy/1.0"},
            timeout=10
        )
        res.raise_for_status()
        data = res.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"⚠️ Coordinates error: {e}")
    return None, None

# -----------------------------------------
#      PRELOAD Teachers Data 
# -----------------------------------------
def preload_more_tutors():
    global cached_tutors_full, cached_tutors_first12, preload_in_progress, last_fetch_time
    if preload_in_progress:
        return
    preload_in_progress = True
    try:
        print("⏳ Preloading tutors progressively…")
        records = sheet.get_all_records(empty2zero=False, head=1)
        verified = []
        def s(v): return str(v).strip() if v else ""
        for r in records:
            if s(r.get("Verified", "")).lower() != "yes":
                continue
            subjects = []
            if s(r.get("Subject")):
                subjects.append(s(r.get("Subject")))
            if s(r.get("Major Subjects")):
                subjects.extend([x.strip() for x in s(r.get("Major Subjects")).split(",") if x.strip()])
            verified.append({
                "Name": s(r.get("Name")),
                "Subjects": subjects,
                "Qualification": s(r.get("Qualification")),
                "Experience": s(r.get("Experience")),
                "Province": s(r.get("Province")),
                "District": s(r.get("District")),
                "Tehsil": s(r.get("Tehsil")),
                "City": s(r.get("City")),
                "Bio": s(r.get("Bio")),
                "Area1": s(r.get("Area1")),
                "Area2": s(r.get("Area2")),
                "Area3": s(r.get("Area3")),
                "ExactLocation": s(r.get("ExactLocation")),
                "Image URL": s(r.get("Image URL")),
                "Latitude": s(r.get("Latitude")),
                "Longitude": s(r.get("Longitude")),
                "Profile URL": s(r.get("Profile URL")),
                "Verified": "Yes",
            })
        cached_tutors_full = verified
        cached_tutors_first12 = verified[:CHUNK_SIZE]
        last_fetch_time = datetime.utcnow()
        print("✅ Preloading complete, total tutors:", len(verified))
    except Exception as e:
        print("❌ Preload error:", e)
    preload_in_progress = False

# -----------------------------------------
#              ROUTES
# -----------------------------------------
@app.get("/")
def home():
    return {"message": "API disabled for unauthorized access"}

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

@app.on_event("startup")
def preload_on_startup():
    preload_more_tutors()

# -----------------------------------------
#       TUTOR REGISTRATION
# -----------------------------------------
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
        verify_recaptcha(recaptcha_token, "tutor_register")
        image_url = "N/A"
        if image and image.filename:
            img_bytes = await image.read()
            encoded = base64.b64encode(img_bytes).decode("utf-8")
            payload = {"key": IMGBB_API_KEY, "image": encoded, "name": image.filename}
            r = requests.post("https://api.imgbb.com/1/upload", data=payload)
            data = r.json()
            if data.get("success"):
                raw_url = data["data"]["url"]
                image_url = "https://cold-truth-e620.irfan-karor-mi.workers.dev/?url=" + raw_url

        latitude = float(lat) if lat else None
        longitude = float(lng) if lng else None
        city = district = province = tehsil = ""
        if latitude is not None and longitude is not None:
            try:
                location = geolocator.reverse(f"{latitude}, {longitude}", exactly_one=True)
                address = location.raw.get("address", {})
                city = address.get("city") or address.get("town") or address.get("village") or ""
                district = address.get("county") or ""
                province = address.get("state") or ""
                tehsil = address.get("suburb") or ""
            except Exception:
                pass
        area1 = area2 = area3 = city
        qualification_val = qualification if not subject else f"{qualification} {subject}"
        major_subjects_str = major_subjects or ""
        sheet.append_row([
            name, subject or "", qualification_val, major_subjects_str, str(experience),
            province, district, tehsil, city, phone, bio,
            area1, area2, area3, exactLocation or "", image_url,
            str(latitude or ""), str(longitude or ""), "No",
            datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), profile_url or ""
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
            "profile_url": profile_url or "",
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------------
#       GET VERIFIED TUTORS (PAGINATED)
# -----------------------------------------
@app.get("/tutors")
def get_tutors(offset: int = Query(0, ge=0), limit: int = Query(CHUNK_SIZE, ge=1), background_tasks: BackgroundTasks = None):
    global cached_tutors_full, cached_tutors_first12, preload_in_progress, last_fetch_time
    now = datetime.utcnow()
    if not cached_tutors_first12 or now - last_fetch_time > CACHE_DURATION:
        preload_more_tutors()
    if not preload_in_progress:
        background_tasks.add_task(preload_more_tutors)
    tutors = cached_tutors_full if cached_tutors_full else cached_tutors_first12
    end = offset + limit
    sliced = tutors[offset:end]
    return {
        "tutors": sliced,
        "offset": offset,
        "limit": limit,
        "total_preloaded": len(tutors),
        "has_more": end < len(tutors)
    }

# -----------------------------------------
#       GET SINGLE TUTOR
# -----------------------------------------
# -----------------------------------------
#       GET SINGLE TUTOR (FROM CACHE, NO EXCEPTION)
# -----------------------------------------
@app.get("/tutors/{teacher_id}")
def get_teacher(teacher_id: int):
    """
    Returns a single tutor from cached preloaded data.
    If cache is not ready, returns a friendly message instead of exception.
    """
    global cached_tutors_full, cached_tutors_first12

    # Use the preloaded full cache if available
    tutors = cached_tutors_full if cached_tutors_full else cached_tutors_first12

    if not tutors:
        return {"message": "Tutor data is loading, please try again shortly."}

    if teacher_id < 0 or teacher_id >= len(tutors):
        return {"message": "Teacher not found."}

    t = tutors[teacher_id]

    return {
        "Name": t.get("Name"),
        "Subjects": t.get("Subjects", []),
        "Qualification": t.get("Qualification"),
        "Experience": t.get("Experience"),
        "Province": t.get("Province"),
        "District": t.get("District"),
        "Tehsil": t.get("Tehsil"),
        "City": t.get("City"),
        "Bio": t.get("Bio"),
        "Area1": t.get("Area1"),
        "Area2": t.get("Area2"),
        "Area3": t.get("Area3"),
        "ExactLocation": t.get("ExactLocation"),
        "Image URL": t.get("Image URL"),
        "Latitude": t.get("Latitude"),
        "Longitude": t.get("Longitude"),
        "Profile URL": t.get("Profile URL"),
        "Verified": t.get("Verified"),
    }

