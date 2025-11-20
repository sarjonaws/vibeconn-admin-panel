// Main app initialization
window.showTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    const titles = {dashboard: 'Dashboard', vault: 'Vault Secrets', behavior: 'Prompt de Comportamiento', agents: 'Agentes Expertos', documents: 'Gestión de Documentos', query: 'Consultas RAG', requests: 'Peticiones API', docs: 'Documentación'};
    document.getElementById('page-title').textContent = titles[tabName];
    
    const actions = {vault: window.initVault, behavior: loadBehaviorPrompt, agents: loadAgents, dashboard: loadDashboardCharts, query: loadChatSessions, requests: loadApiRequests, docs: () => {}};
    if (actions[tabName]) actions[tabName]();
}

document.addEventListener('DOMContentLoaded', () => {
    loadViews();
    loadHealth();
    loadStats();
    loadDocuments();
    loadDashboardCharts();
    
    setInterval(loadHealth, 10000);
    setInterval(loadStats, 15000);
    setInterval(() => {
        loadDocuments();
        if (document.getElementById('dashboard').classList.contains('active')) {
            loadDashboardCharts();
        }
    }, 30000);
    setInterval(() => {
        if (document.getElementById('behavior').classList.contains('active')) {
            loadBehaviorPrompt();
        }
    }, 10000);
});
