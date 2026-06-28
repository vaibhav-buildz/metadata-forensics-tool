"""
Service 2: GPS Coordinate Extraction & Reverse Geocoding
Extracts GPS data from EXIF, converts to decimal degrees, and resolves addresses.
"""
import logging
from typing import Any
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

from config import NOMINATIM_USER_AGENT, NOMINATIM_TIMEOUT

logger = logging.getLogger(__name__)


def extract_gps_location(file_path: str) -> dict[str, Any]:
    """
    Extract GPS coordinates from image EXIF and reverse geocode to an address.

    Returns:
        dict with latitude, longitude, formatted coordinates, and address.
        Returns 'not_available' fields if no GPS data found.
    """
    result = {
        "available": False,
        "latitude": None,
        "longitude": None,
        "coordinates": None,
        "address": None,
        "altitude": None,
    }

    try:
        gps_info = _extract_gps_exif(file_path)
        if not gps_info:
            return result

        lat = _convert_to_decimal(
            gps_info.get("GPSLatitude"),
            gps_info.get("GPSLatitudeRef"),
        )
        lon = _convert_to_decimal(
            gps_info.get("GPSLongitude"),
            gps_info.get("GPSLongitudeRef"),
        )

        if lat is None or lon is None:
            return result

        result["available"] = True
        result["latitude"] = round(lat, 6)
        result["longitude"] = round(lon, 6)

        # Format coordinates
        lat_dir = "N" if lat >= 0 else "S"
        lon_dir = "E" if lon >= 0 else "W"
        result["coordinates"] = f"{abs(lat):.4f}° {lat_dir}, {abs(lon):.4f}° {lon_dir}"

        # Altitude
        alt = gps_info.get("GPSAltitude")
        if alt:
            try:
                alt_val = float(alt)
                alt_ref = gps_info.get("GPSAltitudeRef", 0)
                if alt_ref == 1:
                    alt_val = -alt_val
                result["altitude"] = f"{alt_val:.1f}m"
            except (TypeError, ValueError):
                pass

        # Reverse geocode
        result["address"] = _reverse_geocode(lat, lon)

    except Exception as e:
        logger.warning(f"GPS extraction failed: {e}")

    return result


def _extract_gps_exif(file_path: str) -> dict[str, Any] | None:
    """Extract GPSInfo from image EXIF data."""
    try:
        with Image.open(file_path) as img:
            exif_data = img._getexif()  # type: ignore
            if not exif_data:
                return None

            # Find GPSInfo tag
            gps_info_raw = None
            for tag_id, value in exif_data.items():
                tag_name = TAGS.get(tag_id, str(tag_id))
                if tag_name == "GPSInfo":
                    gps_info_raw = value
                    break

            if not gps_info_raw:
                return None

            # Convert GPS tag IDs to names
            gps_data = {}
            for gps_tag_id, gps_value in gps_info_raw.items():
                gps_tag_name = GPSTAGS.get(gps_tag_id, str(gps_tag_id))
                gps_data[gps_tag_name] = gps_value

            return gps_data

    except Exception as e:
        logger.warning(f"GPS EXIF read failed: {e}")
        return None


def _convert_to_decimal(dms_tuple, ref: str | None) -> float | None:
    """
    Convert GPS coordinates from DMS (degrees, minutes, seconds) to decimal degrees.

    Args:
        dms_tuple: Tuple of (degrees, minutes, seconds) — each may be IFDRational
        ref: Direction reference ('N', 'S', 'E', 'W')

    Returns:
        Decimal degrees as float, or None if invalid
    """
    if not dms_tuple or not ref:
        return None

    try:
        degrees = float(dms_tuple[0])
        minutes = float(dms_tuple[1])
        seconds = float(dms_tuple[2])

        decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)

        if ref in ("S", "W"):
            decimal = -decimal

        return decimal

    except (TypeError, ValueError, IndexError) as e:
        logger.warning(f"DMS conversion failed: {e}")
        return None


def _reverse_geocode(lat: float, lon: float) -> str | None:
    """
    Convert coordinates to a human-readable address via Nominatim.

    Returns:
        Address string, or None if geocoding fails.
    """
    try:
        geolocator: Any = Nominatim(
            user_agent=NOMINATIM_USER_AGENT,
            timeout=NOMINATIM_TIMEOUT,  # type: ignore
        )
        location = geolocator.reverse(f"{lat}, {lon}", language="en", exactly_one=True)
        if location:
            return location.address
    except GeocoderTimedOut:
        logger.warning("Geocoding timed out")
    except GeocoderServiceError as e:
        logger.warning(f"Geocoding service error: {e}")
    except Exception as e:
        logger.warning(f"Geocoding failed: {e}")

    return None
