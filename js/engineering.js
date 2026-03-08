// Engineering Page JavaScript
let allProjects = [];

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    initCategoryNavigation();
});

async function loadProjects() {
    try {
        const response = await fetch('data/engineering-projects.json');
        const data = await response.json();

        const promises = data.projects.map(async (id) => {
            try {
                const meta = await fetch(`engineering/${id}/metadata.json`);
                const metadata = await meta.json();
                return { id, ...metadata };
            } catch (e) {
                console.error(`Error loading ${id}:`, e);
                return null;
            }
        });

        allProjects = (await Promise.all(promises)).filter(p => p !== null);
        allProjects.sort((a, b) => a.title.localeCompare(b.title));
        renderProjects(allProjects);

    } catch (error) {
        console.error('Error loading projects:', error);
        const grid = document.querySelector('.projects-grid');
        if (grid) grid.innerHTML = '<div class="empty-state"><h2>Error</h2><p>Failed to load projects.</p></div>';
    }
}

function renderProjects(projects) {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (projects.length === 0) {
        grid.innerHTML = '<div class="empty-state"><h2>No tools found</h2><p>More coming soon.</p></div>';
        return;
    }

    projects.forEach(project => {
        const card = document.createElement('a');
        card.href = `engineering/${project.id}/`;
        card.className = 'project-card';

        const icon = project.icon || '⚙️';
        const catLabel = project.category === 'reference' ? 'Reference Table' : 'Calculator';
        const catIcon = project.category === 'reference' ? '📊' : '🔧';
        const langBadge = project.lang === 'cs' ? '<span>🇨🇿 Czech</span>' : '';

        card.innerHTML = `
            <div class="project-image">${icon}</div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-meta">
                    <span>${catIcon} ${catLabel}</span>
                    <span>🌐 Browser-based</span>
                    ${langBadge}
                </div>
                <p class="project-description">${project.description}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function initCategoryNavigation() {
    const links = document.querySelectorAll('.category-link');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const topic = this.getAttribute('data-topic');
            renderProjects(topic === 'all' ? allProjects : allProjects.filter(p => p.topic === topic));
        });
    });
}
