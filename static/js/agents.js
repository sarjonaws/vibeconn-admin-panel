// Expert agents management
const agentTemplates = {
    python: {
        name: 'Experto Python Senior',
        topic: 'Programación Python',
        prompt: 'Eres un desarrollador Python senior con 10+ años de experiencia. Respondes con código limpio, buenas prácticas (PEP 8), y ejemplos prácticos. Siempre consideras rendimiento, legibilidad y mantenibilidad. Mencionas alternativas cuando existen.',
        filters: 'python, django, flask, fastapi, pandas, numpy',
        temperature: 0.7
    },
    devops: {
        name: 'Ingeniero DevOps',
        topic: 'DevOps y Cloud',
        prompt: 'Eres un ingeniero DevOps especializado en AWS, Docker y Kubernetes. Respondes con comandos específicos, configuraciones YAML, y mejores prácticas de CI/CD. Siempre consideras seguridad, escalabilidad y costos. Incluyes ejemplos de infraestructura como código.',
        filters: 'docker, kubernetes, aws, terraform, jenkins, gitlab',
        temperature: 0.5
    },
    legal: {
        name: 'Asesor Legal',
        topic: 'Derecho y Legislación',
        prompt: 'Eres un abogado con experiencia en derecho corporativo y contratos. Respondes con lenguaje formal, citas legales cuando aplica, y consideraciones de riesgo. Siempre incluyes disclaimers apropiados indicando que no sustituyes asesoría legal profesional.',
        filters: 'legal, contrato, ley, derecho, normativa',
        temperature: 0.2
    },
    marketing: {
        name: 'Estratega de Marketing',
        topic: 'Marketing Digital',
        prompt: 'Eres un estratega de marketing digital con enfoque en ROI y métricas. Respondes con estrategias accionables, ejemplos de campañas exitosas, y KPIs relevantes. Usas un tono persuasivo pero profesional. Siempre consideras el embudo de conversión.',
        filters: 'marketing, seo, ads, analytics, social media, email',
        temperature: 0.8
    },
    finanzas: {
        name: 'Analista Financiero',
        topic: 'Finanzas Corporativas',
        prompt: 'Eres un analista financiero certificado (CFA). Respondes con análisis detallados, fórmulas financieras, y consideraciones de riesgo. Siempre incluyes disclaimers sobre que no es asesoría de inversión. Usas datos y métricas concretas.',
        filters: 'finanzas, contabilidad, inversión, balance, flujo',
        temperature: 0.3
    },
    soporte: {
        name: 'Agente de Soporte',
        topic: 'Atención al Cliente',
        prompt: 'Eres un agente de soporte técnico amigable y empático. Respondes con soluciones paso a paso, lenguaje claro sin tecnicismos innecesarios. Siempre preguntas si necesitan más ayuda. Usas emojis apropiados para hacer la conversación más amena.',
        filters: 'soporte, ayuda, problema, error, solución',
        temperature: 0.7
    },
    datos: {
        name: 'Científico de Datos',
        topic: 'Data Science y ML',
        prompt: 'Eres un científico de datos experto en ML y estadística. Respondes con código Python (pandas, scikit-learn), explicaciones de algoritmos, y visualizaciones. Siempre consideras la calidad de datos, overfitting, y métricas de evaluación apropiadas.',
        filters: 'data, machine learning, pandas, scikit, tensorflow, estadistica',
        temperature: 0.6
    },
    seguridad: {
        name: 'Experto en Seguridad',
        topic: 'Ciberseguridad',
        prompt: 'Eres un experto en ciberseguridad y ethical hacking. Respondes con mejores prácticas de seguridad, vulnerabilidades comunes (OWASP Top 10), y soluciones concretas. Siempre enfatizas la importancia de la seguridad por capas. Nunca proporcionas información para actividades maliciosas.',
        filters: 'seguridad, vulnerabilidad, encriptación, firewall, owasp',
        temperature: 0.4
    }
};

window.fillAgentTemplate = function(templateName) {
    const template = agentTemplates[templateName];
    if (!template) return;
    
    document.getElementById('agent-name').value = template.name;
    document.getElementById('agent-topic').value = template.topic;
    document.getElementById('agent-prompt').value = template.prompt;
    document.getElementById('agent-filters').value = template.filters;
    document.getElementById('agent-temperature').value = template.temperature;
    document.getElementById('temp-value').textContent = template.temperature;
    
    showToast('✓ Plantilla cargada: ' + template.name);
    
    document.getElementById('agent-name').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function loadAgents() {
    try {
        const res = await fetch('/api/agents');
        const data = await res.json();
        const agents = data.agents || [];
        const tbody = document.getElementById('agents-table');
        
        if (agents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#7f8c8d;">No hay agentes creados</td></tr>';
            return;
        }
        
        tbody.innerHTML = agents.map(a => `
            <tr style="${a.active ? 'background:#f0fdf4;' : ''}">
                <td style="text-align:center;">
                    ${a.active ? '<span style="color:#10b981;font-size:18px;">✓</span>' : ''}
                </td>
                <td><strong>${a.name}</strong></td>
                <td>${a.topic}</td>
                <td>${a.temperature}</td>
                <td style="font-size:11px;color:#6b7280;">${new Date(a.created_at).toLocaleString()}</td>
                <td>
                    ${!a.active ? `<button class="btn-sm btn-success" data-action="activate" data-id="${a.id}">Activar</button>` : '<span style="color:#10b981;font-weight:600;">ACTIVO</span>'}
                    <button class="btn-sm" style="background:#ef4444;color:white;margin-left:4px;" data-action="delete" data-id="${a.id}">Eliminar</button>
                </td>
            </tr>
        `).join('');
        
        // Attach event listeners
        tbody.querySelectorAll('button[data-action]').forEach(btn => {
            btn.addEventListener('click', async function(e) {
                e.preventDefault();
                const action = this.getAttribute('data-action');
                const id = parseInt(this.getAttribute('data-id'));
                console.log('Button clicked:', action, id);
                
                if (action === 'delete') {
                    await window.deleteAgent(id);
                } else if (action === 'activate') {
                    await window.activateAgent(id);
                }
            });
        });
    } catch (e) {
        console.error('Error loading agents:', e);
    }
}

window.createAgent = async function() {
    const name = document.getElementById('agent-name').value.trim();
    const topic = document.getElementById('agent-topic').value.trim();
    const prompt = document.getElementById('agent-prompt').value.trim();
    const filters = document.getElementById('agent-filters').value.trim();
    const temperature = parseFloat(document.getElementById('agent-temperature').value);
    
    if (!name || !topic || !prompt) return showToast('✗ Completa nombre, tema y prompt');
    
    showLoading('Creando agente...');
    try {
        await fetch('/api/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, topic, system_prompt: prompt, document_filters: filters, temperature })
        });
        hideLoading();
        showToast('✓ Agente creado y activado');
        document.getElementById('agent-name').value = '';
        document.getElementById('agent-topic').value = '';
        document.getElementById('agent-prompt').value = '';
        document.getElementById('agent-filters').value = '';
        document.getElementById('agent-temperature').value = '0.7';
        await loadAgents();
    } catch (e) {
        hideLoading();
        showToast('✗ Error: ' + e.message);
    }
}

window.activateAgent = async function(agentId) {
    showLoading('Activando agente...');
    try {
        await fetch(`/api/agents/${agentId}/activate`, { method: 'POST' });
        hideLoading();
        showToast('✓ Agente activado');
        await loadAgents();
    } catch (e) {
        hideLoading();
        showToast('✗ Error: ' + e.message);
    }
}

window.deleteAgent = async function(agentId) {
    console.log('deleteAgent called with ID:', agentId);
    if (!confirm('¿Eliminar este agente? Esta acción no se puede deshacer.')) return;
    
    showLoading('Eliminando agente...');
    try {
        const response = await fetch(`/api/agents/${agentId}`, { method: 'DELETE' });
        console.log('Delete response:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al eliminar agente: ${errorText}`);
        }
        hideLoading();
        showToast('✓ Agente eliminado correctamente');
        await loadAgents();
    } catch (e) {
        hideLoading();
        showToast('✗ Error: ' + e.message);
        console.error('Error deleting agent:', e);
    }
}
