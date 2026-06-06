const fs = require('fs');

const TARGET_COUNT = 1920;
const CATEGORY = 'rescate en rapture';

// Bioshock + rescue inspired vocabulary
const nouns = [
    'ADAM', 'EVE', 'batisfera', 'plásmido', 'escafandra', 'taladro', 'óxido', 'splicer', 'faro',
    'mar', 'océano', 'presión', 'fuga', 'escudo', 'inyección', 'jeringa', 'neón', 'radio',
    'estación', 'vita-cámara', 'hermana', 'papá', 'acero', 'agua', 'cristal', 'grieta', 'alianza',
    'juramento', 'código', 'oxígeno', 'promesa', 'cable', 'refugio', 'lucerna', 'veta', 'gen', 'veneno'
];

const adjectives = [
    'submarino', 'blindado', 'leal', 'roto', 'hundido', 'dorado', 'eléctrico', 'firme', 'pesado',
    'frío', 'cálido', 'seguro', 'inmortal', 'silencioso', 'brillante', 'profundo', 'salado',
    'leal', 'mutado', 'puro', 'imparable', 'oscuro', 'fiel', 'terco', 'protector', 'santo', 'hermético'
];

const structures = [
    (n, a) => `${n} ${a}`,
    (n, a) => `pacto de ${n}`,
    (n, a) => `rescate de ${n}`,
    (n, a) => `${n} protector`,
    (n, a) => `señal de ${n}`,
    (n, a) => `guardia de ${n}`,
    (n, a) => `fuerza de ${n}`,
    (n, a) => `vínculo de ${n}`,
    (n, a) => `${a} bajo presión`,
    (n, a) => `${n} entre las algas`,
];

const tones = ['leal', 'protector', 'oscuro', 'firme', 'pesado', 'esperanzado', 'sacrificado', 'blindado'];

const definitions = [
    "acto de cubrir a un compañero cuando el entorno se cae a pedazos.",
    "promesa inquebrantable que resiste la presión del océano.",
    "ofrecer tu propio oxígeno o ADAM para salvar a otro.",
    "vínculo forjado en el lugar más bajo y oscuro del mundo.",
    "maniobra de extracción bajo fuego o en pleno hundimiento.",
    "lealtad demostrada al recibir el golpe por un aliado.",
    "esperanza mantenida viva cuando hasta el neón parpadea y muere.",
    "palabra de seguridad compartida a través de la radio rota.",
    "resistencia compartida frente a las fugas y el frío del fondo marino.",
    "intervención brutal y rápida para sacar a alguien del peligro.",
    "cuidado silencioso que recuerda a un gigante protegiendo lo más frágil.",
    "promesa sellada con óxido y sal, que nunca se rompe."
];

const examplePrefixes = [
    "Aunque el océano ceda, te ofrezco",
    "No te soltaré, traje",
    "Salgamos de aquí, tengo",
    "Juntos resistimos con",
    "En el fondo del mar solo nos queda",
    "Cierra los ojos, activo",
    "Confía en mí, mi",
    "Romperemos el cristal usando",
    "Si te falta el aire, te doy mi",
    "Nos hundimos juntos o subimos con"
];

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateSlang(usedTerms) {
    let term = '';
    let attempts = 0;
    while (attempts < 1000) {
        const noun = randomChoice(nouns);
        const adj = randomChoice(adjectives);
        const struct = randomChoice(structures);
        term = struct(noun, adj);
        if (!usedTerms.has(term)) {
            usedTerms.add(term);
            break;
        }
        attempts++;
    }
    
    return {
        term: term,
        category: CATEGORY,
        tone: randomChoice(tones),
        definition: randomChoice(definitions),
        tags: ["bioshock", "lealtad", "rescate", "supervivencia", "océano", "apoyo"].sort(() => 0.5 - Math.random()).slice(0, 3),
        example: `${randomChoice(examplePrefixes)} ${term}.`
    };
}

function generateSuggestions(slangs) {
    return slangs.map(s => {
        // Create rhyme suggestion by picking words from the slang
        const words = s.term.split(' ');
        const word = words[words.length - 1]; // Pick last word
        
        return {
            word: word,
            source: s.term,
            category: s.category,
            tone: s.tone,
            tags: s.tags,
            example: s.example
        };
    });
}

function main() {
    const slangs = [];
    const usedTerms = new Set();
    
    for (let i = 0; i < TARGET_COUNT; i++) {
        slangs.push(generateSlang(usedTerms));
    }
    
    const suggestions = generateSuggestions(slangs);
    
    fs.writeFileSync('kinzer-rhymes-part-016.json', JSON.stringify(slangs));
    console.log('kinzer-rhymes-part-016.json generado con', TARGET_COUNT, 'entradas.');
    
    fs.writeFileSync('kinzer-rhyme-suggestions-part-013.json', JSON.stringify(suggestions));
    console.log('kinzer-rhyme-suggestions-part-013.json generado con', TARGET_COUNT, 'entradas.');
}

main();
