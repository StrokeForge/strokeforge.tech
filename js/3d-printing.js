// 3D Printing Projects Page JavaScript
let allProjects = [];
let currentCategory = 'all';

// Load projects on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    initCategoryNavigation();
});

async function loadProjects() {
    try {
        // Load project list
        const response = await fetch('data/3d-printing-projects.json');
        const data = await response.json();
        const projectIds = data.projects;
        
        // Load metadata for each project
        const projectPromises = projectIds.map(async (id) => {
            try {
                const metaResponse = await fetch(`3d-printing/${id}/metadata.json`);
                const metadata = await metaResponse.json();
                return {
                    id: id,
                    ...metadata
                };
            } catch (error) {
                console.error(`Error loading metadata for ${id}:`, error);
                return null;
            }
        });
        
        allProjects = (await Promise.all(projectPromises)).filter(p => p !== null);
        allProjects.sort((a, b) => a.title.localeCompare(b.title));
        displayProjects(allProjects);
        
    } catch (error) {
        console.error('Error loading projects:', error);
        showErrorMessage('Failed to load projects. Please try again later.');
    }
}

function displayProjects(projects) {
    const grid = document.querySelector('.projects-grid');
    
    if (!grid) {
        console.error('Projects grid not found');
        return;
    }
    
    // Clear grid
    grid.innerHTML = '';
    
    if (projects.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h2>No projects yet</h2>
                <p>Check back soon for new 3D printing projects!</p>
            </div>
        `;
        return;
    }
    
    // Generate project cards
    projects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
}

function createProjectCard(project) {
    const card = document.createElement('a');
    card.href = `3d-printing/${project.id}/`;
    card.className = 'project-card';
    
    // Difficulty class
    let difficultyClass = 'difficulty-beginner';
    if (project.difficulty === 'intermediate') {
        difficultyClass = 'difficulty-intermediate';
    } else if (project.difficulty === 'advanced') {
        difficultyClass = 'difficulty-advanced';
    }
    
    card.innerHTML = `
        <div class="project-image">
            ${project.thumbnail ? 
                `<img src="3d-printing/${project.id}/${project.thumbnail}" alt="${project.title}">` :
                '🖨️'
            }
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-meta">
                <span class="${difficultyClass}">⭐ ${capitalizeFirst(project.difficulty)}</span>
                <span>⏱️ ${project.time}</span>
            </div>
            <p class="project-description">
                ${project.description}
            </p>
        </div>
    `;
    
    return card;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showErrorMessage(message) {
    const grid = document.querySelector('.projects-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="empty-state">
                <h2>Error</h2>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize category navigation
function initCategoryNavigation() {
    const categoryLinks = document.querySelectorAll('.category-link');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const category = this.getAttribute('data-category');

            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Update current category
            currentCategory = category;

            // Filter and display projects
            filterProjects(category);
        });
    });
}

// Filter projects by category
function filterProjects(category) {
    if (category === 'all') {
        displayProjects(allProjects);
    } else {
        const filtered = allProjects.filter(project => project.category === category);
        displayProjects(filtered);
    }
}