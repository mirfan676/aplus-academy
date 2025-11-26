from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.locations_routes import router as locations_router
from routes.tutor_register import router as register_router
from routes.tutors_routes import router as tutors_router
from config.sheets import preload_tutors

app = FastAPI(title="APlus Home Tutors API", version="4.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register route modules ---
app.include_router(locations_router)
app.include_router(register_router)
app.include_router(tutors_router)

@app.get("/")
def home():
    return {"message": "API disabled for unauthorized access"}

@app.on_event("startup")
def startup_event():
    preload_tutors()
