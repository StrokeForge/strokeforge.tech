function toggleNav() {
    var links = document.querySelector('.nav-links');
    var btn = document.querySelector('.hamburger');
    if (!links || !btn) return;
    links.classList.toggle('nav-open');
    btn.classList.toggle('nav-open');
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar')) {
        var links = document.querySelector('.nav-links');
        var btn = document.querySelector('.hamburger');
        if (links) links.classList.remove('nav-open');
        if (btn) btn.classList.remove('nav-open');
    }
});
