import os
import json
import gspread
from fastapi import FastAPI, Form, File, Query, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2.service_account import Credentials
import requests
import base64
import traceback

app = FastAPI(title="APlus Home Tutors API", version="2.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow your frontend domain in production
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
    image: UploadFile = File(None),
):
    try:
        image_url = "N/A"

        # --- Upload Image to ImgBB ---
        if image and image.filename:
            image_bytes = await image.read()
            encoded_image = base64.b64encode(image_bytes).decode("utf-8")

            payload = {
                "key": IMGBB_API_KEY,
                "image": encoded_image,
                "name": image.filename
            }

            response = requests.post("https://api.imgbb.com/1/upload", data=payload)
            result = response.json()

            if result.get("success"):
                image_url = result["data"]["url"]
            else:
                print("❌ ImgBB upload failed:", result)

        # --- Default areas if not provided ---
        areas = city_areas.get(city, [city])
        if not area1:
            area1 = areas[0]
        if not area2:
            area2 = areas[1] if len(areas) > 1 else area1
        if not area3:
            area3 = areas[2] if len(areas) > 2 else area1

        # --- Save data to Google Sheets ---
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
            image_url
        ])

        return {
            "message": "✅ Tutor registered successfully!",
            "image_url": image_url,
            "areas": [area1, area2, area3]
        }

    except Exception as e:
        print("❌ Error submitting form:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/tutors")
def get_tutors():
    try:
        # Ensure the header row is used, skip empty rows
        records = sheet.get_all_records(empty2zero=False, head=1)
        filtered_records = []

        for r in records:
            # Skip completely empty rows
            if any(r.values()):
                filtered_records.append({
                    "Name": r.get("Name", ""),
                    "Subject": r.get("Subject", ""),
                    "Qualification": r.get("Qualification", ""),
                    "Experience": r.get("Experience", ""),
                    "City": r.get("City", ""),
                    "Phone": r.get("Phone", ""),
                    "Bio": r.get("Bio", ""),
                    "Area1": r.get("Area1", ""),
                    "Area2": r.get("Area2", ""),
                    "Area3": r.get("Area3", ""),
                    "Image URL": r.get("Image URL", "")
                })

        return filtered_records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/areas")
def get_areas(city: str = Query(..., description="City name")):
    return {"areas": city_areas.get(city, [city])}
