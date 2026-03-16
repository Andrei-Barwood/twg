(function() {
    'use strict';

    // Datos volcados desde la plantilla de discografia.
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
        }
    ];
})();
