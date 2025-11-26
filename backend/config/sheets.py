import gspread
from datetime import datetime, timedelta
from google.oauth2.service_account import Credentials
from config.settings import SERVICE_ACCOUNT_JSON, SCOPES, SHEET_ID

# ----------------------------
# Google Sheets client
# ----------------------------
creds = Credentials.from_service_account_info(SERVICE_ACCOUNT_JSON, scopes=SCOPES)
gspread_client = gspread.authorize(creds)
sheet = gspread_client.open_by_key(SHEET_ID).worksheet("Tutors")

# ----------------------------
# Cache globals
# ----------------------------
cached_tutors = []
last_fetch_time = datetime.min
CACHE_DURATION = timedelta(minutes=5)

# ----------------------------
# Helper
# ----------------------------
def s(v):
    """Safe string strip"""
    return str(v).strip() if v else ""


# ----------------------------
# Preload tutors
# ----------------------------
def preload_tutors():
    """
    Load tutors from Google Sheet
    Only keep verified tutors
    Raises Exception if loading fails or no verified tutors
    """
    global cached_tutors, last_fetch_time

    try:
        records = sheet.get_all_records(empty2zero=False, head=1)
        print("📌 TOTAL ROWS LOADED FROM SHEET:", len(records))

        verified = []

        for idx, r in enumerate(records):
            raw_verified = r.get("Verified", None)
            cleaned = s(raw_verified).lower()
            print(f"Row {idx} Verified raw value: {repr(raw_verified)} | cleaned: {repr(cleaned)}")

            if not cleaned.startswith("y"):
                print(f"❌ Row {idx} skipped — NOT verified")
                continue

            # Process subjects
            subjects = []
            if s(r.get("Subject")):
                subjects.append(s(r.get("Subject")))

            major_subjects = r.get("Major Subjects", "")
            if major_subjects:
                subjects.extend([x.strip() for x in str(major_subjects).split(",") if x.strip()])

            # Append cleaned tutor record
            verified.append({**r, "Subjects": subjects})
            print(f"✅ Row {idx} accepted")

        if not verified:
            raise Exception("No verified tutors found in the sheet.")

        cached_tutors = verified
        last_fetch_time = datetime.utcnow()
        print("🔥 FINAL VERIFIED COUNT:", len(cached_tutors))

    except Exception as e:
        # Clear cache if preload fails
        cached_tutors = []
        last_fetch_time = datetime.min
        print("⚠️ Preload failed:", e)
        # Raise exception so routes can handle it
        raise Exception(f"Failed to load tutors from sheet: {e}")
