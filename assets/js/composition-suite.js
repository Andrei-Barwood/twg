(function() {
    'use strict';

    const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    const FLAT_FRIENDLY_ROOTS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']);
    const NOTE_INDEX = {
        C: 0,
        'B#': 0,
        'C#': 1,
        Db: 1,
        D: 2,
        'D#': 3,
        Eb: 3,
        E: 4,
        Fb: 4,
        'E#': 5,
        F: 5,
        'F#': 6,
        Gb: 6,
        G: 7,
        'G#': 8,
        Ab: 8,
        A: 9,
        'A#': 10,
        Bb: 10,
        B: 11,
        Cb: 11
    };

    const SCALE_LIBRARY = {
        hungarian_minor: {
            name: 'Hungarian Minor',
            intervals: [0, 2, 3, 6, 7, 8, 11],
            mood: 'Color melodramático, angular y muy útil para tensión romántica torcida.',
            writingTip: 'Trabaja saltos entre tercera menor y cuarta aumentada para que el gesto tenga dramatismo sin sonar genérico.',
            trackerTip: 'Funciona bien con leads secos, cuerdas espectrales y bajos que se queden en pedal mientras la melodía se quiebra arriba.'
        },
        phrygian_dominant: {
            name: 'Phrygian Dominant',
            intervals: [0, 1, 4, 5, 7, 8, 10],
            mood: 'Dulce y ceremonial en la superficie, pero con filo inmediato por la segunda menor.',
            writingTip: 'Haz que la segunda menor roce el motivo principal; ese semitono es el perfume del modo.',
            trackerTip: 'Ideal para breaks con huecos, drones modales y líneas ornamentales que respiren alrededor de un pedal.'
        },
        augmented: {
            name: 'Augmented',
            intervals: [0, 3, 4, 7, 8, 11],
            mood: 'Escala hexatónica brillante, simétrica y muy buena para sensación de mecanismo extraño o energía suspendida.',
            writingTip: 'Piensa en bloques de color y simetrías; no hace falta resolver cada gesto si la rotación ya es expresiva.',
            trackerTip: 'Rinde especialmente bien con arpegios mecánicos, capas espejadas y modulaciones bruscas entre registros.'
        },
        minor_pentatonic: {
            name: 'Minor Pentatonic',
            intervals: [0, 3, 5, 7, 10],
            mood: 'Centro rítmico claro, con cuerpo inmediato y espacio suficiente para deformar el beat.',
            writingTip: 'Úsala para fijar el núcleo del motivo y deja que los cromatismos aparezcan solo como bordes o ataques.',
            trackerTip: 'Perfecta para bajos, stabs cortos y riffs que tengan que sobrevivir a mucha fragmentación rítmica.'
        },
        major_pentatonic: {
            name: 'Major Pentatonic',
            intervals: [0, 2, 4, 7, 9],
            mood: 'Luminosa, abierta y útil para un brillo pop o un descanso después de una sección densa.',
            writingTip: 'Cuida el contorno y la respiración del motivo, porque el color ya viene limpio; la expresividad aparece en el ritmo.',
            trackerTip: 'Funciona muy bien en campanas, plucks dulces y doblajes de voces que necesiten claridad sin exceso de información.'
        },
        neutral_pentatonic: {
            name: 'Neutral Pentatonic',
            intervals: [0, 2, 5, 7, 10],
            mood: 'Ambigua, terrenal y excelente para climas suspendidos entre ternura y extrañeza.',
            writingTip: 'Explota su ambigüedad: repite el mismo contorno con acentos distintos para que la armonía parezca mutar sin cambiar demasiado.',
            trackerTip: 'Muy buena para loops hipnóticos, pads escasos y grooves que necesitan aire entre golpe y golpe.'
        }
    };

    const CHORD_TYPES = {
        seventh: {
            name: 'Seventh Stack',
            offsets: [0, 2, 4, 6],
            summary: 'Apila terceras diatónicas dentro de la escala y deja que la extensión superior decida el color.'
        },
        ninth: {
            name: 'Ninth Stack',
            offsets: [0, 2, 4, 6, 8],
            summary: 'Amplía el acorde hasta la novena para tener colchón armónico y más rutas de conducción.'
        },
        suspended: {
            name: 'Suspended Frame',
            offsets: [0, 1, 3, 4, 6],
            summary: 'Sustituye parte del empuje tercial por apoyos de segunda y cuarta para dejar la frase flotando.'
        },
        rnb: {
            name: 'R&B Spread',
            offsets: [0, 2, 6, 8, 12],
            summary: 'Usa la fundamental como suelo y deja séptima, novena o sexta como vidrio coloreado en la parte alta.'
        }
    };

    const DEGREE_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    const ROLE_LABELS = [
        'Centro / apertura',
        'Respuesta lateral',
        'Desvío con color',
        'Bisagra rítmica',
        'Empuje hacia clímax',
        'Sombra o repliegue',
        'Resolución oblicua'
    ];
    const VIVID_PALETTE = ['#6BABDA', '#5C96C9', '#1B98D1', '#EC4141', '#EF7135', '#5FBB4E', '#632E86', '#580D36', '#BC1D75', '#D9539D', '#FDE85F'];
    const CATEGORY_THEMES = [
        { accent: '#1B98D1', strong: '#EC4141', soft: '#9BDBF5' },
        { accent: '#BC1D75', strong: '#632E86', soft: '#FCB6DF' },
        { accent: '#5FBB4E', strong: '#1B98D1', soft: '#8CC7E7' },
        { accent: '#EF7135', strong: '#FDE85F', soft: '#FAF5AB' },
        { accent: '#632E86', strong: '#D9539D', soft: '#9BDBF5' }
    ];

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function hexToRgba(hex, alpha) {
        const normalized = hex.replace('#', '');
        const integer = Number.parseInt(normalized, 16);
        const r = (integer >> 16) & 255;
        const g = (integer >> 8) & 255;
        const b = integer & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function normalizeRoot(rawValue) {
        const cleaned = rawValue
            .trim()
            .replaceAll('♯', '#')
            .replaceAll('♭', 'b');
        const match = cleaned.match(/^([A-Ga-g])([#b]?)/);

        if (!match) {
            return null;
        }

        const letter = match[1].toUpperCase();
        const accidental = match[2] || '';
        const normalized = `${letter}${accidental}`;
        const index = NOTE_INDEX[normalized];

        if (typeof index !== 'number') {
            return null;
        }

        return {
            display: normalized,
            index,
            preferFlats: accidental === 'b' || FLAT_FRIENDLY_ROOTS.has(normalized)
        };
    }

    function formatNote(index, preferFlats) {
        const normalizedIndex = ((index % 12) + 12) % 12;
        return preferFlats ? NOTE_NAMES_FLAT[normalizedIndex] : NOTE_NAMES_SHARP[normalizedIndex];
    }

    function buildScaleNotes(rootData, scaleData) {
        return scaleData.intervals.map((interval) => formatNote(rootData.index + interval, rootData.preferFlats));
    }

    function uniqueOrdered(values) {
        const seen = new Set();
        const result = [];

        values.forEach((value) => {
            if (!seen.has(value)) {
                seen.add(value);
                result.push(value);
            }
        });

        return result;
    }

    function buildChordNotes(scaleNotes, degreeIndex, chordType) {
        const notes = chordType.offsets.map((offset) => scaleNotes[(degreeIndex + offset) % scaleNotes.length]);
        return uniqueOrdered(notes);
    }

    function buildVoiceLeadingTip(chordNotes, scaleNotes, degreeIndex) {
        const anchor = chordNotes[0];
        const guide = chordNotes[1] || chordNotes[0];
        const extension = chordNotes[chordNotes.length - 1] || chordNotes[0];
        const nextRoot = scaleNotes[(degreeIndex + 1) % scaleNotes.length];
        const previousRoot = scaleNotes[(degreeIndex + scaleNotes.length - 1) % scaleNotes.length];
        const templates = [
            `Mantén ${anchor} como eje y mueve ${guide} o ${extension} por semitono o tono hacia ${nextRoot} para que el giro entre patrones sea legible.`,
            `Deja ${guide} como guía superior y baja el resto por bloque; así la armonía cambia sin romper el contorno del motivo.`,
            `Si el beat está muy roto, fija ${anchor} en un track aparte y deja que ${extension} sea la nota de escape al final del patrón.`,
            `Prueba una resolución oblicua: conserva ${anchor} y desplaza una sola voz desde ${guide} hacia ${previousRoot} o ${nextRoot}.`
        ];

        return templates[degreeIndex % templates.length];
    }

    function buildTrackerTip(chordNotes, chordType, scaleData, degreeIndex) {
        const splitPoint = Math.min(2, chordNotes.length);
        const lowLayer = chordNotes.slice(0, splitPoint).join(' · ');
        const topLayer = chordNotes.slice(splitPoint).join(' · ');
        const rhythmicFocus = degreeIndex % 2 === 0 ? 'deja la nota alta para el fill o la cola del patrón' : 'usa la extensión como respuesta corta en el segundo compás';
        return `En DAW o tracker separa ${lowLayer} en el bloque principal${topLayer ? ` y ${topLayer} en una capa alta o de apoyo; ` : '; '}${rhythmicFocus}. ${scaleData.trackerTip} ${chordType.summary}`;
    }

    function buildRoleLabel(degreeIndex) {
        return ROLE_LABELS[degreeIndex % ROLE_LABELS.length];
    }

    function renderPlaceholder(output) {
        output.classList.add('is-empty');
        output.innerHTML = `
            <div class="generator-placeholder">
                Cambia la raíz, la escala o el tipo de stack y genera una lectura armónica lista para partitura, DAW o tracker.
            </div>
        `;
    }

    function renderError(output, message) {
        output.classList.remove('is-empty');
        output.innerHTML = `
            <div class="generator-error">
                <p><strong>No pude leer esa nota raíz.</strong></p>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }

    function renderGenerator(output, rootData, scaleKey, chordTypeKey) {
        const scaleData = SCALE_LIBRARY[scaleKey];
        const chordType = CHORD_TYPES[chordTypeKey];

        if (!scaleData || !chordType) {
            renderError(output, 'La combinación de escala o acorde no existe en esta versión de la herramienta.');
            return;
        }

        const scaleNotes = buildScaleNotes(rootData, scaleData);
        const chordCards = scaleNotes.map((note, degreeIndex) => {
            const chordNotes = buildChordNotes(scaleNotes, degreeIndex, chordType);
            const voiceLeading = buildVoiceLeadingTip(chordNotes, scaleNotes, degreeIndex);
            const trackerTip = buildTrackerTip(chordNotes, chordType, scaleData, degreeIndex);

            return `
                <article class="chord-card">
                    <h4>${DEGREE_LABELS[degreeIndex] || `#${degreeIndex + 1}`} · ${escapeHtml(note)}</h4>
                    <p class="chord-notes">${escapeHtml(chordNotes.join(' · '))}</p>
                    <p><strong>Rol:</strong> ${escapeHtml(buildRoleLabel(degreeIndex))}</p>
                    <p><strong>Conducción:</strong> ${escapeHtml(voiceLeading)}</p>
                    <p><strong>DAW / tracker:</strong> ${escapeHtml(trackerTip)}</p>
                </article>
            `;
        }).join('');

        output.classList.remove('is-empty');
        output.innerHTML = `
            <div class="output-overview">
                <p class="section-kicker">Generated Grid</p>
                <h4 class="output-title">${escapeHtml(rootData.display)} ${escapeHtml(scaleData.name)}</h4>
                <p class="output-description">${escapeHtml(scaleData.mood)}</p>
                <p class="output-description">${escapeHtml(scaleData.writingTip)}</p>
                <div class="scale-chips">
                    ${scaleNotes.map((note) => `<span class="chip">${escapeHtml(note)}</span>`).join('')}
                </div>
                <div class="generator-stats">
                    <span class="generator-stat"><strong>Raíz:</strong> ${escapeHtml(rootData.display)}</span>
                    <span class="generator-stat"><strong>Notas:</strong> ${scaleNotes.length}</span>
                    <span class="generator-stat"><strong>Stack:</strong> ${escapeHtml(chordType.name)}</span>
                </div>
            </div>
            <section class="output-section">
                <h4 class="output-title">Acordes por grado</h4>
                <p class="output-description">Cada tarjeta piensa el acorde como una plantilla operativa: material, conducción y modo de desplegarlo en una sesión real.</p>
                <div class="generator-grid">
                    ${chordCards}
                </div>
            </section>
        `;
    }

    function initGenerator() {
        const form = document.getElementById('generator-form');
        const output = document.getElementById('output');
        const rootField = document.getElementById('root');
        const scaleField = document.getElementById('scale');

        if (!form || !output || !rootField || !scaleField) {
            return;
        }

        const runGenerator = () => {
            const rootData = normalizeRoot(rootField.value);
            const chordField = form.querySelector('input[name="chord_type"]:checked');

            if (!rootData) {
                renderError(output, 'Usa una nota entre A y G, con `#` para sostenidos o `b` para bemoles. Ejemplos: C, F#, Bb.');
                return;
            }

            renderGenerator(output, rootData, scaleField.value, chordField ? chordField.value : 'seventh');
        };

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            runGenerator();
        });

        form.querySelectorAll('input, select').forEach((field) => {
            field.addEventListener('change', runGenerator);
        });

        rootField.addEventListener('input', function() {
            if (rootField.value.trim() === '') {
                renderPlaceholder(output);
                return;
            }

            runGenerator();
        });

        renderPlaceholder(output);
        runGenerator();
    }

    function applyFrameworkTheme(category, categoryIndex) {
        const theme = CATEGORY_THEMES[categoryIndex % CATEGORY_THEMES.length];
        const cards = Array.from(category.querySelectorAll('.mechanic-card'));

        category.style.setProperty('--mechanic-accent', theme.accent);
        category.style.setProperty('--mechanic-strong', theme.strong);
        category.style.setProperty('--mechanic-soft', hexToRgba(theme.soft, 0.24));

        cards.forEach((card, cardIndex) => {
            const accent = VIVID_PALETTE[(categoryIndex * 2 + cardIndex) % VIVID_PALETTE.length];
            const strong = VIVID_PALETTE[(categoryIndex * 2 + cardIndex + 3) % VIVID_PALETTE.length];

            card.style.setProperty('--mechanic-accent', accent);
            card.style.setProperty('--mechanic-strong', strong);
            card.style.setProperty('--mechanic-soft', hexToRgba(accent, 0.18));
        });
    }

    function attachSmoothScroll(anchor) {
        anchor.addEventListener('click', function(event) {
            const href = anchor.getAttribute('href');

            if (!href || !href.startsWith('#')) {
                return;
            }

            const target = document.querySelector(href);

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    function initFrameworkNavigation() {
        const nav = document.getElementById('framework-nav');
        const categories = Array.from(document.querySelectorAll('#framework-content .category'));

        if (!nav || categories.length === 0) {
            return;
        }

        const linksMarkup = categories.map((category, categoryIndex) => {
            if (!category.id) {
                category.id = `framework-category-${categoryIndex + 1}`;
            }

            applyFrameworkTheme(category, categoryIndex);

            const title = category.querySelector('.category-title');
            const count = category.querySelectorAll('.mechanic-card').length;
            const theme = CATEGORY_THEMES[categoryIndex % CATEGORY_THEMES.length];

            return `
                <a
                    href="#${escapeHtml(category.id)}"
                    class="framework-link"
                    style="border-color: ${theme.accent}; color: ${theme.strong}; box-shadow: 4px 4px 0 ${hexToRgba(theme.strong, 0.14)};"
                >
                    ${escapeHtml(title ? title.textContent.trim() : `Category ${categoryIndex + 1}`)}
                    <span class="framework-link-count">${count} bloques</span>
                </a>
            `;
        }).join('');

        nav.innerHTML = linksMarkup;
        nav.querySelectorAll('a[href^="#"]').forEach(attachSmoothScroll);
    }

    initGenerator();
    initFrameworkNavigation();
})();
