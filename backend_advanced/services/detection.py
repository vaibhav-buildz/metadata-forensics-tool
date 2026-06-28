"""
Service 5: Face & Object Detection
Detects faces using OpenCV Haar Cascades and objects using YOLOv8n.
"""
import logging
from typing import Any
import cv2
import numpy as np

logger = logging.getLogger(__name__)

# ── Lazy-load YOLO model ────────────────────────────────
_yolo_model: Any = None


def _get_yolo_model():
    """Lazy-load YOLOv8n to avoid startup delay."""
    global _yolo_model
    if _yolo_model is None:
        try:
            from ultralytics import YOLO
            _yolo_model = YOLO("yolov8n.pt")
            logger.info("✅ YOLOv8n model loaded")
        except Exception as e:
            logger.error(f"❌ Failed to load YOLO model: {e}")
            _yolo_model = "FAILED"
    return _yolo_model if _yolo_model != "FAILED" else None


def detect_faces_and_objects(file_path: str) -> dict[str, Any]:
    """
    Detect faces and objects in an image.

    - Faces: OpenCV Haar Cascade (frontal face)
    - Objects: YOLOv8n (80 COCO classes)

    Returns:
        dict with face count, object list, and privacy alert flag.
    """
    result = {
        "faces": 0,
        "face_details": [],
        "objects": [],
        "object_count": 0,
        "privacy_alert": False,
        "privacy_reasons": [],
    }

    try:
        # Read image with OpenCV
        img = cv2.imread(file_path)
        if img is None:
            logger.warning("Could not read image with OpenCV")
            return result

        # ── Face Detection ──────────────────────────────
        face_result = _detect_faces(img)
        result["faces"] = face_result["count"]
        result["face_details"] = face_result["details"]

        # ── Object Detection ────────────────────────────
        object_result = _detect_objects(file_path)
        result["objects"] = object_result["objects"]
        result["object_count"] = len(object_result["objects"])

        # ── Privacy Assessment ──────────────────────────
        if result["faces"] > 0:
            result["privacy_alert"] = True
            result["privacy_reasons"].append(
                f"{result['faces']} face(s) detected — may contain personal identity"
            )

        # Check for sensitive objects
        sensitive_objects = {"person", "cell phone", "laptop", "car", "license plate"}
        found_sensitive = [obj for obj in result["objects"] if obj.lower() in sensitive_objects]
        if found_sensitive:
            result["privacy_alert"] = True
            result["privacy_reasons"].append(
                f"Sensitive objects detected: {', '.join(set(found_sensitive))}"
            )

    except Exception as e:
        logger.warning(f"Detection failed: {e}")

    return result


def _detect_faces(img: np.ndarray) -> dict[str, Any]:
    """Detect faces using OpenCV Haar Cascade."""
    result = {"count": 0, "details": []}

    try:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)

        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"  # type: ignore
        )

        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE,
        )

        result["count"] = len(faces)
        for i, (x, y, w, h) in enumerate(faces):
            result["details"].append({
                "id": i + 1,
                "position": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
            })

    except Exception as e:
        logger.warning(f"Face detection failed: {e}")

    return result


def _detect_objects(file_path: str) -> dict[str, Any]:
    """Detect objects using YOLOv8n."""
    result = {"objects": []}

    model = _get_yolo_model()
    if model is None:
        logger.warning("YOLO model not available, skipping object detection")
        return result

    try:
        results = model(file_path, verbose=False, conf=0.4)

        if results and len(results) > 0:
            detected = results[0]
            if detected.boxes is not None:
                for box in detected.boxes:
                    class_id = int(box.cls[0])
                    class_name = model.names.get(class_id, f"class_{class_id}")
                    confidence = float(box.conf[0])

                    if confidence >= 0.4:
                        result["objects"].append(class_name)

        # Deduplicate but keep count info
        result["objects"] = list(set(result["objects"]))

    except Exception as e:
        logger.warning(f"Object detection failed: {e}")

    return result
