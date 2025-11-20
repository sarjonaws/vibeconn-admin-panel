// Document management
async function uploadDocument() {
    const text = document.getElementById('doc-text').value;
    
    if (!text) return showToast('✗ Contenido requerido');
    
    const id = 'doc-' + Date.now();
    
    showLoading('Indexando documento...');
    try {
        await fetch('/api/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, text, metadata: { source: 'admin', created_at: new Date().toISOString() } })
        });
        hideLoading();
        showToast('✓ Documento indexado');
        document.getElementById('doc-text').value = '';
        loadStats();
        loadDocuments();
    } catch (e) {
        hideLoading();
        showToast('✗ Error: ' + e.message);
    }
}

async function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    
    if (!file) return showToast('✗ Selecciona un archivo');
    
    const formData = new FormData();
    formData.append('file', file);
    
    showLoading('Procesando archivo...');
    try {
        const response = await fetch('/api/documents/upload-file', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        
        hideLoading();
        showToast('✓ Archivo indexado: ' + file.name);
        fileInput.value = '';
        loadStats();
        loadDocuments();
    } catch (e) {
        hideLoading();
        showToast('✗ Error: ' + e.message);
    }
}

async function deleteDocument(docId) {
    if (!confirm('¿Eliminar este documento?')) return;
    
    showLoading('Eliminando documento...');
    try {
        await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
        hideLoading();
        showToast('✓ Documento eliminado');
        loadDocuments();
        loadStats();
    } catch (e) {
        hideLoading();
        showToast('✗ Error: ' + e.message);
    }
}

async function loadDocuments() {
    try {
        const res = await fetch('/api/documents');
        const docs = await res.json();
        hideLoading();
        const tbody = document.getElementById('docs-table');
        
        if (docs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#7f8c8d;">No hay documentos indexados</td></tr>';
            return;
        }
        
        tbody.innerHTML = docs.slice(0, 50).map(doc => {
            const originalTokens = doc.original_tokens || 0;
            const compressedTokens = doc.compressed_tokens || 0;
            const understanding = doc.semantic_understanding || 0;
            
            let understandingColor = '#e74c3c';
            if (understanding >= 80) understandingColor = '#27ae60';
            else if (understanding >= 60) understandingColor = '#f39c12';
            
            return `
            <tr>
                <td><code style="font-size:11px;">${doc.id}</code></td>
                <td class="text-truncate">${doc.semantic_core || doc.original_text || ''}</td>
                <td style="font-size:12px;">
                    <div style="color:#7f8c8d;">${originalTokens.toLocaleString()} → ${compressedTokens.toLocaleString()}</div>
                </td>
                <td style="font-size:12px;">${doc.compression_ratio || 'N/A'}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="flex:1;background:#ecf0f1;border-radius:4px;height:8px;overflow:hidden;">
                            <div style="width:${understanding}%;background:${understandingColor};height:100%;"></div>
                        </div>
                        <span style="font-size:12px;font-weight:600;color:${understandingColor};min-width:40px;">${understanding}%</span>
                    </div>
                </td>
                <td style="font-size:11px;color:#7f8c8d;">${doc.metadata?.created_at ? new Date(doc.metadata.created_at).toLocaleString() : '-'}</td>
                <td>
                    <button class="btn-sm" onclick="viewDocument('${doc.id}')">Ver</button>
                    <button class="btn-sm" style="background:#e74c3c;margin-left:4px;" onclick="deleteDocument('${doc.id}')">Eliminar</button>
                </td>
            </tr>
            `;
        }).join('');
    } catch (e) {
        console.error('Error loading documents:', e);
    }
}

async function viewDocument(docId) {
    showLoading('Cargando documento...');
    try {
        const res = await fetch('/api/documents');
        const docs = await res.json();
        const doc = docs.find(d => d.id === docId);
        
        if (!doc) {
            hideLoading();
            showToast('✗ Documento no encontrado');
            return;
        }
        
        hideLoading();
        
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        const content = document.createElement('div');
        content.style.cssText = 'background:white;border-radius:8px;max-width:900px;max-height:90vh;overflow:auto;padding:24px;';
        
        const originalTokens = doc.original_tokens || 0;
        const compressedTokens = doc.compressed_tokens || 0;
        const tokensSaved = doc.tokens_saved || 0;
        const understanding = doc.semantic_understanding || 0;
        
        let understandingColor = '#e74c3c';
        if (understanding >= 80) understandingColor = '#27ae60';
        else if (understanding >= 60) understandingColor = '#f39c12';
        
        content.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="margin:0;">📄 ${doc.id}</h3>
                <button onclick="this.closest('div[style*=fixed]').remove()" style="background:#e74c3c;border:none;color:white;padding:8px 16px;border-radius:4px;cursor:pointer;">Cerrar</button>
            </div>
            
            <div style="margin-bottom:16px;padding:12px;background:#ecf0f1;border-radius:4px;font-size:13px;">
                <strong>Metadata:</strong><br>
                Fuente: ${doc.metadata?.source || 'N/A'}<br>
                ${doc.metadata?.filename ? 'Archivo: ' + doc.metadata.filename + '<br>' : ''}
                Fecha: ${doc.metadata?.created_at ? new Date(doc.metadata.created_at).toLocaleString() : 'N/A'}<br>
                Compresión: ${doc.compression_ratio || 'N/A'}
            </div>
            
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
                <div style="padding:12px;background:#e3f2fd;border-radius:4px;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:#1976d2;">${originalTokens.toLocaleString()}</div>
                    <div style="font-size:11px;color:#7f8c8d;margin-top:4px;">TOKENS ORIGINALES</div>
                </div>
                <div style="padding:12px;background:#e8f5e9;border-radius:4px;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:#388e3c;">${compressedTokens.toLocaleString()}</div>
                    <div style="font-size:11px;color:#7f8c8d;margin-top:4px;">TOKENS COMPRIMIDOS</div>
                </div>
                <div style="padding:12px;background:#fff3e0;border-radius:4px;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:#f57c00;">${tokensSaved.toLocaleString()}</div>
                    <div style="font-size:11px;color:#7f8c8d;margin-top:4px;">TOKENS AHORRADOS</div>
                </div>
            </div>
            
            <div style="margin-bottom:16px;padding:12px;background:#f8f9fa;border-radius:4px;">
                <div style="font-size:13px;font-weight:600;margin-bottom:8px;">Entendimiento Semántico</div>
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="flex:1;background:#ecf0f1;border-radius:8px;height:16px;overflow:hidden;">
                        <div style="width:${understanding}%;background:${understandingColor};height:100%;transition:width 0.3s;"></div>
                    </div>
                    <span style="font-size:18px;font-weight:700;color:${understandingColor};min-width:50px;">${understanding}%</span>
                </div>
            </div>
            
            ${doc.original_text ? `
            <div style="margin-bottom:20px;">
                <h4 style="margin:0 0 8px 0;color:#2c3e50;">📝 Texto Original</h4>
                <div style="background:#f8f9fa;padding:16px;border-radius:4px;border-left:3px solid #3498db;max-height:300px;overflow:auto;white-space:pre-wrap;font-size:13px;line-height:1.6;">${doc.original_text}</div>
            </div>
            ` : ''}
            
            ${doc.semantic_core ? `
            <div>
                <h4 style="margin:0 0 8px 0;color:#2c3e50;">✨ Texto Comprimido (Núcleo Semántico)</h4>
                <div style="background:#e8f5e9;padding:16px;border-radius:4px;border-left:3px solid #27ae60;max-height:300px;overflow:auto;white-space:pre-wrap;font-size:13px;line-height:1.6;">${doc.semantic_core}</div>
            </div>
            ` : ''}
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        setTimeout(() => {
            const bar = content.querySelector('div[style*="width:' + understanding + '%"]');
            if (bar) bar.style.width = understanding + '%';
        }, 100);
    } catch (e) {
        hideLoading();
        showToast('✗ Error: ' + e.message);
    }
}
