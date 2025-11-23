from typing import List, Dict
from datetime import datetime
from db.database import get_db
from sqlalchemy import text
import json

class TrackingService:
    def save_trace(self, trace_data: Dict):
        """Guarda trace en BD"""
        db = next(get_db())
        try:
            db.execute(text("""
                INSERT INTO request_traces 
                (trace_id, query, user_id, total_time_ms, success, error, steps, created_at)
                VALUES (:trace_id, :query, :user_id, :total_time_ms, :success, :error, :steps, :created_at)
            """), {
                "trace_id": trace_data["trace_id"],
                "query": trace_data["query"],
                "user_id": trace_data["user_id"],
                "total_time_ms": trace_data["total_time_ms"],
                "success": trace_data["success"],
                "error": trace_data.get("error"),
                "steps": json.dumps(trace_data["steps"]),
                "created_at": datetime.now()
            })
            db.commit()
        finally:
            db.close()
    
    def get_traces(self, limit: int = 50) -> List[Dict]:
        """Obtiene últimos traces"""
        db = next(get_db())
        try:
            result = db.execute(text("""
                SELECT trace_id, query, user_id, total_time_ms, success, error, steps, created_at
                FROM request_traces
                ORDER BY created_at DESC
                LIMIT :limit
            """), {"limit": limit})
            
            traces = []
            for row in result:
                traces.append({
                    "trace_id": row[0],
                    "query": row[1],
                    "user_id": row[2],
                    "total_time_ms": row[3],
                    "success": row[4],
                    "error": row[5],
                    "steps": json.loads(row[6]) if row[6] else [],
                    "created_at": row[7].isoformat() if row[7] else None
                })
            return traces
        finally:
            db.close()
    
    def get_trace(self, trace_id: str) -> Dict:
        """Obtiene trace específico"""
        db = next(get_db())
        try:
            result = db.execute(text("""
                SELECT trace_id, query, user_id, total_time_ms, success, error, steps, created_at
                FROM request_traces
                WHERE trace_id = :trace_id
            """), {"trace_id": trace_id}).fetchone()
            
            if not result:
                return None
            
            return {
                "trace_id": result[0],
                "query": result[1],
                "user_id": result[2],
                "total_time_ms": result[3],
                "success": result[4],
                "error": result[5],
                "steps": json.loads(result[6]) if result[6] else [],
                "created_at": result[7].isoformat() if result[7] else None
            }
        finally:
            db.close()
    
    def analyze_bottlenecks(self) -> Dict:
        """Analiza promedios por paso"""
        db = next(get_db())
        try:
            result = db.execute(text("""
                SELECT steps FROM request_traces
                WHERE success = true AND created_at > NOW() - INTERVAL '7 days'
            """)).fetchall()
            
            step_stats = {}
            for row in result:
                steps = json.loads(row[0]) if row[0] else []
                for step in steps:
                    name = step["name"]
                    duration = step["duration_ms"]
                    
                    if name not in step_stats:
                        step_stats[name] = {"times": [], "errors": 0}
                    
                    step_stats[name]["times"].append(duration)
                    if step.get("error"):
                        step_stats[name]["errors"] += 1
            
            # Calcular promedios
            analysis = []
            for name, data in step_stats.items():
                times = data["times"]
                analysis.append({
                    "step": name,
                    "avg_ms": round(sum(times) / len(times), 2),
                    "min_ms": round(min(times), 2),
                    "max_ms": round(max(times), 2),
                    "count": len(times),
                    "errors": data["errors"]
                })
            
            # Ordenar por promedio descendente
            analysis.sort(key=lambda x: x["avg_ms"], reverse=True)
            return {"bottlenecks": analysis}
        finally:
            db.close()
