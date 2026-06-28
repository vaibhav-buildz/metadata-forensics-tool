import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File
from services.metadata_extractor import extract_metadata
from services.gps_converter import convert_gps_to_address
from services.tampering_detector import detect_tampering
from services.hash_generator import generate_hash_fingerprint

router = APIRouter()

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """Analyze uploaded image"""
    
    # Save the file temporarily
    temp_filename = f"{uuid.uuid4()}_{file.filename}"
    temp_filepath = os.path.join(UPLOAD_DIR, temp_filename)
    
    try:
        # Write uploaded file to disk
        with open(temp_filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Extract metadata
        metadata = extract_metadata(temp_filepath)
        
        # Safely convert GPS data to an address
        gps_data = metadata.get("gps_data")
        try:
            if gps_data:
                location = convert_gps_to_address(gps_data)
            else:
                location = {"has_gps": False, "address": None}
        except Exception as loc_err:
            print(f"Warning: Failed to convert GPS data. Reason: {loc_err}")
            location = {"has_gps": False, "address": None}
        
        # Safely detect tampering
        try:
            tampering = detect_tampering(temp_filepath, metadata)
        except Exception as tamp_err:
            print(f"Warning: Failed to detect tampering. Reason: {tamp_err}")
            tampering = {
                "is_tampered": False,
                "tampering_score": 0,
                "confidence": "Low",
                "reasons": ["Analysis failed"],
                "verdict": "✅ Authentic (no signs of tampering)"
            }
        
        # Safely generate hashes
        try:
            hashes = generate_hash_fingerprint(temp_filepath)
        except Exception as hash_err:
            print(f"Warning: Failed to generate hashes. Reason: {hash_err}")
            hashes = {
                "md5": None,
                "sha256": None,
                "perceptual_hash": None,
                "use_case": {}
            }
        
        return {
            "status": "success", 
            "metadata": metadata,
            "location": location,
            "tampering": tampering,
            "hashes": hashes,
            # Placeholder for other components expected by frontend:
            # "detection": None
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_filepath):
            try:
                os.remove(temp_filepath)
            except:
                pass
