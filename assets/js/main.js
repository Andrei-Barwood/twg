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
    // 5. FAVICON DINAMICO
    // ============================================
    const faviconPalette = [
        '#12162C',
        '#363E7A',
        '#090E1D',
        '#282D5A',
        '#844FDE',
        '#4B37CA',
        '#1C4CC2',
        '#FFFFFF',
        '#0C6182',
        '#00B6A3',
        '#67E6D0',
        '#9CFBFF',
        '#7796EC',
        '#000000',
        '#FFFFFF',
        '#5684E5',
        '#6E66C0',
        '#000000',
        '#FFFFFF',
        '#9990F2',
        '#C4BEF7',
        '#7770B9',
        '#9995BF'
    ];

    const faviconHeartPath = 'M491 551q-7 0 -16 11.5t-9 22.5q0 19 26 19q22 0 22 -17q0 -11 -7.5 -23.5t-15.5 -12.5zM577 408q-24 0 -41 20t-17 49q0 28 17 48.5t41 20.5q25 0 42 -20.5t17 -48.5q0 -29 -17 -49t-42 -20zM401 408q-25 0 -42 20t-17 49q0 28 17 48.5t42 20.5q24 0 41 -20.5t17 -48.5q0 -29 -17 -49t-41 -20zM492 223q-87 -137 -213 -137q-85 0 -144 65q-61 68 -57 171q11 76 55 161q106 204 359 423q252 -219 358 -423q44 -85 55 -161q4 -114 -68.5 -182t-168.5 -51q-104 19 -176 134zM577 635v7q0 16 -11 28.5t-27 13.5q-16 2 -24 -5q-12 9 -26 9q-16 0 -28 -10q-8 8 -25 6q-15 -1 -26.5 -13.5t-11.5 -28.5v-9q-121 -36 -121 -140q0 -85 66 -143q62 -56 149 -56q85 0 149.5 57t64.5 142q0 50 -33.5 88t-95.5 54z';
    const faviconTransitionMs = 1400;
    const faviconUpdateMs = 90;
    let lastFaviconColor = '';

    function hexToRgb(hex) {
        const normalized = hex.replace('#', '');
        const value = Number.parseInt(normalized, 16);

        return {
            r: (value >> 16) & 255,
            g: (value >> 8) & 255,
            b: value & 255
        };
    }

    function rgbToHex(rgb) {
        const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));

        return `#${[rgb.r, rgb.g, rgb.b]
            .map((value) => clamp(value).toString(16).padStart(2, '0'))
            .join('')}`;
    }

    function interpolateColor(startHex, endHex, progress) {
        const start = hexToRgb(startHex);
        const end = hexToRgb(endHex);

        return rgbToHex({
            r: start.r + (end.r - start.r) * progress,
            g: start.g + (end.g - start.g) * progress,
            b: start.b + (end.b - start.b) * progress
        });
    }

    function easeInOutSine(progress) {
        return -(Math.cos(Math.PI * progress) - 1) / 2;
    }

    function buildFaviconSvg(color) {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="-10 0 999 1000">
                <path fill="${color}" d="${faviconHeartPath}" />
            </svg>
        `.trim();
    }

    function ensureFaviconLinks() {
        const links = Array.from(document.querySelectorAll("link[rel~='icon']"));

        if (links.length > 0) {
            return links;
        }

        const link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
        return [link];
    }

    function setFavicon(color) {
        if (color === lastFaviconColor) {
            return;
        }

        const svg = buildFaviconSvg(color);
        const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

        ensureFaviconLinks().forEach((link) => {
            link.type = 'image/svg+xml';
            link.href = url;
        });

        lastFaviconColor = color;
    }

    function startDynamicFavicon() {
        if (faviconPalette.length === 0) {
            return;
        }

        if (faviconPalette.length === 1) {
            setFavicon(faviconPalette[0]);
            return;
        }

        const startTime = performance.now();
        setFavicon(faviconPalette[0]);

        window.setInterval(() => {
            const elapsed = performance.now() - startTime;
            const segment = Math.floor(elapsed / faviconTransitionMs);
            const rawProgress = (elapsed % faviconTransitionMs) / faviconTransitionMs;
            const easedProgress = easeInOutSine(rawProgress);
            const currentIndex = segment % faviconPalette.length;
            const nextIndex = (currentIndex + 1) % faviconPalette.length;
            const currentColor = faviconPalette[currentIndex];
            const nextColor = faviconPalette[nextIndex];

            setFavicon(interpolateColor(currentColor, nextColor, easedProgress));
        }, faviconUpdateMs);
    }

    startDynamicFavicon();

    // ============================================
    // 6. (OPCIONAL) REGISTRO EN CONSOLA (DEBUG)
    // ============================================
    console.log(`🌐 Página detectada: ${pageName}`);

})();
