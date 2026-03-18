const menuBtn = document.getElementById('menu-btn');
const menuLinks = document.getElementById('menu-links');
const links = menuLinks.querySelectorAll('a');

menuBtn.addEventListener('click', () => {
    menuLinks.classList.toggle('hidden');
    menuLinks.classList.toggle('flex');
});

// Cerrar el menú automáticamente al hacer clic en un enlace (en móvil)
links.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            menuLinks.classList.add('hidden');
            menuLinks.classList.remove('flex');
        }
    });
});

// Role rotation is now handled by data-loader.js (reads roles from data/data.json)