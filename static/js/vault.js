// showNotification is now a global function from utils.js

const VAULT_SERVICES = ['compress', 'vector', 'semantic'];

window.initVault = async function() {
    console.log('Initializing Vault...');
    await checkVaultStatus();
    await loadAllSecrets();
    setupEventListeners();
}

async function checkVaultStatus() {
    try {
        const response = await fetch('/api/vault/status');
        const data = await response.json();
        const statusEl = document.getElementById('vault-status');
        if (statusEl) {
            statusEl.textContent = data.authenticated ? 'Conectado' : 'Desconectado';
            statusEl.className = data.authenticated ? 'badge bg-success' : 'badge bg-danger';
        }
    } catch (error) {
        console.error('Error checking vault status:', error);
    }
}

async function loadAllSecrets() {
    for (const service of VAULT_SERVICES) {
        await loadServiceSecrets(service);
    }
}

window.showVaultTab = function(service) {
    // Hide all tabs
    document.querySelectorAll('.vault-tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(`vault-${service}-content`).classList.add('active');
    event.target.closest('.sub-tab').classList.add('active');
}

async function loadServiceSecrets(service) {
    try {
        const response = await fetch(`/api/vault/secrets/${service}`);
        const data = await response.json();
        const container = document.getElementById(`secrets-${service}`);
        
        if (!container) return;

        const secrets = data.secrets || {};
        const keys = Object.keys(secrets);

        if (keys.length === 0) {
            container.innerHTML = `
                <div class="empty-secrets">
                    <i class="bi bi-key"></i>
                    <div style="font-size:14px;font-weight:500;margin-bottom:4px;">Sin secretos configurados</div>
                    <div style="font-size:12px;">Usa el botón "Editar en Masa" para agregar variables</div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="background:#f8f9fa;border-radius:8px;padding:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <div style="font-weight:600;color:#1e293b;">
                        <i class="bi bi-list-ul" style="color:#3b82f6;margin-right:8px;"></i>
                        Variables Configuradas (${keys.length})
                    </div>
                </div>
                ${keys.map(key => `
                    <div class="secret-item-improved" style="background:white;margin-bottom:8px;border:1px solid #e2e8f0;">
                        <div style="flex:1;">
                            <div class="secret-key">
                                <i class="bi bi-key-fill" style="color:#3b82f6;margin-right:8px;"></i>
                                ${key}
                            </div>
                            <div class="secret-value">${maskValue(secrets[key])}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error(`Error loading secrets for ${service}:`, error);
        const container = document.getElementById(`secrets-${service}`);
        if (container) {
            container.innerHTML = `
                <div class="empty-secrets">
                    <i class="bi bi-exclamation-triangle" style="color:#ef4444;"></i>
                    <div style="font-size:14px;font-weight:500;color:#ef4444;">Error al cargar secretos</div>
                </div>
            `;
        }
    }
}

function maskValue(value) {
    if (!value) return '';
    const str = String(value);
    if (str.length <= 8) return '***';
    return str.substring(0, 4) + '***' + str.substring(str.length - 4);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

function setupEventListeners() {
    const bulkSaveBtn = document.getElementById('save-bulk-edit-btn');
    if (bulkSaveBtn) {
        bulkSaveBtn.addEventListener('click', saveBulkEdit);
    }
}

// Bulk Edit Functions
window.showBulkEditModal = async function(service) {
    try {
        const response = await fetch(`/api/vault/secrets/${service}`);
        const data = await response.json();
        const secrets = data.secrets || {};
        
        // Convertir secretos a formato KEY=VALUE
        const envText = Object.entries(secrets)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        
        document.getElementById('bulk-edit-modal-title').innerHTML = `<i class="bi bi-pencil-square" style="color:#3b82f6;"></i> Editar Variables en Masa - ${service}`;
        document.getElementById('bulk-edit-service').value = service;
        document.getElementById('bulk-edit-textarea').value = envText;
        
        validateBulkEdit();
        
        const modal = new bootstrap.Modal(document.getElementById('bulkEditModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading secrets for bulk edit:', error);
        showNotification('Error al cargar secretos', 'danger');
    }
}

window.validateBulkEdit = function() {
    const textarea = document.getElementById('bulk-edit-textarea');
    const errorsDiv = document.getElementById('bulk-edit-errors');
    const countSpan = document.getElementById('bulk-edit-count');
    const saveBtn = document.getElementById('save-bulk-edit-btn');
    
    const lines = textarea.value.split('\n').filter(line => line.trim() !== '');
    const errors = [];
    const validVars = [];
    
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmedLine = line.trim();
        
        // Ignorar líneas vacías o comentarios
        if (trimmedLine === '' || trimmedLine.startsWith('#')) {
            return;
        }
        
        // Validar formato KEY=VALUE
        if (!trimmedLine.includes('=')) {
            errors.push(`Línea ${lineNum}: Falta el signo '=' (formato: CLAVE=valor)`);
            return;
        }
        
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('='); // Permite '=' en el valor
        
        if (!key.trim()) {
            errors.push(`Línea ${lineNum}: La clave no puede estar vacía`);
            return;
        }
        
        if (value === undefined || value === '') {
            errors.push(`Línea ${lineNum}: El valor no puede estar vacío`);
            return;
        }
        
        // Validar que la clave use el formato correcto (mayúsculas y guiones bajos)
        if (!/^[A-Z][A-Z0-9_]*$/.test(key.trim())) {
            errors.push(`Línea ${lineNum}: La clave '${key}' debe usar mayúsculas y guiones bajos (ej: MY_API_KEY)`);
        }
        
        validVars.push(key.trim());
    });
    
    // Actualizar contador
    countSpan.textContent = `${validVars.length} variable${validVars.length !== 1 ? 's' : ''}`;
    
    // Mostrar errores
    if (errors.length > 0) {
        errorsDiv.innerHTML = `
            <div class="alert alert-danger" style="padding:12px;margin:0;">
                <strong><i class="bi bi-exclamation-triangle"></i> Errores encontrados:</strong>
                <ul style="margin:8px 0 0 0;padding-left:20px;font-size:12px;">
                    ${errors.map(err => `<li>${err}</li>`).join('')}
                </ul>
            </div>
        `;
        saveBtn.disabled = true;
    } else if (validVars.length === 0) {
        errorsDiv.innerHTML = `
            <div class="alert alert-warning" style="padding:12px;margin:0;font-size:12px;">
                <i class="bi bi-info-circle"></i> No hay variables para guardar
            </div>
        `;
        saveBtn.disabled = true;
    } else {
        errorsDiv.innerHTML = `
            <div class="alert alert-success" style="padding:12px;margin:0;font-size:12px;">
                <i class="bi bi-check-circle"></i> Formato correcto. Listo para guardar ${validVars.length} variable${validVars.length !== 1 ? 's' : ''}.
            </div>
        `;
        saveBtn.disabled = false;
    }
}

window.saveBulkEdit = async function() {
    const service = document.getElementById('bulk-edit-service').value;
    const textarea = document.getElementById('bulk-edit-textarea').value;
    const saveBtn = document.getElementById('save-bulk-edit-btn');
    
    // Parsear las variables
    const secrets = {};
    const lines = textarea.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === '' || trimmedLine.startsWith('#')) continue;
        
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=');
        
        if (key.trim() && value !== undefined) {
            secrets[key.trim()] = value;
        }
    }
    
    if (Object.keys(secrets).length === 0) {
        showNotification('No hay variables para guardar', 'warning');
        return;
    }
    
    try {
        // Deshabilitar botón mientras guarda
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Guardando...';
        
        const response = await fetch(`/api/vault/secrets/${service}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secrets })
        });
        
        if (response.ok) {
            showNotification(`${Object.keys(secrets).length} variables guardadas exitosamente`, 'success');
            bootstrap.Modal.getInstance(document.getElementById('bulkEditModal')).hide();
            await loadServiceSecrets(service);
        } else {
            showNotification('Error al guardar las variables', 'danger');
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="bi bi-check-circle"></i> Guardar Todas';
        }
    } catch (error) {
        console.error('Error saving bulk secrets:', error);
        showNotification('Error al guardar las variables', 'danger');
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="bi bi-check-circle"></i> Guardar Todas';
    }
}

// Functions are now global: showBulkEditModal, validateBulkEdit, saveBulkEdit
