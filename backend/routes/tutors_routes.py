from fastapi import APIRouter, HTTPException
from config.sheets import (
    sheet,
    cached_tutors,
    last_fetch_time,
    CACHE_DURATION,
    preload_tutors
)
from datetime import datetime

router = APIRouter(prefix="/tutors", tags=["Tutors"])


@router.get("/")
def get_tutors():
    now = datetime.utcnow()

    # Cache still fresh → return memory copy
    if now - last_fetch_time < CACHE_DURATION:
        return cached_tutors

    # Cache expired → reload from Google Sheets
    preload_tutors()
    return cached_tutors


@router.get("/{teacher_id}")
def get_teacher(teacher_id: int):
    """
    One teacher by ID
    ID is based on the order AFTER filtering 'Verified = Yes'
    (because you cached only verified tutors)
    """

    # If student list is empty or outdated, reload
    now = datetime.utcnow()
    if now - last_fetch_time >= CACHE_DURATION:
        preload_tutors()

    # ID lookup against cached verified tutors
    if teacher_id < 0 or teacher_id >= len(cached_tutors):
        raise HTTPException(status_code=404, detail="Teacher not found")

    return cached_tutors[teacher_id]
