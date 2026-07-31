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
    const rowName = pick('[data-demo-row-name]');
    const rowMeta = pick('[data-demo-row-meta]');
    const rowBadge = pick('[data-demo-row-badge]');
    const detailName = pick('[data-demo-detail-name]');
    const actionEl = pick('[data-demo-action]');
    const appointment = pick('[data-demo-appointment]');
    const avatar = pick('.conversation-row.is-selected .conversation-avatar');

    if (!log || !form || !input) return;

    const NOTA_INICIAL = note.textContent;

    let sesion = '';
    let count = 0;
    let turnos = 0;
    let busy = false;

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

    function marcarContacto() {
        if (rowName.textContent !== 'Nuevo contacto') return;

        rowName.textContent = 'Visitante web';
        detailName.textContent = 'Visitante web';
        avatar.textContent = 'VW';
        rowMeta.textContent = 'Demostración · ' + stamp();
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
        resetBtn.hidden = false;

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
                setNote(NOTA_INICIAL, false);
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

    function reset() {
        sesion = 'landing-' + Math.random().toString(36).slice(2, 10);
        count = 0;
        turnos = 0;
        busy = false;

        log.innerHTML = '';
        const day = document.createElement('span');
        day.className = 'chat-day';
        day.textContent = 'Agente real · escríbele tú';
        log.appendChild(day);

        mirror.innerHTML = '';
        const empty = document.createElement('p');
        empty.className = 'detail-message detail-message--empty';
        empty.textContent = 'Aquí aparecerá la conversación en cuanto escribas.';
        mirror.appendChild(empty);

        typing.hidden = true;
        appointment.hidden = true;
        appointment.classList.remove('is-new');
        resetBtn.hidden = true;
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

        setNote(NOTA_INICIAL, false);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const texto = input.value.trim();
        if (texto) enviar(texto);
    });

    resetBtn.addEventListener('click', reset);
    reset();
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
