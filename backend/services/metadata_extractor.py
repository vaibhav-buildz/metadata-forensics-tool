# pyright: reportMissingTypeStubs=false
# pyright: reportUnknownMemberType=false
# pyright: reportUnknownVariableType=false
# pyright: reportUnknownArgumentType=false
"""
Metadata Extractor Module
Extracts EXIF metadata from images using Pillow and piexif.
"""

import os
from PIL import Image  # type: ignore
import piexif  # type: ignore
from typing import Any, Dict

def _get_filesize_mb(file_path: str) -> str:
    """Calculate file size in MB rounded to 1 decimal place."""
    try:
        size_bytes = os.path.getsize(file_path)
        return f"{round(size_bytes / (1024 * 1024), 1)} MB"
    except OSError:
        return "Unknown"

def _parse_orientation(orientation_val: int) -> str:
    """Map EXIF orientation integer to string description."""
    orientations = {
        1: "Normal",
        2: "Mirrored horizontally",
        3: "Rotated 180",
        4: "Mirrored vertically",
        5: "Mirrored horizontally and rotated 270 CW",
        6: "Rotated 90 CW",
        7: "Mirrored horizontally and rotated 90 CW",
        8: "Rotated 270 CW"
    }
    return orientations.get(orientation_val, "Unknown")

def safe_decode(value: Any) -> str:
    """
    Safely decode any value (bytes, string, tuple) to a clean string.
    Never crashes.
    """
    try:
        if isinstance(value, bytes):
            return value.decode("utf-8", errors="ignore").strip('\x00')
        elif isinstance(value, tuple):
            # Convert tuple elements to string and join, or just use str()
            # For GPS tuples like ((28, 1), (32, 1), (7, 1)), str() is safe
            return str(value)
        return str(value)
    except Exception:
        return "Unknown"

def extract_metadata(file_path: str) -> Dict[str, Any]:
    """
    Extracts all EXIF data from the image.
    
    Args:
        file_path (str): The path to the image file.
        
    Returns:
        dict: A dictionary containing extracted metadata.
    """
    # Initialize dictionary with default values
    result: Dict[str, Any] = {
        "filename": os.path.basename(file_path),
        "filesize": _get_filesize_mb(file_path),
        "width": "Unknown",
        "height": "Unknown",
        "format": "Unknown",
        "camera": "Unknown",
        "datetime": "Unknown",
        "orientation": "Unknown",
        "dpi": "Unknown",
        "gps_data": None
    }

    try:
        # Open image with Pillow to extract basic properties
        with Image.open(file_path) as img:
            result["width"] = img.width
            result["height"] = img.height
            result["format"] = img.format or "Unknown"
            
            # Extract DPI if available
            dpi = img.info.get("dpi")
            if dpi and len(dpi) >= 2:
                if dpi[0] == dpi[1]:
                    result["dpi"] = str(int(dpi[0]))
                else:
                    result["dpi"] = f"{int(dpi[0])}x{int(dpi[1])}"
            
            # Extract and parse EXIF data using piexif
            if "exif" in img.info:
                try:
                    exif_dict = piexif.load(img.info["exif"])
                    
                    # Process 0th IFD (contains camera model and orientation)
                    ifd_0th = exif_dict.get("0th")
                    if isinstance(ifd_0th, dict):
                        if piexif.ImageIFD.Model in ifd_0th:
                            # type: ignore
                            result["camera"] = safe_decode(ifd_0th[piexif.ImageIFD.Model])
                        
                        if piexif.ImageIFD.Orientation in ifd_0th:
                            # type: ignore
                            result["orientation"] = _parse_orientation(ifd_0th[piexif.ImageIFD.Orientation])

                    # Process Exif IFD (contains datetime)
                    ifd_exif = exif_dict.get("Exif")
                    if isinstance(ifd_exif, dict):
                        if piexif.ExifIFD.DateTimeOriginal in ifd_exif:
                            # type: ignore
                            dt_str = safe_decode(ifd_exif[piexif.ExifIFD.DateTimeOriginal])
                            # Normalize "YYYY:MM:DD HH:MM:SS" to "YYYY-MM-DD HH:MM:SS"
                            result["datetime"] = dt_str.replace(":", "-", 2)
                    
                    # Process GPS IFD (contains raw GPS data)
                    ifd_gps = exif_dict.get("GPS")
                    if isinstance(ifd_gps, dict):
                        decoded_gps = {}
                        for tag, value in ifd_gps.items():
                            # Convert integer tags to strings for JSON, and decode the value
                            tag_name = str(tag)
                            if isinstance(tag, int):
                                tag_info = piexif.TAGS["GPS"].get(tag)
                                if isinstance(tag_info, dict) and "name" in tag_info:
                                    tag_name = str(tag_info["name"])
                                    
                            decoded_gps[tag_name] = safe_decode(value)
                                
                        if decoded_gps:
                            result["gps_data"] = decoded_gps
                            
                except Exception as exif_err:
                    print(f"Warning: Failed to parse EXIF data. Reason: {exif_err}")

    except Exception as e:
        # Gracefully handle errors like missing file or unreadable image
        print(f"Warning: Failed to read image {file_path}. Reason: {e}")

    return result
