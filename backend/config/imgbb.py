import base64
import requests
from config.settings import IMGBB_API_KEY

async def upload_to_imgbb(image):
    if not image or not image.filename:
        return "N/A"

    img_bytes = await image.read()
    encoded = base64.b64encode(img_bytes).decode("utf-8")

    payload = {"key": IMGBB_API_KEY, "image": encoded, "name": image.filename}
    r = requests.post("https://api.imgbb.com/1/upload", data=payload)
    data = r.json()

    if data.get("success"):
        raw_url = data["data"]["url"]
        return "https://cold-truth-e620.irfan-karor-mi.workers.dev/?url=" + raw_url

    return "N/A"
