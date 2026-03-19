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

document.addEventListener("DOMContentLoaded", function () {
    // Cadenas en Base64
    const eEncoded = "c2ViYXN0aWFuLm10OTlAZ21haWwuY29t";
    const pEncoded = "NTczMTA4NjE4NTcw";

    // Función para decodificar y abrir email
    document.getElementById("btn-eml").addEventListener("click", function () {
        const email = atob(eEncoded);
        window.location.href = "mailto:" + email;
    });

    // Función para decodificar y abrir WhatsApp
    document.getElementById("btn-wsp").addEventListener("click", function () {
        const phone = atob(pEncoded);
        const text = encodeURIComponent("Hola, vi tu portafolio y me gustaría contactarte.");
        window.open("https://wa.me/" + phone + "?text=" + text, "_blank");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const sliders = document.querySelectorAll('.hide-scrollbar');

    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            // Calculamos la posición inicial
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return; // Si no estamos haciendo clic, no hace nada
            e.preventDefault();

            // Calculamos cuánto se ha movido el mouse
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Multiplicador de velocidad (2 es ideal)
            slider.scrollLeft = scrollLeft - walk;
        });
    });
});