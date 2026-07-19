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
function initChatDemo() {
    const mockup = document.querySelector('[data-chat-demo]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!mockup || reduceMotion) return;

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

    ScrollTrigger.create({
        trigger: mockup,
        start: 'top 82%',
        once: true,
        onEnter: () => chatTimeline.play()
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
