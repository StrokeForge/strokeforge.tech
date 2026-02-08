// Models page JavaScript
let allModels = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    loadModels();
});

async function loadModels() {
    try {
        const response = await fetch('data/models.json');
        const data = await response.json();
        allModels = data.models;
        
        // Sort alphabetically by title (A-Z)
        allModels.sort((a, b) => a.title.localeCompare(b.title));
        
        // Update stats
        updateStats(allModels);
        
        // Generate filter buttons
        generateFilterButtons(allModels);
        
        // Display models
        displayModels(allModels);
        
        // Setup filter event listeners
        setupFilters();
        
    } catch (error) {
        console.error('Error loading models:', error);
        showEmptyState('Error loading models. Please try again later.');
    }
}

function generateFilterButtons(models) {
    // Collect all unique tags
    const allTags = new Set();
    models.forEach(model => {
        if (model.tags) {
            model.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    // Sort tags alphabetically
    const sortedTags = Array.from(allTags).sort();
    
    // Find filter buttons container
    const filterContainer = document.querySelector('.filter-buttons');
    
    // Add tag buttons
    sortedTags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.setAttribute('data-tag', tag);
        button.textContent = tag;
        button.style.cssText = 'background: var(--card-bg); border: 2px solid var(--border-gray); color: var(--light-gray); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; transition: all 0.3s; font-size: 0.9rem;';
        filterContainer.appendChild(button);
    });
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentFilter = this.getAttribute('data-tag');
            
            // Update active state
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = 'var(--card-bg)';
                btn.style.borderColor = 'var(--border-gray)';
            });
            this.classList.add('active');
            this.style.background = 'var(--primary-orange)';
            this.style.borderColor = 'var(--primary-orange)';
            this.style.color = 'white';
            
            // Filter and display
            filterModels();
        });
    });
}

function filterModels() {
    if (currentFilter === 'all') {
        displayModels(allModels);
    } else {
        const filtered = allModels.filter(model => {
            return model.tags && model.tags.includes(currentFilter);
        });
        displayModels(filtered);
    }
}

function updateStats(models) {
    // Total models - counted automatically
    document.getElementById('total-models').textContent = models.length;
}

function displayModels(models) {
    const grid = document.getElementById('models-grid');
    
    if (models.length === 0) {
        showEmptyState('No models found with this tag.');
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
    
    card.innerHTML = `
        <div class="model-image">
            ${imageContent}
            <div class="printables-badge">Printables</div>
        </div>
        <div class="model-content">
            <h3 class="model-title">${model.title}</h3>
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