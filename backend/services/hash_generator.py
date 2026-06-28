# pyright: reportMissingTypeStubs=false
# pyright: reportUnknownMemberType=false
# pyright: reportUnknownVariableType=false
# pyright: reportUnknownArgumentType=false
"""
Hash Generator Module
Generates cryptographic and perceptual hashes for image fingerprinting.
"""
import os
import hashlib
from typing import Dict, Any
from PIL import Image
import imagehash # type: ignore

def is_valid_image(file_path: str) -> bool:
    """Checks if the file is a valid image."""
    try:
        with Image.open(file_path) as img:
            img.verify()
        return True
    except Exception:
        return False

def generate_hash_fingerprint(file_path: str) -> Dict[str, Any]:
    """
    Generates MD5, SHA256, and perceptual hashes for an image.
    """
    if not os.path.exists(file_path):
        return {"error": "File does not exist"}
        
    if not is_valid_image(file_path):
        return {"error": "File is not a valid image"}

    result: Dict[str, Any] = {
        "md5": None,
        "sha256": None,
        "perceptual_hash": None,
        "use_case": {
            "md5": "Find exact duplicates of this image",
            "sha256": "Verify file integrity and authenticity",
            "perceptual_hash": "Find similar images (even if edited)"
        }
    }
    
    # -----------------------------------------------------
    # A & B) Cryptographic Hashes (MD5 & SHA256)
    # -----------------------------------------------------
    # These hashes require reading the raw bytes of the file.
    # MD5 is fast and widely used for deduplication.
    # SHA256 is highly secure and collision-resistant.
    try:
        md5_hash = hashlib.md5()
        sha256_hash = hashlib.sha256()
        
        # Read in chunks to efficiently handle very large files
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                md5_hash.update(byte_block)
                sha256_hash.update(byte_block)
                
        result["md5"] = md5_hash.hexdigest()
        result["sha256"] = sha256_hash.hexdigest()
    except Exception as e:
        print(f"Warning: Failed to generate cryptographic hashes. Reason: {e}")
        
    # -----------------------------------------------------
    # C) Perceptual Hash (pHash)
    # -----------------------------------------------------
    # Analyzes the visual content of the image. Resizing, color correction,
    # or minor cropping will yield a very similar/identical pHash.
    try:
        with Image.open(file_path) as img:
            # Generate the perceptual hash and convert to string
            p_hash = imagehash.phash(img)
            result["perceptual_hash"] = str(p_hash)
    except Exception as e:
        print(f"Warning: Failed to generate perceptual hash. Reason: {e}")
        
    return result
