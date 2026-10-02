/* Sin tracker, almacenamiento, cola, cookies ni llamadas de red.
   Un integrador puede definir Studio32Analytics = { consent: 'granted', send }.
   No reproduce eventos anteriores ni envía datos de consultas o formularios. */
(function () {
    'use strict';
    const allowed = new Set(['calculator_view', 'calculator_start', 'calculator_input_change', 'calculator_complete', 'calculator_result_view', 'calculator_cta_click', 'demo_start', 'demo_cta_click', 'whatsapp_click', 'budget_request_click']);
    const path = location.pathname.replace(/index\.html$/, '');
    const pageType = document.body.dataset.pageType || (path === '/' ? 'home' : 'commercial');
    const sectors = { 'agente-whatsapp-clinicas-dentales': 'dental', 'agente-whatsapp-restaurantes': 'restaurant', 'agente-whatsapp-centros-esteticos': 'aesthetics', 'agente-whatsapp-servicios-locales': 'local_services' };
    // Solo enumeraciones; no URL completa, query, referrer ni texto de mensajes.
    function track(name, extras = {}) {
        if (!allowed.has(name)) return;
        const params = { page_type: pageType, sector: sectors[path.split('/')[1]] || 'general' };
        if (['demo', 'whatsapp', 'budget', 'calculator_demo'].includes(extras.cta_type)) params.cta_type = extras.cta_type;
        document.dispatchEvent(new CustomEvent('studio32:discovery', { detail: { name, params } }));
        const adapter = window.Studio32Analytics;
        if (adapter?.consent === 'granted' && typeof adapter.send === 'function') {
            try { adapter.send(name, params); } catch (_) { /* La medición no interrumpe la página. */ }
        }
    }
    window.Studio32Discovery = { track };
    let demoStarted = false;
    document.addEventListener('submit', function (event) {
        if (!event.target.matches('[data-demo-form]') || demoStarted) return;
        const input = event.target.querySelector('input, textarea');
        if (!input || !input.value.trim()) return;
        demoStarted = true;
        track('demo_start');
    }, true);
    document.addEventListener('click', function (event) {
        const anchor = event.target.closest('a');
        if (!anchor) return;
        const url = new URL(anchor.href, location.href);
        if (anchor.dataset.cta === 'calculator_demo') track('calculator_cta_click', { cta_type: 'calculator_demo' });
        if (url.origin === location.origin && url.hash === '#control') track('demo_cta_click', { cta_type: 'demo' });
        if (url.hostname === 'wa.me') {
            track('whatsapp_click', { cta_type: 'whatsapp' });
            if ((url.searchParams.get('text') || '').toLowerCase().includes('presupuesto')) track('budget_request_click', { cta_type: 'budget' });
        }
    });
}());
