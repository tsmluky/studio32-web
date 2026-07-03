/**
 * TEMPLATE: Food Brand · Studio32 · Digital Systems
 *
 * Funcionalidades incluidas:
 *  - Lenis smooth scroll
 *  - Custom cursor (desktop)
 *  - Navbar: scroll effect + mobile menu overlay
 *  - Intersection Observer (animaciones reveal)
 *  - Swiper: carrusel de reseñas
 *  - GET DIRECTIONS: abre Google Maps con la dirección configurada
 *  - Smooth scroll para anchors internos
 *
 * CONFIGURAR antes de entregar:
 *  - MAPS_URL → URL de Google Maps del local del cliente
 *
 * OPCIONAL — bilingüe EN/ES:
 *  Descomenta el bloque "BILINGÜE" al final del archivo y añade
 *  el botón <button id="lang-toggle"> en el nav del HTML.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── CONFIGURACIÓN ────────────────────────────────────────
    // PERSONALIZAR: sustituir por la URL real de Google Maps del cliente
    const MAPS_URL = '{{MAPS_URL}}';

    // ── LENIS SMOOTH SCROLL ──────────────────────────────────
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ── CUSTOM CURSOR (desktop) ──────────────────────────────
    const cursor = document.querySelector('.cursor');
    if (cursor && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top  = e.clientY + 'px';
        });

        document.querySelectorAll('.hover-target, a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }

    // ── NAVBAR: SCROLL EFFECT ────────────────────────────────
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ── MOBILE MENU OVERLAY ──────────────────────────────────
    const mobileBtn     = document.querySelector('.mobile-menu-btn');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks   = document.querySelectorAll('.mobile-link');

    if (mobileBtn && mobileOverlay) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = mobileOverlay.classList.toggle('active');
            mobileBtn.classList.toggle('active', isOpen);
            mobileBtn.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileOverlay.classList.remove('active');
                mobileBtn.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ── INTERSECTION OBSERVER (reveal animations) ─────────────
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-text').forEach(el => observer.observe(el));

    // ── SWIPER: RESEÑAS ──────────────────────────────────────
    if (document.querySelector('.reviews-swiper')) {
        new Swiper('.reviews-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            grabCursor: true,
            loop: true,
            autoplay: {
                delay: 10000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            },
        });
    }

    // ── GET DIRECTIONS ───────────────────────────────────────
    const btnDirections = document.getElementById('btn-directions');
    if (btnDirections) {
        btnDirections.addEventListener('click', () => {
            window.open(MAPS_URL, '_blank', 'noopener');
        });
    }

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

    /* ══════════════════════════════════════════════════════════
       OPCIONAL: BILINGÜE EN/ES
       Para activar:
       1. Descomenta este bloque completo.
       2. Añade <button class="lang-switch hover-target" id="lang-toggle">EN</button>
          en el nav del HTML.
       3. Rellena las claves de traducción con el copy del cliente.
    ══════════════════════════════════════════════════════════ */
    /*
    const translations = {
        es: {
            nav_concepto:  "El Concepto",
            nav_menu:      "Menú",
            nav_ubicacion: "Ubicación",
            hero_l1:       "{{TAGLINE_L1_ES}}",
            hero_l2:       "{{TAGLINE_L2_ES}}",
            marquee_text:  "{{MARQUEE_TEXTO_ES}} // ",
            // ... añadir resto de claves
        },
        en: {
            nav_concepto:  "The Concept",
            nav_menu:      "Menu",
            nav_ubicacion: "Location",
            hero_l1:       "{{TAGLINE_L1_EN}}",
            hero_l2:       "{{TAGLINE_L2_EN}}",
            marquee_text:  "{{MARQUEE_TEXTO_EN}} // ",
            // ... añadir resto de claves
        }
    };

    let currentLang = 'es';

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang]?.[key]) el.innerHTML = translations[lang][key];
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
