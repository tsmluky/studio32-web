/* Acceso por teclado al chat propio; no cambia su diseño ni envía mensajes. */
(function () {
    'use strict';
    let trigger = null;
    document.addEventListener('click', function (event) {
        const button = event.target.closest('.navbar a.nav-btn[href="#contact"]');
        if (button) trigger = button;
    }, true);

    function attach() {
        const panel = document.querySelector('.s32w-panel');
        if (!panel) return false;
        const input = panel.querySelector('input');
        const close = panel.querySelector('.s32w-x');
        const history = panel.querySelector('.s32w-msgs');
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Habla con Studio32');
        // Chat no modal: el visitante puede seguir usando el resto de la web.
        panel.setAttribute('aria-modal', 'false');
        if (input) input.setAttribute('aria-label', 'Escribe tu consulta a Studio32');
        if (history) {
            history.setAttribute('role', 'log');
            history.setAttribute('aria-label', 'Conversación con Studio32');
            history.setAttribute('aria-live', 'polite');
        }
        if (close) {
            close.addEventListener('click', function () {
                if (!panel.classList.contains('open') && trigger && trigger.isConnected) {
                    trigger.focus({ preventScroll: true });
                }
            });
            document.addEventListener('keydown', function (event) {
                if (event.key !== 'Escape' || !panel.classList.contains('open')) return;
                event.preventDefault();
                close.click();
            });
        }
        return true;
    }
    if (attach()) return;
    const observer = new MutationObserver(function () {
        if (attach()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true });
})();
