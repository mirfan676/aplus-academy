from fastapi import APIRouter, HTTPException
from config.sheets import get_sheet_data

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/")
def get_jobs():
    """
    Fetch all job listings from Google Sheets.
    Sheet Name: 'Jobs'
    Returns a list of job objects.
    """

    SHEET_NAME = "Jobs"

    try:
        jobs = get_sheet_data(SHEET_NAME)

        # Convert Google Sheet rows (array of values) into dictionary objects.
        # This assumes row 1 contains column headers.
        if not jobs:
            return {"jobs": []}

        headers = jobs[0]
        rows = jobs[1:]

        job_list = []
        for row in rows:
            job = {headers[i]: row[i] if i < len(row) else "" for i in range(len(headers))}
            job_list.append(job)

        return {"jobs": job_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
