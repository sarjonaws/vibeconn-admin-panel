from fastapi import APIRouter, HTTPException
from typing import List, Dict
from datetime import datetime
from services.tracking_service import TrackingService

router = APIRouter(prefix="/api/tracking", tags=["tracking"])
tracking_service = TrackingService()

@router.post("/traces")
async def save_trace(trace_data: Dict):
    """Recibe y almacena trace de petición"""
    try:
        tracking_service.save_trace(trace_data)
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/traces")
async def get_traces(limit: int = 50):
    """Obtiene últimos traces"""
    return tracking_service.get_traces(limit)

@router.get("/traces/{trace_id}")
async def get_trace(trace_id: str):
    """Obtiene trace específico"""
    trace = tracking_service.get_trace(trace_id)
    if not trace:
        raise HTTPException(status_code=404, detail="Trace not found")
    return trace

@router.get("/analytics/bottlenecks")
async def get_bottlenecks():
    """Analiza cuellos de botella por paso"""
    return tracking_service.analyze_bottlenecks()
