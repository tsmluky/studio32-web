document.addEventListener('DOMContentLoaded', () => {

    // --- Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard easing
        direction: 'vertical',
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const hoverTargets = document.querySelectorAll('.hover-target, a, button');

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

    // --- Simple Reveals ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });

    // --- Swiper Init ---
    const swiper = new Swiper('.reviews-swiper', {
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
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });

    // ---// Mobile Menu Logic
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Translations
    const translations = {
        en: {
            nav_lab: "The Lab",
            nav_menu: "Menu",
            nav_bunker: "Bunker",
            btn_order: "ORDER NOW",

            hero_line1: "NOT JUST",
            hero_line2: "A BURGER",
            marquee_text: "PREMIUM CUTS // 45 DAY DRY AGED // SMASHED TO PERFECTION // NO SHORTCUTS // ",

            label_craft: "// THE CRAFT",
            lab_title: "EDIBLE <br> ENGINEERING",
            lab_desc: "We don't cook. We engineer flavor. Every patty is a result of obsessive testing, precise temperature control, and a bit of madness. Welcome to the lab.",
            spec_blend_label: "BLEND:",
            spec_blend_val: "BRISKET + SHORT RIB",
            spec_fat_label: "FAT RATIO:",
            spec_tech_label: "TECHNIQUE:",
            spec_tech_val: "SMASH & SEAR",

            label_menu: "// THE LINEUP",
            menu_title: "SYSTEM <br> CONFIGURATIONS",
            item1_title: "THE PROTOTYPE",
            item1_desc: "Single Patty, American Cheese, House Pickles, Prime Sauce. No distractions.",
            item2_title: "HEAVY METAL",
            item2_desc: "Double Smashed, Smoked Bacon, Caravane Onion Jam, BBQ dust.",
            item3_title: "THE REACTOR",
            item3_desc: "Triple Patty, Spicy Jalapeño Relish, Pepper Jack, Chipotle Injector.",

            label_proof: "// SOCIAL PROOF",
            reviews_title: "THE DATA",
            review_1: "\"The smash technique here is surgical. Best burger in the district, hands down.\"",
            review_2: "\"No nonsense. Just incredible meat and perfect ratio. The industrial vibe is unmatched.\"",
            review_3: "\"Finally a place that understands that a burger doesn't need fireworks to be bomb.\"",
            review_4: "\"Efficiency and flavor. The 'Heavy Metal' burger changed my life.\"",

            label_bunker: "// THE BUNKER",
            bunker_title: "SECTOR 4 <br> HEADQUARTERS",
            bunker_sub: "OPERATIONS CENTER",
            bunker_addr_label: "COORDINATES:",
            bunker_hours_label: "OPERATING HOURS:",
            btn_map: "GET DIRECTIONS"
        },
        es: {
            nav_lab: "El Laboratorio",
            nav_menu: "Menú",
            nav_bunker: "Bunker",
            btn_order: "PEDIR AHORA",

            hero_line1: "NO ES SOLO",
            hero_line2: "UNA HAMBURGUESA",
            marquee_text: "CORTES PREMIUM // MADURACIÓN 45 DÍAS // SMASH PERFECTO // SIN ATAJOS // ",

            label_craft: "// LA ARTESANÍA",
            lab_title: "INGENIERÍA <br> COMESTIBLE",
            lab_desc: "No cocinamos. Diseñamos sabor. Cada hamburguesa es el resultado de pruebas obsesivas, control preciso de temperatura y un poco de locura. Bienvenido al laboratorio.",
            spec_blend_label: "MEZCLA:",
            spec_blend_val: "BRISKET + COSTILLA",
            spec_fat_label: "RATIO GRASA:",
            spec_tech_label: "TÉCNICA:",
            spec_tech_val: "APLASTAR Y SELLAR",

            label_menu: "// LA ALINEACIÓN",
            menu_title: "CONFIGURACIONES <br> DEL SISTEMA",
            item1_title: "EL PROTOTIPO",
            item1_desc: "Patty simple, Queso Americano, Encurtidos Caseros, Salsa Prime. Sin distracciones.",
            item2_title: "HEAVY METAL",
            item2_desc: "Doble Smash, Bacon Ahumado, Mermelada de Cebolla, Polvo BBQ.",
            item3_title: "EL REACTOR",
            item3_desc: "Triple Patty, Relish de Jalapeño Picante, Queso Pepper Jack, Inyector Chipotle.",

            label_proof: "// PRUEBA SOCIAL",
            reviews_title: "LOS DATOS",
            review_1: "\"La técnica de smash aquí es quirúrgica. La mejor hamburguesa del distrito, sin duda.\"",
            review_2: "\"Sin tonterías. Solo carne increíble y ratio perfecto. El ambiente industrial es inigualable.\"",
            review_3: "\"Por fin un sitio que entiende que una hamburguesa no necesita fuegos artificiales para ser la bomba.\"",
            review_4: "\"Eficiencia y sabor. La hamburguesa 'Heavy Metal' me cambió la vida.\"",

            label_bunker: "// EL BÚNKER",
            bunker_title: "SECTOR 4 <br> CUARTEL GENERAL",
            bunker_sub: "CENTRO DE OPERACIONES",
            bunker_addr_label: "COORDENADAS:",
            bunker_hours_label: "HORARIO OPERATIVO:",
            btn_map: "COMO LLEGAR"
        }
    };

    let currentLang = 'en'; // Default to English for specific vibe, or 'es' if preferred

    // Check initial textContent to match

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        const btn = document.getElementById('lang-toggle');
        if (btn) btn.textContent = lang === 'en' ? 'ES' : 'EN';
    }

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'es' : 'en';
            updateLanguage(currentLang);
        });
    }

});
