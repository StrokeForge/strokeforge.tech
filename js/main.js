// Load project counts for category cards on homepage
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.categories-section')) {
        loadProjectCounts();
    }
});

async function loadProjectCounts() {
    const categories = [
        { file: 'data/electronics-projects.json', id: 'count-electronics' },
        { file: 'data/other-projects.json', id: 'count-other' },
        { file: 'data/engineering-projects.json', id: 'count-engineering' },
        { file: 'data/3d-printing-guides.json', id: 'count-3dprint' }
    ];

    for (const category of categories) {
        try {
            const response = await fetch(category.file);
            const data = await response.json();
            const list = data.projects || data.guides;
            const count = list ? list.length : 0;

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
