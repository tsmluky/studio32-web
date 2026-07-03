/**
 * TEMPLATE: Arquitectura / Reformas Premium · Studio32 · Digital Systems
 *
 * Funcionalidades incluidas:
 *  - Lenis smooth scroll (integrado con GSAP)
 *  - GSAP + ScrollTrigger (animaciones reveal-up)
 *  - Navbar: scroll effect (clase .scrolled) + hamburger toggle
 *  - Before & After sliders interactivos (mouse + touch)
 *  - Smooth scroll para anchors internos
 *  - Form: validación mínima + stub de envío
 *
 * OPCIONAL — bilingüe EN/ES:
 *  Descomenta el bloque "BILINGÜE" al final del archivo y añade
 *  el botón <button id="lang-toggle"> en el nav del HTML.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── LENIS SMOOTH SCROLL (integrado con GSAP) ─────────────
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    gsap.registerPlugin(ScrollTrigger);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // ── NAVBAR: SCROLL EFFECT ────────────────────────────────
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ── NAVBAR: HAMBURGER TOGGLE ─────────────────────────────
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks  = document.getElementById('nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active', isOpen);
            mobileBtn.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ── GSAP: REVEAL-UP ANIMATIONS ───────────────────────────
    document.querySelectorAll('.reveal-up').forEach(el => {
        gsap.fromTo(el,
            { y: 40, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                },
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
            }
        );
    });

    // ── BEFORE & AFTER SLIDERS ────────────────────────────────
    document.querySelectorAll('.ba-slider').forEach(slider => {
        const imgBefore      = slider.querySelector('.ba-image-before');
        const imgBeforeAsset = imgBefore.querySelector('img');
        const handle         = slider.querySelector('.ba-handle');
        let isDragging       = false;

        const updateImageWidth = () => {
            imgBeforeAsset.style.width = slider.offsetWidth + 'px';
        };

        window.addEventListener('resize', updateImageWidth);
        updateImageWidth();

        const moveHandle = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let posX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
            const pct = (posX / rect.width) * 100;
            handle.style.left      = pct + '%';
            imgBefore.style.width  = pct + '%';
        };

        // Mouse events
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            moveHandle(e.clientX);
        });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('mousemove', (e) => {
            if (isDragging) moveHandle(e.clientX);
        });

        // Touch events
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            moveHandle(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchend', () => { isDragging = false; });

        window.addEventListener('touchmove', (e) => {
            if (isDragging) moveHandle(e.touches[0].clientX);
        }, { passive: false });
    });

    // ── SMOOTH SCROLL PARA ANCHORS INTERNOS ──────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target);
            }
        });
    });

    // ── FORM: validación mínima ──────────────────────────────
    // Conectar con el servicio del cliente (Netlify Forms, Formspree, etc.)
    // añadiendo action="" y method="POST" en el <form> del HTML.
    const leadGenForm = document.getElementById('lead-gen-form');
    if (leadGenForm) {
        leadGenForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // TODO: conectar con el servicio de formularios del cliente
            console.log('Formulario de tasación enviado — conectar con backend');
        });
    }

    /* ══════════════════════════════════════════════════════════
       OPCIONAL: BILINGÜE EN/ES
       Para activar:
       1. Descomenta este bloque completo.
       2. Añade <button class="btn-nav hover-target" id="lang-toggle">EN</button>
          en el nav del HTML.
       3. Rellena las claves de traducción con el copy del cliente.
    ══════════════════════════════════════════════════════════ */
    /*
    const translations = {
        es: {
            nav_proyectos:  "Proyectos",
            nav_metodo:     "Metodología",
            nav_servicios:  "Servicios",
            nav_cta:        "Empezar Proyecto",
            hero_eyebrow:   "{{EYEBROW_HERO_ES}}",
            hero_titulo:    "{{HERO_TITULO_ES}}",
            hero_titulo_em: "{{HERO_TITULO_EM_ES}}",
            hero_desc:      "{{HERO_DESCRIPCION_ES}}",
            hero_cta:       "{{HERO_CTA_ES}}",
            // ... añadir resto de claves
        },
        en: {
            nav_proyectos:  "Projects",
            nav_metodo:     "Methodology",
            nav_servicios:  "Services",
            nav_cta:        "Start Project",
            hero_eyebrow:   "{{EYEBROW_HERO_EN}}",
            hero_titulo:    "{{HERO_TITULO_EN}}",
            hero_titulo_em: "{{HERO_TITULO_EM_EN}}",
            hero_desc:      "{{HERO_DESCRIPCION_EN}}",
            hero_cta:       "{{HERO_CTA_EN}}",
            // ... añadir resto de claves
        }
    };

    let currentLang = 'es';

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang]?.[key]) el.textContent = translations[lang][key];
        });
        const btn = document.getElementById('lang-toggle');
        if (btn) btn.textContent = lang === 'es' ? 'EN' : 'ES';
    }

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            updateLanguage(currentLang);
        });
    }
    */

});
