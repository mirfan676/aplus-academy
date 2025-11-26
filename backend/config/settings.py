import os
import json
from google.oauth2.service_account import Credentials

SERVICE_ACCOUNT_JSON = json.loads(os.environ["SERVICE_ACCOUNT_JSON"])
RECAPTCHA_SA_JSON = json.loads(os.environ["RECAPTCHA_SERVICE_ACCOUNT_JSON"])

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

SHEET_ID = "1wBmbImTrliHEIKk5YxM5PN4eOfkz6XLS28bjxRjmZvY"
IMGBB_API_KEY = os.environ.get("IMGBB_API_KEY", "")

RECAPTCHA_PROJECT_ID = os.environ["GCLOUD_PROJECT_ID"]
RECAPTCHA_SITE_KEY = os.environ["RECAPTCHA_SITE_KEY"]
