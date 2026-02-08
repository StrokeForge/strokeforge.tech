// Projects page JavaScript
let allProjects = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameters for category filter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        currentFilter = categoryParam;
    }
    
    // Load projects data
    loadProjects();
    
    // Setup filter buttons
    setupFilters();
});

async function loadProjects() {
    try {
        const response = await fetch('data/projects-index.json');
        const data = await response.json();
        allProjects = data.projects;
        
        // Display projects
        displayProjects(allProjects);
        
        // Update active filter button
        updateActiveFilter();
        
    } catch (error) {
        console.error('Error loading projects:', error);
        showEmptyState('Error loading projects. Please try again later.');
    }
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentFilter = this.getAttribute('data-category');
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter and display
            filterProjects();
        });
    });
}

function updateActiveFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === currentFilter) {
            btn.classList.add('active');
        }
    });
}

function filterProjects() {
    if (currentFilter === 'all') {
        displayProjects(allProjects);
    } else {
        const filtered = allProjects.filter(project => {
            const projectCategory = project.category.toLowerCase().replace(' ', '-');
            return projectCategory === currentFilter;
        });
        displayProjects(filtered);
    }
}

function displayProjects(projects) {
    const grid = document.getElementById('projects-grid');
    
    if (projects.length === 0) {
        showEmptyState('No projects found in this category.');
        return;
    }
    
    // Clear grid
    grid.innerHTML = '';
    
    // Create project cards
    projects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => openProjectDetail(project.id);
    
    // Prepare image
    const imageContent = project.thumbnail ? 
        `<img src="${project.thumbnail}" alt="${project.title}">` :
        getCategoryIcon(project.category);
    
    // Create tags HTML
    const tagsHTML = project.tags ? 
        project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : 
        '';
    
    card.innerHTML = `
        <div class="project-image">
            ${imageContent}
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-meta">
                <span>📅 ${project.date}</span>
                <span>📁 ${project.category}</span>
                <span>⭐ ${project.difficulty}</span>
            </div>
            <p class="project-description">${project.description_short}</p>
            ${tagsHTML ? `<div class="project-tags">${tagsHTML}</div>` : ''}
        </div>
    `;
    
    return card;
}

function getCategoryIcon(category) {
    const icons = {
        '3D Print': '🖨️',
        'Electronics': '⚡',
        'Mechanical': '🔧',
        'Other': '📦'
    };
    return icons[category] || '📦';
}

function openProjectDetail(projectId) {
    // Placeholder - will create project detail page later
    alert(`Project detail page coming soon!\nProject ID: ${projectId}`);
    // Future: window.location.href = `project-detail.html?id=${projectId}`;
}

function showEmptyState(message) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = `
        <div class="empty-state">
            <h2>🔍 ${message}</h2>
        </div>
    `;
}