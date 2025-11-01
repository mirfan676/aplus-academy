import json, os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import gspread
from google.oauth2.service_account import Credentials
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="APlus Home Tutors API", version="0.1.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tutor model
class Tutor(BaseModel):
    name: str
    subject: str
    qualification: str
    experience: int
    city: str
    phone: str

# Google Sheets Setup
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# Load credentials from environment
creds_dict = json.loads(os.environ["GOOGLE_CREDENTIALS"])
creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
client = gspread.authorize(creds)

SHEET_ID = "1wBmbImTrliHEIKk5YxM5PN4eOfkz6XLS28bjxRjmZvY"
sheet = client.open_by_key(SHEET_ID).sheet1

@app.get("/")
def home():
    return {"message": "Welcome to APlus Home Tutors API"}

@app.post("/tutors/register")
def register_tutor(tutor: Tutor):
    try:
        sheet.append_row([
            tutor.name,
            tutor.subject,
            tutor.qualification,
            tutor.experience,
            tutor.city,
            tutor.phone
        ])
        return {"message": "Tutor registered successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
