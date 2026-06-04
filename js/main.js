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
        { file: 'data/3d-printing-projects.json', id: 'count-3dprint' }
    ];

    for (const category of categories) {
        try {
            const response = await fetch(category.file);
            if (!response.ok) continue;            // leave the number already in the HTML
            const data = await response.json();
            const list = data.projects || data.guides;
            if (!list) continue;

            const element = document.getElementById(category.id);
            if (element) {
                element.textContent = list.length;
            }
        } catch (error) {
            // Couldn't load the data — keep the value that's already in the HTML,
            // don't reset it to 0.
        }
    }
}
