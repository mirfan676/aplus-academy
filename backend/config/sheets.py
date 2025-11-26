import gspread
from datetime import datetime, timedelta
from google.oauth2.service_account import Credentials
from config.settings import SERVICE_ACCOUNT_JSON, SCOPES, SHEET_ID

creds = Credentials.from_service_account_info(SERVICE_ACCOUNT_JSON, scopes=SCOPES)
gspread_client = gspread.authorize(creds)
sheet = gspread_client.open_by_key(SHEET_ID).worksheet("Tutors")

cached_tutors = []
last_fetch_time = datetime.min
CACHE_DURATION = timedelta(minutes=5)

def s(v): return str(v).strip() if v else ""

def preload_tutors():
    global cached_tutors, last_fetch_time

    try:
        records = sheet.get_all_records(empty2zero=False, head=1)
        print("Loaded rows:", len(records))

        verified = []

        for r in records:
            if not s(r.get("Verified", "")).lower().startswith("y"):
                continue

            subjects = []
            if s(r.get("Subject")):
                subjects.append(s(r.get("Subject")))
            if s(r.get("Major Subjects")):
                subjects.extend([x.strip() for x in s(r.get("Major Subjects")).split(",")])

            verified.append({**r, "Subjects": subjects})

        cached_tutors = verified
        last_fetch_time = datetime.utcnow()
        print("🔥 Tutors preloaded:", len(cached_tutors))

    except Exception as e:
        print("⚠️ Preload failed:", e)

