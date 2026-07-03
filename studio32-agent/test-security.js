'use strict';
// Tests de seguridad multi-tenant (sin red):
//   - aislamiento de datos entre agentes
//   - tokens de dueño únicos por agente y no intercambiables
//   - herramientas de dueño bloqueadas para clientes
//   - identificación de dueño por teléfono EXACTA (no subcadena)
//   npm run test:sec
process.env.LLM_PROVIDER = 'mock';
const fs = require('fs'), path = require('path');
const { cargarTenant } = require('./src/tenants');
const { bookings } = require('./src/store');
const cb = require('./src/tools/createBooking');
const ga = require('./src/tools/getAgenda');

let pass = 0, fail = 0;
const check = (n, c, e) => { (c ? pass++ : fail++); console.log(`${c ? 'OK ' : 'XX '} ${n}${e && !c ? '  -> ' + e : ''}`); };
const fmt = d => { const p = n => String(n).padStart(2, '0'); return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`; };
const prox = () => { const d = new Date(); do { d.setDate(d.getDate() + 1); } while (![1, 2, 3, 4, 5].includes(d.getDay())); return d; };

// Réplica EXACTA de las comprobaciones que usa el runtime:
const esOwnerToken = (tenant, token) => { const o = tenant.business.owner || {}; return !!(token && o.token && token === o.token); };
const esOwnerTel = (ownerWhats, from) => { const on = (ownerWhats || '').replace(/\D/g, ''); const fn = (from || '').replace(/\D/g, ''); return !!(on && fn === on); };

(async () => {
  const s = cargarTenant('studio32'), b = cargarTenant('barberia_demo');

  console.log('\n== TOKENS DE DUEÑO ==');
  check('cada agente tiene su token', !!s.business.owner.token && !!b.business.owner.token);
  check('tokens distintos por agente', s.business.owner.token !== b.business.owner.token);
  check('token largo (aleatorio fuerte >=32)', s.business.owner.token.length >= 32);
  check('token de barberia NO da dueño en studio32', esOwnerToken(s, b.business.owner.token) === false);
  check('token correcto SÍ da dueño', esOwnerToken(s, s.business.owner.token) === true);
  check('token vacío/inventado NO da dueño', esOwnerToken(s, 'xxxx') === false);

  console.log('\n== IDENTIFICACIÓN POR TELÉFONO (EXACTA) ==');
  check('número exacto SÍ es dueño', esOwnerTel('whatsapp:+34657695181', '34657695181') === true);
  check('número superset NO es dueño (anti-subcadena)', esOwnerTel('whatsapp:+34657695181', '346576951810') === false);
  check('otro número NO es dueño', esOwnerTel('whatsapp:+34657695181', '34611222333') === false);

  console.log('\n== AISLAMIENTO DE DATOS ENTRE AGENTES ==');
  fs.mkdirSync('data/barberia_demo', { recursive: true }); fs.mkdirSync('data/studio32', { recursive: true });
  fs.writeFileSync('data/barberia_demo/bookings.json', '[]'); fs.writeFileSync('data/studio32/bookings.json', '[]');
  const f = fmt(prox());
  await cb.run({ nombre: 'Cliente Barber', contacto: '600111222', servicio: 'Corte de pelo', fecha: f, hora: '10:00', profesional: 'Jose' },
               { tenant: b, tenantId: 'barberia_demo', telefono: 'whatsapp:+34600111222', esOwner: false });
  const nb = (await bookings.listar('barberia_demo')).length;
  const ns = (await bookings.listar('studio32')).length;
  check('la reserva queda SOLO en su agente', nb === 1 && ns === 0, `barberia=${nb} studio32=${ns}`);

  console.log('\n== HERRAMIENTAS DE DUEÑO ==');
  const cli = await ga.run({ rango: 'semana' }, { tenant: b, tenantId: 'barberia_demo', telefono: 'x', esOwner: false });
  check('cliente NO puede listar la agenda', cli.startsWith('ERROR'));
  const own = await ga.run({ rango: 'semana' }, { tenant: b, tenantId: 'barberia_demo', telefono: 'x', esOwner: true });
  check('dueño SÍ puede (devuelve JSON)', (() => { try { return typeof JSON.parse(own).total === 'number'; } catch (e) { return false; } })());

  fs.writeFileSync('data/barberia_demo/bookings.json', '[]');
  console.log(`\n===== SEGURIDAD: ${pass} OK, ${fail} fallos =====`);
  process.exit(fail ? 1 : 0);
})();
