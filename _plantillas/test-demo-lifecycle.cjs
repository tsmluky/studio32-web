const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('site/script.js', 'utf8');
const demo = source.slice(source.indexOf('function initLiveDemo()'), source.indexOf('function initSectorDemo()'));
const fixtures = source.slice(source.indexOf('const DEMO_AGENT ='), source.indexOf('function plantillaDemo()'));
const flush = () => new Promise(resolve => setImmediate(resolve));

function setup() {
    class Node {
        constructor() {
            this.children = []; this.listeners = {}; this.dataset = {}; this.textContent = ''; this.value = '';
            this.classList = { add() {}, remove() {}, toggle() {} };
        }
        set innerHTML(_) { this.children = []; }
        addEventListener(type, fn) { this.listeners[type] = fn; }
        appendChild(node) { this.children.push(node); node.parent = this; return node; }
        append(...nodes) { nodes.forEach(node => this.appendChild(node)); }
        remove() { this.parent.children = this.parent.children.filter(node => node !== this); }
        querySelector() { return null; }
        setAttribute() {}
        focus(options) { this.focusOptions = options; }
    }
    const nodes = new Map();
    const get = selector => { if (!nodes.has(selector)) nodes.set(selector, new Node()); return nodes.get(selector); };
    const root = new Node(); root.children = [new Node()]; root.querySelector = get;
    const buttons = ['clinica', 'restaurante'].map(id => { const node = new Node(); node.dataset.demoSector = id; return node; });
    const timers = new Map(); let timerID = 0;
    const requests = [];
    const document = { querySelector: () => root, querySelectorAll: () => buttons, createElement: () => new Node() };
    vm.runInNewContext(fixtures + demo + '\ninitLiveDemo();', {
        document, AGENT_BASE: 'https://example.invalid', AbortController, Date, Math,
        setTimeout(fn, delay) { timers.set(++timerID, { fn, delay }); return timerID; },
        clearTimeout(id) { timers.delete(id); },
        IntersectionObserver: class { observe() {} disconnect() {} },
        fetch(url, options) { return new Promise((resolve, reject) => { requests.push({ url, options, resolve, reject }); }); }
    });
    const submit = text => { get('[data-demo-input]').value = text; get('[data-demo-form]').listeners.submit({ preventDefault() {} }); };
    const control = () => get('[data-demo-takeover-btn]').listeners.click();
    control();
    return { get, buttons, timers, requests, submit, control };
}
const ok = data => ({ ok: true, status: 200, json: async () => data });
async function run() {
    const reset = setup(); reset.submit('Consulta de prueba');
    const old = reset.requests[0];
    reset.get('[data-demo-reset]').listeners.click();
    assert.equal(old.options.signal.aborted, true, 'reiniciar aborta petición anterior');
    old.resolve(ok({ respuesta: 'RESPUESTA ANTIGUA' })); await flush();
    assert.equal(reset.get('[data-demo-log]').children.some(n => n.children.some(c => c.textContent === 'RESPUESTA ANTIGUA')), false);
    assert.equal(reset.get('[data-demo-input]').focusOptions.preventScroll, true);

    const switchSector = setup(); switchSector.submit('Consulta clínica');
    switchSector.buttons[1].listeners.click(); switchSector.control();
    assert.match(switchSector.get('.live-takeover-text').textContent, /carta, alérgenos/);
    assert.match(switchSector.get('.live-takeover-text').textContent, /datos ficticios/);
    switchSector.submit('Consulta restaurante');
    assert.equal(JSON.parse(switchSector.requests[0].options.body).tenant === JSON.parse(switchSector.requests[1].options.body).tenant, false);
    switchSector.requests[0].reject(Error('petición antigua')); await flush();
    assert.equal(switchSector.get('[data-demo-send]').disabled, true, 'petición antigua no desbloquea petición nueva');
    switchSector.requests[1].resolve(ok({ respuesta: 'Respuesta restaurante' })); await flush();
    assert.equal(switchSector.get('[data-demo-send]').disabled, false);
    const panel = switchSector.requests[2];
    switchSector.get('[data-demo-reset]').listeners.click();
    assert.equal(panel.options.signal.aborted, true, 'reinicio también cancela panel');
    panel.resolve(ok({ citas: [{ fecha: '2099-01-01', hora: '10:00', nombre: 'ANTIGUO' }] })); await flush();
    assert.equal(switchSector.get('[data-demo-row-name]').textContent, 'Nuevo contacto');
    assert.equal(switchSector.get('[data-demo-appointment]').hidden, true);

    const timeout = setup(); timeout.submit('Consulta lenta');
    [...timeout.timers.values()].find(t => t.delay === 45000).fn();
    assert.equal(timeout.requests[0].options.signal.aborted, true);
    timeout.requests[0].reject(Error('AbortError')); await flush();
    assert.equal(timeout.get('[data-demo-send]').disabled, false);
    assert.equal(timeout.get('[data-demo-typing]').hidden, true);
    assert.match(timeout.get('[data-demo-note]').textContent, /podría haberse procesado/);
    assert.equal(timeout.requests.length, 1, 'no hay reenvío automático');

    const hero = source.slice(source.indexOf('let heroAnimationsStarted'), source.indexOf('// 4. Scroll Reveal'));
    for (const reduced of [true, false]) {
        let animations = 0, live = 0;
        const timeline = { from() { animations++; return this; } };
        vm.runInNewContext(hero + '\ninitHeroAnimations(); initHeroAnimations();', {
            TIENE_GSAP: true, window: { matchMedia: () => ({ matches: reduced }) }, gsap: { timeline: () => timeline },
            initChatDemo() {}, initSectorDemo() {}, initLiveDemo() { live++; }, initScrollAnimations() {}
        });
        assert.equal(animations, reduced ? 0 : 3, 'movimiento reducido omite entrada del hero');
        assert.equal(live, 1, 'demo inicia una sola vez en ambos modos');
        let smooth = 0;
        vm.runInNewContext(source.slice(0, source.indexOf('// 2. Preloader Animation')), {
            document: { addEventListener() {} }, window: { matchMedia: () => ({ matches: reduced }) },
            fetch: () => Promise.resolve(), ScrollTrigger: {},
            gsap: { registerPlugin() {}, ticker: { add() {}, lagSmoothing() {} } },
            Lenis: class { constructor() { smooth++; } on() {} }
        });
        assert.equal(smooth, reduced ? 0 : 1, 'movimiento reducido conserva scroll nativo');
    }
    console.log('Demo: reinicio, cambio de sector, respuestas tardías, panel, timeout sin reenvío y movimiento reducido verificados sin backend.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
