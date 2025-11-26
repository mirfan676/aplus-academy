from google.cloud import recaptchaenterprise_v1
from fastapi import HTTPException
from config.settings import RECAPTCHA_SA_JSON, RECAPTCHA_PROJECT_ID, RECAPTCHA_SITE_KEY

recaptcha_client = recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient.from_service_account_info(
    RECAPTCHA_SA_JSON
)

def verify_recaptcha(token: str, expected_action: str):
    try:
        event = recaptchaenterprise_v1.Event(token=token, site_key=RECAPTCHA_SITE_KEY)
        assessment = recaptchaenterprise_v1.Assessment(event=event)

        request = recaptchaenterprise_v1.CreateAssessmentRequest(
            parent=f"projects/{RECAPTCHA_PROJECT_ID}",
            assessment=assessment,
        )

        response = recaptcha_client.create_assessment(request=request)
        props = response.token_properties

        if not props.valid:
            raise HTTPException(status_code=400, detail="Invalid reCAPTCHA token")
        if props.action != expected_action:
            raise HTTPException(status_code=400, detail="Invalid reCAPTCHA action")
        if response.risk_analysis.score < 0.5:
            raise HTTPException(status_code=400, detail="Bot detected (low score)")

        return True

    except Exception:
        raise HTTPException(status_code=400, detail="reCAPTCHA validation failed")
