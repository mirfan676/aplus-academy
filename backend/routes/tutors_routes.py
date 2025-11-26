from fastapi import APIRouter, HTTPException
from config.sheets import cached_tutors, last_fetch_time, CACHE_DURATION, preload_tutors, sheet
from datetime import datetime

router = APIRouter(prefix="/tutors", tags=["Tutors"])


def refresh_cache_if_needed():
    """
    Reload cached_tutors from Google Sheet if:
    - cache is empty
    - or cache older than CACHE_DURATION
    Returns the cached_tutors list if available
    Raises HTTPException (503) if preload fails or no verified tutors
    """
    global last_fetch_time
    now = datetime.utcnow()

    # Refresh cache if empty or expired
    if not cached_tutors or (now - last_fetch_time) >= CACHE_DURATION:
        print("⏳ Cache expired or empty. Reloading tutors from sheet...")
        try:
            preload_tutors()
        except Exception as e:
            print(f"⚠️ Preload failed: {e}")
            raise HTTPException(status_code=503, detail=f"Failed to load tutors: {e}")

    # If still empty after preload, raise 503
    if not cached_tutors:
        print("⚠️ No verified tutors available after preload.")
        raise HTTPException(status_code=503, detail="No verified tutors available after preload.")

    print(f"✅ Using cached tutors. Count: {len(cached_tutors)}")
    return cached_tutors


@router.get("/")
def get_tutors():
    """
    Return list of verified tutors
    Cache refreshes automatically every CACHE_DURATION
    """
    tutors = refresh_cache_if_needed()
    return tutors


@router.get("/{teacher_id}")
def get_teacher(teacher_id: int):
    """
    Return one verified teacher by ID
    ID is based on the order AFTER filtering 'Verified = Yes'
    """
    tutors = refresh_cache_if_needed()

    if teacher_id < 0 or teacher_id >= len(tutors):
        raise HTTPException(status_code=404, detail="Teacher not found")

    return tutors[teacher_id]


@router.get("/debug-sheet")
def debug_sheet():
    """
    Temporary debug route to inspect what the server sees from Google Sheets.
    Returns raw rows for verification.
    """
    try:
        rows = sheet.get_all_records(empty2zero=False, head=1)
        return {
            "total_rows": len(rows),
            "rows_preview": rows[:10]  # return first 10 rows for quick check
        }
    except Exception as e:
        return {"error": str(e)}
