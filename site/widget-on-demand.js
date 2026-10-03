/* El chat propio se carga al pedirlo; el contacto funciona si el proveedor falla. */
(function () {
    'use strict';
    let loading = false;
    let failed = false;

    function fallback(button) {
        button.removeAttribute('aria-busy');
        window.location.hash = 'contact';
        const section = document.getElementById('contact');
        if (section) {
            section.setAttribute('tabindex', '-1');
            section.focus({ preventScroll: true });
        }
    }

    document.addEventListener('click', function (event) {
        const button = event.target.closest('.navbar a.nav-btn[href="#contact"]');
        if (!button) return;
        if (window.S32W && typeof window.S32W.open === 'function') {
            event.preventDefault();
            window.S32W.open();
            return;
        }
        if (failed) return; // El enlace original conserva su navegación.
        event.preventDefault();
        if (loading) return;
        loading = true;
        button.setAttribute('aria-busy', 'true');
        const script = document.createElement('script');
        script.src = 'https://web-production-d722c.up.railway.app/widget.js';
        script.dataset.tenant = 'studio32';
        script.dataset.title = 'Habla con Studio32';
        script.dataset.accent = '#8a6421';
        script.async = true;
        let settled = false;
        const timer = setTimeout(function () { finish(false); }, 8000);

        function finish(loaded) {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            loading = false;
            button.removeAttribute('aria-busy');
            if (loaded && window.S32W && typeof window.S32W.open === 'function') {
                window.S32W.open();
            } else {
                failed = true;
                fallback(button);
            }
        }
        script.onload = function () { finish(true); };
        script.onerror = function () { finish(false); };
        document.body.appendChild(script);
    });
})();
