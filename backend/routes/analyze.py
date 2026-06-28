"""
Main analysis endpoint – orchestrates all forensic services.
"""
import os
import logging
import tempfile
from fastapi import APIRouter, UploadFile, HTTPException
from typing import Any

from config import MAX_UPLOAD_SIZE_BYTES, ALLOWED_EXTENSIONS
from services.metadata_extractor import extract_metadata
from services.gps_converter import extract_gps_location
from services.tampering_detector import detect_tampering
from services.hash_generator import generate_hashes
from services.detection import detect_faces_and_objects
from utils.helpers import validate_file_extension, format_file_size

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/analyze")
async def analyze_image(file: UploadFile) -> dict[str, Any]:
    """
    Accepts an image upload and returns comprehensive forensic analysis:
    - EXIF metadata
    - GPS location & address
    - Tampering detection
    - Hash fingerprints
    - Face & object detection
    """
    # ── Validate file extension ─────────────────────────
    raw_filename = file.filename
    if not raw_filename:
        raise HTTPException(status_code=400, detail="Filename is missing")
    
    filename: str = raw_filename
    if not validate_file_extension(filename, ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # ── Read file content ───────────────────────────────
    content = await file.read()

    if len(content) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size: {MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)} MB",
        )

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    # ── Save to temp file ───────────────────────────────
    tmp_path: str = ""
    try:
        suffix = os.path.splitext(filename)[1]
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
        tmp.write(content)
        tmp.flush()
        tmp_path = str(tmp.name)
        tmp.close()

        logger.info(f"📸 Analyzing: {filename} ({format_file_size(len(content))})")

        # ── Run all services ────────────────────────────
        metadata = extract_metadata(tmp_path, filename, len(content))
        location = extract_gps_location(tmp_path)
        tampering = detect_tampering(tmp_path, metadata)
        hashes = generate_hashes(tmp_path, content)
        detection = detect_faces_and_objects(tmp_path)

        logger.info(f"✅ Analysis complete for: {filename}")

        return {
            "success": True,
            "filename": filename,
            "metadata": metadata,
            "location": location,
            "tampering": tampering,
            "hashes": hashes,
            "detection": detection,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        # Clean up temp file
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
