const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('site/contact-accessibility.js','utf8');
function setup(delayed) {
    const attributes = {}, handlers = {}, closeHandlers = [];
    let available = !delayed, opened = false, observed, disconnected = false, focused = false;
    const trigger = { isConnected: true, focus(options) { focused = options.preventScroll; } };
    const close = { addEventListener(_,fn) { closeHandlers.push(fn); }, click() { opened = false; closeHandlers.forEach(fn=>fn()); } };
    const panel = { setAttribute(k,v) { attributes['panel.'+k] = v; }, classList: { contains() { return opened; } },
        querySelector(s) { return s === '.s32w-x' ? close : { setAttribute(k,v) { attributes[s+'.'+k] = v; } }; } };
    vm.runInNewContext(source, { document: { body: {},
        querySelector() { return available ? panel : null; }, addEventListener(k,fn) { handlers[k] = fn; } },
        MutationObserver: class { constructor(fn) { observed=fn; } observe() {} disconnect() { disconnected=true; } } });
    return { attributes, handlers, trigger, get focused() { return focused; }, get disconnected() { return disconnected; },
        open() { opened=true; handlers.click({ target: { closest() { return trigger; } } }); },
        insert() { available=true; observed(); }, close, get closed() { return !opened; } };
}
for (const delayed of [false,true]) {
    const ui=setup(delayed); if(delayed) { ui.insert(); assert.equal(ui.disconnected,true); }
    assert.equal(ui.attributes['input.aria-label'],'Escribe tu consulta a Studio32');
    assert.equal(ui.attributes['panel.role'],'dialog');
    assert.equal(ui.attributes['panel.aria-modal'],'false');
    assert.equal(ui.attributes['.s32w-msgs.role'],'log');
    let prevented=false;
    ui.handlers.keydown({key:'Escape',preventDefault(){prevented=true;}});
    assert.equal(prevented,false,'Escape sin chat abierto no intercepta el resto de la web');
    ui.open(); ui.handlers.keydown({key:'Escape',preventDefault(){prevented=true;}});
    assert.equal(ui.closed,true); assert.equal(prevented,true); assert.equal(ui.focused,true);
    ui.open(); ui.close.click(); assert.equal(ui.focused,true,'botón Cerrar devuelve el foco');
}
console.log('Contacto: etiqueta, diálogo no modal, historial, Escape y retorno de foco; carga inmediata/tardía sin backend.');
