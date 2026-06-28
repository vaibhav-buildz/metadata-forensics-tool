# 🔍 Metadata Forensics Tool

A full-stack image metadata forensics application that performs comprehensive analysis on uploaded images. Built with **FastAPI** (Python) and **React** + **Tailwind CSS**.

![Forensics Tool](https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📋 **EXIF Metadata** | Extract camera make/model, date, dimensions, ISO, aperture, shutter speed, and 50+ EXIF tags |
| 📍 **GPS Location** | Extract GPS coordinates, convert to address, and display on an interactive dark-themed map |
| 🛡️ **Tampering Detection** | Detect image manipulation via date mismatch, editor software signatures, compression artifacts, and Error Level Analysis (ELA) |
| 🔐 **Hash Fingerprints** | Generate MD5, SHA-256, and perceptual hash (pHash) for verification and deduplication |
| 👁️ **Face & Object Detection** | Detect faces (OpenCV Haar Cascade) and objects (YOLOv8n) with privacy assessment |
| 📥 **Report Download** | Download complete forensic analysis as JSON |

---

## 🏗️ Architecture

```
User → React Frontend → POST /api/analyze → FastAPI Backend
                                               ├─ Metadata Extractor (Pillow + exifread)
                                               ├─ GPS Converter (Nominatim)
                                               ├─ Tampering Detector (ELA + heuristics)
                                               ├─ Hash Generator (MD5, SHA-256, pHash)
                                               └─ Detection Service (OpenCV + YOLOv8n)
                                            → JSON Response → Display in Cards + Map
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend runs at: `http://localhost:8000`
API docs: `http://localhost:8000/api/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Docker (Optional)

```bash
docker-compose up --build
```

---

## 📁 Project Structure

```
metadata-forensics-tool/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── config.py                  # Settings & constants
│   ├── requirements.txt           # Python dependencies
│   ├── routes/
│   │   ├── analyze.py             # POST /api/analyze
│   │   └── health.py              # GET /api/health
│   ├── services/
│   │   ├── metadata_extractor.py  # EXIF data extraction
│   │   ├── gps_converter.py       # GPS to address
│   │   ├── tampering_detector.py  # Tampering analysis
│   │   ├── hash_generator.py      # Hash fingerprinting
│   │   └── detection.py           # Face & object detection
│   └── utils/
│       └── helpers.py             # Utility functions
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Root component + routing
│   │   ├── index.jsx              # React entry point
│   │   ├── index.css              # Tailwind v4 + custom styles
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing + upload
│   │   │   └── Analysis.jsx       # Results page
│   │   ├── components/
│   │   │   ├── Upload.jsx         # Drag-and-drop upload
│   │   │   ├── Results.jsx        # Results container
│   │   │   ├── MetadataCard.jsx   # EXIF display
│   │   │   ├── MapDisplay.jsx     # Leaflet map
│   │   │   ├── TamperingCard.jsx  # Tampering gauge
│   │   │   ├── HashCard.jsx       # Hash fingerprints
│   │   │   └── DetectionCard.jsx  # Faces & objects
│   │   └── services/
│   │       └── api.js             # Axios API client
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/analyze` | Upload image for forensic analysis |
| `GET` | `/api/docs` | Swagger UI documentation |

### Example Response

```json
{
  "success": true,
  "filename": "photo.jpg",
  "metadata": {
    "filename": "photo.jpg",
    "filesize": "2.50 MB",
    "camera_model": "iPhone 12 Pro",
    "datetime_original": "2025:06:27 14:30:45"
  },
  "location": {
    "available": true,
    "latitude": 28.5355,
    "longitude": 77.391,
    "address": "Sector 62, Greater Noida, UP, India"
  },
  "tampering": {
    "is_tampered": false,
    "score": 15,
    "verdict": "✅ Authentic"
  },
  "hashes": {
    "md5": "a1b2c3d4...",
    "sha256": "e5f6g7h8...",
    "perceptual": "hash123..."
  },
  "detection": {
    "faces": 2,
    "objects": ["person", "car", "tree"],
    "privacy_alert": true
  }
}
```

---

## 🎨 Design

- **Dark cyber-forensic theme** with deep navy background
- **Glassmorphism** cards with backdrop blur
- **Animated upload zone** with scanning effect
- **Score gauge** with color-coded fill animation
- **Interactive map** with dark CARTO tiles
- **Copy-to-clipboard** for hash values
- **Responsive** layout for all screen sizes

---

## 📄 License

MIT License — free for personal and commercial use.
