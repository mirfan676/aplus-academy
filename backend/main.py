import os
import json
import gspread
from fastapi import FastAPI, Form, File, Query, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from io import BytesIO

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
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

# Load credentials from environment variable
creds_dict = json.loads(os.environ["GOOGLE_CREDENTIALS"])
creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)

# Authorize Google clients
gspread_client = gspread.authorize(creds)
drive_service = build("drive", "v3", credentials=creds)

# --- CONFIG ---
SHEET_ID = "1wBmbImTrliHEIKk5YxM5PN4eOfkz6XLS28bjxRjmZvY"
FOLDER_ID = "1sgKkV_ZehAbgpvAwbD_JulJvJoust_f8"

sheet = gspread_client.open_by_key(SHEET_ID).sheet1


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
    import traceback

    try:
        image_url = "N/A"

        # --- Upload Image to Google Drive (optional) ---
        if image and image.filename:
            file_metadata = {"name": image.filename, "parents": [FOLDER_ID]}
            media = MediaIoBaseUpload(
                BytesIO(await image.read()),
                mimetype=image.content_type or "image/jpeg",
                resumable=True
            )
            file = drive_service.files().create(
                body=file_metadata,
                media_body=media,
                fields="id"
            ).execute()

            file_id = file.get("id")
            # Make the image publicly accessible
            drive_service.permissions().create(
                fileId=file_id,
                body={"role": "reader", "type": "anyone"},
            ).execute()
            image_url = f"https://drive.google.com/uc?id={file_id}"

        # --- Default areas if not provided ---
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

        if not area1:
            area1 = city_areas.get(city, [city])[0]
        if not area2:
            area2 = city_areas.get(city, [city])[1] if len(city_areas.get(city, [city])) > 1 else area1
        if not area3:
            area3 = city_areas.get(city, [city])[2] if len(city_areas.get(city, [city])) > 2 else area1

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
        # Print full traceback in console
        print("❌ Error submitting form:", e)
        traceback.print_exc()
        # Return detailed error to frontend (can also hide in production)
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/tutors")
def get_tutors():
    """Fetch all tutor records from Google Sheets"""
    try:
        records = sheet.get_all_records()
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/areas")
def get_areas(city: str = Query(..., description="City name")):
    """Return predefined areas for cities"""
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
    return {"areas": city_areas.get(city, [city])}


