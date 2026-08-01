/**
 * Studio32 · "Luz" — campo atmosférico para el hero de la web.
 * =============================================================
 * Construye la composición entera por código. NO renderiza texto: la
 * tipografía y la conversación van en HTML encima de esta secuencia.
 *
 * CÓMO SE USA
 *   1. Abre After Effects (con o sin proyecto abierto).
 *   2. Archivo > Scripts > Ejecutar archivo de script…  → elige este .jsx
 *   3. Se crea la composición "S32_Luz". Dale al play.
 *   4. Para exportar: Composición > Añadir a la cola de renderización.
 *      Módulo de salida → PNG Sequence (o WebP si tu versión lo trae).
 *      Guarda en  docs/ae/salida/luz_[####].png
 *
 * NOTAS TÉCNICAS
 *   - Se accede a las propiedades por matchName y por ÍNDICE, nunca por
 *     nombre visible: los nombres cambian con el idioma de la aplicación y
 *     romperían el script en un AE en español.
 *   - Cada efecto va en su propio try/catch. Si tu versión ordena distinto
 *     las propiedades de algún efecto, el resto de la composición se monta
 *     igual y al final se informa de lo que falló.
 */

(function studio32Luz() {
    // ── Parámetros ───────────────────────────────────────────────────────────
    var ANCHO = 1920;
    var ALTO = 1200;          // 16:10 — deja aire vertical para pantallas altas
    var FPS = 25;
    var DURACION = 6;         // 150 fotogramas: de sobra para rebobinar con scroll

    var incidencias = [];

    function rgb(r, g, b) {
        return [r / 255, g / 255, b / 255];
    }

    // Colores del cielo, de medianoche a amanecer.
    var CIELO_ALTO_NOCHE = rgb(5, 6, 10);
    var CIELO_ALTO_ALBA = rgb(26, 22, 48);
    var CIELO_ALTO_DIA = rgb(86, 122, 178);

    var CIELO_BAJO_NOCHE = rgb(10, 14, 28);
    var CIELO_BAJO_ALBA = rgb(96, 58, 62);
    var CIELO_BAJO_DIA = rgb(236, 156, 104);

    var AMBAR = rgb(255, 238, 205);

    // ── Utilidades ───────────────────────────────────────────────────────────
    function nuevoSolido(comp, nombre, color) {
        return comp.layers.addSolid(color, nombre, ANCHO, ALTO, 1);
    }

    function efecto(capa, matchName) {
        return capa.property("ADBE Effect Parade").addProperty(matchName);
    }

    /** Pone keyframes en una propiedad y le da easing suave a todos. */
    function animar(prop, tiempos, valores) {
        for (var i = 0; i < tiempos.length; i++) {
            prop.setValueAtTime(tiempos[i], valores[i]);
        }
        for (var k = 1; k <= prop.numKeys; k++) {
            try {
                prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
            } catch (e) { /* algunas propiedades no admiten bezier */ }
        }
        // Easing en el primero y el último para que arranque y pare sin golpe.
        try {
            var suaveIn = new KeyframeEase(0, 55);
            var suaveOut = new KeyframeEase(0, 55);
            var dim = (prop.value instanceof Array) ? prop.value.length : 1;
            var listaIn = [], listaOut = [];
            for (var d = 0; d < dim; d++) { listaIn.push(suaveIn); listaOut.push(suaveOut); }
            prop.setTemporalEaseAtKey(1, listaIn, listaOut);
            prop.setTemporalEaseAtKey(prop.numKeys, listaIn, listaOut);
        } catch (e) { /* no crítico */ }
    }

    // ── Proyecto y composición ───────────────────────────────────────────────
    if (!app.project) app.newProject();
    app.beginUndoGroup("Studio32 · Luz");

    var comp = app.project.items.addComp("S32_Luz", ANCHO, ALTO, 1, DURACION, FPS);
    comp.bgColor = CIELO_ALTO_NOCHE;

    // ── 1 · CIELO ────────────────────────────────────────────────────────────
    // Degradado vertical que va de noche cerrada a amanecer.
    try {
        var cielo = nuevoSolido(comp, "01 · Cielo", CIELO_ALTO_NOCHE);
        var rampa = efecto(cielo, "ADBE Ramp");

        // Orden de Ramp: 1 Inicio · 2 Color inicio · 3 Fin · 4 Color fin · 5 Forma
        rampa.property(1).setValue([ANCHO / 2, 0]);
        rampa.property(3).setValue([ANCHO / 2, ALTO]);
        rampa.property(5).setValue(1); // 1 = lineal

        animar(rampa.property(2),
            [0, DURACION * 0.58, DURACION],
            [CIELO_ALTO_NOCHE, CIELO_ALTO_ALBA, CIELO_ALTO_DIA]);

        animar(rampa.property(4),
            [0, DURACION * 0.58, DURACION],
            [CIELO_BAJO_NOCHE, CIELO_BAJO_ALBA, CIELO_BAJO_DIA]);
    } catch (e) {
        incidencias.push("Cielo (Ramp): " + e.toString());
    }

    // ── 2 · SOL ──────────────────────────────────────────────────────────────
    // Rampa RADIAL sobre su propio sólido, en modo Añadir: el negro del borde
    // no aporta nada y el centro cálido queda como un foco de luz. Más robusto
    // que el efecto Círculo, cuyos índices varían entre versiones.
    try {
        var sol = nuevoSolido(comp, "02 · Sol", [0, 0, 0]);
        sol.blendingMode = BlendingMode.ADD;

        var radial = efecto(sol, "ADBE Ramp");
        radial.property(5).setValue(2);            // 2 = radial
        radial.property(2).setValue(AMBAR);        // centro
        radial.property(4).setValue([0, 0, 0]);    // borde

        var xSol = ANCHO * 0.68;

        // El foco nace muy por debajo del encuadre y sube.
        animar(radial.property(1),
            [0, DURACION * 0.55, DURACION],
            [[xSol, ALTO * 1.42], [xSol, ALTO * 1.05], [xSol, ALTO * 0.60]]);

        // El radio crece con él.
        animar(radial.property(3),
            [0, DURACION],
            [[xSol, ALTO * 1.90], [xSol, ALTO * 1.34]]);

        // Desenfoque: muy difuso de noche, más definido al amanecer.
        var desenfoque = efecto(sol, "ADBE Box Blur2");
        animar(desenfoque.property(1), [0, DURACION], [140, 46]);
        try { desenfoque.property(2).setValue(3); } catch (e) { }   // iteraciones
        try { desenfoque.property(4).setValue(true); } catch (e) { } // repetir bordes

        // Intensidad general: primero una brasa, al final amanecer pleno.
        animar(sol.property("ADBE Transform Group").property("ADBE Opacity"),
            [0, DURACION * 0.22, DURACION * 0.58, DURACION],
            [0, 14, 46, 100]);
    } catch (e) {
        incidencias.push("Sol (Ramp radial + Box Blur): " + e.toString());
    }

    // ── 3 · BRUMA ────────────────────────────────────────────────────────────
    // Ruido fractal muy suave en modo Trama. Es lo que da textura de aire y lo
    // que en CSS no existe: rompe el degradado plano.
    try {
        var bruma = nuevoSolido(comp, "03 · Bruma", [0, 0, 0]);
        bruma.blendingMode = BlendingMode.SCREEN;

        var ruido = efecto(bruma, "ADBE Fractal Noise");
        try { ruido.property(4).setValue(42); } catch (e) { }   // contraste
        try { ruido.property(5).setValue(-28); } catch (e) { }  // brillo
        try { ruido.property(8).setValue(4); } catch (e) { }    // complejidad

        // Evolución: el aire se mueve despacio durante toda la pieza.
        var propEvo = null;
        for (var i = 1; i <= ruido.numProperties; i++) {
            if (ruido.property(i).matchName === "ADBE Fractal Noise-0112") { propEvo = ruido.property(i); break; }
        }
        if (!propEvo) { try { propEvo = ruido.property(10); } catch (e) { } }
        if (propEvo) animar(propEvo, [0, DURACION], [0, 220]);

        animar(bruma.property("ADBE Transform Group").property("ADBE Opacity"),
            [0, DURACION * 0.5, DURACION],
            [7, 12, 6]);

        // Escalado grande: queremos nubes de aire, no grano fino.
        bruma.property("ADBE Transform Group").property("ADBE Scale").setValue([190, 190]);
    } catch (e) {
        incidencias.push("Bruma (Fractal Noise): " + e.toString());
    }

    // ── 4 · VIÑETA ───────────────────────────────────────────────────────────
    // Oscurece las esquinas para que la tipografía HTML de encima respire.
    try {
        var vineta = nuevoSolido(comp, "04 · Viñeta", [0, 0, 0]);
        var rampaV = efecto(vineta, "ADBE Ramp");
        rampaV.property(5).setValue(2);                       // radial
        rampaV.property(1).setValue([ANCHO / 2, ALTO * 0.46]);
        rampaV.property(3).setValue([ANCHO / 2, ALTO * 1.15]);
        rampaV.property(2).setValue([0, 0, 0]);
        rampaV.property(4).setValue([1, 1, 1]);
        vineta.blendingMode = BlendingMode.MULTIPLY;
        vineta.property("ADBE Transform Group").property("ADBE Opacity").setValue(72);
    } catch (e) {
        incidencias.push("Viñeta: " + e.toString());
    }

    comp.openInViewer();
    app.endUndoGroup();

    // ── Informe ──────────────────────────────────────────────────────────────
    var mensaje = "Composición «S32_Luz» creada.\n\n"
        + ANCHO + "×" + ALTO + " · " + FPS + " fps · " + DURACION + " s ("
        + (FPS * DURACION) + " fotogramas)\n\n"
        + "Para exportar:\n"
        + "Composición > Añadir a la cola de renderización\n"
        + "Módulo de salida > secuencia PNG\n"
        + "Guardar como  luz_[####].png";

    if (incidencias.length) {
        mensaje += "\n\n─────────────\nAvisos (" + incidencias.length + "):\n" + incidencias.join("\n");
    }

    alert(mensaje, "Studio32 · Luz");
})();
