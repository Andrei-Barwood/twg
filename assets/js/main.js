// assets/js/main.js

(function() {
    'use strict';

    // ============================================
    // 1. DETECTAR PÁGINA ACTUAL Y AÑADIR CLASE AL BODY
    // ============================================
    const path = window.location.pathname;
    let page = path.split('/').pop(); // nombre del archivo (ej. "index.html")

    // Si la ruta termina en '/' o está vacía, asumimos index.html
    if (!page || page === '' || page.endsWith('/')) {
        page = 'index.html';
    }

    // Extraemos el nombre sin extensión (ej. "index", "music")
    const pageName = page.replace('.html', '').toLowerCase();

    // Añadimos la clase al body (para los efectos hover diferenciados)
    document.body.classList.add(pageName);

    // También añadimos una clase genérica para páginas que no son el index
    if (pageName !== 'index') {
        document.body.classList.add('pagina-interna');
    }

    // ============================================
    // 2. ENLACES EXTERNOS: ABRIR EN NUEVA PESTAÑA
    // ============================================
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        // Solo si no tiene ya target="_blank"
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer'); // seguridad y rendimiento
        }
    });

    // ============================================
    // 3. SCROLL SUAVE PARA ENLACES INTERNOS (ANCLAS)
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // ignorar enlaces vacíos

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault(); // evitar salto instantáneo
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // 4. (OPCIONAL) EFECTO GLITCH EN TÍTULOS AL AZAR
    //    (Ejemplo adicional, se puede quitar si no se desea)
    // ============================================
    // Añade la clase 'glitch' a algunos h2 aleatoriamente para dar más dinamismo
    const headers = document.querySelectorAll('h2');
    if (headers.length > 0) {
        // Selecciona un índice aleatorio
        const randomIndex = Math.floor(Math.random() * headers.length);
        headers[randomIndex].classList.add('glitch');
    }

    // ============================================
    // 5. (OPCIONAL) REGISTRO EN CONSOLA (DEBUG)
    // ============================================
    console.log(`🌐 Página detectada: ${pageName}`);

})();