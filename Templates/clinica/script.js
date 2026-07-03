/**
 * TEMPLATE: Clínica Premium · Studio32 · Digital Systems
 *
 * Funcionalidades incluidas:
 *  - Lenis smooth scroll
 *  - Navbar: scroll effect (clase .scrolled) + hamburger toggle
 *  - Intersection Observer (animaciones reveal)
 *  - Swiper: carrusel de casos de éxito
 *  - Smooth scroll para anchors internos
 *  - Form: validación mínima + stub de envío
 *
 * OPCIONAL — bilingüe EN/ES:
 *  Descomenta el bloque "BILINGÜE" al final del archivo y añade
 *  el botón <button id="lang-toggle"> en el nav del HTML.
 */

document.addEventListener('DOMContentLoaded', () => {

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

    // ── NAVBAR: SCROLL EFFECT ────────────────────────────────
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ── NAVBAR: HAMBURGER TOGGLE ─────────────────────────────
    const mobileBtn  = document.getElementById('mobile-menu-btn');
    const navLinks   = document.getElementById('nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active', isOpen);
            mobileBtn.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Cerrar al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
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

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ── SWIPER: CASOS DE ÉXITO ───────────────────────────────
    if (document.querySelector('.cases-swiper')) {
        new Swiper('.cases-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: { slidesPerView: 2 },
            },
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
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });

    // ── FORM: validación mínima ──────────────────────────────
    // Conectar con el servicio del cliente (Netlify Forms, Formspree, etc.)
    // añadiendo action="" y method="POST" en el <form> del HTML.
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // TODO: conectar con el servicio de formularios del cliente
            console.log('Formulario de cita enviado — conectar con backend');
        });
    }

    /* ══════════════════════════════════════════════════════════
       OPCIONAL: BILINGÜE EN/ES
       Para activar:
       1. Descomenta este bloque completo.
       2. Añade <button class="lang-switch hover-scale" id="lang-toggle">EN</button>
          en el nav del HTML.
       3. Rellena las claves de traducción con el copy del cliente.
    ══════════════════════════════════════════════════════════ */
    /*
    const translations = {
        es: {
            nav_tratamientos: "Tratamientos",
            nav_equipo:       "Equipo",
            nav_casos:        "Casos de Éxito",
            nav_cta:          "{{HERO_CTA_ES}}",
            hero_tag:         "{{ESPECIALIDAD_EYEBROW_ES}}",
            hero_titulo:      "{{HERO_TITULO_ES}}",
            hero_acento:      "{{HERO_ACENTO_ES}}",
            hero_desc:        "{{HERO_DESCRIPCION_ES}}",
            // ... añadir resto de claves
        },
        en: {
            nav_tratamientos: "Treatments",
            nav_equipo:       "Team",
            nav_casos:        "Success Cases",
            nav_cta:          "{{HERO_CTA_EN}}",
            hero_tag:         "{{ESPECIALIDAD_EYEBROW_EN}}",
            hero_titulo:      "{{HERO_TITULO_EN}}",
            hero_acento:      "{{HERO_ACENTO_EN}}",
            hero_desc:        "{{HERO_DESCRIPCION_EN}}",
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
