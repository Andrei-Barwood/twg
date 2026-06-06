const fs = require('fs');

const TARGET_COUNT = 1920;
const CATEGORY = 'bioshock episodio 1';

// Bioshock Episode 1 + Survivor Mode inspired vocabulary
const nouns = [
    'llave inglesa', 'escasez', 'oscuridad', 'sombra', 'splicer', 'ceniza', 'escombros', 'radio',
    'botiquín', 'munición', 'superviviente', 'estática', 'Atlas', 'Rapture', 'eco', 'inyección',
    'médico', 'cirujano', 'agua negra', 'cristal roto', 'fuga', 'sangre', 'respiro', 'herida',
    'pánico', 'plásmido', 'venas', 'corriente', 'batería', 'linterna', 'fuego', 'cenicero'
];

const adjectives = [
    'vacío', 'roto', 'desesperado', 'afilado', 'crudo', 'frío', 'tenso', 'escaso', 'aplastante',
    'sangriento', 'eléctrico', 'ciego', 'oxidado', 'clínico', 'fatal', 'urgente', 'brutal',
    'improvisado', 'oscuro', 'salado', 'enfermo', 'frenético', 'hundido', 'tóxico'
];

const structures = [
    (n, a) => `${n} ${a}`,
    (n, a) => `golpe de ${n}`,
    (n, a) => `${n} en la sombra`,
    (n, a) => `modo ${n}`,
    (n, a) => `sed de ${n}`,
    (n, a) => `último ${n}`,
    (n, a) => `${a} sin balas`,
    (n, a) => `${n} de Atlas`,
    (n, a) => `pulso de ${n}`,
    (n, a) => `sangre y ${n}`,
];

const tones = ['superviviente', 'desesperado', 'crudo', 'tenso', 'urgente', 'frío', 'violento', 'frenético'];

const definitions = [
    "maniobra extrema cuando te quedas sin opciones ni recursos.",
    "el último aliento antes de golpear con lo que tengas a mano.",
    "avanzar a oscuras sabiendo que algo te acecha en el agua.",
    "improvisación táctica cuando falla la luz y sobra el miedo.",
    "ataque directo y sucio, sin elegancia, pura supervivencia.",
    "decisión desesperada que tomas cuando te acorralan.",
    "una fracción de segundo de calma antes de que se rompa el cristal.",
    "usar el entorno a tu favor cuando te falta munición.",
    "ignorar el dolor para dar el último golpe necesario.",
    "el instinto primitivo que despierta en la zona más oscura de Rapture."
];

const examplePrefixes = [
    "Sin balas en la recámara, solo me queda",
    "El agua sube, preparo",
    "Escucho pasos, activo",
    "En modo survivor todo se resuelve con",
    "La radio falló, bienvenido al",
    "Curando las heridas con",
    "Me muevo en la sombra, soy",
    "No hay salida limpia, necesito",
    "Golpe al cráneo con",
    "Respirando óxido, soltando"
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
        tags: ["survivor", "rapture", "escasez", "combate", "urgencia"].sort(() => 0.5 - Math.random()).slice(0, 3),
        example: `${randomChoice(examplePrefixes)} ${term}.`
    };
}

function generateSuggestions(slangs) {
    return slangs.map(s => {
        const words = s.term.split(' ');
        const word = words[words.length - 1];
        
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
    
    fs.writeFileSync('kinzer-rhymes-part-017.json', JSON.stringify(slangs));
    console.log('kinzer-rhymes-part-017.json generado con', TARGET_COUNT, 'entradas.');
    
    fs.writeFileSync('kinzer-rhyme-suggestions-part-014.json', JSON.stringify(suggestions));
    console.log('kinzer-rhyme-suggestions-part-014.json generado con', TARGET_COUNT, 'entradas.');
}

main();
