// Documentation and Step-by-Step Guide Module

const DOCS_CONTENT = {
    intro: {
        title: "🚀 Bienvenido a VibeConnections",
        content: `
            <p>Sistema RAG (Retrieval-Augmented Generation) con compresión semántica y almacenamiento dual.</p>
            <h3>¿Qué puedes hacer?</h3>
            <ul>
                <li>📄 Indexar documentos (texto, PDF, Excel)</li>
                <li>💬 Realizar consultas inteligentes con contexto</li>
                <li>🎭 Personalizar el comportamiento de las respuestas</li>
                <li>🤖 Usar agentes expertos especializados</li>
                <li>📊 Monitorear costos y uso en tiempo real</li>
            </ul>
        `
    },
    architecture: {
        title: "📋 Arquitectura del Sistema",
        content: `
            <h3>Servicios</h3>
            <table class="docs-table">
                <tr><th>Servicio</th><th>Puerto</th><th>Función</th></tr>
                <tr><td>admin-panel</td><td>9000</td><td>Panel de administración web</td></tr>
                <tr><td>sematic-context-api</td><td>8001</td><td>Entrada principal (RAG)</td></tr>
                <tr><td>vector-engine-api</td><td>8000</td><td>Motor de vectores (Qdrant)</td></tr>
                <tr><td>compress-block-semantic</td><td>8002</td><td>Compresión OpenAI</td></tr>
            </table>
            
            <h3>Flujo de Consulta RAG</h3>
            <pre>Cliente → sematic-context-api → vector-engine-api → Qdrant
                ↓
            LLM (Ollama/OpenAI)
                ↓
            Respuesta</pre>
        `
    },
    quickstart: {
        title: "⚡ Inicio Rápido",
        content: `
            <h3>Pasos Básicos</h3>
            <ol>
                <li><strong>Configurar API Key</strong> - Ve a "Vault Secrets" y agrega tu OPENAI_API_KEY</li>
                <li><strong>Indexar Documentos</strong> - Sube archivos o texto en "Documentos"</li>
                <li><strong>Crear Prompt</strong> - Define el comportamiento en "Comportamiento"</li>
                <li><strong>Consultar</strong> - Haz preguntas en "Consultas"</li>
            </ol>
            
            <div class="docs-tip">
                💡 <strong>Tip:</strong> Usa la guía paso a paso para una configuración asistida
            </div>
        `
    },
    configuration: {
        title: "🔐 Vault Secrets",
        content: `
            <h3>Gestión Segura de Secretos</h3>
            <p>Vault Secrets gestiona de forma segura todas las API keys y variables de entorno de los servicios.</p>
            
            <h3>Configuración por Servicio</h3>
            
            <div class="docs-scenario">
                <h4>Compress Service</h4>
                <p><strong>Variables requeridas:</strong> OPENAI_API_KEY</p>
                <p><strong>Función:</strong> Compresión semántica de documentos</p>
            </div>
            
            <div class="docs-scenario">
                <h4>Vector Engine</h4>
                <p><strong>Variables:</strong> Configuración del motor de vectores</p>
                <p><strong>Función:</strong> Almacenamiento y búsqueda vectorial</p>
            </div>
            
            <div class="docs-scenario">
                <h4>Semantic Context</h4>
                <p><strong>Variables requeridas:</strong> OPENAI_API_KEY</p>
                <p><strong>Función:</strong> Motor RAG y generación de respuestas</p>
            </div>
            
            <div class="docs-tip">
                💡 <strong>Tip:</strong> Usa "Editar Variables" para configurar múltiples secretos a la vez
            </div>
        `
    },
    documents: {
        title: "📁 Gestión de Documentos",
        content: `
            <h3>Formatos Soportados</h3>
            <ul>
                <li>✅ <strong>Texto plano</strong> - Directo desde el formulario</li>
                <li>✅ <strong>PDF</strong> (.pdf) - Extrae texto de todas las páginas</li>
                <li>✅ <strong>Excel</strong> (.xlsx, .xls) - Extrae datos de todas las hojas</li>
            </ul>
            
            <h3>Proceso de Indexación</h3>
            <pre>Archivo → Extracción → Compresión → Indexación → Disponible para RAG</pre>
            
            <h3>Limitaciones</h3>
            <ul>
                <li>Tamaño recomendado: &lt; 10 MB</li>
                <li>PDF: Solo texto extraíble (no imágenes escaneadas)</li>
                <li>Excel: Solo valores (no fórmulas)</li>
            </ul>
        `
    },
    behavior: {
        title: "🎭 Prompts de Comportamiento",
        content: `
            <h3>¿Qué son?</h3>
            <p>Instrucciones que personalizan el tono y estilo de las respuestas del sistema.</p>
            
            <h3>Ejemplos</h3>
            <div class="docs-example">
                <strong>Profesional:</strong> "Responde de forma técnica y precisa"
            </div>
            <div class="docs-example">
                <strong>Casual:</strong> "Usa tono amigable con emojis"
            </div>
            <div class="docs-example">
                <strong>Breve:</strong> "Máximo 3 líneas, directo al punto"
            </div>
            <div class="docs-example">
                <strong>Estructurado:</strong> "1. Resumen 2. Explicación 3. Ejemplo"
            </div>
        `
    },
    agents: {
        title: "🤖 Agentes Expertos",
        content: `
            <h3>Plantillas Predefinidas</h3>
            <ol>
                <li><strong>Experto Python</strong> - Código limpio, buenas prácticas</li>
                <li><strong>Ingeniero DevOps</strong> - AWS, Docker, Kubernetes</li>
                <li><strong>Asesor Legal</strong> - Formal, preciso, con disclaimers</li>
                <li><strong>Estratega Marketing</strong> - ROI, métricas, persuasivo</li>
                <li><strong>Analista Financiero</strong> - Fórmulas, análisis de riesgo</li>
                <li><strong>Soporte Técnico</strong> - Empático, paso a paso</li>
                <li><strong>Data Scientist</strong> - Estadística, ML, visualizaciones</li>
                <li><strong>Experto Seguridad</strong> - Vulnerabilidades, mejores prácticas</li>
            </ol>
        `
    },
    costs: {
        title: "💰 Costos y Monitoreo",
        content: `
            <h3>Costos OpenAI (gpt-4o-mini)</h3>
            <table class="docs-table">
                <tr><th>Operación</th><th>Costo</th></tr>
                <tr><td>Compresión</td><td>~$0.00015 por 1K tokens</td></tr>
                <tr><td>Consulta RAG (input)</td><td>$0.00015 por 1K tokens</td></tr>
                <tr><td>Consulta RAG (output)</td><td>$0.0006 por 1K tokens</td></tr>
                <tr><td>Fine-tuning</td><td>~$0.008 por 1K tokens</td></tr>
            </table>
            
            <h3>Estimados en MXN (TC: 20)</h3>
            <ul>
                <li>100 documentos (1K tokens c/u): ~$3 MXN</li>
                <li>100 consultas RAG: ~$1.50 MXN</li>
                <li>Fine-tuning 1000 docs: ~$100-200 MXN</li>
            </ul>
            
            <div class="docs-tip">
                📊 El dashboard muestra costos en tiempo real
            </div>
        `
    },
    troubleshooting: {
        title: "🔍 Solución de Problemas",
        content: `
            <h3>Servicios no inician</h3>
            <pre>netstat -ano | findstr "8000 8001 8002 9000"  # Windows
lsof -i:8000,8001,8002,9000                    # Linux/Mac</pre>
            
            <h3>Error de compresión</h3>
            <pre>curl http://localhost:8002/
echo $OPENAI_API_KEY</pre>
            
            <h3>Qdrant no disponible</h3>
            <p>Es normal. Qdrant es opcional. El sistema funciona sin él.</p>
            
            <h3>Ollama no responde</h3>
            <pre>ollama serve
ollama list
ollama pull mistral-7b-instruct</pre>
        `
    }
};

const GUIDED_STEPS = [
    {
        step: 1,
        title: "Verificar Servicios",
        description: "Asegúrate de que todos los servicios estén corriendo. Si algunos están offline, puedes continuar de todos modos.",
        action: "checkHealth",
        buttonText: "Verificar Servicios"
    },
    {
        step: 2,
        title: "Configurar API Key",
        description: "Ve a la sección de Vault Secrets y agrega tu OPENAI_API_KEY para habilitar todas las funcionalidades.",
        action: "goToVault",
        buttonText: "Ir a Vault Secrets"
    },
    {
        step: 3,
        title: "Indexar Primer Documento",
        description: "Sube tu primer documento (texto, PDF o Excel) para que el sistema pueda responder preguntas sobre él.",
        action: "goToDocuments",
        buttonText: "Ir a Documentos"
    },
    {
        step: 4,
        title: "Crear Prompt de Comportamiento",
        description: "Define el tono y estilo de las respuestas del sistema (profesional, casual, breve, etc.).",
        action: "goToBehavior",
        buttonText: "Ir a Comportamiento"
    },
    {
        step: 5,
        title: "Realizar Primera Consulta",
        description: "Haz tu primera pregunta al sistema RAG y obtén respuestas basadas en tus documentos.",
        action: "goToQuery",
        buttonText: "Ir a Consultas"
    },
    {
        step: 6,
        title: "¡Listo!",
        description: "Sistema configurado correctamente. Ahora puedes explorar todas las funcionalidades: agentes expertos, monitoreo de costos, y más.",
        action: "finish",
        buttonText: "Finalizar"
    }
];

let currentStep = 0;

function renderDocsView() {
    const sections = Object.keys(DOCS_CONTENT);
    
    return `
        <div class="docs-container">
            <div class="docs-sidebar">
                <h3>📚 Contenido</h3>
                ${sections.map(key => `
                    <div class="docs-nav-item" onclick="showDocsSection('${key}')">
                        ${DOCS_CONTENT[key].title}
                    </div>
                `).join('')}
                <hr>
                <div class="docs-nav-item docs-nav-guide" onclick="startGuidedTour()">
                    🎯 Guía Paso a Paso
                </div>
            </div>
            
            <div class="docs-content">
                <div id="docs-section">
                    ${renderDocsSection('intro')}
                </div>
            </div>
        </div>
        
        <div id="guided-tour-modal" class="modal" style="display: none;">
            <div class="modal-content guided-tour-content">
                <span class="close" onclick="closeGuidedTour()">&times;</span>
                <div id="guided-tour-body"></div>
            </div>
        </div>
    `;
}

function renderDocsSection(key) {
    const section = DOCS_CONTENT[key];
    return `
        <div class="docs-section">
            <h2>${section.title}</h2>
            ${section.content}
        </div>
    `;
}

function showDocsSection(key) {
    document.getElementById('docs-section').innerHTML = renderDocsSection(key);
    
    // Highlight active nav item
    document.querySelectorAll('.docs-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
}

function startGuidedTour() {
    currentStep = 0;
    document.getElementById('guided-tour-modal').style.display = 'block';
    renderGuidedStep();
}

function closeGuidedTour() {
    document.getElementById('guided-tour-modal').style.display = 'none';
}

function renderGuidedStep() {
    const step = GUIDED_STEPS[currentStep];
    const isLast = currentStep === GUIDED_STEPS.length - 1;
    const isFirst = currentStep === 0;
    const progressPercent = (currentStep / (GUIDED_STEPS.length - 1)) * 100;
    
    document.getElementById('guided-tour-body').innerHTML = `
        <div class="guided-step">
            <div class="step-header">
                <span class="step-number">Paso ${step.step} de ${GUIDED_STEPS.length}</span>
                <div class="step-progress">
                    <div class="step-progress-bar" style="width: ${progressPercent}%"></div>
                </div>
            </div>
            
            <h2>${step.title}</h2>
            <p>${step.description}</p>
            
            <div class="step-actions">
                ${!isFirst ? `<button class="btn-secondary" onclick="previousStep()">← Anterior</button>` : ''}
                <button class="btn-primary" onclick="executeStepAction('${step.action}')">
                    ${step.buttonText}
                </button>
                ${!isLast ? `<button class="btn-secondary" onclick="nextStep()">Saltar →</button>` : ''}
            </div>
        </div>
    `;
}

function nextStep() {
    if (currentStep < GUIDED_STEPS.length - 1) {
        currentStep++;
        renderGuidedStep();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        renderGuidedStep();
    }
}

async function executeStepAction(action) {
    try {
        switch(action) {
            case 'checkHealth':
                showLoading('Verificando servicios...');
                try {
                    const health = await API.checkHealth();
                    const allOnline = Object.values(health).every(status => status === 'online');
                    hideLoading();
                    if (allOnline) {
                        showToast('✅ Todos los servicios están en línea');
                    } else {
                        showToast('⚠️ Algunos servicios están offline');
                    }
                } catch (error) {
                    hideLoading();
                    showToast('⚠️ No se pudo verificar servicios');
                }
                setTimeout(() => nextStep(), 1500);
                break;
                
            case 'goToVault':
                closeGuidedTour();
                setTimeout(() => {
                    showTab('vault');
                    showToast('💡 Configura tu API Key aquí en Vault Secrets');
                }, 200);
                break;
                
            case 'goToDocuments':
                closeGuidedTour();
                setTimeout(() => {
                    showTab('documents');
                    showToast('💡 Sube tu primer documento aquí');
                }, 200);
                break;
                
            case 'goToBehavior':
                closeGuidedTour();
                setTimeout(() => {
                    showTab('behavior');
                    showToast('💡 Crea un prompt de comportamiento aquí');
                }, 200);
                break;
                
            case 'goToQuery':
                closeGuidedTour();
                setTimeout(() => {
                    showTab('query');
                    showToast('💡 Haz tu primera consulta aquí');
                }, 200);
                break;
                
            case 'finish':
                closeGuidedTour();
                showToast('🎉 ¡Configuración completada! Explora el sistema');
                break;
        }
    } catch (error) {
        console.error('Error en executeStepAction:', error);
        showToast('⚠️ Error en la acción. Intenta de nuevo.');
    }
}

// Close modal when clicking outside
if (typeof window !== 'undefined') {
    const originalOnClick = window.onclick;
    window.onclick = function(event) {
        const modal = document.getElementById('guided-tour-modal');
        if (modal && event.target === modal) {
            closeGuidedTour();
        }
        if (originalOnClick) originalOnClick(event);
    };
}
