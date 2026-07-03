document.addEventListener('DOMContentLoaded', () => {

    // --- Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- Preloader ---
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }, 1500);
    });

    // --- Translations ---
    const translations = {
        es: {
            nav_home: "Inicio",
            nav_story: "Nuestra Historia",
            nav_menu: "Menú",
            nav_reservations: "Reservas",

            hero_title_1: "La Reserva",
            hero_title_2: "Imposible",
            hero_subtitle: "Donde la alta gastronomía se convierte en un culto privado.",
            hero_cta: "Solicitar Reserva",
            scroll_indicator: "Scroll",

            story_eyebrow: "La Filosofía",
            story_title_1: "8 Mesas.",
            story_title_2: "Inolvidables",
            story_p1: "No servimos cenas. Orquestamos experiencias sensoriales irrepetibles. L'Obscur ha redefinido la alta cocina, operando con una lista de espera de 3 meses para nuestras exclusivas mesas en el corazón de la ciudad.",
            story_p2: "Nuestro chef cura semanalmente un menú degustación a ciegas. Sin cartas estáticas. Solo ingredientes subastados en lonja horas antes del servicio.",
            story_cta: "Descubrir el Origen",

            ph_interior: "Interior",
            ph_atmosphere: "Atmósfera 01",

            menu_eyebrow: "Materia Prima Extrema",
            menu_title: "La Colección",

            ph_dish01: "Plato 01",
            dish1_title: "El Corte Obsidiana",
            dish1_desc: "Wagyu A5 importado directamente de Kobe, curado 60 días en cámara propia. Una rareza absoluta.",

            ph_cocktail: "Coctel 01",
            dish2_title: "Elixir de Medianoche",
            dish2_desc: "Whisky Añejo, Romero Ahumado, Esencia de la Noche.",

            ph_private: "Privado",
            ph_ambiance: "Ambiente 02",
            dish3_title: "La Atmósfera",
            dish3_desc: "Cabinas privadas, perfección acústica, servicio inigualable.",
            dish3_price: "Priceless",

            menu_cta: "Ver Menú Completo",

            quote_text: "En un mar de restaurantes clónicos, conseguir mesa en L'Obscur es el verdadero símbolo de estatus.",
            quote_author: "— Crítica Gastronómica Independiente",

            reservations_title: "Acceso Privado",
            reservations_subtitle: "Actualmente operamos con lista de espera. Solo se abren mesas con 30 días de antelación el día 1 de cada mes a las 10:00 AM.",

            placeholder_name: "Nombre Completo",
            placeholder_email: "Email Preferente",

            guests_2: "2 Comensales (Barra)",
            guests_4: "4 Comensales (Mesa)",
            guests_private: "Cabina Privada Elite",

            reservations_btn: "Solicitar Reserva"
        },
        en: {
            nav_home: "Home",
            nav_story: "Our Story",
            nav_menu: "The Menu",
            nav_reservations: "Reservations",

            hero_title_1: "Experience",
            hero_title_2: "The Divine",
            hero_subtitle: "Where culinary art meets the night.",
            hero_cta: "Book Your Table",
            scroll_indicator: "Scroll",

            story_eyebrow: "The Philosophy",
            story_title_1: "A Symphony of",
            story_title_2: "Taste",
            story_p1: "Nestled in the heart of the city, yet miles away from the ordinary. L'Obscur is not just a restaurant; it is a sanctuary for the senses. We believe in the purity of flavor, the elegance of silence, and the beauty of the night.",
            story_p2: "Our chefs curate a nightly tasting menu that challenges expectations and delights the palate, using only the rarest ingredients sourced globally.",
            story_cta: "View Philosophy",

            ph_interior: "Interior",
            ph_atmosphere: "Atmosphere 01",

            menu_eyebrow: "Curated Excellence",
            menu_title: "The Signature Collection",

            ph_dish01: "Dish 01",
            dish1_title: "The Obsidian Cut",
            dish1_desc: "A5 Wagyu, Truffle infused reduction, Gold leaf.",

            ph_cocktail: "Cocktail 01",
            dish2_title: "Midnight Elixir",
            dish2_desc: "Aged Whiskey, Smoked Rosemary, Essence of Night.",

            ph_private: "Private",
            ph_ambiance: "Ambiance 02",
            dish3_title: "The Atmosphere",
            dish3_desc: "Private booths, acoustic perfection, unparalleled service.",
            dish3_price: "Priceless",

            menu_cta: "View Full Menu",

            quote_text: "Dining at L'Obscur isn't just a meal. It's a memory etched in gold.",
            quote_author: "— The Culinary Times",

            reservations_title: "Secure Your Seat",
            reservations_subtitle: "Limited availability. Reservations required 2 weeks in advance.",

            placeholder_name: "Name",
            placeholder_phone: "Phone",
            placeholder_email: "Email",

            guests_2: "2 Guests",
            guests_4: "4 Guests",
            guests_private: "Private Room",

            reservations_btn: "Request Reservation"
        }
    };

    let currentLang = 'es';

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key]; // innerHTML allows spans if needed
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.setAttribute('placeholder', translations[lang][key]);
            }
        });

        const toggleBtn = document.getElementById('lang-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = lang === 'es' ? 'EN' : 'ES';
        }
    }

    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentLang = currentLang === 'es' ? 'en' : 'es';
            updateLanguage(currentLang);
        });
    }

    // --- Custom Cursor (Minimal) ---
    const cursor = document.querySelector('.cursor');
    // Removed follower reference

    const hoverTargets = document.querySelectorAll('.hover-target, a, button, input, select'); // Changed to include all interactive elements automatically

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }


    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNav  = document.getElementById('mobile-nav');
    const mobileClose = document.querySelectorAll('[data-mobile-close]');
    const langMobile  = document.getElementById('lang-toggle-mobile');

    function openMenu() {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Cerrar menú');
        mobileNav.classList.add('open');
        mobileNav.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        lenis.stop();
    }

    function closeMenu() {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Abrir menú');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        lenis.start();
    }

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
        });

        mobileClose.forEach(link => link.addEventListener('click', closeMenu));

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && document.body.classList.contains('menu-open')) closeMenu();
        });
    }

    // Sincronizar lang-toggle del menú móvil
    if (langMobile) {
        langMobile.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            updateLanguage(currentLang);
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-text');
    revealElements.forEach(el => observer.observe(el));

    // --- Smooth Scroll for Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                lenis.scrollTo(target);
            }
        });
    });
});
