"""
Utility helper functions.
"""
import os


def validate_file_extension(filename: str, allowed: set) -> bool:
    """Check if file extension is in the allowed set."""
    if not filename:
        return False
    ext = os.path.splitext(filename)[1].lower()
    return ext in allowed


def format_file_size(size_bytes: int) -> str:
    """Convert bytes to human-readable string."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.2f} MB"
    else:
        return f"{size_bytes / (1024 * 1024 * 1024):.2f} GB"


def safe_str(value, default: str | None = "Unknown") -> str | None:
    """Safely convert a value to string, returning default if None/empty."""
    if value is None:
        return default
    s = str(value).strip()
    return s if s else default


def safe_float(value, default=0.0) -> float:
    """Safely convert a value to float."""
    try:
        return float(value)
    except (TypeError, ValueError):
        return default
