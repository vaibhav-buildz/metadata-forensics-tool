# pyright: reportMissingTypeStubs=false
# pyright: reportUnknownMemberType=false
# pyright: reportUnknownVariableType=false
# pyright: reportUnknownArgumentType=false
"""
GPS Converter Module
Converts raw GPS EXIF data to human-readable addresses using geopy.
"""
import ast
from typing import Dict, Any, Optional
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

def convert_dms_to_decimal(degrees: float, minutes: float, seconds: float) -> float:
    """
    Converts Degrees, Minutes, Seconds (DMS) to Decimal Degrees.
    Formula: decimal = degrees + (minutes/60) + (seconds/3600)
    """
    return degrees + (minutes / 60.0) + (seconds / 3600.0)

def _parse_rational(value: Any) -> float:
    """
    Helper to parse EXIF rational format, e.g. (28, 1) -> 28.0.
    Handles tuples or lists of (numerator, denominator).
    """
    if isinstance(value, (tuple, list)) and len(value) == 2:
        num, den = value
        if den == 0:
            return 0.0
        return float(num) / float(den)
    elif isinstance(value, (int, float)):
        return float(value)
    return 0.0

def _parse_dms_tuple(dms_value: Any) -> Optional[float]:
    """
    Parses a DMS tuple like ((28, 1), (32, 1), (7, 1)) into decimal degrees.
    """
    # If it was stringified by safe_decode, convert it back
    if isinstance(dms_value, str):
        try:
            dms_value = ast.literal_eval(dms_value)
        except (ValueError, SyntaxError):
            return None
            
    if isinstance(dms_value, (tuple, list)) and len(dms_value) >= 3:
        degrees = _parse_rational(dms_value[0])
        minutes = _parse_rational(dms_value[1])
        seconds = _parse_rational(dms_value[2])
        return convert_dms_to_decimal(degrees, minutes, seconds)
        
    return None

def convert_gps_to_address(exif_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Takes EXIF GPS data and converts it to decimal coordinates and address.
    """
    # Default return structure if no GPS data
    result: Dict[str, Any] = {
        "has_gps": False,
        "address": None,
        "latitude": None,
        "longitude": None,
        "coordinates": None
    }
    
    if not exif_data:
        return result
        
    # Extract raw coordinates and references
    lat_raw = exif_data.get("GPSLatitude")
    lat_ref = exif_data.get("GPSLatitudeRef")
    lon_raw = exif_data.get("GPSLongitude")
    lon_ref = exif_data.get("GPSLongitudeRef")
    
    if not all([lat_raw, lat_ref, lon_raw, lon_ref]):
        return result
        
    # Parse decimal values
    lat_decimal = _parse_dms_tuple(lat_raw)
    lon_decimal = _parse_dms_tuple(lon_raw)
    
    if lat_decimal is None or lon_decimal is None:
        return result
        
    # Apply direction (S/W makes it negative)
    if isinstance(lat_ref, str) and lat_ref.upper() == "S":
        lat_decimal = -lat_decimal
    elif isinstance(lat_ref, bytes) and lat_ref.decode('utf-8', 'ignore').upper() == "S":
        lat_decimal = -lat_decimal
        
    if isinstance(lon_ref, str) and lon_ref.upper() == "W":
        lon_decimal = -lon_decimal
    elif isinstance(lon_ref, bytes) and lon_ref.decode('utf-8', 'ignore').upper() == "W":
        lon_decimal = -lon_decimal
        
    # Format nicely rounded coordinates
    lat_decimal = round(lat_decimal, 4)
    lon_decimal = round(lon_decimal, 4)
    
    lat_display_ref = "N" if lat_decimal >= 0 else "S"
    lon_display_ref = "E" if lon_decimal >= 0 else "W"
    
    result["has_gps"] = True
    result["latitude"] = lat_decimal
    result["longitude"] = lon_decimal
    result["coordinates"] = f"{abs(lat_decimal)}° {lat_display_ref}, {abs(lon_decimal)}° {lon_display_ref}"
    
    # Reverse Geocoding
    try:
        # User agent is required by Nominatim
        geolocator = Nominatim(user_agent="metadata_forensics_tool")
        location = geolocator.reverse((lat_decimal, lon_decimal), timeout=10.0) # type: ignore
        
        if location and location.address: # type: ignore
            result["address"] = location.address # type: ignore
            
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        print(f"Warning: Geocoding failed: {e}")
        # Address remains None but we still have coordinates
        
    return result
