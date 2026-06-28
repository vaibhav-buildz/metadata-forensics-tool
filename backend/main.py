from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import health, analyze

app = FastAPI(
    title="Metadata Forensics API",
    description="Extract and analyze image metadata",
    version="1.0.0"
)

# Enable CORS (so frontend can call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(analyze.router, prefix="/api", tags=["analysis"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
