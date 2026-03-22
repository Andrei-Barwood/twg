// assets/js/p5-background.js
// Animación con glitches y cambios abruptos

(function() {
    'use strict';

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 600;
    const NUM_CUBES = isMobile ? 20 : 50; // más cubos para más caos
    const MAX_SIZE = isMobile ? 100 : 250;
    const MIN_SIZE = 15;

    // Colores de la paleta (se usarán para cambios abruptos)
    const COLORS = ['#ACC849', '#D2EA91', '#A4C040', '#BDD56C', '#ADD9D5', '#D6C77C', '#FAFBD8', '#B73232', '#F0575C', '#F49A43', '#FFCD60', '#7CA42A'];

    let cubes = [];
    let glitchIntensity = 0; // 0 a 1, para efectos globales
    let lastGlitchFrame = 0;
    let scanlines = false;

    const sketch = (p) => {
        p.setup = () => {
            let canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
            canvas.parent('p5-background');
            p.frameRate(30); // para que los cambios sean más notorios

            // Inicializar cubos con valores aleatorios
            for (let i = 0; i < NUM_CUBES; i++) {
                cubes.push({
                    angle: p.random(p.TWO_PI),
                    radius: p.random(150, 500),
                    size: p.random(MIN_SIZE, MAX_SIZE),
                    color: p.color(p.random(COLORS)),
                    zOffset: p.random(-300, 300),
                    glitchOffset: p.createVector(0, 0, 0),
                    glitchTimer: 0,
                });
            }
        };

        p.draw = () => {
            p.clear();

            // Calcular centro según ratón (con algo de retraso para suavizar, pero podemos hacerlo abrupto)
            let targetX = p.mouseX || p.width / 2;
            let targetY = p.mouseY || p.height / 2;
            // Movimiento abrupto si glitch activo
            let cx = targetX - p.width / 2;
            let cy = -(targetY - p.height / 2);

            // Probabilidad de glitch global (cada 30 frames aprox)
            if (p.frameCount % 30 === 0 && p.random() < 0.3) {
                glitchIntensity = p.random(0.5, 1);
                lastGlitchFrame = p.frameCount;
                scanlines = true;
            }
            // Desvanecer glitch después de unos frames
            if (p.frameCount - lastGlitchFrame > 10) {
                glitchIntensity = p.lerp(glitchIntensity, 0, 0.1);
                if (glitchIntensity < 0.05) glitchIntensity = 0;
                scanlines = false;
            }

            // Actualizar y dibujar cubos (solo siguen al cursor, sin oscilación)
            for (let cube of cubes) {
                let x = cx + cube.radius * p.cos(cube.angle);
                let y = cy + cube.radius * p.sin(cube.angle);
                let z = cube.zOffset;

                // Aplicar glitch individual (probabilidad por cubo)
                if (p.random() < 0.01 * glitchIntensity) {
                    // Cambio abrupto de color
                    cube.color = p.color(p.random(COLORS));
                }
                if (p.random() < 0.02 * glitchIntensity) {
                    // Desplazamiento repentino
                    cube.glitchOffset.set(p.random(-50, 50), p.random(-50, 50), p.random(-50, 50));
                    cube.glitchTimer = 5; // durará 5 frames
                }
                if (cube.glitchTimer > 0) {
                    cube.glitchTimer--;
                } else {
                    cube.glitchOffset.set(0, 0, 0);
                }

                // Aplicar glitch global (desplazamiento)
                let finalX = x + cube.glitchOffset.x;
                let finalY = y + cube.glitchOffset.y;
                let finalZ = z + cube.glitchOffset.z;

                p.push();
                p.translate(finalX, finalY, finalZ);

                // Dibujar
                p.fill(cube.color);
                p.stroke(255, 255, 255, 120);
                p.strokeWeight(1);
                p.box(cube.size);

                p.pop();
            }

            // Efecto de scanlines (líneas horizontales de ruido)
            if (scanlines || p.random() < 0.1 * glitchIntensity) {
                p.push();
                p.resetMatrix(); // trabajar en 2D sobre el canvas
                p.stroke(183, 50, 50, 36);
                p.strokeWeight(1);
                for (let i = 0; i < p.height; i += 8) {
                    if (p.random() < 0.3) {
                        p.line(0, i, p.width, i);
                    }
                }
                p.pop();
            }

            // Efecto de inversión de color momentánea (simulada con un rectángulo semitransparente)
            if (p.random() < 0.05 * glitchIntensity) {
                p.push();
                p.resetMatrix();
                p.fill(250, 251, 216, 26);
                p.rect(0, 0, p.width, p.height);
                p.pop();
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    };

    new p5(sketch);
})();
