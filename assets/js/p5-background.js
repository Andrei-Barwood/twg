// assets/js/p5-background.js
// Fondo estatico SVG: sin p5, sin canvas, sin animacion.

(function() {
    'use strict';

    const background = document.getElementById('p5-background');
    if (!background) return;

    const isShowsPage = document.body.classList.contains('shows-page')
        || window.location.pathname.endsWith('/shows.html');

    const palette = isShowsPage
        ? {
            base: '#FAFBD8',
            washA: '#D2EA91',
            washB: '#ADD9D5',
            ink: '#B73232',
            inkSoft: '#F0575C',
            accent: '#FFCD60',
            muted: '#7CA42A',
            pale: '#D6C77C',
        }
        : {
            base: '#E4E4E4',
            washA: '#AA86C5',
            washB: '#84DD92',
            ink: '#452261',
            inkSoft: '#784497',
            accent: '#65C092',
            muted: '#9877B1',
            pale: '#FFFFFF',
        };

    background.setAttribute('aria-hidden', 'true');
    background.classList.add('static-polygon-background');

    background.innerHTML = `
        <svg class="static-polygon-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="twg-bg-wash" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="${palette.pale}" stop-opacity="0.98" />
                    <stop offset="0.48" stop-color="${palette.base}" stop-opacity="0.92" />
                    <stop offset="1" stop-color="${palette.washA}" stop-opacity="0.34" />
                </linearGradient>
                <linearGradient id="twg-poly-fill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="${palette.washA}" stop-opacity="0.38" />
                    <stop offset="0.52" stop-color="${palette.pale}" stop-opacity="0.28" />
                    <stop offset="1" stop-color="${palette.washB}" stop-opacity="0.34" />
                </linearGradient>
            </defs>

            <rect width="1440" height="900" fill="url(#twg-bg-wash)" />
            <path d="M-80 755 C180 620 255 720 450 570 C705 375 795 565 1055 365 C1200 255 1325 260 1520 175 L1520 940 L-80 940 Z"
                fill="${palette.washB}" opacity="0.18" />
            <path d="M-40 160 L355 115 L455 245 L175 310 Z" fill="${palette.washA}" opacity="0.16" />
            <path d="M1010 45 L1505 10 L1460 285 L1060 250 Z" fill="${palette.muted}" opacity="0.14" />

            <g transform="translate(370 112) rotate(-4)">
                <polygon points="210,70 505,25 685,215 585,610 105,520"
                    fill="url(#twg-poly-fill)" stroke="${palette.ink}" stroke-width="5" stroke-linejoin="round" opacity="0.62" />
                <polygon points="210,70 310,285 105,520"
                    fill="${palette.pale}" opacity="0.32" stroke="${palette.ink}" stroke-width="4" stroke-linejoin="round" />
                <polygon points="210,70 310,285 505,25"
                    fill="${palette.washA}" opacity="0.18" stroke="${palette.ink}" stroke-width="4" stroke-linejoin="round" />
                <polygon points="505,25 685,215 520,305"
                    fill="${palette.washB}" opacity="0.22" stroke="${palette.ink}" stroke-width="4" stroke-linejoin="round" />
                <polygon points="520,305 685,215 585,610"
                    fill="${palette.pale}" opacity="0.2" stroke="${palette.ink}" stroke-width="4" stroke-linejoin="round" />
                <polygon points="310,285 520,305 585,610 105,520"
                    fill="${palette.washA}" opacity="0.14" stroke="${palette.ink}" stroke-width="4" stroke-linejoin="round" />

                <path d="M210 70 L310 285 L105 520 M310 285 L520 305 M505 25 L520 305 L585 610 M505 25 L685 215"
                    fill="none" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M370 45 L380 560 M370 45 L520 305 M380 560 L520 305"
                    fill="none" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="12 14" opacity="0.9" />

                <circle cx="370" cy="45" r="8" fill="${palette.ink}" />
                <circle cx="380" cy="560" r="8" fill="${palette.ink}" />
                <circle cx="520" cy="305" r="8" fill="${palette.ink}" />
            </g>

            <g transform="translate(76 565) scale(0.52) rotate(8)" opacity="0.24">
                <polygon points="210,70 505,25 685,215 585,610 105,520"
                    fill="${palette.washA}" stroke="${palette.inkSoft}" stroke-width="5" stroke-linejoin="round" />
                <path d="M210 70 L310 285 L105 520 M310 285 L520 305 M505 25 L520 305 L585 610 M505 25 L685 215 M370 45 L380 560 M370 45 L520 305 M380 560 L520 305"
                    fill="none" stroke="${palette.inkSoft}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
            </g>

            <g transform="translate(1060 440) scale(0.42) rotate(-18)" opacity="0.2">
                <polygon points="210,70 505,25 685,215 585,610 105,520"
                    fill="${palette.accent}" stroke="${palette.ink}" stroke-width="5" stroke-linejoin="round" />
                <path d="M210 70 L310 285 L105 520 M310 285 L520 305 M505 25 L520 305 L585 610 M505 25 L685 215 M370 45 L380 560 M370 45 L520 305 M380 560 L520 305"
                    fill="none" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="13 12" />
            </g>
        </svg>
    `;
})();
