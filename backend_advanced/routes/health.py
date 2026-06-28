"""
Health check endpoint.
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Returns service health status."""
    return {
        "status": "ok",
        "service": "Metadata Forensics Tool",
        "version": "1.0.0",
    }
