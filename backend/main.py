import os
import json
import gspread
from fastapi import FastAPI, Form, File, UploadFile, HTTPException
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
    area1: str = Form(...),
    area2: str = Form(...),
    area3: str = Form(...),
    image: UploadFile = File(None),
):
    try:
        image_url = "N/A"

        # --- Upload Image to Google Drive ---
        if image:
            file_metadata = {
                "name": image.filename,
                "parents": [FOLDER_ID]
            }

            media = MediaIoBaseUpload(
                BytesIO(await image.read()),
                mimetype=image.content_type,
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

        return {"message": "✅ Tutor registered successfully!", "image_url": image_url}

    except Exception as e:
        print("❌ Error:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/tutors")
def get_tutors():
    """Fetch all tutor records from Google Sheets"""
    try:
        records = sheet.get_all_records()
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
