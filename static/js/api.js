// API calls
async function loadHealth() {
    const res = await fetch('/api/health');
    const health = await res.json();
    const statusDiv = document.getElementById('status');
    const online = Object.values(health).filter(s => s === 'online').length;
    
    statusDiv.innerHTML = Object.entries(health).map(([service, status]) => 
        `<span class="status-badge ${status}">${SERVICES[service].name}</span>`
    ).join('');
    
    document.getElementById('stat-services').textContent = `${online}/3`;
    
    const servicesStatus = document.getElementById('services-status');
    servicesStatus.innerHTML = Object.entries(health).map(([service, status]) => `
        <div class="form-group">
            <label class="form-label">${SERVICES[service].name}</label>
            <span>${SERVICES[service].port}</span>
            <span class="status-badge ${status}">${status}</span>
        </div>
    `).join('');
}

async function loadStats() {
    try {
        const docsRes = await fetch('/api/documents');
        const docs = await docsRes.json();
        const reqsRes = await fetch('/api/requests');
        const reqsData = await reqsRes.json();
        const requests = reqsData.requests || [];
        
        const totalDocs = docs.length;
        let totalOriginal = 0;
        let totalCompressed = 0;
        
        docs.forEach(doc => {
            totalOriginal += doc.original_tokens || 0;
            totalCompressed += doc.compressed_tokens || 0;
        });
        
        // Costos OpenAI (USD)
        const COST_PER_1K_INPUT = 0.00015; // gpt-4o-mini input
        const COST_PER_1K_OUTPUT = 0.0006; // gpt-4o-mini output
        const USD_TO_MXN = 20; // Tipo de cambio aproximado
        
        // Costo de compresión (todos los tokens originales procesados)
        const compressionCostUSD = (totalOriginal / 1000) * COST_PER_1K_INPUT;
        const compressionCostMXN = compressionCostUSD * USD_TO_MXN;
        
        // Costo de consultas (suma de todos los tokens usados en requests)
        let totalQueryTokens = 0;
        requests.forEach(req => {
            totalQueryTokens += req.tokens_used || 0;
        });
        const queryCostUSD = (totalQueryTokens / 1000) * (COST_PER_1K_INPUT + COST_PER_1K_OUTPUT);
        const queryCostMXN = queryCostUSD * USD_TO_MXN;
        
        const totalCostMXN = compressionCostMXN + queryCostMXN;
        
        document.getElementById('stat-docs').textContent = totalDocs;
        document.getElementById('stat-vectors').textContent = totalDocs;
        document.getElementById('stat-original-tokens').textContent = totalOriginal.toLocaleString();
        document.getElementById('stat-compressed-tokens').textContent = totalCompressed.toLocaleString();
        document.getElementById('stat-tokens-saved').textContent = (totalOriginal - totalCompressed).toLocaleString();
        document.getElementById('stat-cost-compression').textContent = '$' + compressionCostMXN.toFixed(2);
        document.getElementById('stat-cost-queries').textContent = '$' + queryCostMXN.toFixed(2);
        document.getElementById('stat-cost-total').textContent = '$' + totalCostMXN.toFixed(2);
    } catch (e) {
        console.error('Error loading stats:', e);
    }
}

async function loadBehaviorPrompt() {
    try {
        const res = await fetch('/api/behavior-prompts');
        const data = await res.json();
        const prompts = data.prompts || [];
        const tbody = document.getElementById('prompts-table');
        
        if (prompts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#7f8c8d;">No hay prompts guardados</td></tr>';
            return;
        }
        
        tbody.innerHTML = prompts.map(p => `
            <tr style="${p.active ? 'background:#e8f5e9;' : ''}">
                <td style="text-align:center;">
                    ${p.active ? '<span style="color:#27ae60;font-size:18px;">✓</span>' : ''}
                </td>
                <td class="text-truncate" title="${p.prompt}">${p.prompt}</td>
                <td style="font-size:11px;color:#7f8c8d;">${new Date(p.created_at).toLocaleString()}</td>
                <td>
                    ${!p.active ? `<button class="btn-sm btn-success" onclick="activatePrompt(${p.id})">Activar</button>` : '<span style="color:#27ae60;font-weight:600;">ACTIVO</span>'}
                    <button class="btn-sm" style="background:#e74c3c;margin-left:4px;" onclick="deletePrompt(${p.id})" ${p.active ? 'disabled' : ''}>Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('Error loading behavior prompts:', e);
    }
}

async function createBehaviorPrompt() {
    const prompt = document.getElementById('new-behavior-prompt').value.trim();
    
    if (!prompt) return showToast('✗ Escribe un prompt');
    
    showLoading('Creando prompt...');
    try {
        await fetch('/api/behavior-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        hideLoading();
        showToast('✓ Prompt creado y activado');
        document.getElementById('new-behavior-prompt').value = '';
        loadBehaviorPrompt();
    } catch (e) {
        hideLoading();
        showToast('✗ Error: ' + e.message);
    }
}

async function activatePrompt(promptId) {
    showLoading('Activando prompt...');
    try {
        await fetch(`/api/behavior-prompt/${promptId}/activate`, { method: 'POST' });
        hideLoading();
        showToast('✓ Prompt activado');
        loadBehaviorPrompt();
    } catch (e) {
        hideLoading();
        showToast('✗ Error: ' + e.message);
    }
}

async function deletePrompt(promptId) {
    if (!confirm('¿Eliminar este prompt?')) return;
    
    showLoading('Eliminando prompt...');
    try {
        await fetch(`/api/behavior-prompt/${promptId}`, { method: 'DELETE' });
        hideLoading();
        showToast('✓ Prompt eliminado');
        loadBehaviorPrompt();
    } catch (e) {
        hideLoading();
        showToast('✗ Error: ' + e.message);
    }
}
