const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(process.env.MEASUREMENT_SOURCE || 'site/measurement-consent.js', 'utf8');
function setup({ saved, host = 'www.studio32.es', blocked = false } = {}) {
    const nodes = [], tags = [], cookies = [], data = new Map();
    if (saved) data.set('studio32.measurement.v1', JSON.stringify(saved));
    class Element {
        constructor(tag) { this.tagName = tag; this.children = []; this.listeners = {}; nodes.push(this); }
        appendChild(node) { this.children.push(node); return node; }
        append(...items) { items.forEach(item => this.appendChild(item)); }
        setAttribute() {}
        addEventListener(name, callback) { this.listeners[name] = callback; }
        focus() {}
        querySelector() { return this.children.find(node => node.tagName === 'button'); }
    }
    const body = new Element('body'), footer = new Element('footer');
    const doc = {
        currentScript: { src: 'https://' + host + '/measurement-consent.js' },
        referrer: 'https://chatgpt.com/c/private-conversation?email=private@example.com',
        title: 'Studio32', body,
        head: { appendChild: node => tags.push(node) },
        createElement: tag => new Element(tag),
        querySelector: selector => selector === 'footer' ? footer : selector.includes('canonical') ? { href: 'https://www.studio32.es/recursos/?email=private@example.com#secret' } : null
    };
    Object.defineProperty(doc, 'cookie', { set: value => cookies.push(value) });
    let reloads = 0;
    const win = { addEventListener() {} };
    const storage = { getItem(key) { if (blocked) throw Error('blocked'); return data.get(key) || null; }, setItem(key, value) { if (blocked) throw Error('blocked'); data.set(key, value); } };
    vm.runInNewContext(source, { document: doc, window: win, localStorage: storage, location: { hostname: host, reload: () => reloads++ }, URL, Date, Set });
    return { win, tags, nodes, data, cookies, reloads: () => reloads,
        click(label) { const button = nodes.find(node => node.textContent === label); assert.ok(button, label); button.listeners.click(); } };
}
const initial = setup();
assert.equal(initial.tags.length, 0, 'sin etiqueta antes de elegir');
assert.equal(initial.win.gtag, undefined);
initial.click('Rechazar opcionales');
assert.equal(initial.tags.length, 0, 'rechazo sin pings ni etiqueta');
assert.equal(initial.win.Studio32Analytics.consent, 'denied');
initial.click('Configurar cookies');
initial.click('Aceptar analíticas');
assert.equal(initial.tags.length, 1);
assert.match(initial.tags[0].src, /G-ZKX0QLRZ47$/);
const commands = initial.win.dataLayer.map(args => Array.from(args));
assert.equal(commands[0][0], 'consent');
assert.equal(commands[0][2].analytics_storage, 'denied');
assert.equal(commands[1][2].analytics_storage, 'granted');
const view = commands.find(args => args[1] === 'page_view');
assert.equal(view[2].page_location, 'https://www.studio32.es/recursos/');
assert.equal(view[2].page_referrer, 'https://chatgpt.com/');
initial.win.Studio32Analytics.send('calculator_complete', { page_type: 'calculator', sector: 'general', email: 'private@example.com', revenue: 12000 });
assert.equal(JSON.stringify(initial.win.dataLayer).includes('private@example.com'), false);
assert.equal(JSON.stringify(initial.win.dataLayer).includes('12000'), false);
const count = initial.win.dataLayer.length;
initial.win.Studio32Analytics.send('unknown_event', {});
assert.equal(initial.win.dataLayer.length, count);
initial.click('Configurar cookies'); initial.click('Rechazar opcionales');
initial.win.Studio32Analytics.send('demo_start', {});
assert.equal(initial.win.dataLayer.length, count, 'sin eventos tras retirar');
assert.equal(initial.reloads(), 1);
assert.equal(initial.win['ga-disable-G-ZKX0QLRZ47'], true);
assert.ok(initial.cookies.some(cookie => cookie.startsWith('_ga_ZKX0QLRZ47=;')));
assert.equal(setup({ saved: { choice: 'granted', expires: Date.now() + 10000 } }).tags.length, 1);
assert.equal(setup({ saved: { choice: 'granted', expires: Date.now() - 10000 } }).tags.length, 0);
const preview = setup({ host: 'preview.studio32-web.pages.dev', saved: { choice: 'granted', expires: Date.now() + 10000 } });
assert.equal(preview.tags.length, 0, 'preview no envía medición');
preview.win.Studio32Analytics.send('demo_start', {});
const blocked = setup({ blocked: true }); blocked.click('Aceptar analíticas');
assert.equal(blocked.tags.length, 1, 'almacenamiento bloqueado no rompe la elección');
console.log('Consentimiento: espera, rechazo, aceptación, retirada, caducidad, preview, URL/PII y almacenamiento bloqueado verificados.');
