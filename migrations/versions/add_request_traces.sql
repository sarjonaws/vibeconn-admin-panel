-- Migration: Add request_traces table
CREATE TABLE IF NOT EXISTS request_traces (
    id SERIAL PRIMARY KEY,
    trace_id TEXT UNIQUE NOT NULL,
    query TEXT NOT NULL,
    user_id TEXT,
    total_time_ms REAL NOT NULL,
    success BOOLEAN NOT NULL,
    error TEXT,
    steps TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_traces_created_at ON request_traces(created_at);
CREATE INDEX IF NOT EXISTS idx_traces_trace_id ON request_traces(trace_id);
