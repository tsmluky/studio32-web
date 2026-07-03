gsap.registerPlugin(ScrollTrigger);

// 1. Lenis Smooth Scroll Setup
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

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
        onComplete: initHeroAnimations // Llama a la anim principal
    });


// 3. Hero Animations (Runs after preloader)
function initHeroAnimations() {
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

    initScrollAnimations();
}

// 4. Scroll Reveal Animations (SplitType)
function initScrollAnimations() {
    // Romper textos en lineas para animarlos
    const splitTexts = document.querySelectorAll('.split-lines');

    splitTexts.forEach(text => {
        const split = new SplitType(text, { types: 'lines' });

        // Esconder overflow pero dar margen para los descendentes (g, p, etc)
        split.lines.forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.paddingBottom = '3vw';
            wrapper.style.marginBottom = '-3vw';
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
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
            ease: "power4.out"
        });
    });
}


// 5. Magnetic Hover Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const magnetics = document.querySelectorAll('.magnetic');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Loop for smooth cursor following
gsap.ticker.add(() => {
    // Cursor dot follows instantly
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

    // Follower ring follows with delay
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
});

// Magnetic effect when hovering over elements
magnetics.forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
        const bound = this.getBoundingClientRect();
        const strength = this.dataset.strength || 20;

        // Calculate distance from center of element
        const x = ((e.clientX - bound.left) / bound.width - 0.5) * strength;
        const y = ((e.clientY - bound.top) / bound.height - 0.5) * strength;

        gsap.to(this, {
            x: x,
            y: y,
            duration: 1,
            ease: "power4.out"
        });

        cursor.classList.add('active');
        follower.classList.add('active');
    });

    btn.addEventListener('mouseleave', function () {
        gsap.to(this, {
            x: 0,
            y: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)"
        });

        cursor.classList.remove('active');
        follower.classList.remove('active');
    });
});


// 6. Mobile menu (hamburger toggle + overlay)
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('[data-mobile-close]');

function openMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    document.body.classList.add('menu-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (typeof lenis !== 'undefined' && lenis.stop) lenis.stop();
}

function closeMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    document.body.classList.remove('menu-open');
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
