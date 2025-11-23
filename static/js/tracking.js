// Tracking UI
async function loadTraces() {
    const res = await fetch('/api/tracking/traces?limit=20');
    const traces = await res.json();
    
    const tbody = document.getElementById('traces-tbody');
    tbody.innerHTML = traces.map(t => `
        <tr onclick="showTraceDetail('${t.trace_id}')" style="cursor:pointer">
            <td>${t.trace_id.substring(0,8)}</td>
            <td>${t.query.substring(0,50)}...</td>
            <td>${t.total_time_ms.toFixed(0)}ms</td>
            <td>${t.success ? '✅' : '❌'}</td>
            <td>${new Date(t.created_at).toLocaleString()}</td>
        </tr>
    `).join('');
}

async function showTraceDetail(traceId) {
    const res = await fetch(`/api/tracking/traces/${traceId}`);
    const trace = await res.json();
    
    const detail = document.getElementById('trace-detail');
    detail.innerHTML = `
        <h3>Trace: ${trace.trace_id}</h3>
        <p><strong>Query:</strong> ${trace.query}</p>
        <p><strong>Total:</strong> ${trace.total_time_ms.toFixed(0)}ms</p>
        <h4>Steps:</h4>
        <table class="table">
            <thead><tr><th>Step</th><th>Duration</th><th>Metadata</th></tr></thead>
            <tbody>
                ${trace.steps.map(s => `
                    <tr>
                        <td>${s.name}</td>
                        <td><strong>${s.duration_ms.toFixed(0)}ms</strong></td>
                        <td>${JSON.stringify(s.metadata)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function loadBottlenecks() {
    const res = await fetch('/api/tracking/analytics/bottlenecks');
    const data = await res.json();
    
    const tbody = document.getElementById('bottlenecks-tbody');
    tbody.innerHTML = data.bottlenecks.map(b => `
        <tr>
            <td>${b.step}</td>
            <td><strong>${b.avg_ms.toFixed(0)}ms</strong></td>
            <td>${b.min_ms.toFixed(0)}ms</td>
            <td>${b.max_ms.toFixed(0)}ms</td>
            <td>${b.count}</td>
            <td>${b.errors > 0 ? '⚠️ ' + b.errors : '✅'}</td>
        </tr>
    `).join('');
}

// Auto-refresh cada 10s
setInterval(() => {
    if (document.getElementById('traces-tbody')) loadTraces();
    if (document.getElementById('bottlenecks-tbody')) loadBottlenecks();
}, 10000);
