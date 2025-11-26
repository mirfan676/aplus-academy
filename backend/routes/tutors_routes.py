from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from datetime import datetime
from io import BytesIO
import requests
from PIL import Image

import config.sheets as sheets  # live reference to cached globals

router = APIRouter(prefix="/tutors", tags=["Tutors"])

# ------------------------------
# Thumbnail cache in memory
# ------------------------------
thumbnail_cache = {}  # key: teacher_id, value: BytesIO()

def refresh_cache_if_needed():
    """
    Reload cached_tutors from Google Sheet if:
    - cache empty
    - or cache expired
    """
    now = datetime.utcnow()

    if not sheets.cached_tutors or (now - sheets.last_fetch_time) >= sheets.CACHE_DURATION:
        print("⏳ Cache expired or empty. Reloading tutors from sheet...")
        try:
            sheets.preload_tutors()
        except Exception as e:
            print(f"⚠️ Preload failed: {e}")
            raise HTTPException(status_code=503, detail=f"Failed to load tutors: {e}")

    if not sheets.cached_tutors:
        print("⚠️ No verified tutors available after preload.")
        raise HTTPException(status_code=503, detail="No verified tutors available after preload.")

    print(f"✅ Using cached tutors. Count: {len(sheets.cached_tutors)}")
    return sheets.cached_tutors


# ------------------------------
# DEBUG ROUTE
# ------------------------------
@router.get("/debug-sheet")
def debug_sheet():
    try:
        rows = sheets.sheet.get_all_records(empty2zero=False, head=1)
        verified_rows = []

        for idx, r in enumerate(rows):
            raw_verified = r.get("Verified", "")
            cleaned = str(raw_verified).strip().lower()
            if cleaned.startswith("y"):
                verified_rows.append({"row_index": idx, "row_data": r})

        return {
            "total_rows": len(rows),
            "rows_preview": rows[:10],
            "verified_count": len(verified_rows),
            "verified_rows_preview": verified_rows[:10]
        }

    except Exception as e:
        return {"error": str(e)}


# ------------------------------
# SECURE THUMBNAIL ROUTE (cached)
# ------------------------------
@router.get("/image/{teacher_id}")
def get_teacher_image(teacher_id: int):
    """
    Returns a PROTECTED THUMBNAIL.
    The real image URL is NEVER exposed to frontend.
    """
    tutors = refresh_cache_if_needed()

    if teacher_id < 0 or teacher_id >= len(tutors):
        raise HTTPException(status_code=404, detail="Teacher not found")

    # Return cached thumbnail if exists
    if teacher_id in thumbnail_cache:
        buffer = thumbnail_cache[teacher_id]
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="image/jpeg",
            headers={"Cache-Control": "public, max-age=86400", "Content-Disposition": "inline"}
        )

    image_url = tutors[teacher_id].get("Image URL")
    if not image_url:
        raise HTTPException(status_code=404, detail="Image not found")

    try:
        # Download original image
        r = requests.get(image_url, timeout=10)
        r.raise_for_status()

        # Load into PIL and create secure thumbnail
        img = Image.open(BytesIO(r.content))
        img.thumbnail((150, 150))
        buffer = BytesIO()
        img.save(buffer, format="JPEG", quality=55)
        buffer.seek(0)

        # Cache the thumbnail in memory
        thumbnail_cache[teacher_id] = buffer

        # Return thumbnail
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="image/jpeg",
            headers={"Cache-Control": "public, max-age=86400", "Content-Disposition": "inline"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process image: {e}")


# ------------------------------
# NORMAL ROUTES — IMAGE PROTECTED
# ------------------------------
@router.get("/")
def get_tutors():
    """
    Always fetch fresh tutors from Google Sheet.
    Return list of verified tutors WITH SECURE THUMBNAIL.
    """
    tutors = refresh_cache_if_needed()
    protected_list = []

    for idx, t in enumerate(tutors):
        t_copy = t.copy()
        t_copy["Thumbnail"] = f"https://aplus-academy.onrender.com/tutors/image/{idx}"
        if "Image URL" in t_copy:
            del t_copy["Image URL"]
        protected_list.append(t_copy)

    return protected_list


@router.get("/{teacher_id}")
def get_teacher(teacher_id: int):
    tutors = refresh_cache_if_needed()

    if teacher_id < 0 or teacher_id >= len(tutors):
        raise HTTPException(status_code=404, detail="Teacher not found")

    t = tutors[teacher_id].copy()
    t["Thumbnail"] = f"https://aplus-academy.onrender.com/tutors/image/{teacher_id}"
    if "Image URL" in t:
        del t["Image URL"]

    return t
