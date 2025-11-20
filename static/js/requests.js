// API requests tracking
async function loadApiRequests() {
    try {
        const res = await fetch('/api/requests');
        const data = await res.json();
        const requests = data.requests || [];
        const tbody = document.getElementById('requests-table');
        
        if (requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#7f8c8d;">No hay peticiones registradas</td></tr>';
            return;
        }
        
        tbody.innerHTML = requests.map(r => `
            <tr>
                <td style="font-size:11px;">${new Date(r.created_at).toLocaleString()}</td>
                <td style="text-align:center;font-weight:600;color:#3498db;">${r.tokens_used}</td>
                <td style="text-align:center;font-weight:600;color:#27ae60;">${Math.round(r.response_time_ms)}</td>
                <td style="font-size:12px;">${r.model}</td>
                <td class="text-truncate" style="max-width:300px;" title="${r.full_prompt}">${r.full_prompt}</td>
                <td><button class="btn-sm" onclick="viewRequest(${r.id})">Ver</button></td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('Error loading requests:', e);
    }
}

async function viewRequest(requestId) {
    try {
        const res = await fetch('/api/requests');
        const data = await res.json();
        const request = data.requests.find(r => r.id === requestId);
        
        if (!request) return;
        
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        const content = document.createElement('div');
        content.style.cssText = 'background:white;border-radius:8px;max-width:900px;max-height:90vh;overflow:auto;padding:24px;';
        
        content.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="margin:0;">📊 Detalles de Petición</h3>
                <button onclick="this.closest('div[style*=fixed]').remove()" style="background:#e74c3c;border:none;color:white;padding:8px 16px;border-radius:4px;cursor:pointer;">Cerrar</button>
            </div>
            
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
                <div style="padding:12px;background:#e3f2fd;border-radius:4px;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:#1976d2;">${request.tokens_used}</div>
                    <div style="font-size:11px;color:#7f8c8d;margin-top:4px;">TOKENS USADOS</div>
                </div>
                <div style="padding:12px;background:#e8f5e9;border-radius:4px;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:#388e3c;">${Math.round(request.response_time_ms)}ms</div>
                    <div style="font-size:11px;color:#7f8c8d;margin-top:4px;">TIEMPO DE RESPUESTA</div>
                </div>
                <div style="padding:12px;background:#fff3e0;border-radius:4px;text-align:center;">
                    <div style="font-size:14px;font-weight:700;color:#f57c00;">${request.model}</div>
                    <div style="font-size:11px;color:#7f8c8d;margin-top:4px;">MODELO</div>
                </div>
            </div>
            
            <div style="margin-bottom:16px;">
                <h4 style="margin:0 0 8px 0;color:#2c3e50;">📝 Prompt Completo</h4>
                <div style="background:#f8f9fa;padding:16px;border-radius:4px;border-left:3px solid #3498db;max-height:300px;overflow:auto;white-space:pre-wrap;font-size:13px;line-height:1.6;font-family:monospace;">${request.full_prompt}</div>
            </div>
            
            <div>
                <h4 style="margin:0 0 8px 0;color:#2c3e50;">✨ Respuesta</h4>
                <div style="background:#e8f5e9;padding:16px;border-radius:4px;border-left:3px solid #27ae60;max-height:300px;overflow:auto;white-space:pre-wrap;font-size:13px;line-height:1.6;">${request.response}</div>
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
    } catch (e) {
        showToast('✗ Error: ' + e.message);
    }
}
