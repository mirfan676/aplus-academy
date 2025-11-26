from fastapi import APIRouter, HTTPException
from datetime import datetime
import config.sheets as sheets  # import module to get live reference to globals

router = APIRouter(prefix="/tutors", tags=["Tutors"])


def refresh_cache_if_needed():
    """
    Reload cached_tutors from Google Sheet if:
    - cache is empty
    - or cache older than CACHE_DURATION
    Returns the cached_tutors list if available
    Raises HTTPException (503) if preload fails or no verified tutors
    """
    now = datetime.utcnow()

    # Refresh cache if empty or expired
    if not sheets.cached_tutors or (now - sheets.last_fetch_time) >= sheets.CACHE_DURATION:
        print("⏳ Cache expired or empty. Reloading tutors from sheet...")
        try:
            sheets.preload_tutors()
        except Exception as e:
            print(f"⚠️ Preload failed: {e}")
            raise HTTPException(status_code=503, detail=f"Failed to load tutors: {e}")

    # If still empty after preload, raise 503
    if not sheets.cached_tutors:
        print("⚠️ No verified tutors available after preload.")
        raise HTTPException(status_code=503, detail="No verified tutors available after preload.")

    print(f"✅ Using cached tutors. Count: {len(sheets.cached_tutors)}")
    return sheets.cached_tutors


# -----------------------------
# Debug route (must be first!)
# -----------------------------
@router.get("/debug-sheet")
def debug_sheet():
    """
    Temporary debug route to inspect what the server sees from Google Sheets.
    Returns raw rows for verification.
    """
    try:
        rows = sheets.sheet.get_all_records(empty2zero=False, head=1)
        return {
            "total_rows": len(rows),
            "rows_preview": rows[:10]  # return first 10 rows for quick check
        }
    except Exception as e:
        return {"error": str(e)}


# -----------------------------
# Normal routes
# -----------------------------
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
