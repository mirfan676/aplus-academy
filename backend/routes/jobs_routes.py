from fastapi import APIRouter, HTTPException
from config.sheets import load_jobs_sheet

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/")
def get_jobs():
    """
    Fetch all job listings from Google Sheets.
    Source Sheet: 'Jobs'
    Returns a list of job objects with headers as keys.
    """

    try:
        records = load_jobs_sheet()   # Already returns list of dicts

        # If sheet is empty
        if not records:
            return {"jobs": []}

        return {"jobs": records}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load jobs: {e}")
