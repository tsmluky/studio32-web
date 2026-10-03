const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('site/widget-on-demand.js', 'utf8');
function setup() {
    const scripts = [], timers = new Map(); let handler, focused = false, busy = false, opens = 0;
    const window = { location: { hash: '' } };
    const button = { setAttribute() { busy = true; }, removeAttribute() { busy = false; } };
    const document = {
        addEventListener(_, fn) { handler = fn; },
        createElement() { return { dataset: {} }; },
        body: { appendChild(script) { scripts.push(script); } },
        getElementById() { return { setAttribute() {}, focus() { focused = true; } }; }
    };
    vm.runInNewContext(source, { document, window,
        setTimeout(fn) { timers.set(1, fn); return 1; }, clearTimeout(id) { timers.delete(id); } });
    return { scripts, timers, window, get focused() { return focused; }, get busy() { return busy; },
        get opens() { return opens; }, ready() { window.S32W = { open() { opens++; } }; },
        click(matches = true) { let prevented = false; handler({ target: { closest() { return matches ? button : null; } }, preventDefault() { prevented = true; } }); return prevented; } };
}
const success = setup();
assert.equal(success.scripts.length, 0, 'no descarga ni almacenamiento del widget al entrar');
assert.equal(success.click(false), false, 'no intercepta otros enlaces');
success.click(); success.click();
assert.equal(success.scripts.length, 1, 'clics repetidos no duplican el widget');
assert.equal(success.busy, true);
assert.equal(success.scripts[0].dataset.tenant, 'studio32');
success.ready(); success.scripts[0].onload();
assert.equal(success.opens, 1); assert.equal(success.busy, false);
assert.equal(success.timers.size, 0);
const timeout = setup(); timeout.click(); timeout.timers.get(1)();
assert.equal(timeout.window.location.hash, 'contact'); assert.equal(timeout.focused, true);
timeout.ready(); timeout.scripts[0].onload();
assert.equal(timeout.opens, 0, 'respuesta tardía no abre un chat inesperado');
timeout.click(); assert.equal(timeout.opens, 1, 'un clic nuevo sí puede abrir un widget disponible');
const failure = setup(); failure.click(); failure.scripts[0].onerror();
assert.equal(failure.click(), false, 'tras fallo funciona el enlace original sin reintentos automáticos');
assert.equal(failure.scripts.length, 1);
const broken = setup(); broken.click(); broken.scripts[0].onload();
assert.equal(broken.window.location.hash, 'contact', 'script cargado sin API vuelve al contacto');
console.log('Widget: sin carga inicial, instancia única, apertura, error, timeout y respuesta tardía verificados sin backend.');
