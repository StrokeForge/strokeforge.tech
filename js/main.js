// Load projects data and update homepage
document.addEventListener('DOMContentLoaded', function() {
    loadProjectsData();
    loadModelsData();
});

async function loadProjectsData() {
    try {
        // Load projects index
        const response = await fetch('data/projects-index.json');
        const data = await response.json();
        
        // Update category counts (excluding 3d-print)
        updateCategoryCounts(data.projects);
        
        // Update recent projects
        updateRecentProjects(data.projects);
        
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

async function loadModelsData() {
    try {
        // Load models data
        const response = await fetch('data/models.json');
        const data = await response.json();
        
        // Update 3D Models count
        document.getElementById('count-3dprint').textContent = data.models.length;
        
    } catch (error) {
        console.error('Error loading models:', error);
    }
}

function updateCategoryCounts(projects) {
    // Count projects by category (excluding 3d-print)
    const counts = {
        'electronics': 0,
        'mechanical': 0,
        'other': 0
    };
    
    projects.forEach(project => {
        const category = project.category.toLowerCase().replace(' ', '-');
        if (counts[category] !== undefined) {
            counts[category]++;
        }
    });
    
    // Update DOM
    document.getElementById('count-electronics').textContent = counts['electronics'];
    document.getElementById('count-mechanical').textContent = counts['mechanical'];
    document.getElementById('count-other').textContent = counts['other'];
}

function updateRecentProjects(projects) {
    const recentContainer = document.getElementById('recent-projects');
    
    if (projects.length === 0) {
        // Keep the empty state message
        return;
    }
    
    // Get 3 most recent projects
    const recentProjects = projects.slice(0, 3);
    
    // Clear container
    recentContainer.innerHTML = '';
    
    // Create cards
    recentProjects.forEach(project => {
        const card = createProjectCard(project);
        recentContainer.appendChild(card);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => window.location.href = `projects.html?id=${project.id}`;
    
    card.innerHTML = `
        <div class="project-image">
            ${project.thumbnail ? 
                `<img src="${project.thumbnail}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">` :
                '📦'
            }
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-meta">
                <span>📅 ${project.date}</span>
                <span>📁 ${project.category}</span>
                <span>⭐ ${project.difficulty}</span>
            </div>
            <p class="project-description">${project.description_short}</p>
        </div>
    `;
    
    return card;
}