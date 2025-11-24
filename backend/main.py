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

cached_tutors = []
last_fetch_time = datetime.min
CACHE_DURATION = timedelta(minutes=5)


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
    """
    Fully correct reCAPTCHA Enterprise verification
    """
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

        # --- Validate core token properties ---
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
#              ROUTES
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
        # -----------------------------
        # Validate reCAPTCHA Enterprise
        # -----------------------------
        verify_recaptcha(recaptcha_token, "tutor_register")

        # -----------------------------
        # Upload image to IMGBB
        # -----------------------------
        image_url = "N/A"
        if image and image.filename:
            img_bytes = await image.read()
            encoded = base64.b64encode(img_bytes).decode("utf-8")
            payload = {"key": IMGBB_API_KEY, "image": encoded, "name": image.filename}

            r = requests.post("https://api.imgbb.com/1/upload", data=payload)
            data = r.json()

            if data.get("success"):
                raw_url = data["data"]["url"]
                image_url = (
                    "https://cold-truth-e620.irfan-karor-mi.workers.dev/?url=" + raw_url
                )

        # -----------------------------
        # Parse coordinates
        # -----------------------------
        latitude = float(lat) if lat else None
        longitude = float(lng) if lng else None

        # -----------------------------
        # Reverse Geocoding
        # -----------------------------
        city = district = province = tehsil = ""

        if latitude is not None and longitude is not None:
            try:
                location = geolocator.reverse(
                    f"{latitude}, {longitude}",
                    exactly_one=True,
                )
                address = location.raw.get("address", {})

                city = (
                    address.get("city")
                    or address.get("town")
                    or address.get("village")
                    or ""
                )
                district = address.get("county") or ""
                province = address.get("state") or ""
                tehsil = address.get("suburb") or ""
            except Exception:
                pass

        # -----------------------------
        # Data formatting
        # -----------------------------
        area1 = area2 = area3 = city

        qualification_val = (
            qualification if not subject else f"{qualification} {subject}"
        )
        major_subjects_str = major_subjects or ""

        # -----------------------------
        # Insert into Google Sheets
        # -----------------------------
        sheet.append_row(
            [
                name,
                subject or "",
                qualification_val,
                major_subjects_str,
                str(experience),
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
                str(latitude or ""),
                str(longitude or ""),
                "No",
                datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                profile_url or "",
            ]
        )

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
#           GET VERIFIED TUTORS
# -----------------------------------------
@app.get("/tutors")
def get_tutors():
    global cached_tutors, last_fetch_time

    now = datetime.utcnow()
    if now - last_fetch_time < CACHE_DURATION:
        return cached_tutors

    try:
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

        cached_tutors = verified
        last_fetch_time = now
        return verified

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------------------
#            GET SINGLE TUTOR
# -----------------------------------------
@app.get("/tutors/{teacher_id}")
def get_teacher(teacher_id: int):
    try:
        records = sheet.get_all_records(empty2zero=False, head=1)

        if teacher_id >= len(records):
            raise HTTPException(status_code=404, detail="Teacher not found")

        t = records[teacher_id]

        def s(v): return str(v).strip() if v else ""

        subjects = []
        if s(t.get("Subject")):
            subjects.append(s(t.get("Subject")))
        if s(t.get("Major Subjects")):
            subjects.extend([x.strip() for x in s(t.get("Major Subjects")).split(",") if x.strip()])

        return {
            "Name": s(t.get("Name")),
            "Subjects": subjects,
            "Qualification": s(t.get("Qualification")),
            "Experience": s(t.get("Experience")),
            "Province": s(t.get("Province")),
            "District": s(t.get("District")),
            "Tehsil": s(t.get("Tehsil")),
            "City": s(t.get("City")),
            "Bio": s(t.get("Bio")),
            "Area1": s(t.get("Area1")),
            "Area2": s(t.get("Area2")),
            "Area3": s(t.get("Area3")),
            "ExactLocation": s(t.get("ExactLocation")),
            "Image URL": s(t.get("Image URL")),
            "Latitude": s(t.get("Latitude")),
            "Longitude": s(t.get("Longitude")),
            "Profile URL": s(t.get("Profile URL")),
            "Verified": s(t.get("Verified")),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
