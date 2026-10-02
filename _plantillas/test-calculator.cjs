const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { calculate } = require('../site/consultas-calculator.js');
const sample = { enquiries: 200, outside: 40, unresolved: 50, conversion: 20, value: 100 };
assert.deepEqual(calculate(sample), { risk: 40, clients: 8, monthly: 800, annual: 9600, low: 7680, high: 11520 });
for (const field of Object.keys(sample)) {
    assert.equal(calculate({ ...sample, [field]: 0 }).monthly, 0);
    for (const invalid of [-1, NaN, Infinity, '', undefined]) assert.throws(() => calculate({ ...sample, [field]: invalid }), RangeError);
}
assert.throws(() => calculate({ ...sample, outside: 101 }), RangeError);
assert.throws(() => calculate({ ...sample, enquiries: 2.5 }), RangeError);
const upper = calculate({ enquiries: 1000000, outside: 100, unresolved: 100, conversion: 100, value: 1000000 });
assert.equal(upper.risk, 1000000); assert.equal(upper.high, upper.annual); assert.ok(Number.isFinite(upper.high));
assert.equal(calculate({ ...sample, unresolved: 5 }).low, 0);
// Leaked user fields cannot enter events, and no default network/storage adapter exists.
const emitted = []; const sent = [];
const context = { document: { body: { dataset: { pageType: 'tool' } }, addEventListener() {}, dispatchEvent(e) { emitted.push(e); } },
    location: { pathname: '/herramientas/calculadora-consultas-perdidas/', href: 'https://www.studio32.es/?email=private', origin: 'https://www.studio32.es' },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } }, URL,
    window: {}, fetch() { throw Error('Unexpected network'); }, localStorage: { setItem() { throw Error('Unexpected storage'); } } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../site/discovery-events.js'), 'utf8'), context);
context.window.Studio32Analytics = { consent: 'denied', send: (...args) => sent.push(args) };
context.window.Studio32Discovery.track('calculator_complete', { email: 'private', value: 100, cta_type: 'malicious' });
assert.equal(sent.length, 0);
context.window.Studio32Analytics.consent = 'granted';
context.window.Studio32Discovery.track('calculator_complete', { email: 'private', value: 100 });
assert.equal(sent.length, 1); assert.equal(JSON.stringify(sent).includes('private'), false); assert.equal(JSON.stringify(sent).includes('value'), false);
context.window.Studio32Discovery.track('invented_event');
assert.equal(sent.length, 1); assert.equal(emitted.length, 2);
console.log('Calculadora: fórmula, límites, cero, solapamiento y rango validados. Eventos: consentimiento y ausencia de PII validados.');
