"""
Service 4: Hash Fingerprint Generation
Generates cryptographic (MD5, SHA-256) and perceptual hashes for image verification.
"""
import hashlib
import logging
from PIL import Image
import imagehash

logger = logging.getLogger(__name__)


def generate_hashes(file_path: str, file_content: bytes) -> dict:
    """
    Generate multiple hash fingerprints for an image.

    - MD5: Fast, widely used for quick verification
    - SHA-256: Cryptographically secure, tamper-proof
    - Perceptual Hash (pHash): Content-based, survives resizing/compression

    Args:
        file_path: Path to the image file
        file_content: Raw file bytes

    Returns:
        dict with md5, sha256, and perceptual hash values.
    """
    result = {
        "md5": None,
        "sha256": None,
        "perceptual": None,
        "perceptual_type": "pHash",
    }

    try:
        # ── MD5 ─────────────────────────────────────────
        result["md5"] = hashlib.md5(file_content).hexdigest()
    except Exception as e:
        logger.warning(f"MD5 hash failed: {e}")

    try:
        # ── SHA-256 ─────────────────────────────────────
        result["sha256"] = hashlib.sha256(file_content).hexdigest()
    except Exception as e:
        logger.warning(f"SHA-256 hash failed: {e}")

    try:
        # ── Perceptual Hash ─────────────────────────────
        with Image.open(file_path) as img:
            phash = imagehash.phash(img)
            result["perceptual"] = str(phash)
    except Exception as e:
        logger.warning(f"Perceptual hash failed: {e}")

    return result
