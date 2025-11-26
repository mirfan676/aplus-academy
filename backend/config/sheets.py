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
        print("📌 TOTAL ROWS LOADED FROM SHEET:", len(records))

        verified = []

        for idx, r in enumerate(records):
            raw_verified = r.get("Verified", None)
            print(f"Row {idx} Verified raw value:", repr(raw_verified))

            # Clean version
            cleaned = s(raw_verified).lower().strip()
            print(f"Row {idx} Verified cleaned:", repr(cleaned))

            if not cleaned.startswith("y"):
                print(f"❌ Row {idx} skipped — NOT verified")
                continue

            print(f"✅ Row {idx} accepted")

            subjects = []
            if s(r.get("Subject")):
                subjects.append(s(r.get("Subject")))
            if s(r.get("Major Subjects")):
                subjects.extend([x.strip() for x in s(r.get("Major Subjects")).split(",") if x.strip()])

            verified.append({**r, "Subjects": subjects})

        cached_tutors = verified
        last_fetch_time = datetime.utcnow()

        print("🔥 FINAL VERIFIED COUNT:", len(cached_tutors))

    except Exception as e:
        print("⚠️ Preload failed:", e)




