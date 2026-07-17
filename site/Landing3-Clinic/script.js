document.documentElement.classList.add('js');

const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('.primary-nav');

function closeNavigation() {
    if (!navToggle || !primaryNav) return;
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
}

if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
        const willOpen = !primaryNav.classList.contains('is-open');
        primaryNav.classList.toggle('is-open', willOpen);
        navToggle.setAttribute('aria-expanded', String(willOpen));
        navToggle.setAttribute('aria-label', willOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNavigation);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeNavigation();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 820) closeNavigation();
    });
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
}

const bookingDemo = document.querySelector('[data-booking-demo]');

if (bookingDemo) {
    const bookingStatus = bookingDemo.querySelector('[data-booking-status]');
    const bookingAction = bookingDemo.querySelector('[data-booking-action]');
    const selections = {};

    bookingDemo.querySelectorAll('[data-choice-group]').forEach((group) => {
        const groupName = group.dataset.choiceGroup;
        const buttons = group.querySelectorAll('[data-choice]');

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                buttons.forEach((candidate) => candidate.setAttribute('aria-pressed', 'false'));
                button.setAttribute('aria-pressed', 'true');
                selections[groupName] = button.dataset.choice;
                bookingStatus.classList.remove('is-ready');
                bookingStatus.textContent = 'Selección guardada. Completa ambos bloques.';
            });
        });
    });

    bookingAction.addEventListener('click', () => {
        if (!selections.motivo || !selections.horario) {
            bookingStatus.classList.remove('is-ready');
            bookingStatus.textContent = 'Selecciona una opción en cada bloque para preparar la solicitud.';
            return;
        }

        bookingStatus.classList.add('is-ready');
        bookingStatus.textContent = `${selections.motivo} · preferencia de ${selections.horario.toLowerCase()}. Solicitud de demostración preparada.`;
        bookingAction.textContent = 'Solicitud preparada';
    });
}
