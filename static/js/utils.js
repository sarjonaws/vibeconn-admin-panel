window.showLoading = function(text = 'Procesando...') {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading').classList.add('show');
}

window.hideLoading = function() {
    document.getElementById('loading').classList.remove('show');
}

window.showNotification = function(message, type = 'info') {
    showToast(message);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showNotification(message, type = 'info') {
    showToast(message);
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const tabElement = document.getElementById(tabName);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    // Find and activate the corresponding nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(tabName)) {
            item.classList.add('active');
        }
    });
    
    const TITLES = {
        dashboard: 'Dashboard',
        behavior: 'Prompt de Comportamiento',
        agents: 'Agentes Expertos',
        documents: 'Gestión de Documentos',
        query: 'Consultas RAG',
        requests: 'Peticiones API',
        docs: 'Documentación'
    };
    
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
        titleElement.textContent = TITLES[tabName] || tabName;
    }
    
    // Execute tab-specific actions
    if (tabName === 'behavior') {
        loadBehaviorPrompt();
    } else if (tabName === 'agents') {
        loadAgents();
    } else if (tabName === 'dashboard') {
        loadDashboardCharts();
    } else if (tabName === 'query') {
        loadChatSessions();
    } else if (tabName === 'requests') {
        loadApiRequests();
    }
}
