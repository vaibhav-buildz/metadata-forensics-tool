"""
Service 1: EXIF Metadata Extraction
Extracts comprehensive metadata from images using Pillow and exifread.
"""
import os
import logging
from typing import Any
from datetime import datetime
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import exifread

from utils.helpers import safe_str, format_file_size

logger = logging.getLogger(__name__)


def extract_metadata(file_path: str, original_filename: str, file_size: int) -> dict[str, Any]:
    """
    Extract EXIF metadata from an image file.

    Returns structured metadata including camera info, dates, dimensions,
    and technical settings.
    """
    result = {
        "filename": original_filename,
        "filesize": format_file_size(file_size),
        "filesize_bytes": file_size,
        "dimensions": None,
        "format": None,
        "mode": None,
        "camera_make": None,
        "camera_model": None,
        "datetime_original": None,
        "datetime_digitized": None,
        "datetime_modified": None,
        "orientation": None,
        "software": None,
        "color_space": None,
        "iso": None,
        "aperture": None,
        "shutter_speed": None,
        "focal_length": None,
        "flash": None,
        "white_balance": None,
        "exposure_mode": None,
        "metering_mode": None,
        "all_tags": {},
    }

    try:
        # ── Pillow basic info ───────────────────────────
        with Image.open(file_path) as img:
            result["dimensions"] = f"{img.width} × {img.height}"
            result["format"] = img.format or os.path.splitext(file_path)[1].upper().strip(".")
            result["mode"] = img.mode

            # Extract Pillow EXIF
            exif_data = img._getexif()  # type: ignore
            if exif_data:
                _parse_pillow_exif(exif_data, result)

        # ── exifread for deeper tags ────────────────────
        with open(file_path, "rb") as f:
            tags = exifread.process_file(f, details=False)
            if tags:
                _parse_exifread_tags(tags, result)

        # ── File system dates ───────────────────────────
        stat = os.stat(file_path)
        result["file_modified_date"] = datetime.fromtimestamp(stat.st_mtime).strftime(
            "%Y-%m-%d %H:%M:%S"
        )

    except Exception as e:
        logger.warning(f"Metadata extraction partial failure: {e}")

    # Clean up None values for display
    result["all_tags"] = {k: v for k, v in result["all_tags"].items() if v is not None}

    return result


def _parse_pillow_exif(exif_data: dict[str, Any], result: dict[str, Any]):
    """Parse EXIF data from Pillow's _getexif()."""
    tag_map = {}
    for tag_id, value in exif_data.items():
        tag_name = TAGS.get(tag_id, str(tag_id))
        tag_map[tag_name] = value

    result["camera_make"] = safe_str(tag_map.get("Make"), None)
    result["camera_model"] = safe_str(tag_map.get("Model"), None)
    result["datetime_original"] = safe_str(tag_map.get("DateTimeOriginal"), None)
    result["datetime_digitized"] = safe_str(tag_map.get("DateTimeDigitized"), None)
    result["datetime_modified"] = safe_str(tag_map.get("DateTime"), None)
    result["software"] = safe_str(tag_map.get("Software"), None)
    result["iso"] = safe_str(tag_map.get("ISOSpeedRatings"), None)

    # Orientation
    orient_val = tag_map.get("Orientation")
    if orient_val:
        orient_map = {
            1: "Normal",
            2: "Mirrored horizontal",
            3: "Rotated 180°",
            4: "Mirrored vertical",
            5: "Mirrored horizontal + Rotated 270°",
            6: "Rotated 90° CW",
            7: "Mirrored horizontal + Rotated 90°",
            8: "Rotated 270° CW",
        }
        result["orientation"] = orient_map.get(orient_val, f"Unknown ({orient_val})")

    # Aperture
    aperture = tag_map.get("FNumber")
    if aperture:
        try:
            if hasattr(aperture, "numerator"):
                result["aperture"] = f"f/{float(aperture):.1f}"
            else:
                result["aperture"] = f"f/{float(aperture):.1f}"
        except (TypeError, ValueError):
            result["aperture"] = str(aperture)

    # Shutter speed
    exposure = tag_map.get("ExposureTime")
    if exposure:
        try:
            if hasattr(exposure, "numerator") and exposure.numerator:
                if exposure.numerator == 1:
                    result["shutter_speed"] = f"1/{int(exposure.denominator)}s"
                else:
                    result["shutter_speed"] = f"{float(exposure):.4f}s"
            else:
                result["shutter_speed"] = f"{float(exposure)}s"
        except (TypeError, ValueError, ZeroDivisionError):
            result["shutter_speed"] = str(exposure)

    # Focal length
    focal = tag_map.get("FocalLength")
    if focal:
        try:
            result["focal_length"] = f"{float(focal):.1f}mm"
        except (TypeError, ValueError):
            result["focal_length"] = str(focal)

    # Flash
    flash_val = tag_map.get("Flash")
    if flash_val is not None:
        result["flash"] = "Fired" if (int(flash_val) & 1) else "No Flash"

    # White balance
    wb = tag_map.get("WhiteBalance")
    if wb is not None:
        result["white_balance"] = "Auto" if wb == 0 else "Manual"

    # Exposure mode
    em = tag_map.get("ExposureMode")
    if em is not None:
        em_map = {0: "Auto", 1: "Manual", 2: "Auto Bracket"}
        result["exposure_mode"] = em_map.get(em, f"Unknown ({em})")

    # Metering mode
    mm = tag_map.get("MeteringMode")
    if mm is not None:
        mm_map = {
            0: "Unknown", 1: "Average", 2: "Center-weighted",
            3: "Spot", 4: "Multi-spot", 5: "Pattern", 6: "Partial",
        }
        result["metering_mode"] = mm_map.get(mm, f"Unknown ({mm})")

    # Color space
    cs = tag_map.get("ColorSpace")
    if cs is not None:
        result["color_space"] = "sRGB" if cs == 1 else f"Uncalibrated ({cs})"

    # Store all tags for reference
    for k, v in tag_map.items():
        try:
            result["all_tags"][k] = str(v)[:200]  # Truncate long values
        except Exception:
            pass


def _parse_exifread_tags(tags: dict[str, Any], result: dict[str, Any]):
    """Fill in any gaps using exifread tags."""
    tag_str = lambda key: safe_str(tags.get(key), None)

    if not result["camera_make"]:
        result["camera_make"] = tag_str("Image Make")
    if not result["camera_model"]:
        result["camera_model"] = tag_str("Image Model")
    if not result["datetime_original"]:
        result["datetime_original"] = tag_str("EXIF DateTimeOriginal")
    if not result["software"]:
        result["software"] = tag_str("Image Software")
    if not result["iso"]:
        result["iso"] = tag_str("EXIF ISOSpeedRatings")

    # Add exifread-specific tags
    for key, val in tags.items():
        tag_name = str(key)
        if tag_name not in result["all_tags"]:
            try:
                result["all_tags"][tag_name] = str(val)[:200]
            except Exception:
                pass
