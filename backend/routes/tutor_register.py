from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from config.recaptcha import verify_recaptcha
from config.imgbb import upload_to_imgbb
from config.geocoder import geolocator
from config.sheets import sheet
import traceback

router = APIRouter()

@router.post("/tutors/register")
async def register_tutor(
    recaptcha_token: str = Form(...),
    name: str = Form(...),
    subject: str = Form(None),
    major_subjects: str = Form(None),
    qualification: str = Form(...),
    experience: int = Form(...),
    phone: str = Form(...),
    bio: str = Form(...),
    exactLocation: str = Form(None),
    lat: str = Form(None),
    lng: str = Form(None),
    image: UploadFile = File(None),
    profile_url: str = Form(None),
):
    try:
        # Validate reCAPTCHA
        verify_recaptcha(recaptcha_token, "tutor_register")

        # Upload to imgbb
        image_url = await upload_to_imgbb(image)

        # Parse coordinates
        latitude = float(lat) if lat else None
        longitude = float(lng) if lng else None
        
        city = district = province = tehsil = ""

        if latitude and longitude:
            try:
                loc = geolocator.reverse(f"{latitude}, {longitude}")
                addr = loc.raw.get("address", {})
                city = addr.get("city") or addr.get("town") or ""
                district = addr.get("county") or ""
                province = addr.get("state") or ""
                tehsil = addr.get("suburb") or ""

            except Exception:
                pass

        # Write to sheet
        sheet.append_row([
            name,
            subject or "",
            f"{qualification} {subject}" if subject else qualification,
            major_subjects or "",
            str(experience),
            province,
            district,
            tehsil,
            city,
            phone,
            bio,
            city,
            city,
            city,
            exactLocation or "",
            image_url,
            str(latitude or ""),
            str(longitude or ""),
            "No",
            profile_url or "",
        ])

        return {
            "message": "Tutor registered successfully!",
            "image_url": image_url,
            "province": province,
            "district": district,
            "tehsil": tehsil,
            "city": city,
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
