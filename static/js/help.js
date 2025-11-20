// Context-sensitive help system

const HELP_CONTENT = {
    dashboard: {
        title: "📊 Dashboard - Panel de Control",
        content: `
            <h3>¿Qué es el Dashboard?</h3>
            <p>El Dashboard es tu centro de control principal donde puedes ver estadísticas en tiempo real del sistema.</p>
            
            <h3>Información Disponible</h3>
            <div class="help-step">
                <strong>Estadísticas Generales:</strong>
                <ul>
                    <li>Total de documentos indexados</li>
                    <li>Total de vectores almacenados</li>
                    <li>Estado de servicios (online/offline)</li>
                </ul>
            </div>
            
            <div class="help-step">
                <strong>Métricas de Tokens:</strong>
                <ul>
                    <li>Tokens originales (antes de compresión)</li>
                    <li>Tokens comprimidos (después de compresión)</li>
                    <li>Tokens ahorrados (diferencia)</li>
                </ul>
            </div>
            
            <div class="help-step">
                <strong>Costos en MXN:</strong>
                <ul>
                    <li>Costo de compresión de documentos</li>
                    <li>Costo de consultas RAG</li>
                    <li>Costo total acumulado</li>
                </ul>
            </div>
            
            <div class="help-tip">
                💡 <strong>Tip:</strong> El dashboard se actualiza automáticamente cada 15 segundos
            </div>
        `
    },
    
    vault: {
        title: "🔐 Vault Secrets - Gestión Segura de Secretos",
        content: `
            <h3>¿Qué es Vault Secrets?</h3>
            <p>Gestiona de forma segura las API keys y secretos de configuración de todos los servicios del sistema.</p>
            
            <h3>Servicios Disponibles</h3>
            <div class="help-step">
                <strong>Compress Service:</strong>
                <p>Variables de entorno para el servicio de compresión semántica (incluye OPENAI_API_KEY)</p>
            </div>
            
            <div class="help-step">
                <strong>Vector Engine:</strong>
                <p>Configuración del motor de vectores y almacenamiento</p>
            </div>
            
            <div class="help-step">
                <strong>Semantic Context:</strong>
                <p>Variables del servicio RAG (incluye OPENAI_API_KEY)</p>
            </div>
            
            <h3>Cómo Gestionar Secretos</h3>
            <div class="help-step">
                <strong>Edición en Masa:</strong>
                <ul>
                    <li>Click en "Editar Variables" en el servicio deseado</li>
                    <li>Escribe las variables en formato <code>CLAVE=valor</code></li>
                    <li>Una variable por línea</li>
                    <li>Click en "Guardar Todas"</li>
                </ul>
            </div>
            
            <div class="help-tip">
                💡 <strong>Tip:</strong> Los secretos se almacenan de forma segura en HashiCorp Vault y se sincronizan automáticamente con los servicios
            </div>
        `
    },
    
    behavior: {
        title: "🎭 Prompts de Comportamiento",
        content: `
            <h3>¿Qué son los Prompts de Comportamiento?</h3>
            <p>Son instrucciones que definen el tono, estilo y formato de las respuestas del sistema RAG.</p>
            
            <h3>Cómo Crear un Prompt</h3>
            <div class="help-step">
                <strong>1. Escribe tu prompt:</strong>
                <p>Ejemplo: "Responde de forma técnica y precisa, usando ejemplos de código cuando sea posible"</p>
            </div>
            
            <div class="help-step">
                <strong>2. Click en "Crear y Activar":</strong>
                <p>El prompt se guardará y se activará automáticamente</p>
            </div>
            
            <div class="help-step">
                <strong>3. Gestionar prompts:</strong>
                <ul>
                    <li><strong>Activar:</strong> Hace que un prompt sea el activo</li>
                    <li><strong>Eliminar:</strong> Borra un prompt del historial</li>
                </ul>
            </div>
            
            <h3>Ejemplos de Prompts</h3>
            <ul>
                <li><strong>Profesional:</strong> "Responde de forma técnica y precisa"</li>
                <li><strong>Casual:</strong> "Usa tono amigable con emojis"</li>
                <li><strong>Breve:</strong> "Máximo 3 líneas, directo al punto"</li>
                <li><strong>Estructurado:</strong> "1. Resumen 2. Explicación 3. Ejemplo"</li>
            </ul>
            
            <div class="help-tip">
                💡 <strong>Tip:</strong> Solo un prompt puede estar activo a la vez
            </div>
        `
    },
    
    agents: {
        title: "🤖 Agentes Expertos",
        content: `
            <h3>¿Qué son los Agentes Expertos?</h3>
            <p>Son configuraciones especializadas que adaptan el sistema para dominios específicos.</p>
            
            <h3>Crear un Agente</h3>
            <div class="help-step">
                <strong>1. Usa una plantilla rápida:</strong>
                <p>Click en uno de los botones (Python, DevOps, Legal, etc.) para autocompletar</p>
            </div>
            
            <div class="help-step">
                <strong>2. Personaliza los campos:</strong>
                <ul>
                    <li><strong>Nombre:</strong> Identificador del agente</li>
                    <li><strong>Tema:</strong> Área de especialización</li>
                    <li><strong>Prompt del Sistema:</strong> Personalidad y comportamiento</li>
                    <li><strong>Filtros:</strong> Palabras clave para filtrar documentos</li>
                    <li><strong>Temperatura:</strong> 0.0 (preciso) a 1.0 (creativo)</li>
                </ul>
            </div>
            
            <div class="help-step">
                <strong>3. Click en "Crear Agente":</strong>
                <p>El agente se guardará y podrás activarlo cuando lo necesites</p>
            </div>
            
            <div class="help-tip">
                💡 <strong>Tip:</strong> Los agentes son útiles para tener múltiples configuraciones especializadas
            </div>
        `
    },
    
    documents: {
        title: "📄 Gestión de Documentos",
        content: `
            <h3>¿Cómo Indexar Documentos?</h3>
            <p>Puedes indexar documentos de dos formas: texto directo o subiendo archivos.</p>
            
            <h3>Opción 1: Texto Directo</h3>
            <div class="help-step">
                <strong>1. Escribe o pega el texto</strong> en el área de texto
            </div>
            <div class="help-step">
                <strong>2. Click en "Indexar"</strong>
            </div>
            <div class="help-step">
                <strong>3. Espera la confirmación</strong> (puede tardar unos segundos)
            </div>
            
            <h3>Opción 2: Subir Archivo</h3>
            <div class="help-step">
                <strong>Formatos soportados:</strong>
                <ul>
                    <li>PDF (.pdf) - Extrae texto de todas las páginas</li>
                    <li>Excel (.xlsx, .xls) - Extrae datos de todas las hojas</li>
                </ul>
            </div>
            <div class="help-step">
                <strong>1. Click en "Elegir archivo"</strong>
            </div>
            <div class="help-step">
                <strong>2. Selecciona tu archivo</strong> (máx. 10 MB recomendado)
            </div>
            <div class="help-step">
                <strong>3. Click en "Subir e Indexar"</strong>
            </div>
            
            <h3>Proceso Automático</h3>
            <p>Archivo → Extracción → Compresión → Indexación → Disponible para RAG</p>
            
            <div class="help-tip">
                💡 <strong>Tip:</strong> Los documentos indexados aparecerán en la tabla inferior
            </div>
        `
    },
    
    query: {
        title: "💬 Consultas RAG",
        content: `
            <h3>¿Cómo Hacer Consultas?</h3>
            <p>El chat RAG te permite hacer preguntas sobre tus documentos indexados.</p>
            
            <h3>Pasos para Consultar</h3>
            <div class="help-step">
                <strong>1. Escribe tu pregunta</strong> en el campo de texto inferior
            </div>
            <div class="help-step">
                <strong>2. Presiona Enter o click en "Enviar"</strong>
            </div>
            <div class="help-step">
                <strong>3. Espera la respuesta</strong> del sistema RAG
            </div>
            
            <h3>Características</h3>
            <ul>
                <li><strong>Historial:</strong> Todas las conversaciones se guardan</li>
                <li><strong>Sesiones:</strong> Puedes crear múltiples conversaciones</li>
                <li><strong>Contexto:</strong> El sistema busca en tus documentos</li>
                <li><strong>Comportamiento:</strong> Usa el prompt activo</li>
            </ul>
            
            <h3>Información Mostrada</h3>
            <ul>
                <li>Respuesta del sistema</li>
                <li>Tokens usados</li>
                <li>Tiempo de respuesta</li>
                <li>Modelo utilizado</li>
            </ul>
            
            <div class="help-tip">
                💡 <strong>Tip:</strong> Haz preguntas específicas sobre el contenido de tus documentos
            </div>
        `
    },
    
    requests: {
        title: "📊 Peticiones API",
        content: `
            <h3>¿Qué son las Peticiones API?</h3>
            <p>Esta sección muestra el historial de todas las peticiones realizadas a OpenAI.</p>
            
            <h3>Información Disponible</h3>
            <div class="help-step">
                <strong>Por cada petición verás:</strong>
                <ul>
                    <li><strong>Fecha:</strong> Cuándo se realizó</li>
                    <li><strong>Tokens:</strong> Cantidad de tokens usados</li>
                    <li><strong>Tiempo:</strong> Milisegundos de respuesta</li>
                    <li><strong>Modelo:</strong> Modelo de OpenAI usado</li>
                    <li><strong>Prompt:</strong> Texto enviado (truncado)</li>
                </ul>
            </div>
            
            <h3>Acciones</h3>
            <div class="help-step">
                <strong>Ver detalles:</strong> Click en "Ver" para ver el prompt completo y la respuesta
            </div>
            
            <div class="help-tip">
                💡 <strong>Tip:</strong> Usa esta sección para monitorear el uso y optimizar costos
            </div>
        `
    },
    
    docs: {
        title: "📚 Documentación",
        content: `
            <h3>¿Qué encontrarás aquí?</h3>
            <p>Documentación completa del sistema VibeConnections.</p>
            
            <h3>Secciones Disponibles</h3>
            <ul>
                <li>🚀 Bienvenido a VibeConnections</li>
                <li>📋 Arquitectura del Sistema</li>
                <li>⚡ Inicio Rápido</li>
                <li>🔧 Configuración</li>
                <li>📁 Gestión de Documentos</li>
                <li>🎭 Prompts de Comportamiento</li>
                <li>🤖 Agentes Expertos</li>
                <li>💰 Costos y Monitoreo</li>
                <li>🔍 Solución de Problemas</li>
            </ul>
            
            <h3>Guía Paso a Paso</h3>
            <div class="help-step">
                <strong>Click en "🎯 Guía Paso a Paso"</strong> para una configuración asistida del sistema
            </div>
            
            <div class="help-tip">
                💡 <strong>Tip:</strong> Usa el sidebar para navegar entre secciones
            </div>
        `
    }
};

let currentHelpTab = 'dashboard';

function showContextHelp() {
    // Detect current active tab
    const activeTabs = document.querySelectorAll('.tab-content.active');
    if (activeTabs.length > 0) {
        currentHelpTab = activeTabs[0].id;
    }
    
    const helpContent = HELP_CONTENT[currentHelpTab];
    if (!helpContent) {
        showToast('⚠️ No hay ayuda disponible para esta sección');
        return;
    }
    
    document.getElementById('help-body').innerHTML = `
        <h2>${helpContent.title}</h2>
        ${helpContent.content}
        <div class="help-actions">
            <button class="btn-secondary" onclick="closeHelp()">Cerrar</button>
            <button class="btn-primary" onclick="startGuidedTour(); closeHelp();">Iniciar Guía Completa</button>
        </div>
    `;
    
    document.getElementById('help-modal').classList.add('show');
}

function closeHelp() {
    document.getElementById('help-modal').classList.remove('show');
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('help-modal');
    if (event.target === modal) {
        closeHelp();
    }
});
