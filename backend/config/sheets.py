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
        print("\n================ PRELOAD START ================\n")

        # Load all rows from sheet
        records = sheet.get_all_records(empty2zero=False, head=1)
        print(f"📄 Loaded rows from sheet: {len(records)}")

        verified = []

        for idx, r in enumerate(records, start=1):
            print(f"\n--- Row {idx} raw data ---")
            print(r)

            # Extract & normalize verified field
            raw_verified = r.get("Verified", "")
            v = str(raw_verified).strip().lower()

            print(f"🔍 Verified value raw='{raw_verified}' normalized='{v}'")

            # Skip non-verified tutors
            if not v.startswith("y"):
                print("⛔ Skipped (not verified)")
                continue
            else:
                print("✅ Accepted as verified")

            # Parse subjects
            subjects = []

            sub1 = str(r.get("Subject", "")).strip()
            major = str(r.get("Major Subjects", "")).strip()

            print(f"📘 Subject: '{sub1}'")
            print(f"📗 Major Subjects: '{major}'")

            if sub1:
                subjects.append(sub1)

            if major:
                major_split = [x.strip() for x in major.split(",") if x.strip()]
                subjects.extend(major_split)
                print("➡️ Parsed major subjects:", major_split)

            print("📚 Final subjects list:", subjects)

            tutor = {**r, "Subjects": subjects}
            verified.append(tutor)

            print("✅ Tutor added")

        cached_tutors = verified
        last_fetch_time = datetime.utcnow()

        print(f"\n🔥 FINAL Preloaded tutors count: {len(cached_tutors)}")
        print("\n================ PRELOAD END =================\n")

    except Exception as e:
        print("⚠️ Preload failed:", e)



