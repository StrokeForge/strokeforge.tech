// Electronics Page JavaScript
let allProjects = [];
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    initCategoryNavigation();
});

async function loadProjects() {
    try {
        const response = await fetch('data/electronics-projects.json');
        const data = await response.json();

        const projectPromises = data.projects.map(async (id) => {
            try {
                const meta = await fetch(`electronics/${id}/metadata.json`);
                const metadata = await meta.json();
                return { id, ...metadata };
            } catch (e) {
                console.error(`Error loading ${id}:`, e);
                return null;
            }
        });

        allProjects = (await Promise.all(projectPromises)).filter(p => p !== null);
        displayProjects(allProjects);

    } catch (error) {
        console.error('Error loading projects:', error);
        showError('Failed to load projects. Please try again later.');
    }
}

function displayProjects(projects) {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (projects.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h2>No tools in this category yet</h2>
                <p>Check back soon — more tools are being added!</p>
            </div>
        `;
        return;
    }

    projects.forEach(project => grid.appendChild(createCard(project)));
}

function createCard(project) {
    const card = document.createElement('a');
    card.href = `electronics/${project.id}/`;
    card.className = 'project-card';

    const icon = project.icon || '⚡';
    const catLabel = categoryLabel(project.category);

    card.innerHTML = `
        <div class="project-image">${icon}</div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-meta">
                <span>⚡ ${catLabel}</span>
                <span>🌐 Browser-based</span>
            </div>
            <p class="project-description">${project.description}</p>
        </div>
    `;
    return card;
}

function categoryLabel(cat) {
    const labels = {
        basic:     'Basic',
        power:     'Power',
        signals:   'Signals',
        arduino:   'Arduino / ESP32',
        reference: 'Reference',
        diodes:    'Diodes'
    };
    return labels[cat] || 'Electronics';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showError(msg) {
    const grid = document.querySelector('.projects-grid');
    if (grid) grid.innerHTML = `<div class="empty-state"><h2>Error</h2><p>${msg}</p></div>`;
}

function initCategoryNavigation() {
    const links = document.querySelectorAll('.category-link');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const cat = this.getAttribute('data-category');
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            currentCategory = cat;
            filterProjects(cat);
        });
    });
}

function filterProjects(category) {
    if (category === 'all') {
        displayProjects(allProjects);
    } else {
        displayProjects(allProjects.filter(p => p.category === category));
    }
}
