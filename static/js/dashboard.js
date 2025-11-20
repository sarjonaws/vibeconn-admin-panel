// Dashboard charts and visualizations
async function loadDashboardCharts() {
    try {
        const res = await fetch('/api/documents');
        const docs = await res.json();
        
        if (docs.length === 0) return;
        
        // 1. Word Cloud
        const wordFreq = {};
        docs.forEach(doc => {
            const text = (doc.semantic_core || doc.original_text || '').toLowerCase();
            const words = text.split(/\s+/).filter(w => w.length > 4);
            words.forEach(word => {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            });
        });
        
        const topWords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 30);
        
        const maxFreq = topWords[0]?.[1] || 1;
        const wordCloudDiv = document.getElementById('word-cloud');
        wordCloudDiv.innerHTML = topWords.map(([word, freq]) => {
            const size = 12 + (freq / maxFreq) * 28;
            const opacity = 0.5 + (freq / maxFreq) * 0.5;
            return `<span style="font-size:${size}px;opacity:${opacity};color:#3498db;font-weight:600;cursor:pointer;" title="${freq} veces">${word}</span>`;
        }).join(' ');
        
        // 2. Token Chart
        const tokenWords = {};
        docs.forEach(doc => {
            const text = (doc.semantic_core || doc.original_text || '').toLowerCase();
            const words = text.split(/\s+/).filter(w => w.length > 4);
            words.forEach(word => {
                const tokens = Math.ceil(word.length / 4);
                tokenWords[word] = (tokenWords[word] || 0) + tokens;
            });
        });
        
        const topTokenWords = Object.entries(tokenWords)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        const maxTokens = topTokenWords[0]?.[1] || 1;
        const tokenChartDiv = document.getElementById('token-chart');
        tokenChartDiv.innerHTML = topTokenWords.map(([word, tokens]) => {
            const width = (tokens / maxTokens) * 100;
            return `
                <div style="margin-bottom:8px;">
                    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                        <span style="font-weight:600;">${word}</span>
                        <span style="color:#7f8c8d;">${tokens} tokens</span>
                    </div>
                    <div style="background:#ecf0f1;border-radius:4px;height:20px;overflow:hidden;">
                        <div style="width:${width}%;background:#3498db;height:100%;transition:width 0.3s;"></div>
                    </div>
                </div>
            `;
        }).join('');
        
        // 3. Vector Map (simplified 2D projection)
        const vectorMapDiv = document.getElementById('vector-map');
        const mapWidth = vectorMapDiv.offsetWidth || 800;
        const mapHeight = 400;
        const padding = 60;
        
        const points = docs.slice(0, 50).map((doc, i) => {
            const x = (Math.sin(i * 0.5) * 0.4 + 0.5) * (mapWidth - padding * 2) + padding;
            const y = (Math.cos(i * 0.3) * 0.4 + 0.5) * (mapHeight - padding * 2) + padding;
            const label = (doc.id || '').substring(0, 12);
            return { x, y, label, understanding: doc.semantic_understanding || 50 };
        });
        
        vectorMapDiv.innerHTML = `
            <svg width="${mapWidth}" height="${mapHeight}" style="position:absolute;top:0;left:0;">
                <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${mapHeight - padding}" stroke="#bdc3c7" stroke-width="2" />
                <line x1="${padding}" y1="${mapHeight - padding}" x2="${mapWidth - padding}" y2="${mapHeight - padding}" stroke="#bdc3c7" stroke-width="2" />
                
                ${[0, 0.25, 0.5, 0.75, 1].map(t => {
                    const x = padding + t * (mapWidth - padding * 2);
                    const y = mapHeight - padding - t * (mapHeight - padding * 2);
                    return `
                        <line x1="${x}" y1="${mapHeight - padding}" x2="${x}" y2="${mapHeight - padding + 5}" stroke="#7f8c8d" stroke-width="1" />
                        <text x="${x}" y="${mapHeight - padding + 20}" font-size="11" fill="#7f8c8d" text-anchor="middle">${t.toFixed(2)}</text>
                        <line x1="${padding}" y1="${y}" x2="${padding - 5}" y2="${y}" stroke="#7f8c8d" stroke-width="1" />
                        <text x="${padding - 10}" y="${y + 4}" font-size="11" fill="#7f8c8d" text-anchor="end">${t.toFixed(2)}</text>
                    `;
                }).join('')}
                
                <text x="${mapWidth / 2}" y="${mapHeight - 10}" font-size="13" fill="#2c3e50" text-anchor="middle" font-weight="600">Dimensión X</text>
                <text x="20" y="${mapHeight / 2}" font-size="13" fill="#2c3e50" text-anchor="middle" font-weight="600" transform="rotate(-90, 20, ${mapHeight / 2})">Dimensión Y</text>
                
                ${points.map(p => {
                    const color = p.understanding >= 80 ? '#27ae60' : p.understanding >= 60 ? '#f39c12' : '#e74c3c';
                    return `
                        <circle cx="${p.x}" cy="${p.y}" r="6" fill="${color}" opacity="0.7" stroke="white" stroke-width="2" />
                        <text x="${p.x}" y="${p.y - 12}" font-size="9" fill="#2c3e50" text-anchor="middle" font-weight="600">${p.label}</text>
                    `;
                }).join('')}
            </svg>
        `;
        
    } catch (e) {
        console.error('Error loading charts:', e);
    }
}
