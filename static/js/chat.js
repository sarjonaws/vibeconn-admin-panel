// Chat interface
let currentSessionId = 'session-' + Date.now();
let selectedAgentId = null;

function newChat() {
    currentSessionId = 'session-' + Date.now();
    document.getElementById('chat-messages').innerHTML = `
        <div style="text-align:center;color:#7f8c8d;padding:40px;">
            <div style="font-size:48px;margin-bottom:16px;">💬</div>
            <div style="font-size:18px;font-weight:600;margin-bottom:8px;">Nueva conversación</div>
            <div style="font-size:14px;">Haz una pregunta para comenzar</div>
        </div>
    `;
    document.getElementById('query-text').value = '';
    loadChatSessions();
}

async function loadAgentsForChat() {
    try {
        const res = await fetch('/api/agents');
        const data = await res.json();
        const agents = data.agents || [];
        const selector = document.getElementById('agent-selector');
        
        if (!selector) return;
        
        selector.innerHTML = '<option value="">🤖 Sin agente específico</option>' + 
            agents.map(a => `<option value="${a.id}">${a.active ? '✓ ' : ''}${a.name}</option>`).join('');
        
        // Select active agent by default
        const activeAgent = agents.find(a => a.active);
        if (activeAgent) {
            selector.value = activeAgent.id;
            selectedAgentId = activeAgent.id;
            updateAgentBadge(activeAgent.name);
        }
    } catch (e) {
        console.error('Error loading agents for chat:', e);
    }
}

function onAgentChange() {
    const selector = document.getElementById('agent-selector');
    selectedAgentId = selector.value ? parseInt(selector.value) : null;
    const selectedText = selector.options[selector.selectedIndex].text;
    updateAgentBadge(selectedAgentId ? selectedText : null);
}

function updateAgentBadge(agentName) {
    const badge = document.getElementById('current-agent-badge');
    if (badge) {
        badge.textContent = agentName ? `Agente: ${agentName}` : '';
        badge.style.color = agentName ? '#10b981' : '#6b7280';
    }
}

async function loadChatSessions() {
    // Load agents first
    await loadAgentsForChat();
    
    try {
        const res = await fetch('/api/chat/sessions');
        const data = await res.json();
        const sessions = data.sessions || [];
        const container = document.getElementById('chat-sessions');
        
        if (sessions.length === 0) {
            container.innerHTML = '<div style="padding:16px;text-align:center;color:#7f8c8d;font-size:12px;">No hay conversaciones</div>';
            return;
        }
        
        container.innerHTML = sessions.map(s => {
            const date = new Date(s.last_message).toLocaleDateString();
            const isActive = s.session_id === currentSessionId;
            return `
                <div onclick="loadSession('${s.session_id}')" style="padding:12px;margin-bottom:4px;border-radius:6px;cursor:pointer;background:${isActive ? '#e3f2fd' : 'transparent'};border-left:3px solid ${isActive ? '#3498db' : 'transparent'};" onmouseover="this.style.background='#ecf0f1'" onmouseout="this.style.background='${isActive ? '#e3f2fd' : 'transparent'}'">
                    <div style="font-size:13px;font-weight:600;color:#2c3e50;margin-bottom:4px;">${s.message_count} mensajes</div>
                    <div style="font-size:11px;color:#7f8c8d;">${date}</div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error('Error loading sessions:', e);
    }
}

async function loadSession(sessionId) {
    currentSessionId = sessionId;
    try {
        const res = await fetch(`/api/chat/history/${sessionId}`);
        const data = await res.json();
        const messages = (data.messages || []).reverse();
        
        const container = document.getElementById('chat-messages');
        container.innerHTML = messages.map(m => `
            <div style="margin-bottom:24px;">
                <div style="display:flex;gap:12px;margin-bottom:16px;">
                    <div style="width:32px;height:32px;background:#3b82f6;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;flex-shrink:0;">U</div>
                    <div style="flex:1;padding:12px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                        <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;color:#111827;">${m.user_message}</div>
                    </div>
                </div>
                <div style="display:flex;gap:12px;">
                    <div style="width:32px;height:32px;background:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;flex-shrink:0;">A</div>
                    <div style="flex:1;padding:12px;background:#f0fdf4;border-radius:8px;border:1px solid #d1fae5;">
                        <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;color:#111827;">${m.assistant_message}</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        scrollToBottom();
        loadChatSessions();
    } catch (e) {
        console.error('Error loading session:', e);
    }
}

async function streamText(elementId, text) {
    const element = document.getElementById(elementId);
    const words = text.split(' ');
    
    for (let i = 0; i < words.length; i++) {
        element.textContent += (i > 0 ? ' ' : '') + words[i];
        scrollToBottom();
        await new Promise(resolve => setTimeout(resolve, 30));
    }
}

async function askQuestion() {
    const query = document.getElementById('query-text').value.trim();
    if (!query) return;
    
    const container = document.getElementById('chat-messages');
    
    if (container.innerHTML.includes('Inicia una conversación')) {
        container.innerHTML = '';
    }
    
    container.innerHTML += `
        <div style="margin-bottom:24px;">
            <div style="display:flex;gap:12px;">
                <div style="width:32px;height:32px;background:#3b82f6;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;flex-shrink:0;">U</div>
                <div style="flex:1;padding:12px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                    <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;color:#111827;">${query}</div>
                </div>
            </div>
        </div>
    `;
    
    const loadingId = 'loading-' + Date.now();
    container.innerHTML += `
        <div id="${loadingId}" style="margin-bottom:24px;">
            <div style="display:flex;gap:12px;">
                <div style="width:32px;height:32px;background:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;flex-shrink:0;">A</div>
                <div style="flex:1;padding:12px;background:#f0fdf4;border-radius:8px;border:1px solid #d1fae5;">
                    <div style="font-size:14px;color:#6b7280;">Pensando...</div>
                </div>
            </div>
        </div>
    `;
    
    scrollToBottom();
    document.getElementById('query-text').value = '';
    document.getElementById('query-text').style.height = 'auto';
    
    try {
        const maxTokens = parseInt(document.getElementById('max-tokens-slider')?.value || 2000);
        
        const requestBody = { 
            query, 
            user_id: currentSessionId, 
            language: 'es',
            max_tokens: maxTokens
        };
        
        // Add agent_id if selected
        if (selectedAgentId) {
            requestBody.agent_id = selectedAgentId;
        }
        
        const res = await fetch('/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        // Check if response is OK
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Debug: Log the response to see what we're getting
        console.log('Response from /api/ask:', data);
        console.log('data.answer:', data.answer);
        console.log('data.response:', data.response);
        console.log('Full data keys:', Object.keys(data));
        
        const fullText = data.answer || data.response || 'Sin respuesta';
        console.log('Final text to display:', fullText);
        
        const responseId = 'response-' + Date.now();
        document.getElementById(loadingId).innerHTML = `
            <div style="display:flex;gap:12px;">
                <div style="width:32px;height:32px;background:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;flex-shrink:0;">A</div>
                <div style="flex:1;padding:12px;background:#f0fdf4;border-radius:8px;border:1px solid #d1fae5;">
                    <div id="${responseId}" style="font-size:14px;line-height:1.6;white-space:pre-wrap;color:#111827;"></div>
                </div>
            </div>
        `;
        
        const requestInfo = data.request_info || {};
        if (requestInfo.tokens_used) {
            const infoDiv = document.createElement('div');
            infoDiv.style.cssText = 'margin-top:8px;padding:8px;background:#f9fafb;border-radius:4px;font-size:11px;color:#6b7280;border:1px solid #e5e7eb;';
            infoDiv.innerHTML = `
                📊 <strong>${requestInfo.tokens_used}</strong> tokens | 
                ⏱️ <strong>${requestInfo.response_time_ms}ms</strong> | 
                🤖 <strong>${requestInfo.model}</strong>
            `;
            document.getElementById(loadingId).querySelector('div[style*="flex:1"]').appendChild(infoDiv);
        }
        
        await streamText(responseId, fullText);
        scrollToBottom();
        loadChatSessions();
    } catch (e) {
        document.getElementById(loadingId).innerHTML = `
            <div style="display:flex;gap:12px;">
                <div style="width:32px;height:32px;background:#ef4444;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;flex-shrink:0;">!</div>
                <div style="flex:1;padding:12px;background:#fef2f2;border-radius:8px;border:1px solid #fee2e2;">
                    <div style="font-size:14px;color:#991b1b;">Error: ${e.message}</div>
                </div>
            </div>
        `;
        scrollToBottom();
    }
}

function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) {
        setTimeout(() => {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }, 50);
    }
}
