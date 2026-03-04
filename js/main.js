// Load project counts for category cards on homepage
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.categories-section')) {
        loadProjectCounts();
    }
});

async function loadProjectCounts() {
    const categories = [
        { file: 'data/3d-printing-projects.json', id: 'count-3dprint' },
        { file: 'data/electronics-projects.json', id: 'count-electronics' },
        { file: 'data/mechanical-projects.json', id: 'count-mechanical' },
        { file: 'data/other-projects.json', id: 'count-other' },
        { file: 'data/engineering-projects.json', id: 'count-engineering' }
    ];

    for (const category of categories) {
        try {
            const response = await fetch(category.file);
            const data = await response.json();
            const count = data.projects ? data.projects.length : 0;

            const element = document.getElementById(category.id);
            if (element) {
                element.textContent = count;
            }
        } catch (error) {
            // If file doesn't exist yet, show 0
            const element = document.getElementById(category.id);
            if (element) {
                element.textContent = '0';
            }
        }
    }
}
