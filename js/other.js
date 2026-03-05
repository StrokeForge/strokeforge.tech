// Other Projects Page JavaScript
let allProjects = [];

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    initCategoryNavigation();
});

async function loadProjects() {
    try {
        const response = await fetch('data/other-projects.json');
        const data = await response.json();
        const projectIds = data.projects;

        const projectPromises = projectIds.map(async (id) => {
            try {
                const metaResponse = await fetch(`other/${id}/metadata.json`);
                const metadata = await metaResponse.json();
                return { id, ...metadata };
            } catch (error) {
                console.error(`Error loading metadata for ${id}:`, error);
                return null;
            }
        });

        allProjects = (await Promise.all(projectPromises)).filter(p => p !== null);
        displayProjects(allProjects);

    } catch (error) {
        console.error('Error loading projects:', error);
        showErrorMessage('Failed to load projects. Please try again later.');
    }
}

function displayProjects(projects) {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (projects.length === 0) {
        grid.innerHTML = '<div class="empty-state"><h2>No projects yet</h2><p>Check back soon!</p></div>';
        return;
    }

    projects.forEach(project => grid.appendChild(createProjectCard(project)));
}

function createProjectCard(project) {
    const card = document.createElement('a');
    card.href = `other/${project.id}/`;
    card.className = 'project-card';

    const icon = project.icon || '📦';
    const typeLabel = project.type === 'tool' ? 'Web Tool' : 'Project';
    const typeIcon = project.type === 'tool' ? '🔧' : '📦';

    card.innerHTML = `
        <div class="project-image">${icon}</div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-meta">
                <span>${typeIcon} ${typeLabel}</span>
                <span>🌐 Browser-based</span>
            </div>
            <p class="project-description">${project.description}</p>
        </div>
    `;

    return card;
}

function initCategoryNavigation() {
    const links = document.querySelectorAll('.category-link');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const cat = this.getAttribute('data-category');
            displayProjects(cat === 'all' ? allProjects : allProjects.filter(p => p.type === cat));
        });
    });
}

function showErrorMessage(message) {
    const grid = document.querySelector('.projects-grid');
    if (grid) grid.innerHTML = `<div class="empty-state"><h2>Error</h2><p>${message}</p></div>`;
}
