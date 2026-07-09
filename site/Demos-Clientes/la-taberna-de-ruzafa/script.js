/**
 * TEMPLATE: Restaurante Premium · Studio32 · Digital Systems
 *
 * Funcionalidades incluidas:
 *  - Lenis smooth scroll
 *  - Preloader
 *  - Custom cursor (desktop)
 *  - Navbar: scroll effect + hamburger toggle
 *  - Intersection Observer (animaciones reveal)
 *  - Smooth scroll para anchors internos
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

    // ── PRELOADER ────────────────────────────────────────────
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);
            }, 1200);
        });
    }

    // ── CUSTOM CURSOR (desktop) ──────────────────────────────
    const cursor = document.querySelector('.cursor');
    if (cursor && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top  = e.clientY + 'px';
        });

        document.querySelectorAll('.hover-target, a, button, input, select').forEach(el => {
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

    // ── NAVBAR: HAMBURGER TOGGLE ─────────────────────────────
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks     = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            hamburgerBtn.classList.toggle('active', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Cerrar al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
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
    // El form envía a un backend/endpoint externo.
    // Conectar con la solución del cliente (Netlify Forms, Formspree, etc.)
    // añadiendo action="" y method="POST" en el <form> del HTML.
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Conecta con el asistente de reservas (widget del Studio32 Agent).
            const campos = bookingForm.querySelectorAll('input');
            const [nombre, telefono, fecha, invitados] = Array.from(campos).map(c => c.value.trim());
            let fechaTxt = fecha;
            if (fecha) {
                const d = new Date(fecha + 'T12:00:00');
                if (!isNaN(d)) fechaTxt = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
            }
            const partes = ['Hola, quiero reservar mesa'];
            if (invitados) partes.push(`para ${invitados}`);
            if (fechaTxt) partes.push(`el ${fechaTxt}`);
            if (nombre) partes.push(`a nombre de ${nombre}`);
            if (telefono) partes.push(`(tel. ${telefono})`);
            if (window.S32W) {
                window.S32W.send(partes.join(' ') + '.');
            } else {
                // El widget no está cargado (agente apagado): aviso discreto.
                console.warn('Asistente de reservas no disponible.');
                alert('El chat de reservas no está disponible en este momento. Llámanos o vuelve a intentarlo en unos minutos.');
            }
        });
    }

    /* ══════════════════════════════════════════════════════════
       OPCIONAL: BILINGÜE EN/ES
       Para activar:
       1. Descomenta este bloque completo.
       2. Añade <button class="lang-switch" id="lang-toggle">EN</button>
          en el nav del HTML.
       3. Rellena las claves de traducción con el copy del cliente.
    ══════════════════════════════════════════════════════════ */
    /*
    const translations = {
        es: {
            nav_story:        "Nuestra Historia",
            nav_menu:         "Menú",
            nav_reservations: "Reservas",
            hero_l1:          "{{TAGLINE_L1_ES}}",
            hero_l2:          "{{TAGLINE_L2_ES}}",
            hero_subtitle:    "{{TAGLINE_SUBTITULO_ES}}",
            hero_cta:         "Reservar Mesa",
            // ... añadir resto de claves
        },
        en: {
            nav_story:        "Our Story",
            nav_menu:         "Menu",
            nav_reservations: "Reservations",
            hero_l1:          "{{TAGLINE_L1_EN}}",
            hero_l2:          "{{TAGLINE_L2_EN}}",
            hero_subtitle:    "{{TAGLINE_SUBTITULO_EN}}",
            hero_cta:         "Book a Table",
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
