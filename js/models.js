// Models page JavaScript
let allModels = [];

document.addEventListener('DOMContentLoaded', function() {
    loadModels();
});

async function loadModels() {
    try {
        const response = await fetch('data/models.json');
        const data = await response.json();
        allModels = data.models;
        
        // Update stats
        updateStats(data, allModels);
        
        // Display models
        displayModels(allModels);
        
    } catch (error) {
        console.error('Error loading models:', error);
        showEmptyState('Error loading models. Please try again later.');
    }
}

function updateStats(data, models) {
    // Total models
    document.getElementById('total-models').textContent = data.total_models || models.length;
    
    // Calculate total likes and downloads
    let totalLikes = 0;
    let totalDownloads = 0;
    
    models.forEach(model => {
        if (model.stats) {
            totalLikes += model.stats.likes || 0;
            totalDownloads += model.stats.downloads || 0;
        }
    });
    
    document.getElementById('total-likes').textContent = totalLikes;
    document.getElementById('total-downloads').textContent = totalDownloads;
}

function displayModels(models) {
    const grid = document.getElementById('models-grid');
    
    if (models.length === 0) {
        showEmptyState('No models available yet.');
        return;
    }
    
    // Clear grid
    grid.innerHTML = '';
    
    // Create model cards
    models.forEach(model => {
        const card = createModelCard(model);
        grid.appendChild(card);
    });
}

function createModelCard(model) {
    const card = document.createElement('div');
    card.className = 'model-card';
    
    // Prepare image
    const imageContent = model.preview_image ? 
        `<img src="${model.preview_image}" alt="${model.title}">` :
        '🖨️';
    
    // Create tags HTML
    const tagsHTML = model.tags ? 
        model.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('') : 
        '';
    
    // Stats
    const likes = model.stats?.likes || 0;
    const downloads = model.stats?.downloads || 0;
    const makes = model.stats?.makes || 0;
    
    card.innerHTML = `
        <div class="model-image">
            ${imageContent}
            <div class="printables-badge">Printables</div>
        </div>
        <div class="model-content">
            <h3 class="model-title">${model.title}</h3>
            <div class="model-stats">
                <span>❤️ ${likes}</span>
                <span>⬇️ ${downloads}</span>
                ${makes > 0 ? `<span>🔧 ${makes}</span>` : ''}
            </div>
            ${model.description ? `<p class="model-description">${model.description}</p>` : ''}
            ${tagsHTML ? `<div class="model-tags">${tagsHTML}</div>` : ''}
            <a href="${model.printables_url}" target="_blank" class="download-btn">
                View on Printables →
            </a>
        </div>
    `;
    
    return card;
}

function showEmptyState(message) {
    const grid = document.getElementById('models-grid');
    grid.innerHTML = `
        <div class="empty-state">
            <h2>🔍 ${message}</h2>
        </div>
    `;
}