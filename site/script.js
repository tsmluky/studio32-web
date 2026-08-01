// Backend del agente (Railway). Lo usa la demo en vivo de la sección #control.
const AGENT_BASE = 'https://web-production-d722c.up.railway.app';

// Despierta el contenedor en cuanto alguien entra en la web. Railway lo duerme y
// el arranque en frío se comía ~15 s en el primer mensaje, que en una landing es
// letal. Mientras el visitante lee, el agente ya se está poniendo en pie.
// Es un GET al healthcheck: no gasta modelo ni cuenta para el rate limit del chat.
(function calentarAgente() {
    try {
        fetch(AGENT_BASE + '/', { mode: 'no-cors', cache: 'no-store' }).catch(() => { });
    } catch (_) { /* sin red: la demo ya avisa al fallar el primer mensaje */ }
})();

gsap.registerPlugin(ScrollTrigger);

// 1. Lenis Smooth Scroll Setup
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);


// 2. Preloader Animation
const tlPreload = gsap.timeline();

// Animamos las letras del preloader
tlPreload.to('.preloader-text span', {
    y: 0,
    stagger: 0.05,
    duration: 0.8,
    ease: "power4.out"
})
    // Barra de progreso
    .to('.progress-bar', {
        width: '100%',
        duration: 1.5,
        ease: "power2.inOut"
    }, "-=0.2")
    // Desaparecer preloader y revelar Hero
    .to('.preloader', {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
        onComplete: () => {
            // Marca el preloader como resuelto (la red de seguridad de index.html
            // comprueba esta clase) y arranca la animación principal.
            const p = document.querySelector('.preloader');
            if (p) p.classList.add('is-done');
            initHeroAnimations();
        }
    });


// 3. Hero Animations (Runs after preloader)
// Guard de arranque único: el resto del sistema (hero, chat demo y los reveals
// por scroll con SplitType) cuelga de esta función. La llama el onComplete del
// preloader y, como red de seguridad, el propio index.html si ese onComplete no
// llega a dispararse (p. ej. pestaña en segundo plano con requestAnimationFrame
// frenado). El flag evita que se inicialice dos veces.
let heroAnimationsStarted = false;
function initHeroAnimations() {
    if (heroAnimationsStarted) return;
    heroAnimationsStarted = true;
    const tlHero = gsap.timeline();

    // Revelar líneas del hero ("Studio32 / Digital Systems")
    tlHero.from('.hero-title .reveal-text', {
        yPercent: 120,
        rotation: 5,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out"
    })
        .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8 }, "-=0.8")
        .from('.hero-bottom', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
        .from('.navbar', { y: -50, opacity: 0, duration: 1 }, "-=1");

    initChatDemo();
    initSectorDemo();
    initLiveDemo();
    initScrollAnimations();
}

// 4. Scroll Reveal Animations (SplitType)
function initScrollAnimations() {
    // Respeta reduced-motion: deja el texto visible sin animación.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Romper textos en lineas para animarlos
    const splitTexts = document.querySelectorAll('.split-lines');

    splitTexts.forEach(text => {
        const split = new SplitType(text, { types: 'lines' });

        // Cada línea va en un envoltorio con overflow:hidden que la recorta para el
        // revelado (entra deslizándose desde abajo con una leve rotación). El
        // padding-bottom da holgura para los descendentes (g, j, p) y esa rotación;
        // el margin-bottom negativo lo compensa para no alterar el interlineado.
        const wrappers = [];
        split.lines.forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.paddingBottom = '0.35em';
            wrapper.style.marginBottom = '-0.35em';
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
            wrappers.push(wrapper);
        });

        gsap.from(split.lines, {
            scrollTrigger: {
                trigger: text,
                start: "top 85%",
            },
            yPercent: 100,
            rotation: 2,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power4.out",
            onComplete: () => {
                // Terminado el revelado, se retira el recorte. Los envoltorios
                // solapaban la zona de clic de la línea anterior (la selección
                // saltaba carácter a carácter); al quitar overflow/padding/margin
                // —que se anulaban entre sí, así que el interlineado no cambia—
                // el texto vuelve a seleccionarse por palabras con normalidad.
                wrappers.forEach(w => {
                    w.style.overflow = 'visible';
                    w.style.paddingBottom = '0';
                    w.style.marginBottom = '0';
                });
            }
        });
    });
}


// 5. Conversación de producto: se reproduce una sola vez al entrar en pantalla.
// Si JS, GSAP o las animaciones están desactivados, el HTML permanece legible.
// Una línea de tiempo por mockup, indexada para que el selector de sector pueda
// relanzar la conversación de la pestaña que se acaba de abrir.
const chatTimelines = new Map();

function initChatDemo() {
    const mockups = Array.from(document.querySelectorAll('[data-chat-demo]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sin animación los mensajes quedan visibles de serie: no se añade .is-armed.
    if (!mockups.length || reduceMotion) return;

    mockups.forEach((mockup) => {
        const messages = Array.from(mockup.querySelectorAll('.chat-msg'));
        const typingIndicators = Array.from(mockup.querySelectorAll('.chat-typing'));

        if (!messages.length) return;

        mockup.classList.add('is-armed');

        const chatTimeline = gsap.timeline({ paused: true });
        let typingIndex = 0;

        messages.forEach((message) => {
            chatTimeline.to(message, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.42,
                ease: 'power2.out'
            });

            if (message.classList.contains('chat-msg--in') && typingIndicators[typingIndex]) {
                const indicator = typingIndicators[typingIndex];
                typingIndex += 1;

                chatTimeline
                    .call(() => indicator.classList.add('is-visible'))
                    .to({}, { duration: 0.62 })
                    .call(() => indicator.classList.remove('is-visible'));
            } else {
                chatTimeline.to({}, { duration: 0.18 });
            }
        });

        chatTimelines.set(mockup, chatTimeline);

        const panel = mockup.closest('[data-sector-panel]');

        if (panel) {
            // En el selector, el disparador es el bloque entero: un panel oculto
            // no tiene altura y nunca cruzaría el umbral de scroll.
            ScrollTrigger.create({
                trigger: panel.closest('[data-sector-demo]') || panel,
                start: 'top 82%',
                once: true,
                onEnter: () => {
                    if (!panel.hidden) chatTimeline.play();
                }
            });
        } else {
            ScrollTrigger.create({
                trigger: mockup,
                start: 'top 82%',
                once: true,
                onEnter: () => chatTimeline.play()
            });
        }
    });
}

// ---------------------------------------------------------------------------
// Demo en vivo: el visitante habla con el AGENTE REAL desplegado, sin guion.
// Mismo backend que atiende WhatsApp — mismas herramientas, mismo tono.
// El tenant `clinica-cobalto` es ficticio y existe sólo para demostraciones.
// ---------------------------------------------------------------------------
const DEMO_AGENT = {
    endpoint: AGENT_BASE + '/chat',
    tenant: 'clinica-cobalto',
    maxTurnos: 25
};

// Un sector = un tenant REAL del agente. Al cambiar de pestaña se cambia el
// negocio con el que se habla, no el decorado: cada uno tiene su propia
// personalidad, sus servicios y sus políticas en `studio32-agent`.
const SECTORES = {
    clinica: {
        tenant: 'clinica-cobalto',
        negocio: 'Clínica Cobalto',
        iniciales: 'CC',
        marcador: 'Clínica Cobalto · ayer por la noche',
        nota: 'Agente real conectado. Pregúntale lo que se te ocurra: precios, horarios, miedo al dentista, o pídele cita de verdad.',
        placeholder: 'Escribe lo que quieras preguntarle…',
        preview: {
            knowledge: 'Servicios, horarios y políticas de la clínica',
            services: [
                ['Primera visita', '30 min · Sin coste'],
                ['Higiene dental', '45 min · Con cita'],
                ['Urgencia dental', 'Huecos prioritarios'],
                ['Revisión', '30 min · Seguimiento']
            ]
        },
        showreel: [
            { kind: 'in', texto: 'Buenas noches, llevo dos días con dolor en una muela y no sé si aguantar hasta el lunes.', estado: 'Conversación entrante · fuera de horario' },
            { kind: 'out', texto: 'Vaya, lo siento. ¿Te duele todo el rato o solo al morder?', estado: 'El agente está valorando la urgencia' },
            { kind: 'in', texto: 'Todo el rato, y por la noche va a peor.' },
            { kind: 'out', texto: 'Con ese dolor mejor no esperar al lunes. Mañana me queda a las 9:30 o a las 12. ¿Cuál te encaja?', estado: 'Urgencia detectada · consultando agenda real' },
            { kind: 'in', texto: 'A las 9:30. ¿Cuánto me va a costar?' },
            { kind: 'out', texto: 'La primera visita es solo mirar y contarte qué hay, sin coste. El presupuesto sale por escrito antes de tocar nada.' },
            { kind: 'in', texto: 'Perfecto. Marta García.', contacto: 'Marta García' },
            {
                kind: 'out',
                texto: 'Hecho, Marta: mañana a las 9:30. Si esta noche va a peor, escríbeme y aviso al equipo.',
                estado: 'Cita confirmada · agenda actualizada',
                cita: { slot: 'Mañana · 9:30', nota: 'Primera visita · Confirmada' }
            }
        ]
    },

    restaurante: {
        tenant: 'restaurante-demo',
        negocio: 'Casa Duarte',
        iniciales: 'CD',
        marcador: 'Casa Duarte · anoche, en pleno servicio',
        nota: 'Agente real conectado. Pregúntale por la carta, por alérgenos o pídele mesa de verdad.',
        placeholder: 'Pregúntale por la carta o pide mesa…',
        preview: {
            knowledge: 'Carta, alérgenos, horarios y políticas de reserva',
            services: [
                ['Reserva de mesa', 'Sin coste · 2–12 personas'],
                ['Menú de grupos', 'Disponible desde 6 personas'],
                ['Opciones sin gluten', 'Cocina informada'],
                ['Celebraciones', 'Consulta previa']
            ]
        },
        showreel: [
            { kind: 'in', texto: '¿Tenéis mesa para 6 el sábado sobre las 21:30?', estado: 'Conversación entrante · sala llena' },
            { kind: 'out', texto: 'El sábado a las 21:30 me queda mesa de 6 en el salón. ¿Hay alguna alergia o intolerancia en el grupo?', estado: 'El agente consulta el aforo real del turno' },
            { kind: 'in', texto: 'Sí, una es celíaca.' },
            { kind: 'out', texto: 'Lo dejo anotado para cocina. Tenemos arroz de verduras y alcachofas a la brasa sin gluten. ¿A nombre de quién la pongo?', estado: 'Alergia registrada para cocina' },
            { kind: 'in', texto: 'Laura Sanz.', contacto: 'Laura Sanz' },
            {
                kind: 'out',
                texto: 'Reservado: sábado a las 21:30, 6 personas, una comensal celíaca. Si al final sois uno más o uno menos, escríbeme y lo ajusto.',
                estado: 'Reserva confirmada · sala avisada',
                cita: { slot: 'Sábado · 21:30', nota: '6 personas · 1 celíaca' }
            }
        ]
    },

    servicios: {
        tenant: 'servicios-demo',
        negocio: 'Instalaciones Vera',
        iniciales: 'IV',
        marcador: 'Instalaciones Vera · antes de abrir el taller',
        nota: 'Agente real conectado. Pídele presupuesto y fíjate en lo que pregunta antes de pasarte al técnico.',
        placeholder: 'Cuéntale qué necesitas…',
        preview: {
            knowledge: 'Servicios, coberturas, zonas y criterios técnicos',
            services: [
                ['Visita técnica', 'Gratuita · Con cita'],
                ['Cambio de caldera', 'Valoración previa'],
                ['Reparación urgente', 'Prioridad 24 h'],
                ['Mantenimiento', 'Plan anual']
            ]
        },
        showreel: [
            { kind: 'in', texto: 'Buenos días, quería presupuesto para cambiar la caldera.', estado: 'Conversación entrante · 07:58' },
            { kind: 'out', texto: 'Te lo prepara el técnico. Para que salga ajustado, ¿es piso o unifamiliar, y sabes qué caldera tienes ahora?', estado: 'El agente está cualificando la petición' },
            { kind: 'in', texto: 'Piso, una Junkers vieja.' },
            { kind: 'out', texto: 'Bien. ¿Es solo calefacción o también agua caliente?' },
            { kind: 'in', texto: 'Las dos cosas. Soy Javier Ortiz.', contacto: 'Javier Ortiz' },
            {
                kind: 'out',
                texto: 'Gracias, Javier. Con eso ya puede prepararte número: mañana entre las 9 y las 11 te llama Sergio, con tus datos delante. No vas a repetir nada.',
                estado: 'Llamada agendada · técnico con contexto',
                cita: { slot: 'Mañana · 9:00–11:00', nota: 'Llamada del técnico · Sergio' }
            }
        ]
    }
};

// El guion de reclamo (`showreel`) se reproduce solo la primera vez que la
// sección entra en pantalla, para que el visitante vea la demo con vida antes de
// decidir si participa. No toca el backend: coste cero y sin espera. Al terminar,
// el relevo invita a hablar con el agente REAL de ese mismo sector.

function initLiveDemo() {
    const root = document.querySelector('[data-live-demo]');

    if (!root) return;

    const pick = (selector) => root.querySelector(selector);

    const log = pick('[data-demo-log]');
    const form = pick('[data-demo-form]');
    const input = pick('[data-demo-input]');
    const sendBtn = pick('[data-demo-send]');
    const note = pick('[data-demo-note]');
    const typing = pick('[data-demo-typing]');
    const resetBtn = pick('[data-demo-reset]');
    const mirror = pick('[data-demo-mirror]');
    const countEl = pick('[data-demo-count]');
    const statusEl = pick('[data-demo-status]');
    const conversationList = pick('[data-demo-conversation-list]');
    let activeRow = pick('[data-demo-active-row]');
    let rowName = pick('[data-demo-row-name]');
    let rowMeta = pick('[data-demo-row-meta]');
    let rowBadge = pick('[data-demo-row-badge]');
    const detailName = pick('[data-demo-detail-name]');
    const actionEl = pick('[data-demo-action]');
    const appointment = pick('[data-demo-appointment]');
    const appointmentSlot = pick('[data-demo-appointment-slot]');
    const appointmentNote = pick('[data-demo-appointment-note]');
    let avatar = pick('.conversation-row.is-selected .conversation-avatar');
    const takeover = pick('[data-demo-takeover]');
    const takeoverBtn = pick('[data-demo-takeover-btn]');
    const dashboardTabs = [...root.querySelectorAll('[data-dashboard-tab]')];
    const dashboardViews = [...root.querySelectorAll('[data-dashboard-view]')];
    const calendarLive = pick('[data-demo-calendar-live]');
    const calendarSlot = pick('[data-demo-calendar-slot]');
    const serviceNames = [...root.querySelectorAll('[data-preview-service-name]')];
    const serviceMetas = [...root.querySelectorAll('[data-preview-service-meta]')];
    const knowledgePreview = pick('[data-preview-knowledge]');

    if (!log || !form || !input) return;

    // Rótulos del negocio: se reescriben al cambiar de sector, en el chat y en
    // el panel, para que ambos hablen siempre del mismo negocio.
    const botonesSector = [...document.querySelectorAll('[data-demo-sector]')];
    const chatNombre = pick('.chat-header-meta strong');
    const chatAvatar = pick('.chat-avatar');
    const panelNombre = pick('.dashboard-business-name');
    const panelMarca = pick('.dashboard-business-mark');

    let sector = SECTORES.clinica;

    let sesion = '';
    let count = 0;
    let turnos = 0;
    let busy = false;

    function bindActiveRow(row) {
        if (!row) return;
        activeRow = row;
        rowName = row.querySelector('[data-demo-row-name]');
        rowMeta = row.querySelector('[data-demo-row-meta]');
        rowBadge = row.querySelector('[data-demo-row-badge]');
        avatar = row.querySelector('.conversation-avatar');
    }

    function mostrarVista(id) {
        dashboardTabs.forEach((tab) => {
            const activa = tab.dataset.dashboardTab === id;
            tab.classList.toggle('is-active', activa);
            tab.setAttribute('aria-selected', activa ? 'true' : 'false');
            tab.tabIndex = activa ? 0 : -1;
            if (activa && id === 'citas') tab.classList.remove('has-update');
        });

        dashboardViews.forEach((view) => {
            const activa = view.dataset.dashboardView === id;
            view.classList.toggle('is-active', activa);
            view.hidden = !activa;
        });
    }

    dashboardTabs.forEach((tab) => {
        tab.addEventListener('click', () => mostrarVista(tab.dataset.dashboardTab));
    });

    function actualizarPreviewSector() {
        const preview = sector.preview;
        if (!preview) return;

        preview.services.forEach((service, index) => {
            if (serviceNames[index]) serviceNames[index].textContent = service[0];
            if (serviceMetas[index]) serviceMetas[index].textContent = service[1];
        });

        if (knowledgePreview) knowledgePreview.textContent = preview.knowledge;
    }

    function restaurarConversacionShowreel() {
        const generada = conversationList?.querySelector('[data-demo-generated-row]');
        if (generada) generada.remove();

        const showreelRow = conversationList?.querySelector('[data-demo-showreel-row]');
        if (!showreelRow) return;

        conversationList.querySelectorAll('.conversation-row').forEach((row) => {
            row.classList.remove('is-selected');
            row.removeAttribute('data-demo-active-row');
        });
        showreelRow.classList.add('is-selected');
        showreelRow.setAttribute('data-demo-active-row', '');
        bindActiveRow(showreelRow);
        conversationList.scrollTop = 0;
    }

    // El showreel no desaparece al empezar la prueba real: queda como una
    // conversación ya atendida y la del visitante entra encima, como ocurriría
    // en el inbox de verdad.
    function abrirNuevaConversacion() {
        if (!conversationList || !activeRow) return;

        activeRow.classList.remove('is-selected');
        activeRow.removeAttribute('data-demo-active-row');
        rowBadge.textContent = 'Atendida';
        rowBadge.classList.remove('is-hot');
        rowMeta.textContent = appointment.hidden ? 'Conversación resuelta · ahora' : 'Cita gestionada · ahora';

        const row = document.createElement('article');
        row.className = 'conversation-row is-selected is-entering';
        row.setAttribute('data-demo-active-row', '');
        row.setAttribute('data-demo-generated-row', '');
        row.innerHTML = '<span class="conversation-avatar">?</span>' +
            '<div><strong data-demo-row-name>Nuevo contacto</strong>' +
            '<small data-demo-row-meta>Sin mensajes todavía</small></div>' +
            '<em data-demo-row-badge>Agente</em>';

        conversationList.prepend(row);
        bindActiveRow(row);
        conversationList.scrollTop = 0;
        requestAnimationFrame(() => row.classList.remove('is-entering'));
    }

    function stamp() {
        const now = new Date();
        return String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    }

    function mirrorMessage(kind, text) {
        const empty = mirror.querySelector('.detail-message--empty');
        if (empty) empty.remove();

        const line = document.createElement('p');
        line.className = 'detail-message detail-message--' + (kind === 'in' ? 'client' : 'agent');
        line.textContent = text;
        mirror.appendChild(line);

        // El panel real muestra sólo la cola reciente de la conversación.
        while (mirror.children.length > 5) mirror.removeChild(mirror.firstChild);
        mirror.scrollTop = mirror.scrollHeight;

        count += 1;
        countEl.textContent = count === 1 ? '1 mensaje' : count + ' mensajes';
    }

    function appendMessage(kind, text) {
        const wrap = document.createElement('div');
        wrap.className = 'chat-msg chat-msg--' + kind;

        const body = document.createElement('p');
        body.textContent = text;

        const time = document.createElement('time');
        time.textContent = stamp();

        wrap.append(body, time);
        log.appendChild(wrap);
        log.scrollTop = log.scrollHeight;

        mirrorMessage(kind, text);
    }

    function setNote(text, isError) {
        note.textContent = text;
        note.classList.toggle('is-error', !!isError);
    }

    // Lee del agente lo que ha hecho DE VERDAD en esta sesión y lo pinta en el
    // panel. No se deduce del texto de la respuesta: se consulta el estado real.
    async function refrescarPanel() {
        try {
            const url = AGENT_BASE + '/demo/estado?tenant=' + encodeURIComponent(DEMO_AGENT.tenant) +
                '&sesion=' + encodeURIComponent(sesion);
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) return;

            const data = await res.json();
            const cita = (data.citas || [])[0];
            if (!cita) return;

            pintarCita(cita.fecha + ' · ' + cita.hora, (cita.servicio || 'Cita') + ' · Confirmada');
            if (cita.nombre) marcarContacto(cita.nombre);
        } catch (_) { /* el panel simplemente no se actualiza; el chat sigue */ }
    }

    function iniciales(nombre) {
        return nombre.split(' ').map((parte) => parte[0]).join('').slice(0, 2).toUpperCase();
    }

    function marcarContacto(nombre) {
        if (!nombre && rowName.textContent !== 'Nuevo contacto') return;

        const quien = nombre || 'Visitante web';
        rowName.textContent = quien;
        detailName.textContent = quien;
        avatar.textContent = nombre ? iniciales(nombre) : 'VW';
        rowMeta.textContent = 'Demostración · ' + stamp();
    }

    function pintarCita(slot, nota) {
        appointmentSlot.textContent = slot;
        appointmentNote.textContent = nota;

        if (!appointment.hidden) return;
        appointment.hidden = false;
        appointment.classList.remove('is-new');
        void appointment.offsetWidth; // reinicia la animación al reprogramar
        appointment.classList.add('is-new');

        if (calendarLive && calendarSlot) {
            calendarSlot.textContent = slot;
            calendarLive.hidden = false;
            const citasTab = dashboardTabs.find((tab) => tab.dataset.dashboardTab === 'citas');
            if (citasTab && !citasTab.classList.contains('is-active')) citasTab.classList.add('has-update');
        }
    }

    async function enviar(texto) {
        if (busy) return;

        if (turnos >= DEMO_AGENT.maxTurnos) {
            setNote('Has llegado al límite de esta demostración. Reinicia para empezar otra conversación.', false);
            return;
        }

        busy = true;
        turnos += 1;
        input.value = '';
        sendBtn.disabled = true;

        appendMessage('in', texto);
        marcarContacto();

        typing.hidden = false;
        log.scrollTop = log.scrollHeight;
        statusEl.textContent = 'El agente está respondiendo';

        try {
            const res = await fetch(DEMO_AGENT.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenant: DEMO_AGENT.tenant, sesion: sesion, mensaje: texto })
            });

            const data = await res.json();
            typing.hidden = true;

            if (res.status === 429) {
                appendMessage('out', data.respuesta || 'Vas muy rápido, espera un momento y seguimos.');
                statusEl.textContent = 'Límite de ritmo alcanzado';
            } else if (!res.ok || !data.respuesta) {
                throw new Error('respuesta no válida');
            } else {
                appendMessage('out', data.respuesta);
                statusEl.textContent = 'El agente lleva la conversación';
                setNote(sector.nota, false);
                refrescarPanel();
            }
        } catch (err) {
            typing.hidden = true;
            statusEl.textContent = 'Sin conexión con el agente';
            setNote('No he podido conectar con el agente. Vuelve a intentarlo en un momento.', true);
        } finally {
            busy = false;
            sendBtn.disabled = false;
            input.focus();
        }
    }

    function limpiar(etiqueta, preservarCitaEnAgenda) {
        sesion = 'landing-' + Math.random().toString(36).slice(2, 10);
        count = 0;
        turnos = 0;
        busy = false;

        log.innerHTML = '';
        const day = document.createElement('span');
        day.className = 'chat-day';
        day.textContent = etiqueta;
        log.appendChild(day);

        mirror.innerHTML = '';
        const empty = document.createElement('p');
        empty.className = 'detail-message detail-message--empty';
        empty.textContent = 'Aquí aparecerá la conversación en cuanto escribas.';
        mirror.appendChild(empty);

        typing.hidden = true;
        appointment.hidden = true;
        appointment.classList.remove('is-new');
        if (calendarLive && !preservarCitaEnAgenda) calendarLive.hidden = true;
        sendBtn.disabled = false;
        input.value = '';

        countEl.textContent = '0 mensajes';
        statusEl.textContent = 'Esperando el primer mensaje';
        rowName.textContent = 'Nuevo contacto';
        rowMeta.textContent = 'Sin mensajes todavía';
        detailName.textContent = 'Nuevo contacto';
        avatar.textContent = '?';

        rowBadge.textContent = 'Agente';
        rowBadge.classList.remove('is-hot');
        actionEl.textContent = 'Intervenir';
        actionEl.classList.remove('is-hot');

        setNote(sector.nota, false);
    }

    // ── Guion de reclamo ────────────────────────────────────────────────────
    // Al entrar en pantalla, la demo se rellena sola: conversación, panel y cita.
    // No toca el backend (coste cero, sin espera) y sirve para captar la mirada.
    // Al terminar, el relevo invita a hablar con el agente REAL.
    let showreelTimers = [];

    function pararShowreel() {
        showreelTimers.forEach(clearTimeout);
        showreelTimers = [];
    }

    function arrancarShowreel() {
        pararShowreel();
        restaurarConversacionShowreel();
        mostrarVista('inbox');
        root.classList.add('is-showreel');
        input.disabled = true;
        takeover.hidden = true;
        limpiar(sector.marcador);
        setNote('Mira lo que hace por sí solo. En un momento podrás probarlo tú.', false);
        statusEl.textContent = 'Conversación entrante';

        let t = 400;

        sector.showreel.forEach((paso, indice) => {
            if (paso.kind === 'out') {
                showreelTimers.push(setTimeout(() => {
                    typing.hidden = false;
                    log.scrollTop = log.scrollHeight;
                }, t));
                t += 900;
            }

            showreelTimers.push(setTimeout(() => {
                typing.hidden = true;
                appendMessage(paso.kind, paso.texto);
                if (paso.contacto) marcarContacto(paso.contacto);
                if (paso.estado) statusEl.textContent = paso.estado;
                if (paso.cita) pintarCita(paso.cita.slot, paso.cita.nota);
                if (indice === sector.showreel.length - 1) {
                    showreelTimers.push(setTimeout(() => { takeover.hidden = false; }, 900));
                }
            }, t));

            t += paso.kind === 'out' ? 700 : 1100;
        });
    }

    function tomarControl() {
        pararShowreel();
        takeover.hidden = true;
        typing.hidden = true;
        root.classList.remove('is-showreel');
        input.disabled = false;
        mostrarVista('inbox');
        abrirNuevaConversacion();
        setNote(sector.nota, false);
        limpiar('Agente real · escríbele tú', true);
        rowBadge.textContent = 'Agente';
        rowBadge.classList.remove('is-hot');
        actionEl.textContent = 'Intervenir';
        actionEl.classList.remove('is-hot');
        input.focus({ preventScroll: true });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const texto = input.value.trim();
        if (texto) enviar(texto);
    });

    // Cambiar de sector cambia el NEGOCIO con el que se habla, no el decorado:
    // otro tenant real del agente, con su propia personalidad y sus políticas.
    // `limpiar()` (dentro de arrancarShowreel) ya renueva sesión y panel, así que
    // aquí solo se reescriben los rótulos y se relanza.
    function aplicarSector(id) {
        const nuevo = SECTORES[id];
        if (!nuevo || nuevo === sector) return;

        sector = nuevo;
        DEMO_AGENT.tenant = sector.tenant;

        chatNombre.textContent = sector.negocio;
        chatAvatar.textContent = sector.iniciales;
        if (panelNombre) panelNombre.textContent = sector.negocio;
        if (panelMarca) panelMarca.textContent = sector.iniciales;
        input.placeholder = sector.placeholder;
        actualizarPreviewSector();

        botonesSector.forEach((boton) => {
            const activo = boton.dataset.demoSector === id;
            boton.classList.toggle('is-active', activo);
            boton.setAttribute('aria-selected', activo ? 'true' : 'false');
            boton.tabIndex = activo ? 0 : -1;
        });

        arrancarShowreel();
    }

    botonesSector.forEach((boton, i) => {
        boton.addEventListener('click', () => aplicarSector(boton.dataset.demoSector));
        boton.addEventListener('keydown', (evento) => {
            const paso = evento.key === 'ArrowRight' ? 1 : evento.key === 'ArrowLeft' ? -1 : 0;
            if (!paso) return;
            evento.preventDefault();
            const destino = botonesSector[(i + paso + botonesSector.length) % botonesSector.length];
            aplicarSector(destino.dataset.demoSector);
            destino.focus();
        });
    });

    takeoverBtn.addEventListener('click', tomarControl);
    resetBtn.addEventListener('click', arrancarShowreel);

    // Arranca el reclamo la primera vez que la sección entra en pantalla.
    actualizarPreviewSector();
    mostrarVista('inbox');
    limpiar('Clínica Cobalto');
    input.disabled = true;
    root.classList.add('is-showreel');

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            observador.disconnect();
            arrancarShowreel();
        });
    }, { threshold: 0.35 });

    observador.observe(root);
}

function initSectorDemo() {
    const root = document.querySelector('[data-sector-demo]');

    if (!root) return;

    const tabs = Array.from(root.querySelectorAll('[data-sector-tab]'));
    const panels = Array.from(root.querySelectorAll('[data-sector-panel]'));

    if (tabs.length !== panels.length || !tabs.length) return;

    function activate(index, moveFocus) {
        tabs.forEach((tab, i) => {
            const isActive = i === index;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.tabIndex = isActive ? 0 : -1;
        });

        panels.forEach((panel, i) => {
            const isActive = i === index;
            panel.classList.toggle('is-active', isActive);
            panel.hidden = !isActive;

            if (!isActive) return;

            const timeline = chatTimelines.get(panel.querySelector('[data-chat-demo]'));
            if (timeline) timeline.restart();
        });

        if (moveFocus) tabs[index].focus();
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => activate(i, false));

        tab.addEventListener('keydown', (event) => {
            const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
            if (!step) return;

            event.preventDefault();
            activate((i + step + tabs.length) % tabs.length, true);
        });
    });
}


// 6. Mobile menu (hamburger toggle + overlay)
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('[data-mobile-close]');

function openMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    mobileMenu.removeAttribute('inert');
    document.body.classList.add('menu-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (typeof lenis !== 'undefined' && lenis.stop) lenis.stop();
}

function closeMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    document.body.classList.remove('menu-open');
    mobileMenu.setAttribute('inert', '');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (typeof lenis !== 'undefined' && lenis.start) lenis.start();
}

if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = document.body.classList.contains('menu-open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close on link click (allow native scroll to fire after closing)
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
            closeMobileMenu();
        }
    });

    // If user resizes back to desktop while menu is open, reset state
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && document.body.classList.contains('menu-open')) {
            closeMobileMenu();
        }
    });
}

// 7. FAQ: keep one answer open so the section remains compact and scannable.
const faqItems = Array.from(document.querySelectorAll('.faq-item'));

faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
        if (!item.open) return;
        faqItems.forEach((otherItem) => {
            if (otherItem !== item) otherItem.open = false;
        });
    });
});
