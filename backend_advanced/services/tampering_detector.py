"""
Service 3: Image Tampering Detection
Analyzes images for signs of manipulation using multiple heuristics.
"""
import os
import logging
from typing import Any
import struct
from datetime import datetime
from PIL import Image
import numpy as np

from config import (
    TAMPERING_SCORE_THRESHOLD,
    DATE_MISMATCH_PENALTY,
    EDITOR_SOFTWARE_PENALTY,
    COMPRESSION_ARTIFACT_PENALTY,
    ELA_ANOMALY_PENALTY,
)

logger = logging.getLogger(__name__)

# Known editing software signatures
EDITOR_SOFTWARE = [
    "photoshop", "gimp", "lightroom", "capture one", "affinity",
    "paint.net", "pixlr", "snapseed", "vsco", "canva",
    "adobe", "corel", "paintshop", "darktable", "rawtherapee",
    "luminar", "on1", "dxo", "topaz", "skylum",
]


def detect_tampering(file_path: str, metadata: dict[str, Any]) -> dict[str, Any]:
    """
    Analyze an image for signs of tampering/manipulation.

    Checks:
    1. Date mismatch between EXIF and file system
    2. Known editing software signatures
    3. JPEG quantization table anomalies
    4. Error Level Analysis (ELA)

    Returns:
        dict with is_tampered, score (0-100), verdict, and reasons list.
    """
    score = 0
    reasons = []

    try:
        # ── Check 1: Date mismatch ─────────────────────
        date_result = _check_date_mismatch(metadata, file_path)
        score += date_result["penalty"]
        if date_result["reason"]:
            reasons.append(date_result["reason"])

        # ── Check 2: Editor software ───────────────────
        editor_result = _check_editor_software(metadata)
        score += editor_result["penalty"]
        if editor_result["reason"]:
            reasons.append(editor_result["reason"])

        # ── Check 3: Compression artifacts ─────────────
        compression_result = _check_compression_artifacts(file_path)
        score += compression_result["penalty"]
        if compression_result["reason"]:
            reasons.append(compression_result["reason"])

        # ── Check 4: ELA analysis ──────────────────────
        ela_result = _check_ela(file_path)
        score += ela_result["penalty"]
        if ela_result["reason"]:
            reasons.append(ela_result["reason"])

    except Exception as e:
        logger.warning(f"Tampering detection partial failure: {e}")

    # Cap score at 100
    score = min(score, 100)
    is_tampered = score >= TAMPERING_SCORE_THRESHOLD

    if is_tampered:
        verdict = "⚠️ Likely Tampered"
    elif score > 20:
        verdict = "🟡 Suspicious"
    else:
        verdict = "✅ Authentic"

    return {
        "is_tampered": is_tampered,
        "score": score,
        "verdict": verdict,
        "reasons": reasons,
        "checks_performed": 4,
    }


def _check_date_mismatch(metadata: dict[str, Any], file_path: str) -> dict[str, Any]:
    """Compare EXIF datetime vs file modification date."""
    result = {"penalty": 0, "reason": None}

    exif_date_str = metadata.get("datetime_original")
    if not exif_date_str:
        return result

    try:
        # Parse EXIF date (format: YYYY:MM:DD HH:MM:SS)
        exif_date = datetime.strptime(exif_date_str, "%Y:%m:%d %H:%M:%S")
        file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))

        # If file modification is significantly before EXIF date, suspicious
        diff = abs((file_mtime - exif_date).total_seconds())

        if diff > 365 * 24 * 3600:  # More than 1 year difference
            result["penalty"] = DATE_MISMATCH_PENALTY
            result["reason"] = (
                f"Date mismatch: EXIF says {exif_date_str}, "
                f"file modified {file_mtime.strftime('%Y-%m-%d %H:%M:%S')} "
                f"(>{int(diff / (24 * 3600))} days apart)"
            )
    except (ValueError, OSError):
        pass

    return result


def _check_editor_software(metadata: dict[str, Any]) -> dict[str, Any]:
    """Check if editing software is recorded in EXIF."""
    result = {"penalty": 0, "reason": None}

    software = metadata.get("software")
    if not software:
        return result

    software_lower = software.lower()
    for editor in EDITOR_SOFTWARE:
        if editor in software_lower:
            result["penalty"] = EDITOR_SOFTWARE_PENALTY
            result["reason"] = f"Editing software detected: {software}"
            break

    return result


def _check_compression_artifacts(file_path: str) -> dict[str, Any]:
    """
    Analyze JPEG quantization tables for re-compression artifacts.
    Non-standard quantization tables may indicate the image was re-saved.
    """
    result = {"penalty": 0, "reason": None}

    if not file_path.lower().endswith((".jpg", ".jpeg")):
        return result

    try:
        with open(file_path, "rb") as f:
            data = f.read()

        # Look for multiple JPEG quantization table markers (DQT = 0xFFDB)
        dqt_count = 0
        pos = 0
        while pos < len(data) - 1:
            if data[pos] == 0xFF and data[pos + 1] == 0xDB:
                dqt_count += 1
            pos += 1

        # Multiple DQT markers beyond the standard 2 (luma + chroma) may
        # indicate re-compression
        if dqt_count > 2:
            result["penalty"] = COMPRESSION_ARTIFACT_PENALTY
            result["reason"] = (
                f"Unusual compression: {dqt_count} quantization tables found "
                f"(standard is 2), suggesting re-compression"
            )

    except Exception as e:
        logger.warning(f"Compression check failed: {e}")

    return result


def _check_ela(file_path: str) -> dict[str, Any]:
    """
    Perform Error Level Analysis (ELA).
    Re-saves at a known quality and checks if error levels are uniform.
    Non-uniform error levels suggest localized editing.
    """
    result = {"penalty": 0, "reason": None}

    try:
        with Image.open(file_path) as img:
            if img.mode != "RGB":
                img = img.convert("RGB")

            # Re-save at quality 95
            import tempfile
            tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
            tmp_path = tmp.name
            tmp.close()

            try:
                img.save(tmp_path, "JPEG", quality=95)

                with Image.open(tmp_path) as resaved:
                    # Calculate difference
                    original_arr = np.array(img, dtype=np.float32)
                    resaved_arr = np.array(resaved, dtype=np.float32)

                    diff = np.abs(original_arr - resaved_arr)
                    mean_error = np.mean(diff)
                    max_error = np.max(diff)
                    std_error = np.std(diff)

                    # High standard deviation relative to mean suggests
                    # non-uniform error levels (localized editing)
                    if mean_error > 0 and (std_error / (mean_error + 1e-6)) > 2.5:
                        result["penalty"] = ELA_ANOMALY_PENALTY
                        result["reason"] = (
                            f"ELA anomaly: non-uniform error levels detected "
                            f"(mean={mean_error:.1f}, std={std_error:.1f}), "
                            f"suggesting localized editing"
                        )
            finally:
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)

    except Exception as e:
        logger.warning(f"ELA check failed: {e}")

    return result
