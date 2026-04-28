(function() {
    'use strict';

    const DATA_URL = 'assets/data/kinzer-rhymes.json';
    const STORAGE_KEY = 'twg.kinzerRhymes.drafts.v1';
    const WORD_RE = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9']+/g;
    const VOWELS = 'aeiou';
    const state = {
        entries: [],
        wordPool: [],
        currentDraftId: null,
        rhymeMode: 'hybrid',
        selection: null,
    };
    const RHYME_MODES = [
        { id: 'hybrid', label: 'órbita mixta' },
        { id: 'consonant', label: 'sello consonante' },
        { id: 'assonant', label: 'eco asonante' },
        { id: 'terminal', label: 'último golpe' },
        { id: 'kaamo', label: 'deriva Kaamo' },
    ];
    const WORD_BLOCKLIST = new Set([
        'ante', 'aqui', 'alla', 'aun', 'aunque', 'bien', 'casi', 'cual',
        'cuales', 'cuando', 'cuanto', 'cuenta', 'dice', 'ella', 'ellos',
        'esto', 'fuera', 'hacia', 'luego', 'mientras', 'mismo', 'misma',
        'nadie', 'nada', 'poco', 'porque', 'puede', 'puedo', 'queda',
        'quien', 'ritmo', 'solo', 'tambien', 'tiene', 'toda', 'todo',
        'tras', 'viene',
        'para', 'pero', 'como', 'donde', 'desde', 'hasta', 'entre', 'sobre',
        'bajo', 'cada', 'todo', 'toda', 'todos', 'todas', 'otro', 'otra',
        'otros', 'otras', 'este', 'esta', 'estos', 'estas', 'modo', 'zona',
        'sector', 'sistema', 'estacion', 'slang', 'rima', 'cola', 'doom',
        'kaamo', 'shima', 'gof', 'e1m1', 'e1m2', 'e1m3', 'e1m4', 'e1m5',
        'e1m6', 'e1m7', 'e1m8', 'e1m9', 'e2m1', 'e2m2', 'e2m3', 'e2m4',
        'e2m5', 'e2m6', 'e2m7', 'e2m8', 'e2m9', 'e3m1', 'e3m2', 'e3m3',
        'e3m4', 'e3m5', 'e3m6', 'e3m7', 'e3m8', 'e3m9', 'e4m1', 'e4m2',
        'e4m3', 'e4m4', 'e4m5', 'e4m6', 'e4m7', 'e4m8', 'e4m9',
    ]);

    const $ = (selector) => document.querySelector(selector);
    const lyrics = $('#kinzer-lyrics');
    const title = $('#kinzer-title');
    const template = $('#kinzer-card-template');

    function debounce(fn, wait) {
        let timer = null;
        return (...args) => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => fn(...args), wait);
        };
    }

    function stripAccents(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function normalize(text) {
        return stripAccents(String(text).toLowerCase().replace(/ü/g, 'u'))
            .replace(/[^a-z0-9ñ\s']/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function words(text) {
        return String(text).match(WORD_RE) || [];
    }

    function cleanWord(word) {
        return normalize(word).replace(/[^a-zñü]/g, '');
    }

    function rhymeTail(word) {
        const clean = cleanWord(word);
        if (clean.length <= 3) return clean;
        const positions = [];
        [...clean].forEach((char, index) => {
            if (VOWELS.includes(char)) positions.push(index);
        });
        if (!positions.length) return clean.slice(-3);
        const start = 'aeiouns'.includes(clean.slice(-1)) && positions.length >= 2
            ? positions[positions.length - 2]
            : positions[positions.length - 1];
        return clean.slice(start);
    }

    function assonanceTail(word) {
        return [...rhymeTail(word)].filter((char) => VOWELS.includes(char)).join('');
    }

    function suffixOverlap(left, right) {
        let score = 0;
        for (let i = 1; i <= Math.min(left.length, right.length); i += 1) {
            if (left[left.length - i] !== right[right.length - i]) break;
            score += 1;
        }
        return score;
    }

    function clampScore(value) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }

    function hybridRhymeScore(a, b, at, bt, aa, ba, overlap) {
        if (at === bt) return 100;
        if (at.length >= 3 && bt.length >= 3 && suffixOverlap(at, bt) >= 3) return 92;
        if (aa && aa === ba) return 78 + Math.min(overlap, 8);
        if (aa && ba && aa.slice(-2) === ba.slice(-2)) return 64 + Math.min(overlap, 10);
        if (overlap >= 4) return 58 + Math.min(overlap, 12);
        if (overlap >= 3) return 45 + overlap;
        return 0;
    }

    function kaamoSignal(entry) {
        const haystack = normalize([
            entry.category,
            entry.definition,
            entry.example,
            entry.tags.join(' ')
        ].join(' '));
        return haystack.includes('shima') || haystack.includes('kaamo') || haystack.includes('astronauta perdido');
    }

    function rhymeModeLabel(modeId) {
        return (RHYME_MODES.find((mode) => mode.id === modeId) || RHYME_MODES[0]).label;
    }

    function rhymeSignal(word, modeId) {
        if (modeId === 'assonant') return `vocales ${assonanceTail(word) || 'sin eco'}`;
        if (modeId === 'terminal') return `final ${cleanWord(word).slice(-4) || 'sin final'}`;
        return `cola ${rhymeTail(word) || 'sin cola'}`;
    }

    function rhymeScore(left, right, modeId = 'hybrid', entry = null, allowExact = false) {
        const a = cleanWord(left);
        const b = cleanWord(right);
        if (!a || !b || (a === b && !allowExact)) return 0;
        const at = rhymeTail(a);
        const bt = rhymeTail(b);
        const aa = assonanceTail(a);
        const ba = assonanceTail(b);
        const overlap = suffixOverlap(a, b);
        const tailOverlap = suffixOverlap(at, bt);
        if (modeId === 'consonant') {
            if (at === bt) return 100;
            if (tailOverlap >= 4) return clampScore(88 + tailOverlap);
            if (overlap >= 4) return clampScore(72 + overlap);
            if (tailOverlap >= 3) return 64;
            return 0;
        }
        if (modeId === 'assonant') {
            if (aa && aa === ba) return clampScore(94 + Math.min(overlap, 6));
            if (aa && ba && aa.slice(-3) === ba.slice(-3)) return 84;
            if (aa && ba && aa.slice(-2) === ba.slice(-2)) return 68;
            return 0;
        }
        if (modeId === 'terminal') {
            if (overlap >= 5) return 100;
            if (overlap >= 4) return clampScore(84 + overlap);
            if (overlap >= 3) return 72;
            if (tailOverlap >= 3) return 62;
            return 0;
        }
        if (modeId === 'kaamo') {
            const base = hybridRhymeScore(a, b, at, bt, aa, ba, overlap);
            const stationBonus = entry && kaamoSignal(entry) ? 18 : 0;
            const driftBonus = aa && ba && aa.slice(-2) === ba.slice(-2) ? 10 : 0;
            if (!base && stationBonus && (overlap >= 2 || driftBonus)) {
                return clampScore(48 + stationBonus + driftBonus + Math.min(overlap, 8));
            }
            return clampScore(base + stationBonus + driftBonus);
        }
        return clampScore(hybridRhymeScore(a, b, at, bt, aa, ba, overlap));
    }

    function searchScore(entry, query) {
        const q = normalize(query);
        if (!q) return 1;
        const haystack = normalize([
            entry.term,
            entry.category,
            entry.tone,
            entry.definition,
            entry.example,
            entry.tags.join(' ')
        ].join(' '));
        let score = 0;
        q.split(' ').forEach((token) => {
            if (normalize(entry.term).includes(token)) score += 24;
            if (entry.tags.some((tag) => normalize(tag).includes(token))) score += 16;
            if (haystack.includes(token)) score += 8;
        });
        if (haystack.includes(q)) score += 32;
        return score;
    }

    function searchEntries() {
        const query = $('#kinzer-search').value;
        const category = $('#kinzer-category').value;
        const tone = $('#kinzer-tone').value;
        return state.entries
            .filter((entry) => category === 'all' || entry.category === category)
            .filter((entry) => tone === 'all' || entry.tone === tone)
            .map((entry) => ({ ...entry, score: searchScore(entry, query) }))
            .filter((entry) => !query || entry.score > 0)
            .sort((a, b) => b.score - a.score || a.term.localeCompare(b.term, 'es'))
            .slice(0, 80);
    }

    function wordAllowed(word, target) {
        const clean = cleanWord(word);
        return clean.length >= 4 && clean !== target && !WORD_BLOCKLIST.has(clean);
    }

    function buildWordPool(entries) {
        const seen = new Set();
        const pool = [];
        entries.forEach((entry) => {
            words(`${entry.term} ${entry.example}`).forEach((rawWord) => {
                const key = cleanWord(rawWord);
                if (key.length < 4 || WORD_BLOCKLIST.has(key)) return;
                const cacheKey = `${key}|${entry.category}|${entry.tone}`;
                if (seen.has(cacheKey)) return;
                seen.add(cacheKey);
                pool.push({
                    key,
                    text: rawWord.toLowerCase(),
                    category: entry.category,
                    tone: entry.tone,
                    source: entry.term,
                    entry,
                    kaamo: kaamoSignal(entry),
                });
            });
        });
        return pool;
    }

    function diversifyWords(items, limit) {
        const selected = [];
        const selectedWords = new Set();
        const usedCategories = new Set();
        items.forEach((item) => {
            if (selected.length >= limit) return;
            if (usedCategories.has(item.category)) return;
            selected.push(item);
            selectedWords.add(item.key);
            usedCategories.add(item.category);
        });
        items.forEach((item) => {
            if (selected.length >= limit) return;
            if (selectedWords.has(item.key)) return;
            selected.push(item);
            selectedWords.add(item.key);
        });
        return selected;
    }

    function rhymeWordSuggestions(word, limit = 12) {
        const clean = cleanWord(word);
        if (!clean) return [];
        const candidates = new Map();
        state.wordPool.forEach((candidate) => {
            if (!wordAllowed(candidate.text, clean)) return;
            const score = rhymeScore(clean, candidate.key, state.rhymeMode, candidate.entry);
            if (!score) return;
            const current = candidates.get(candidate.key);
            const next = {
                ...candidate,
                score,
                signal: rhymeSignal(candidate.text, state.rhymeMode),
            };
            if (!current || score > current.score || (state.rhymeMode === 'kaamo' && next.kaamo && !current.kaamo)) {
                candidates.set(candidate.key, next);
            }
        });
        const ranked = [...candidates.values()].sort((a, b) => (
            b.score - a.score
            || (state.rhymeMode === 'kaamo' ? Number(b.kaamo) - Number(a.kaamo) : 0)
            || a.category.localeCompare(b.category, 'es')
            || a.text.localeCompare(b.text, 'es')
        ));
        return diversifyWords(ranked, limit);
    }

    function rhymeCandidates(word, limit = 28) {
        const clean = cleanWord(word);
        if (!clean) return [];
        return state.entries
            .map((entry) => {
                const termWords = words(entry.term);
                const last = termWords.slice(-1)[0] || '';
                return {
                    text: entry.term,
                    lastWord: last,
                    category: entry.category,
                    tone: entry.tone,
                    definition: entry.definition,
                    score: rhymeScore(clean, last, state.rhymeMode, entry, termWords.length > 1),
                    tail: rhymeTail(last),
                    assonance: assonanceTail(last),
                    modeLabel: rhymeModeLabel(state.rhymeMode),
                    signal: rhymeSignal(last, state.rhymeMode),
                    kaamo: kaamoSignal(entry),
                };
            })
            .filter((item) => item.score > 0)
            .sort((a, b) => (
                b.score - a.score
                || (state.rhymeMode === 'kaamo' ? Number(b.kaamo) - Number(a.kaamo) : 0)
                || a.text.localeCompare(b.text, 'es')
            ))
            .slice(0, limit);
    }

    function detectSlang(text) {
        const haystack = ` ${normalize(text)} `;
        return state.entries
            .filter((entry) => haystack.includes(` ${normalize(entry.term)} `))
            .slice(0, 18);
    }

    function rhymeClusters(text) {
        const counts = new Map();
        words(text).forEach((word) => {
            const clean = cleanWord(word);
            if (clean.length < 4) return;
            const tail = rhymeTail(clean);
            if (tail.length < 2) return;
            const bucket = counts.get(tail) || new Map();
            bucket.set(clean, (bucket.get(clean) || 0) + 1);
            counts.set(tail, bucket);
        });
        return [...counts.entries()]
            .map(([tail, bucket]) => ({
                tail,
                count: [...bucket.values()].reduce((sum, value) => sum + value, 0),
                words: [...bucket.keys()].slice(0, 8),
            }))
            .filter((cluster) => cluster.count >= 2)
            .sort((a, b) => b.count - a.count || a.tail.localeCompare(b.tail))
            .slice(0, 12);
    }

    function card({ title: cardTitle, body, footer, insertValue }) {
        const node = template.content.firstElementChild.cloneNode(true);
        node.querySelector('h4').textContent = cardTitle;
        node.querySelector('p').textContent = body || '';
        node.querySelector('footer').textContent = footer || '';
        node.querySelector('.kinzer-insert').addEventListener('click', () => insertText(insertValue || cardTitle));
        return node;
    }

    function renderList(selector, items, mapper, emptyTitle) {
        const list = $(selector);
        list.innerHTML = '';
        if (!items.length) {
            list.appendChild(card({ title: emptyTitle, body: 'sin señal todavía', footer: '' }));
            return;
        }
        items.forEach((item) => list.appendChild(card(mapper(item))));
    }

    function renderWordSuggestions(items) {
        const list = $('#kinzer-word-list');
        list.innerHTML = '';
        if (!items.length) {
            const empty = document.createElement('span');
            empty.className = 'kinzer-word-chip empty';
            empty.textContent = 'sin palabras';
            list.appendChild(empty);
            return;
        }
        items.forEach((item) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'kinzer-word-chip';
            button.title = `${item.source} · ${item.score}% · ${item.signal}`;
            button.innerHTML = '<strong></strong><span></span>';
            button.querySelector('strong').textContent = item.text;
            button.querySelector('span').textContent = `${item.category} · ${item.score}%`;
            button.addEventListener('click', () => insertText(item.text));
            list.appendChild(button);
        });
    }

    function renderSlang() {
        renderList('#kinzer-slang-list', searchEntries(), (entry) => ({
            title: entry.term,
            body: entry.definition,
            footer: `${entry.category} · ${entry.tone} · ${entry.tags.join(', ')}`,
            insertValue: entry.term,
        }), 'sin resultados');
    }

    function renderAnalysis() {
        const text = lyrics.value;
        const tokenList = words(text);
        const lastWord = tokenList.slice(-1)[0] || '';
        const slangMatches = detectSlang(text);
        const clusters = rhymeClusters(text);

        $('#kinzer-last-word').textContent = lastWord || 'sin palabra';
        $('#kinzer-words').textContent = tokenList.length;
        $('#kinzer-lines').textContent = text.split('\n').filter((line) => line.trim()).length;
        $('#kinzer-slang-hits').textContent = slangMatches.length;
        $('#kinzer-rhyme-clusters').textContent = clusters.length;

        renderWordSuggestions(rhymeWordSuggestions(lastWord));

        renderList('#kinzer-rhyme-list', rhymeCandidates(lastWord), (item) => ({
            title: item.text,
            body: item.definition,
            footer: `${item.category} · ${item.score}% · ${item.modeLabel} · ${item.signal}`,
            insertValue: item.text,
        }), 'sin rimas');

        renderList('#kinzer-detected-list', slangMatches, (entry) => ({
            title: entry.term,
            body: entry.definition,
            footer: `${entry.category} · ${entry.tone}`,
            insertValue: entry.term,
        }), 'sin slang detectado');

        const clusterList = $('#kinzer-cluster-list');
        clusterList.innerHTML = '';
        if (!clusters.length) {
            const chip = document.createElement('span');
            chip.className = 'kinzer-chip';
            chip.textContent = 'sin patrón';
            clusterList.appendChild(chip);
        } else {
            clusters.forEach((cluster) => {
                const chip = document.createElement('span');
                chip.className = 'kinzer-chip';
                chip.textContent = `${cluster.tail}: ${cluster.words.join(', ')}`;
                clusterList.appendChild(chip);
            });
        }
    }

    const analyzeNow = debounce(renderAnalysis, 120);

    function fillSelect(selector, values, label) {
        const select = $(selector);
        select.innerHTML = '';
        const option = document.createElement('option');
        option.value = 'all';
        option.textContent = label;
        select.appendChild(option);
        values.forEach((value) => {
            const child = document.createElement('option');
            child.value = value;
            child.textContent = value;
            select.appendChild(child);
        });
    }

    function fillRhymeModes() {
        const select = $('#kinzer-rhyme-mode');
        select.innerHTML = '';
        RHYME_MODES.forEach((mode) => {
            const option = document.createElement('option');
            option.value = mode.id;
            option.textContent = mode.label;
            select.appendChild(option);
        });
        select.value = state.rhymeMode;
    }

    function insertText(text) {
        const stored = state.selection || { start: lyrics.value.length, end: lyrics.value.length };
        const start = document.activeElement === lyrics ? lyrics.selectionStart : stored.start;
        const end = document.activeElement === lyrics ? lyrics.selectionEnd : stored.end;
        const prefix = lyrics.value.slice(0, start);
        const suffix = lyrics.value.slice(end);
        const spacer = prefix && !/\s$/.test(prefix) && !/^\s/.test(text) ? ' ' : '';
        lyrics.value = `${prefix}${spacer}${text}${suffix}`;
        const cursor = start + spacer.length + text.length;
        state.selection = { start: cursor, end: cursor };
        lyrics.focus();
        lyrics.setSelectionRange(cursor, cursor);
        $('#kinzer-save-state').textContent = 'editando';
        renderAnalysis();
    }

    function drafts() {
        try {
            return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (error) {
            return [];
        }
    }

    function writeDrafts(nextDrafts) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDrafts));
    }

    function renderDrafts() {
        const list = $('#kinzer-draft-list');
        const items = drafts();
        list.innerHTML = '';
        $('#kinzer-draft-count').textContent = items.length;
        if (!items.length) {
            list.appendChild(card({ title: 'sin letras guardadas', body: 'guarda una primera barra', footer: '' }));
            return;
        }
        items.forEach((draft) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `kinzer-draft-button${draft.id === state.currentDraftId ? ' active' : ''}`;
            button.innerHTML = '<strong></strong><span></span>';
            button.querySelector('strong').textContent = draft.title;
            button.querySelector('span').textContent = draft.body.replace(/\s+/g, ' ').slice(0, 110) || 'vacía';
            button.addEventListener('click', () => {
                state.currentDraftId = draft.id;
                title.value = draft.title;
                lyrics.value = draft.body;
                state.selection = { start: lyrics.value.length, end: lyrics.value.length };
                $('#kinzer-save-state').textContent = 'cargado';
                renderAnalysis();
                renderDrafts();
            });
            list.appendChild(button);
        });
    }

    function saveDraft() {
        const items = drafts();
        const now = new Date().toISOString();
        const draft = {
            id: state.currentDraftId || `draft-${Date.now()}`,
            title: title.value.trim() || 'Borrador orbital',
            body: lyrics.value,
            updatedAt: now,
        };
        const next = [draft, ...items.filter((item) => item.id !== draft.id)]
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .slice(0, 80);
        state.currentDraftId = draft.id;
        writeDrafts(next);
        $('#kinzer-save-state').textContent = 'guardado';
        renderDrafts();
    }

    function deleteDraft() {
        if (!state.currentDraftId) return;
        writeDrafts(drafts().filter((draft) => draft.id !== state.currentDraftId));
        state.currentDraftId = null;
        title.value = 'Borrador orbital';
        lyrics.value = '';
        $('#kinzer-save-state').textContent = 'borrado';
        renderAnalysis();
        renderDrafts();
    }

    function sparkLine() {
        const categories = ['brújula amable', 'beat dubstep', 'Doom 1', 'Doom 2', 'Doom 3', 'Doom 4', 'nave y puerto', 'Shima Kaamo'];
        const pool = state.entries.filter((entry) => categories.includes(entry.category));
        const pick = () => pool[Math.floor(Math.random() * pool.length)] || state.entries[0];
        const a = pick();
        const b = pick();
        const templates = [
            `Vengo con ${a.term}, ${b.term} en la señal`,
            `Si cae la noche, activo ${a.term} y cuido ${b.term}`,
            `No vendo humo: traigo ${a.term}, ${b.term} y verdad`,
            `Entre ${a.term} y ${b.term}, mi bajo vuelve a despegar`,
        ];
        insertText(`\n${templates[Math.floor(Math.random() * templates.length)]}\n`);
    }

    function switchPanel(name) {
        document.querySelectorAll('.kinzer-tab').forEach((button) => {
            button.classList.toggle('active', button.dataset.panel === name);
        });
        document.querySelectorAll('.kinzer-panel').forEach((panel) => {
            panel.classList.toggle('active', panel.id === `kinzer-panel-${name}`);
        });
    }

    async function boot() {
        const response = await fetch(DATA_URL);
        state.entries = await response.json();
        state.wordPool = buildWordPool(state.entries);
        const categories = [...new Set(state.entries.map((entry) => entry.category))].sort((a, b) => a.localeCompare(b, 'es'));
        const tones = [...new Set(state.entries.map((entry) => entry.tone))].sort((a, b) => a.localeCompare(b, 'es'));
        $('#kinzer-entry-count').textContent = state.entries.length;
        $('#kinzer-family-count').textContent = categories.length;
        $('#kinzer-mode-count').textContent = RHYME_MODES.length;
        fillSelect('#kinzer-category', categories, 'todas las familias');
        fillSelect('#kinzer-tone', tones, 'todos los tonos');
        fillRhymeModes();
        state.selection = { start: lyrics.value.length, end: lyrics.value.length };
        renderAnalysis();
        renderSlang();
        renderDrafts();
    }

    lyrics.addEventListener('input', () => {
        state.selection = { start: lyrics.selectionStart, end: lyrics.selectionEnd };
        $('#kinzer-save-state').textContent = 'editando';
        analyzeNow();
    });
    ['click', 'keyup', 'select'].forEach((eventName) => {
        lyrics.addEventListener(eventName, () => {
            state.selection = { start: lyrics.selectionStart, end: lyrics.selectionEnd };
        });
    });
    title.addEventListener('input', () => {
        $('#kinzer-save-state').textContent = 'editando';
    });
    $('#kinzer-search').addEventListener('input', debounce(renderSlang, 140));
    $('#kinzer-category').addEventListener('change', renderSlang);
    $('#kinzer-tone').addEventListener('change', renderSlang);
    $('#kinzer-rhyme-mode').addEventListener('change', (event) => {
        state.rhymeMode = event.target.value;
        renderAnalysis();
    });
    $('#kinzer-save').addEventListener('click', saveDraft);
    $('#kinzer-delete').addEventListener('click', deleteDraft);
    $('#kinzer-spark').addEventListener('click', sparkLine);
    $('#kinzer-new').addEventListener('click', () => {
        state.currentDraftId = null;
        title.value = 'Borrador orbital';
        lyrics.value = '';
        state.selection = { start: 0, end: 0 };
        $('#kinzer-save-state').textContent = 'nuevo';
        renderAnalysis();
        renderDrafts();
    });
    document.querySelectorAll('.kinzer-tab').forEach((button) => {
        button.addEventListener('click', () => switchPanel(button.dataset.panel));
    });

    boot().catch(() => {
        $('#kinzer-save-state').textContent = 'sin diccionario';
    });
})();
