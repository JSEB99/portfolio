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

document.addEventListener('DOMContentLoaded', () => {
    const roleElement = document.getElementById('role-text');
    const roles = ["Data Engineer", "Data Analyst", "Data Scientist"];
    let currentIndex = 0;

    function updateRole() {
        // Efecto de desvanecimiento (opcional pero recomendado)
        roleElement.style.opacity = 0;

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % roles.length;
            roleElement.textContent = roles[currentIndex];
            roleElement.style.opacity = 1;
        }, 200); // Tiempo que tarda en desaparecer
    }

    // Cambia cada 3 segundos
    setInterval(updateRole, 2000);
});