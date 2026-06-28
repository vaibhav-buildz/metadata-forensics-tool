# pyright: reportMissingTypeStubs=false
# pyright: reportUnknownMemberType=false
# pyright: reportUnknownVariableType=false
# pyright: reportUnknownArgumentType=false
"""
Tampering Detector Module
Analyzes images for potential editing or tampering post-capture.
"""
import os
from datetime import datetime
from typing import Dict, Any, List, Tuple
import cv2 # type: ignore

def get_file_modification_date(file_path: str) -> str:
    """Gets the file's last modification date on disk."""
    try:
        mod_time = os.path.getmtime(file_path)
        return datetime.fromtimestamp(mod_time).strftime('%Y-%m-%d %H:%M:%S')
    except Exception:
        return "Unknown"

def calculate_compression_variance(file_path: str) -> Tuple[float, bool]:
    """
    Loads the image with OpenCV and calculates the Laplacian variance.
    If the variance is highly anomalous, it suggests compression artifacts or editing.
    Returns (variance, is_anomalous).
    """
    try:
        # Load image via cv2
        image = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
        if image is None:
            return 0.0, False
            
        # Calculate Laplacian variance
        variance = float(cv2.Laplacian(image, cv2.CV_64F).var())
        
        # Determine if anomalous (e.g. exceptionally low variance often points to heavy re-compression or blurring)
        is_anomalous = variance < 100.0 or variance > 10000.0
        return variance, is_anomalous
    except Exception:
        return 0.0, False

def generate_verdict(score: int) -> str:
    """Returns a human-readable verdict based on the tampering score."""
    if score <= 20:
        return "✅ Authentic (no signs of tampering)"
    elif score <= 50:
        return "⚠️ Possible editing (minor inconsistencies)"
    else:
        return "🚩 Likely edited (strong evidence)"

def detect_tampering(file_path: str, exif_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes the image and EXIF data to detect post-capture tampering.
    """
    score = 0
    reasons: List[str] = []
    
    try:
        # -----------------------------------------------------
        # A) EXIF vs File Date Comparison
        # -----------------------------------------------------
        file_mod_date = get_file_modification_date(file_path)
        exif_date = exif_data.get("datetime")
        
        if exif_date and exif_date != "Unknown" and file_mod_date != "Unknown":
            # Usually, if an image is edited, the modification date will be later than the EXIF DateTimeOriginal
            # We perform a simple string comparison here.
            if str(exif_date) != str(file_mod_date):
                score += 40
                reasons.append(f"EXIF date mismatch (taken {exif_date}, modified {file_mod_date})")
        
        # -----------------------------------------------------
        # B) Compression Analysis
        # -----------------------------------------------------
        _, is_anomalous = calculate_compression_variance(file_path)
        if is_anomalous:
            score += 30
            reasons.append("Compression artifacts detected")
            
        # -----------------------------------------------------
        # C) Metadata Consistency
        # -----------------------------------------------------
        # Check if orientation tag is present. Many editors strip it.
        orientation = exif_data.get("orientation")
        if not orientation or orientation == "Unknown":
            score += 20
            reasons.append("Missing or removed orientation tag")
            
        # Cap score at 100
        score = min(score, 100)
        
        # Generate confidence
        confidence = "Low"
        if score >= 50:
            confidence = "High"
        elif score >= 20:
            confidence = "Medium"
            
        verdict = generate_verdict(score)
        is_tampered = score >= 50
        
        return {
            "is_tampered": is_tampered,
            "tampering_score": score,
            "confidence": confidence,
            "reasons": reasons,
            "verdict": verdict
        }
    except Exception as e:
        # If analysis fails: return safe default with 0 score
        print(f"Warning: Tampering analysis failed. Reason: {e}")
        return {
            "is_tampered": False,
            "tampering_score": 0,
            "confidence": "Low",
            "reasons": ["Analysis failed or skipped"],
            "verdict": generate_verdict(0)
        }
