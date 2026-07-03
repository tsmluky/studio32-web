'use strict';
// Diagnóstico del motor LLM: hace UNA llamada real y dice exactamente qué pasa.
//   npm run test:llm
const llm = require('./src/llm');

(async () => {
    console.log(`Proveedor: ${llm.PROVIDER} | modelo: ${llm.MODEL} | disponible: ${llm.disponible()}`);
    if (llm.PROVIDER === 'mock') {
        console.log('Estás en modo simulación (no hay API key). No se llama a ningún proveedor.');
        return;
    }
    try {
        const m = await llm.chat({ system: 'Responde solo con: OK', messages: [{ role: 'user', content: 'di OK' }] });
        console.log('\n✓ El LLM respondió correctamente:', JSON.stringify(m.content));
        console.log('  La conexión funciona. Si el widget seguía fallando, reinicia npm run dev.');
    } catch (e) {
        console.error('\n✗ La llamada al LLM ha fallado:');
        console.error('  status :', e.status);
        console.error('  code   :', e.code || (e.error && e.error.code));
        console.error('  message:', e.message);
        if (e.status === 401) console.error('  → CAUSA: la API key no es válida o fue revocada. Genera una nueva en platform.openai.com.');
        else if (e.status === 429) console.error('  → CAUSA: sin saldo/cuota. Añade crédito en platform.openai.com → Billing.');
        else if (e.status === 404) console.error('  → CAUSA: el modelo no está disponible para tu cuenta. Prueba OPENAI_MODEL=gpt-4o-mini.');
        else if (/ENOTFOUND|ECONNREFUSED|fetch failed/i.test(e.message || '')) console.error('  → CAUSA: sin conexión a internet o firewall bloqueando api.openai.com.');
        else console.error('  → Revisa el mensaje de arriba.');
    }
})();
