(function() {
    'use strict';

    const insideSessionLicense = {
        name: "CC BY",
        url: "https://creativecommons.org/licenses/by/4.0/",
        summary: "Puedes samplear, remezclar, derivar y usar este material incluso en contextos comerciales, siempre con atribución.",
        manifesto: "Creo que la autogestión y el contenido open source generan culturas más ricas, más productivas y económicamente más estables que las que nacen desde una mentalidad conservadora rígida."
    };

    const insideSessionCallToAction = {
        title: "Haz algo con estos stems",
        body: "Si haces un remix, un edit, una sesión de estudio o cualquier mutación rara y bonita, envíamela por correo o etiquétame en YouTube.",
        email: "contacto@megadoll.club",
        youtubeUrl: "https://www.youtube.com/@TheWoodenGroom",
        youtubeLabel: "@TheWoodenGroom"
    };

    function createInsideSession(config) {
        const options = config || {};

        return {
            title: options.title || "Inside the Session",
            summary: options.summary || "Descarga directa del paquete completo de stems, nota personal, screenshots de Renoise y extras de producción.",
            statusLabel: options.statusLabel || "Disponible para explorar",
            metadata: Array.isArray(options.metadata) ? options.metadata : [],
            downloadUrl: options.downloadUrl || "",
            downloadLabel: options.downloadLabel || "Descarga directa (ZIP)",
            downloadNote: options.downloadNote || "",
            embeds: Array.isArray(options.embeds) ? options.embeds : [],
            preview: options.preview || null,
            noteTitle: options.noteTitle || "Nota personal",
            noteParagraphs: Array.isArray(options.noteParagraphs) ? options.noteParagraphs : [],
            screenshotsTitle: options.screenshotsTitle || "Screenshots de la sesión",
            screenshots: Array.isArray(options.screenshots) ? options.screenshots : [],
            preset: options.preset || null,
            license: {
                ...insideSessionLicense,
                ...(options.license || {})
            },
            callToAction: {
                ...insideSessionCallToAction,
                ...(options.callToAction || {})
            }
        };
    }

    // Datos volcados desde la plantilla de discografia.
    // Para activar un pack por release, agrega:
    // insideSession: createInsideSession({
    //     metadata: [
    //         { label: "BPM", value: "160" },
    //         { label: "Tonalidad", value: "Fm" },
    //         { label: "Renoise", value: "3.5.x" }
    //     ],
    //     downloadUrl: "https://...",
    //     downloadNote: "El ZIP completo trae más canales que el preview.",
    //     embeds: [
    //         {
    //             title: "Album en Bandcamp",
    //             embedUrl: "https://bandcamp.com/EmbeddedPlayer/...",
    //             description: "Contexto del release dentro de Bandcamp.",
    //             height: "42px"
    //         },
    //         {
    //             title: "Preview en Bandcamp",
    //             embedUrl: "https://bandcamp.com/VideoEmbed?track=...",
    //             description: "Muestra pequeña frente al ZIP completo.",
    //             height: "435px",
    //             allowFullscreen: true
    //         }
    //     ],
    //     noteParagraphs: [
    //         "Texto de la nota personal."
    //     ],
    //     screenshots: [
    //         {
    //             src: "assets/images/inside-the-session/nombre-release/captura-01.jpg",
    //             alt: "Renoise abierto en nombre-release",
    //             caption: "Vista general de la sesión"
    //         }
    //     ],
    //     preset: {
    //         title: "Arco de Choque",
    //         instrument: "Bass Master de Loopmasters",
    //         description: "Breve descripción de uso."
    //     }
    // })
    window.musicReleases = [
        {
            id: "yellow-voices",
            title: "Yellow Voices",
            year: "2011",
            type: "Ep",
            catalog: "PHNTM_1",
            series: "Phantoma",
            status: "Perdido",
            image: "",
            description: "Se me perdió porque migré mal los archivos de un disco antiguo a uno nuevo, intenté con la app de  recuperador de datos pero el disco antiguo se había mojado y estaba muy dañado, una verdadera pérdida, ni modos. Pero bueno la última canción “Siren” apareció después como por arte de magia en un disco nuevo al cual yo no le había copiado contenido reciente, asi que asumo que mis versiones de Andrew anteriores me contactaron desde el pasado…",
            links: []
        },
        {
            id: "siren",
            title: "Siren",
            year: "2012",
            type: "Sencillo",
            catalog: "PHNTM_2",
            series: "Phantoma",
            status: "Recuperado/Remasterizado",
            image: "",
            description: "Se lanzó para celebrar un halloween en la casa de Luisa, fue divertido aunque el estreno fue en la casa Juli, que video ese día",
            links: []
        },
        {
            id: "el-habitat37",
            title: "El Habitat37",
            year: "2013",
            type: "Sencillo",
            catalog: "PHNTM_3",
            series: "Phantoma",
            status: "Grabado/Remasterizado",
            image: "",
            description: "Representó un antes y un después en la formación de la iniciativa Hive Minds, un colectivo de programadores que ensamblaron el sistema digital de un laboratorio farmacéutico cuya operación real es la criogenia, el instituto Elena del Mar, la fuerza operativo del comando D5K en Suiza o en Alemania no me acuerdo, el embarazo de Liliana, entre otros proyectos científicos con propósitos militares, este sencillo se referencia directamente en el blog del accidente de incendio en las instalaciones de uno de los laboratorios",
            links: []
        },
        {
            id: "wild-bunnies-forest",
            title: "Wild Bunnies Forest",
            year: "2014",
            type: "Sencillo",
            catalog: "PHNTM_4",
            series: "Phantoma",
            status: "Grabado/Sin Masterizar",
            image: "",
            description: "Este sencillo es particularmente lindo pero en todo caso quizá fue de esos momentos en los que el artista no tiene nada que ver con su arte? Yo estaba pasando un episodio muy difícil porque un asesino que estaba en prisión quería fugarse para asesinarme y bueno, eventualmente toda la ciudad estaba en contra de ese mamarracho, cuando logró fugarse me ayudaron mucho a evitar un problema grave, casi lo mato y me hubieran dado 3 años y un día, que basura",
            links: []
        },
        {
            id: "el-bosque-magico",
            title: "El Bosque Mágico",
            year: "2017",
            type: "Ep",
            catalog: "GRBNNY_01",
            series: "Gore Bunny",
            status: "Grabado/Sin Masterizar",
            image: "",
            description: "Este y todos los lanzamientos de Gore Bunny fueron en su momento experimentos divertidos, inspirados en el segundo origen de Andrew I, que como resultado obtuvo los bocetos y sketches de Andrew II",
            links: []
        },
        {
            id: "bio-digital-jazz",
            title: "Bio Digital Jazz",
            year: "2017",
            type: "Album",
            catalog: "GRBNNY_02",
            series: "Gore Bunny",
            status: "Grabado/Sin Masterizar",
            image: "",
            description: "Bio Digital Jazz es una aproximación a ciegas de lo que probablemente ocurrió diseñando la versión II de Andrew WIIIK, durante la grabación de este álbum no tuve acceso a los historiales de gestión del laboratorio durante ese período así que considero que son puras elocubraciones",
            links: []
        },
        {
            id: "satan-s-princess",
            title: "Satan's Princess",
            year: "2018",
            type: "Album",
            catalog: "MD_001",
            series: "Mega Doll",
            status: "Grabado/Sin Masterizar",
            image: "",
            description: "Jewel Music una vez me preguntó que pasaría si tuviéramos una hija, y yo le respondí que sería linda pero que sería algo asi como la enviada de satanás a la tierra porque yo soy terrible y nadie me va a domar nunca",
            links: []
        },
        {
            id: "water-mirror",
            title: "Water Mirror",
            year: "2018",
            type: "Album",
            catalog: "MD_002",
            series: "Mega Doll",
            status: "Grabado/Sin Masterizar",
            image: "",
            description: "Como resultado de estar frecuentando una tabla ouija italiana que me reveló bondades, lo cual me choqueó un poco, pues usualmente la gente la recuerda como una maldita porquería, las canciones",
            links: []
        },
        {
            id: "enfermera-satanica",
            title: "Enfermera Satánica",
            year: "2018",
            type: "Album",
            catalog: "MD_003",
            series: "Mega Doll",
            status: "Grabado/Sin Masterizar",
            image: "",
            description: "Alguien una vez me preguntó qué pensaba de las enfermeras, y yo le respondí que son satánicas",
            links: []
        },
        {
            id: "the-cotton-candy-machine",
            title: "The Cotton Candy Machine",
            year: "2019",
            type: "Album",
            catalog: "PTT_01",
            series: "Petite",
            status: "Grabado",
            image: "",
            description: "Un puto hit de radio, fue el lanzamiento que catapultó a Mega Doll en el mainstream Las Vegiano, MTV Las Vegas, MFC, CB, OF, Bonga, MV, RedTB, SckFlck, entre otras estaciones musicales de FM importantes comentaron, publicaron, compartieron y le hicieron reviews a este album, fue muy agradable la recepción, a pesar de ser un album puramente experimental en el mainstream comercial lo recibieron con un abrazo muy bonito",
            links: []
        },
        {
            id: "petite",
            title: "Petite",
            year: "2019",
            type: "Ep",
            catalog: "PTT_02",
            series: "Petite",
            status: "Grabado",
            image: "",
            description: "Después de The Cotton Candy Machine decidí grabar el resto de la serie Petite inspirándome en aventuras de la gente que compartió ese album y continuar la historia desde un hardcore-techno muy experimental que yo titulé hardcore sinfónico porque sus estructuras complejas y enredadas retratan estilos de color sinfónico utilizado en sistemas sinfónicos",
            links: []
        },
        {
            id: "moon-s-petals-orquidea",
            title: "Moon's Petals Orquidea",
            year: "2019",
            type: "Sencillo",
            catalog: "PTT_03",
            series: "Petite",
            status: "Grabado",
            image: "",
            description: "Jewel Music hizo un pie de limón por primera vez en la primera cita en el primer minuto antes del primer segundo y entonces para celebrar grabé este sencillo",
            links: []
        },
        {
            id: "reflejos-de-tu-corazon-en-un-espejo-antiguo",
            title: "Reflejos De Tu Corazon En Un Espejo Antiguo",
            year: "2019",
            type: "Album",
            catalog: "MD_004",
            series: "Mega Doll",
            status: "Grabado",
            image: "",
            description: "Inspirado en la ilustración de el naipe de poker utilizado por Alice in Wonderland para hacer trucos de magia de técnica y sin técnica, demasiado anticipado para el tiempo que corría en esos años, logró retratar el propósito del album Almas Gemelas, romper el espejo en fragmentos que coincidan con los fragmentos de tu cabello de forma espontánea, simétrica, natural y muy smart. Es un album que hace referencia a las facciones de mi rostro expresándolo como un pastel a base de deliciosas combinaciones del naipe de poker de Alice, proyectó la idea de que si no eres constante con tus practicas de skin care la belleza pasa de ser una situación espontánea y muy natural, a un producto de resultado fugaz, que desaparece fácilmente y sin esfuerzo, después que desaparece la rubia del baño y todo su crew de malvadas se difumina y las cosas pierden su sabor",
            links: []
        },
        {
            id: "lines-dreams-and-magic",
            title: "Lines Dreams And Magic",
            year: "2019",
            type: "Album",
            catalog: "MD_005",
            series: "Mega Doll",
            status: "Grabado",
            image: "",
            description: "Inspirado en la gran acogida que tuvo el track ‘Papel de Laura’ del album “Reflejos de tu Corazón en un Espejo Antiguo” realicé este album invadiendo lo que en su momento era una de las tantas habitaciones donde hicimos fiesta tocando DJs de toda Las Vegas, loqueamos, cocinamos, comimos, dormimos, corrimos, saltamos encima de la cama y todos esos recuerdos me saben a una mezcla linda de naranjas con crema batida",
            links: []
        },
        {
            id: "deep-inside-my-heart",
            title: "Deep Inside My Heart",
            year: "2020",
            type: "Album",
            catalog: "MD_006",
            series: "Mega Doll",
            status: "Grabado",
            image: "",
            description: "Jewel Music hizo un pie de limón por segunda vez en la primera cita en el primer minuto antes del primer segundo y entonces para celebrar grabé este album",
            links: []
        },
        {
            id: "tiempo-monumento",
            title: "Tiempo Monumento",
            year: "2020",
            type: "Album",
            catalog: "MD_007",
            series: "Mega Doll",
            status: "Grabado",
            image: "",
            description: "Este album fue la ante sala del track False Shadows Caverns que parece al final de el Ep ‘Doll Cult’",
            links: []
        },
        {
            id: "tears-of-water",
            title: "Tears Of Water",
            year: "2020",
            type: "Sencillo",
            catalog: "MD_008",
            series: "Mega Doll",
            status: "Grabado",
            image: "",
            description: "A veces para eliminar la oscuridad y todas esas sombras extrañas hay que caminar sin ver y con los ojos cerrados…",
            links: []
        },
        {
            id: "water-fountain",
            title: "Water Fountain",
            year: "2020",
            type: "Sencillo",
            catalog: "MD_009",
            series: "Mega Doll",
            status: "Grabado",
            image: "",
            description: "No recuerdo bien pero creo que mi primer beso fue a los 6 años en una fuente de agua re bonita de piedra amarilla, nos estábamos rumbiando y empezó a llover, era una temperatura deli",
            links: []
        },
        {
            id: "almas-gemelas-tracks",
            title: "Almas Gemelas [tracks]",
            year: "2026",
            type: "Sample Pack",
            catalog: "ALMGM_022",
            series: "Almas Gemelas",
            status: "Publicado",
            image: "",
            description: "Archivo abierto del EP Almas Gemelas: stems por canal exportados desde Renoise, licencia CC BY y una guía tonal en Do Aumentada (exátona) para remezclar, montar piezas audiovisuales o reconstruir la obra desde adentro.",
            links: [
                {
                    label: "Entrada blog",
                    url: "blog.html#sample-pack-almas-gemelas"
                }
            ],
            insideSession: createInsideSession({
                title: "Inside the Session / Almas Gemelas",
                summary: "Stems abiertos del EP Almas Gemelas. El ZIP trae los buffers por canal exportados desde Renoise y una guía tonal para trabajar nuevo material sin perder el color del release.",
                statusLabel: "Pack completo disponible",
                metadata: [
                    {
                        label: "Formato",
                        value: "WAV / 44.1 kHz / 16-bit"
                    },
                    {
                        label: "Fuente",
                        value: "Buffers de Renoise exportados canal por canal"
                    },
                    {
                        label: "Incluye",
                        value: "Stems individuales de instrumento y capas estructurales"
                    },
                    {
                        label: "No incluye",
                        value: "Las mezclas finales en estéreo del EP"
                    },
                    {
                        label: "Escala guía",
                        value: "Do Aumentada (exátona)"
                    },
                    {
                        label: "Notas",
                        value: "C, Eb, E, G, G#, B"
                    },
                    {
                        label: "Uso sugerido",
                        value: "Remixes, audiovisual, videojuegos, cine, TV, podcasts e instalaciones"
                    }
                ],
                downloadUrl: "https://archive.org/download/serie-almas-gemelas-01/22%20-%20%5Btracks%5D%20Serie%20Almas%20Gemelas.zip",
                downloadLabel: "Descarga el sample pack (ZIP)",
                downloadNote: "El ZIP contiene el material fuente del EP. No trae la mezcla final: la idea es trabajar el archivo abierto y reconstruirlo desde sus partes.",
                embeds: [
                    {
                        title: "Preview en Bandcamp",
                        embedUrl: "https://bandcamp.com/VideoEmbed?track=1922966536&bgcol=ffffff&linkcol=0687f5",
                        description: "Muestra breve del sample pack frente al ZIP completo.",
                        height: "435px",
                        allowFullscreen: true
                    }
                ],
                noteTitle: "Archivo abierto",
                noteParagraphs: [
                    "Este lanzamiento corresponde al sample pack de Almas Gemelas y está pensado como un archivo operativo, no solo como souvenir del release.",
                    "Los stems salen de Renoise canal por canal. En varios casos, pads y sintetizadores comparten muestra por buffer, así que el trabajo se parece más a rearmar una pieza desde adentro que a remezclar pistas estéreo ya cerradas.",
                    "Si quieres añadir material nuevo sin salirte del color del EP, la guía más útil es trabajar solo con C, Eb, E, G, G# y B en todas las octavas. Esa colección concentra la ambigüedad armónica de Almas Gemelas y ayuda a mantener coherencia tímbrica y melódica.",
                    "También me interesa como documento de preservación: un archivo vivo para mutaciones raras y obras derivadas en audio, video, instalaciones o cualquier otra forma de montaje."
                ],
                license: {
                    manifesto: "La idea es abrir el archivo, no cerrarlo. Compartir stems y buffers tiene sentido cuando el material puede seguir viviendo en otras manos, otros montajes y otros sistemas."
                },
                callToAction: {
                    title: "Haz algo con Almas Gemelas",
                    body: "Si haces una remezcla, una escena para videojuego, una pieza audiovisual, un montaje para cine o cualquier mutación rara a partir de estos stems, mándamela o etiquétame."
                }
            })
        },
        {
            id: "taxi-labyrinth",
            title: "Taxi Labyrinth",
            year: "2026",
            type: "Album",
            catalog: "GRFF_001",
            series: "Sound Graffiti",
            status: "Publicado",
            image: "",
            description: "\"creepy\": a mi una vez un taxista, intenté hackearle el taxímetro con un iPod nano chirrete en modo chirrete y se dió cuenta y no comprendía que mierdas le pasaba al puto contador. El tipo iba histérico y se desesperó tanto que le metió la segunda a la caja de cambios y me llevó en sgunda hasta mi casa con ese vehículo ardiendo en temperatura y el mansito sorprendido porque él aceleraba a fondo y el contador del taxímetro no avanzaba abruptamente, y yo por mi parte con el iPod nano de chirri jugando vortex para un lado, y luego jugando vortex para el otro, un cague de risa parce. Disfrútalo!",
            links: [
                {
                    label: "Bandcamp",
                    url: "https://megadoll.bandcamp.com/album/taxi-labyrinth"
                }
            ],
            insideSession: createInsideSession({
                summary: "Stems del track 2 \"La Ausencia de Evidencias es la Evidencia\". El preview incrustado es solo una muestra; la descarga ZIP trae muchos más archivos y canales por separado.",
                statusLabel: "Track 2 disponible",
                metadata: [
                    {
                        label: "BPM",
                        value: "116"
                    },
                    {
                        label: "TPL",
                        value: "12"
                    },
                    {
                        label: "Pulso",
                        value: "También funciona a 4/4, pero algunas unidades se convierten en cuatrillos, doscillos o síncopas; la marca de tiempo fuerte no es ternaria, es compuesta (como quien dice 'no corras')."
                    },
                    {
                        label: "Tonalidad",
                        value: "La Húngara Menor"
                    },
                    {
                        label: "Renoise",
                        value: "3.5"
                    },
                    {
                        label: "Render",
                        value: "44.1 kHz / 16-bit"
                    },
                    {
                        label: "Compatibilidad",
                        value: "Los stems corren en cualquier DAW o sampler porque el render usa el estándar de CD."
                    }
                ],
                downloadUrl: "https://archive.org/download/la-ausencia-de-evidencias-es-la-evidencia-tracks/02%20-%20La%20Ausencia%20de%20Evidencias%20es%20la%20Evidencia%20%5Btracks%5D.zip",
                downloadNote: "La descarga directa contiene el paquete completo de stems. Los embeds de Bandcamp son solo una ventana pequeña frente al ZIP entero.",
                embeds: [
                    {
                        title: "Álbum en Bandcamp",
                        embedUrl: "https://bandcamp.com/EmbeddedPlayer/album=3611659809/size=small/bgcol=ffffff/linkcol=0687f5/transparent=true/",
                        description: "Vista incrustada del álbum donde vive este material.",
                        height: "42px"
                    },
                    {
                        title: "Preview en Bandcamp",
                        embedUrl: "https://bandcamp.com/VideoEmbed?track=1020403504&bgcol=ffffff&linkcol=0687f5",
                        description: "Preview del track dentro del perfil del álbum. La descarga ZIP es bastante más grande que esta muestra.",
                        height: "435px",
                        allowFullscreen: true
                    }
                ],
                noteTitle: "Nota personal",
                noteParagraphs: [
                    "Considero que se trata de un iPod nano en modo chirrete, y la verdad aún no lo supero.",
                    "Track 2.",
                    "\"Falta que la brújula se nos dañe y ahí sí quedaríamos mejor que nunca!\"",
                    "\"No, estos no vienen equipados con brújula digital, sensor GPS ni con giroscopio metálico, no se preocupe.\"",
                    "\"Mire, si se daña esta mierda usted me paga.\"",
                    "\"Yo cobro lo que a mí se me dé la regalada gana.\""
                ],
                screenshots: [
                    {
                        src: "assets/images/20.jpg",
                        alt: "Screenshot de Renoise para Taxi Labyrinth 01",
                        caption: "Vista de la sesión 01"
                    },
                    {
                        src: "assets/images/19.jpg",
                        alt: "Screenshot de Renoise para Taxi Labyrinth 02",
                        caption: "Vista de la sesión 02"
                    },
                    {
                        src: "assets/images/18.jpg",
                        alt: "Screenshot de Renoise para Taxi Labyrinth 03",
                        caption: "Vista de la sesión 03"
                    }
                ]
            })
        }
    ];
})();
