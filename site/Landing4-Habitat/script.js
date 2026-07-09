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

// Integrate with GSAP
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// 2. Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 3. Simple Reveal Up Animations
const revealElements = document.querySelectorAll('.reveal-up');

revealElements.forEach(el => {
    gsap.fromTo(el, {
        y: 40,
        opacity: 0
    }, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    });
});

// 4. Before & After Slider Logic
const sliders = document.querySelectorAll('.ba-slider');

sliders.forEach(slider => {
    const imgBefore = slider.querySelector('.ba-image-before');
    const imgBeforeAsset = imgBefore.querySelector('img');
    const handle = slider.querySelector('.ba-handle');
    let isDragging = false;

    // Maintain correct image width regardless of container crop
    const updateImageWidth = () => {
        const sliderWidth = slider.offsetWidth;
        imgBeforeAsset.style.width = sliderWidth + 'px';
    };

    window.addEventListener('resize', updateImageWidth);
    updateImageWidth(); // Initial call

    const moveHandle = (clientX) => {
        const rect = slider.getBoundingClientRect();
        let posX = clientX - rect.left;

        // Boundaries
        if (posX < 0) posX = 0;
        if (posX > rect.width) posX = rect.width;

        const percentage = (posX / rect.width) * 100;

        // Update DOM
        handle.style.left = `${percentage}%`;
        imgBefore.style.width = `${percentage}%`;
    };

    // Mouse Events
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        moveHandle(e.clientX);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveHandle(e.clientX);
    });

    // Touch Events
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        moveHandle(e.touches[0].clientX);
    });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        // prevent default scrolling when sliding horizontal
        // e.preventDefault(); 
        moveHandle(e.touches[0].clientX);
    }, { passive: false }); // passive false needed if we want to prevent default
});

// 6. Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

function closeHabitatNav() {
    navLinks.classList.remove('active');
    mobileBtn.classList.remove('active');
    mobileBtn.setAttribute('aria-expanded', 'false');
    mobileBtn.setAttribute('aria-label', 'Abrir menú');
}

if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('active');
        navLinks.classList.toggle('active');
        mobileBtn.classList.toggle('active');
        mobileBtn.setAttribute('aria-expanded', String(!isOpen));
        mobileBtn.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeHabitatNav);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) closeHabitatNav();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeHabitatNav();
    });
}
