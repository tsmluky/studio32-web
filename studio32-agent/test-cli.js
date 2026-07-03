'use strict';

// CLI de pruebas. Dos modos:
//   npm run test:agent   -> smoke test sin red (no necesita OPENAI_API_KEY ni npm install)
//   npm run chat         -> conversación interactiva real (necesita OPENAI_API_KEY)
//
// En modo interactivo escribe "salir" para terminar.

const readline = require('readline');
const { cargarTenant } = require('./src/tenants');
const { responder } = require('./src/orchestrator');
const tools = require('./src/tools');
const llm = require('./src/llm');
const checkAvailability = require('./src/tools/checkAvailability');

const TENANT = process.env.DEFAULT_TENANT || 'barberia_demo';

async function smoke() {
    console.log('--- Studio32 Agent · smoke test (sin red) ---\n');
    const t = cargarTenant(TENANT);
    console.log(`[OK] Tenant "${t.id}" cargado: ${t.business.nombre}`);
    console.log(`[OK] Servicios cargados: ${(t.services.servicios || []).length}`);

    const names = tools.schemas().map(s => s.function.name);
    console.log(`[OK] Tools registradas: ${names.join(', ')}`);

    // Motor de disponibilidad (determinista, sin LLM): próxima fecha laborable.
    const diasLab = (t.business.horario || {}).dias_laborables || [1, 2, 3, 4, 5];
    const d = new Date();
    do { d.setDate(d.getDate() + 1); } while (!diasLab.includes(d.getDay()));
    const f = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    const svc = (t.services.servicios[0] || {}).nombre;
    const r = JSON.parse(await checkAvailability.run({ fecha: f, servicio: svc }, { tenant: t, tenantId: t.id }));
    const huecos = Object.values(r.huecos || {}).flat();
    console.log(`[OK] checkAvailability "${svc}" el ${f}: ${huecos.length} huecos (ej: ${huecos.slice(0, 3).join(', ') || '—'})`);

    console.log(`\nLLM: ${llm.disponible() ? 'configurado (' + llm.MODEL + ')' : 'SIN OPENAI_API_KEY — la conversación real no funcionará hasta ponerla en .env'}`);
    console.log('\n✓ Smoke test OK\n');
    process.exit(0);
}

async function interactivo() {
    if (!llm.disponible()) {
        console.log('Falta OPENAI_API_KEY en .env.');
        console.log('Para comprobar el motor sin red usa: npm run test:agent');
        process.exit(1);
    }
    const tenant = cargarTenant(TENANT);
    const sesion = `cli-${Date.now()}`;
    const ctx = { tenant, tenantId: TENANT, telefono: sesion, twilioClient: null };

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log(`--- Studio32 Agent · CLI (tenant: ${TENANT} · modelo: ${llm.MODEL}) ---`);
    console.log('Escribe como si fueras un cliente ("salir" para terminar).\n');

    const ask = () => rl.question('Tú: ', async (entrada) => {
        const txt = entrada.trim();
        if (!txt) return ask();
        if (txt.toLowerCase() === 'salir') return rl.close();
        try {
            const resp = await responder(ctx, txt);
            console.log(`\nBot: ${resp}\n`);
        } catch (err) {
            console.error('\n[Error]', err.message, '\n');
        }
        ask();
    });
    ask();
}

if (process.argv.includes('--smoke')) smoke();
else interactivo();
