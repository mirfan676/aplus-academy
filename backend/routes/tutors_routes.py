from fastapi import APIRouter, HTTPException
from config.sheets import cached_tutors, last_fetch_time, CACHE_DURATION, preload_tutors
from datetime import datetime

router = APIRouter(prefix="/tutors", tags=["Tutors"])


def refresh_cache_if_needed():
    """
    Reload cached_tutors from Google Sheet if:
    - cache is empty
    - or cache older than CACHE_DURATION
    Returns True if tutors are available after refresh
    """
    global last_fetch_time
    now = datetime.utcnow()

    if not cached_tutors or (now - last_fetch_time) >= CACHE_DURATION:
        print("⏳ Cache expired or empty. Reloading tutors from sheet...")
        preload_tutors()

    if not cached_tutors:
        print("⚠️ No verified tutors available after preload.")
        return False

    print(f"✅ Using cached tutors. Count: {len(cached_tutors)}")
    return True


@router.get("/")
def get_tutors():
    """
    Return list of verified tutors
    Cache refreshes automatically every CACHE_DURATION
    """
    if not refresh_cache_if_needed():
        raise HTTPException(status_code=503, detail="No tutors available. Try again later.")

    return cached_tutors


@router.get("/{teacher_id}")
def get_teacher(teacher_id: int):
    """
    Return one verified teacher by ID
    ID is based on the order AFTER filtering 'Verified = Yes'
    """
    if not refresh_cache_if_needed():
        raise HTTPException(status_code=503, detail="No tutors available. Try again later.")

    if teacher_id < 0 or teacher_id >= len(cached_tutors):
        raise HTTPException(status_code=404, detail="Teacher not found")

    return cached_tutors[teacher_id]
