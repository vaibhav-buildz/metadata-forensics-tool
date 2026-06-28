"""
Application configuration and settings.
"""
import os
from dotenv import load_dotenv

load_dotenv()


# ── App Settings ────────────────────────────────────────
APP_NAME = "Metadata Forensics Tool"
APP_VERSION = "1.0.0"
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

# ── Upload Settings ─────────────────────────────────────
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))
MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tiff", ".tif", ".bmp", ".webp", ".heic"}

# ── CORS ────────────────────────────────────────────────
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# ── Geocoding (Nominatim) ──────────────────────────────
NOMINATIM_USER_AGENT = os.getenv("NOMINATIM_USER_AGENT", "metadata-forensics-tool/1.0")
NOMINATIM_TIMEOUT = int(os.getenv("NOMINATIM_TIMEOUT", "10"))

# ── Detection ──────────────────────────────────────────
YOLO_MODEL = os.getenv("YOLO_MODEL", "yolov8n.pt")
FACE_CASCADE = "haarcascade_frontalface_default.xml"

# ── Tampering Thresholds ───────────────────────────────
TAMPERING_SCORE_THRESHOLD = 50  # Score above this = likely tampered
DATE_MISMATCH_PENALTY = 25
EDITOR_SOFTWARE_PENALTY = 30
COMPRESSION_ARTIFACT_PENALTY = 20
ELA_ANOMALY_PENALTY = 25
