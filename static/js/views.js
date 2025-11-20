// HTML views for each tab
const VIEWS = {
    dashboard: `
        <div class="grid-3">
            <div class="card"><div class="stat-box"><div class="stat-value" id="stat-docs">0</div><div class="stat-label">Documentos</div></div></div>
            <div class="card"><div class="stat-box"><div class="stat-value" id="stat-vectors">0</div><div class="stat-label">Vectores</div></div></div>
            <div class="card"><div class="stat-box"><div class="stat-value" id="stat-services">0/3</div><div class="stat-label">Servicios Online</div></div></div>
        </div>
        <div class="grid-3">
            <div class="card"><div class="stat-box" style="background:#e3f2fd;"><div class="stat-value" style="color:#1976d2;" id="stat-original-tokens">0</div><div class="stat-label">Tokens Originales</div></div></div>
            <div class="card"><div class="stat-box" style="background:#e8f5e9;"><div class="stat-value" style="color:#388e3c;" id="stat-compressed-tokens">0</div><div class="stat-label">Tokens Comprimidos</div></div></div>
            <div class="card"><div class="stat-box" style="background:#fff3e0;"><div class="stat-value" style="color:#f57c00;" id="stat-tokens-saved">0</div><div class="stat-label">Tokens Ahorrados</div></div></div>
        </div>
        <div class="grid-3">
            <div class="card"><div class="stat-box" style="background:#fce4ec;"><div class="stat-value" style="color:#c2185b;" id="stat-cost-compression">$0.00</div><div class="stat-label">Costo Compresión (MXN)</div></div></div>
            <div class="card"><div class="stat-box" style="background:#f3e5f5;"><div class="stat-value" style="color:#7b1fa2;" id="stat-cost-queries">$0.00</div><div class="stat-label">Costo Consultas (MXN)</div></div></div>
            <div class="card"><div class="stat-box" style="background:#e8eaf6;"><div class="stat-value" style="color:#303f9f;" id="stat-cost-total">$0.00</div><div class="stat-label">Costo Total (MXN)</div></div></div>
        </div>
        <div class="card"><div class="card-title">Estado de Servicios</div><div id="services-status"></div></div>
        <div class="grid-2">
            <div class="card"><div class="card-title">☁️ Nube de Palabras Más Usadas</div><div id="word-cloud" style="min-height:300px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:20px;"></div></div>
            <div class="card"><div class="card-title">📊 Palabras con Más Tokens</div><div id="token-chart" style="min-height:300px;padding:20px;"></div></div>
        </div>
        <div class="card"><div class="card-title">🗺️ Mapa de Espacio Vectorial (t-SNE 2D)</div><div id="vector-map" style="min-height:400px;position:relative;background:#f8f9fa;border-radius:4px;"></div></div>
    `,
    
    vault: `
        <div class="card">
            <div class="card-title">🔐 HashiCorp Vault - Gestión de Secretos</div>
            <div class="alert alert-info" style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <strong>Estado de conexión:</strong> <span id="vault-status" class="badge bg-secondary">Verificando...</span>
                    <div style="margin-top:4px;font-size:12px;color:#6b7280;">
                        Gestiona de forma segura las API keys y secretos de los servicios
                    </div>
                </div>
                <button class="btn-sm btn-success" onclick="window.initVault()" style="flex-shrink:0;">
                    <i class="bi bi-arrow-clockwise"></i> Recargar
                </button>
            </div>
        </div>
        
        <div class="sub-tabs">
            <div class="sub-tab active" onclick="showVaultTab('compress')">
                <i class="bi bi-file-zip"></i> Compress Service
            </div>
            <div class="sub-tab" onclick="showVaultTab('vector')">
                <i class="bi bi-diagram-3"></i> Vector Engine
            </div>
            <div class="sub-tab" onclick="showVaultTab('semantic')">
                <i class="bi bi-chat-dots"></i> Semantic Context
            </div>
        </div>
        
        <div id="vault-compress-content" class="vault-tab-content active">
            <div class="card">
                <div class="card-header-vault">
                    <h5 style="margin:0;color:#111827;font-size:15px;font-weight:600;">
                        <i class="bi bi-file-zip" style="color:#3b82f6;"></i> Compress Service
                    </h5>
                    <button class="btn-sm btn-primary" onclick="showBulkEditModal('compress')" title="Editar todas las variables de entorno">
                        <i class="bi bi-pencil-square"></i> Editar Variables
                    </button>
                </div>
                <div id="secrets-compress" class="secrets-list-improved"></div>
            </div>
        </div>
        
        <div id="vault-vector-content" class="vault-tab-content">
            <div class="card">
                <div class="card-header-vault">
                    <h5 style="margin:0;color:#111827;font-size:15px;font-weight:600;">
                        <i class="bi bi-diagram-3" style="color:#3b82f6;"></i> Vector Engine
                    </h5>
                    <button class="btn-sm btn-primary" onclick="showBulkEditModal('vector')" title="Editar todas las variables de entorno">
                        <i class="bi bi-pencil-square"></i> Editar Variables
                    </button>
                </div>
                <div id="secrets-vector" class="secrets-list-improved"></div>
            </div>
        </div>
        
        <div id="vault-semantic-content" class="vault-tab-content">
            <div class="card">
                <div class="card-header-vault">
                    <h5 style="margin:0;color:#111827;font-size:15px;font-weight:600;">
                        <i class="bi bi-chat-dots" style="color:#3b82f6;"></i> Semantic Context
                    </h5>
                    <button class="btn-sm btn-primary" onclick="showBulkEditModal('semantic')" title="Editar todas las variables de entorno">
                        <i class="bi bi-pencil-square"></i> Editar Variables
                    </button>
                </div>
                <div id="secrets-semantic" class="secrets-list-improved"></div>
            </div>
        </div>
    `,
    
    behavior: `
        <div class="card">
            <div class="card-title">🎭 Crear Nuevo Prompt</div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Prompt</label>
                    <textarea id="new-behavior-prompt" placeholder="Ejemplo: Responde siempre de forma amigable y concisa. Usa emojis cuando sea apropiado." style="min-height: 100px;"></textarea>
                    <button class="btn-success" onclick="createBehaviorPrompt()">Crear y Activar</button>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-title">📋 Historial de Prompts</div>
            <div class="alert alert-warning">El prompt activo se aplica automáticamente a todas las consultas RAG</div>
            <table><thead><tr><th style="width: 50px;">Estado</th><th>Prompt</th><th style="width: 150px;">Fecha</th><th style="width: 180px;">Acciones</th></tr></thead><tbody id="prompts-table"></tbody></table>
        </div>
    `,
    
    agents: `
        <div class="card">
            <div class="card-title">⚡ Plantillas Rápidas</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn-sm" onclick="fillAgentTemplate('python')" style="background:#3776ab;color:white;">🐍 Python</button>
                <button class="btn-sm" onclick="fillAgentTemplate('devops')" style="background:#326ce5;color:white;">🛠️ DevOps</button>
                <button class="btn-sm" onclick="fillAgentTemplate('legal')" style="background:#8b4513;color:white;">⚖️ Legal</button>
                <button class="btn-sm" onclick="fillAgentTemplate('marketing')" style="background:#ff6b6b;color:white;">📊 Marketing</button>
                <button class="btn-sm" onclick="fillAgentTemplate('finanzas')" style="background:#2ecc71;color:white;">💰 Finanzas</button>
                <button class="btn-sm" onclick="fillAgentTemplate('soporte')" style="background:#9b59b6;color:white;">🎫 Soporte</button>
                <button class="btn-sm" onclick="fillAgentTemplate('datos')" style="background:#e67e22;color:white;">📊 Data Science</button>
                <button class="btn-sm" onclick="fillAgentTemplate('seguridad')" style="background:#e74c3c;color:white;">🔒 Seguridad</button>
            </div>
        </div>
        <div class="card">
            <div class="card-title">🤖 Crear Agente Experto</div>
            <div class="form-grid">
                <div class="form-group"><label class="form-label">Nombre 🏷️</label><input type="text" id="agent-name" placeholder="Ej: Experto en Python"><div style="font-size:11px;color:#7f8c8d;margin-top:4px;">Identificador único del agente</div></div>
                <div class="form-group"><label class="form-label">Tema 📚</label><input type="text" id="agent-topic" placeholder="Ej: Programación Python"><div style="font-size:11px;color:#7f8c8d;margin-top:4px;">Área de especialización</div></div>
                <div class="form-group"><label class="form-label">Prompt del Sistema 🧠</label><textarea id="agent-prompt" placeholder="Eres un experto en Python con 10 años de experiencia. Respondes con ejemplos prácticos y buenas prácticas." style="min-height:100px;"></textarea><div style="font-size:11px;color:#7f8c8d;margin-top:4px;">Define la personalidad y comportamiento del agente</div></div>
                <div class="form-group"><label class="form-label">Filtros de Documentos 🔍</label><input type="text" id="agent-filters" placeholder="Ej: python, django, flask (opcional)"><div style="font-size:11px;color:#7f8c8d;margin-top:4px;">Palabras clave para filtrar documentos relevantes (separadas por comas)</div></div>
                <div class="form-group"><label class="form-label">Temperatura 🌡️ <span id="temp-value" style="color:#3498db;font-weight:600;">0.7</span></label><input type="range" id="agent-temperature" value="0.7" min="0" max="1" step="0.1" oninput="document.getElementById('temp-value').textContent = this.value" style="width:100%;"><div style="font-size:11px;color:#7f8c8d;margin-top:4px;"><strong>0.0-0.3:</strong> Preciso y determinista | <strong>0.4-0.6:</strong> Balanceado | <strong>0.7-0.9:</strong> Creativo | <strong>1.0:</strong> Máxima creatividad</div></div>
                <div class="form-group"><span></span><span></span><button class="btn-success" onclick="createAgent()" style="width:100%;">Crear Agente</button></div>
            </div>
        </div>
        <div class="card">
            <div class="card-title">📋 Agentes Creados</div>
            <table><thead><tr><th>Estado</th><th>Nombre</th><th>Tema</th><th>Temperatura</th><th>Fecha</th><th style="width: 180px;">Acciones</th></tr></thead><tbody id="agents-table"></tbody></table>
        </div>
    `,
    
    documents: `
        <div class="card">
            <div class="card-title">📄 Indexar Documento de Texto</div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Contenido</label>
                    <textarea id="doc-text" placeholder="Contenido del documento..."></textarea>
                    <button class="btn-success" onclick="uploadDocument()">Indexar</button>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-title">📁 Subir Archivo (PDF, Excel)</div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Archivo</label>
                    <input type="file" id="file-input" accept=".pdf,.xlsx,.xls" style="padding:8px;">
                    <button class="btn-success" onclick="uploadFile()">Subir e Indexar</button>
                </div>
            </div>
            <div style="margin-top:12px;font-size:12px;color:#7f8c8d;">• Formatos soportados: PDF, Excel (.xlsx, .xls)<br>• El texto se extraerá automáticamente y se indexará</div>
        </div>
        <div class="card">
            <div class="card-title">📋 Documentos Indexados</div>
            <table><thead><tr><th>ID</th><th>Contenido</th><th>Tokens</th><th>Compresión</th><th>Entendimiento</th><th>Fecha</th><th style="width: 150px;">Acciones</th></tr></thead><tbody id="docs-table"></tbody></table>
        </div>
    `,
    
    query: `
        <div class="chat-container">
            <div class="chat-sidebar">
                <div style="padding:16px;border-bottom:1px solid #e5e7eb;flex-shrink:0;">
                    <button onclick="newChat()" style="width:100%;padding:12px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;margin-bottom:12px;">+ Nueva Conversación</button>
                    <select id="agent-selector" style="width:100%;padding:10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:white;margin-bottom:12px;" onchange="onAgentChange()">
                        <option value="">🤖 Sin agente específico</option>
                    </select>
                    <div style="margin-bottom:8px;">
                        <label style="font-size:12px;color:#6b7280;font-weight:500;display:block;margin-bottom:4px;">Tokens máximos: <span id="max-tokens-value" style="color:#3b82f6;font-weight:600;">2000</span></label>
                        <input type="range" id="max-tokens-slider" value="2000" min="500" max="4000" step="100" style="width:100%;" oninput="document.getElementById('max-tokens-value').textContent = this.value">
                        <div style="font-size:10px;color:#9ca3af;margin-top:2px;">500 (corto) - 4000 (largo)</div>
                    </div>
                </div>
                <div id="chat-sessions" style="flex:1;overflow-y:auto;padding:8px;"></div>
            </div>
            <div class="chat-main">
                <div style="padding:16px;border-bottom:1px solid #e5e7eb;background:#f8f9fa;flex-shrink:0;display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="margin:0;font-size:16px;color:#111827;">💬 Chat RAG</h3>
                    <span id="current-agent-badge" style="font-size:12px;color:#6b7280;font-weight:500;"></span>
                </div>
                <div id="chat-messages">
                    <div style="text-align:center;color:#6b7280;padding:40px;">
                        <div style="font-size:48px;margin-bottom:16px;">💬</div>
                        <div style="font-size:18px;font-weight:600;margin-bottom:8px;">Inicia una conversación</div>
                        <div style="font-size:14px;">Haz una pregunta para comenzar</div>
                    </div>
                </div>
                <div class="chat-input-area">
                    <div style="display:flex;gap:12px;max-width:900px;margin:0 auto;">
                        <textarea id="query-text" placeholder="Escribe tu mensaje..." style="flex:1;padding:12px;border:1px solid #d1d5db;border-radius:6px;resize:none;font-size:14px;font-family:inherit;max-height:120px;" rows="1" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();askQuestion();}"></textarea>
                        <button onclick="askQuestion()" style="padding:12px 24px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;flex-shrink:0;">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    requests: `
        <div class="card">
            <div class="card-title">📊 Historial de Peticiones a OpenAI</div>
            <div style="margin-bottom:16px;"><button onclick="loadApiRequests()" class="btn-sm">🔄 Actualizar</button></div>
            <table><thead><tr><th style="width:150px;">Fecha</th><th style="width:100px;">Tokens</th><th style="width:100px;">Tiempo (ms)</th><th style="width:120px;">Modelo</th><th>Prompt</th><th style="width:100px;">Acción</th></tr></thead><tbody id="requests-table"></tbody></table>
        </div>
    `,
    
    docs: '' // Will be rendered by docs.js
};

window.loadViews = function() {
    Object.keys(VIEWS).forEach(view => {
        const element = document.getElementById(view);
        if (element) {
            const content = view === 'docs' ? renderDocsView() : VIEWS[view];
            element.innerHTML = content;
        }
    });
}
