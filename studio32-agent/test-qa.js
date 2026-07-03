'use strict';
// Batería de regresión (sin red): casos límite de disponibilidad, reserva,
// cancelación, reprogramación, agenda del dueño, aforo restaurante, onboarding
// y guardrails.
//   npm run test:qa
// Usa el tenant barberia_demo como banco de pruebas (resetea sus datos).
process.env.LLM_PROVIDER = 'mock';

const fs = require('fs'), path = require('path');
const { cargarTenant } = require('./src/tenants');
const ca = require('./src/tools/checkAvailability');
const cb = require('./src/tools/createBooking');
const cx = require('./src/tools/cancelBooking');
const rs = require('./src/tools/rescheduleBooking');
const ga = require('./src/tools/getAgenda');
const gm = require('./src/tools/getMenu');
const tools = require('./src/tools');
const rem = require('./src/reminders');
const ob = require('./src/onboarding');
const safety = require('./src/safety');

let pass = 0, fail = 0;
function check(n, cond, extra) { (cond ? pass++ : fail++); console.log(`${cond ? 'OK ' : 'XX '} ${n}${extra && !cond ? '  -> ' + extra : ''}`); }
const fmt = d => { const p = n => String(n).padStart(2, '0'); return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`; };
const prox = base => { const d = new Date(base); do { d.setDate(d.getDate() + 1); } while (![1, 2, 3, 4, 5].includes(d.getDay())); return d; };

(async () => {
  const T = 'barberia_demo';
  const t = cargarTenant(T);
  const dataDir = path.join(__dirname, 'data', T);
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'bookings.json'), '[]');
  const ctx = { tenant: t, tenantId: T, telefono: 'whatsapp:+34611000111', esOwner: false };
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const f1 = fmt(prox(hoy)), f2 = fmt(prox(prox(hoy)));

  console.log('\n== DISPONIBILIDAD ==');
  let r = JSON.parse(await ca.run({ fecha: f1, servicio: 'Corte de pelo', profesional: 'Jose' }, ctx));
  check('huecos en día laborable', r.disponible && r.huecos.Jose.length > 0);
  r = JSON.parse(await ca.run({ fecha: '01/01/2020', servicio: 'Corte de pelo' }, ctx));
  check('fecha pasada -> sugiere otra', r.disponible === false && !!r.fecha_sugerida);
  check('servicio inexistente -> error', !!JSON.parse(await ca.run({ fecha: f1, servicio: 'NoExiste' }, ctx)).error);
  check('profesional inexistente -> error', !!JSON.parse(await ca.run({ fecha: f1, servicio: 'Corte de pelo', profesional: 'Merlin' }, ctx)).error);

  console.log('\n== RESERVA ==');
  check('crear reserva', (await cb.run({ nombre: 'Ana', contacto: '600111222', servicio: 'Corte de pelo', fecha: f1, hora: '10:00', profesional: 'Jose' }, ctx)).startsWith('OK'));
  check('no duplica idéntica', (await cb.run({ nombre: 'Ana', contacto: '600111222', servicio: 'Corte de pelo', fecha: f1, hora: '10:00', profesional: 'Jose' }, ctx)).includes('ya estaba'));
  check('evita doble-booking', !(await cb.run({ nombre: 'Otro', contacto: '699999999', servicio: 'Corte de pelo', fecha: f1, hora: '10:00', profesional: 'Jose' }, ctx)).startsWith('OK: reserva creada'));
  check('evita fuera de horario', !(await cb.run({ nombre: 'Tarde', contacto: '600000000', servicio: 'Corte de pelo', fecha: f1, hora: '23:30', profesional: 'Jose' }, ctx)).startsWith('OK: reserva creada'));
  r = JSON.parse(await ca.run({ fecha: f1, servicio: 'Corte de pelo', profesional: 'Jose' }, ctx));
  check('hueco reservado deja de ofrecerse', !r.huecos.Jose.includes('10:00'));

  console.log('\n== CANCELAR ==');
  check('cancela la cita', (await cx.run({ fecha: f1 }, ctx)).startsWith('OK'));
  check('hueco liberado', JSON.parse(await ca.run({ fecha: f1, servicio: 'Corte de pelo', profesional: 'Jose' }, ctx)).huecos.Jose.includes('10:00'));
  check('cancelar sin citas -> ERROR', (await cx.run({ fecha: f1 }, ctx)).startsWith('ERROR'));

  console.log('\n== REPROGRAMAR ==');
  await cb.run({ nombre: 'Bea', contacto: '600222333', servicio: 'Corte de pelo', fecha: f1, hora: '11:00', profesional: 'Jose' }, ctx);
  check('reprograma a hueco libre', (await rs.run({ nueva_fecha: f2, nueva_hora: '12:00' }, ctx)).startsWith('OK'));
  check('reprogramar fuera de horario -> rechaza', /^(FUERA_HORARIO|CERRADO)/.test(await rs.run({ nueva_fecha: f2, nueva_hora: '23:30' }, ctx)));

  console.log('\n== AGENDA (DUEÑO) ==');
  check('cliente NO ve agenda', (await ga.run({ rango: 'semana' }, { ...ctx, esOwner: false })).startsWith('ERROR'));
  const agRes = await ga.run({ rango: 'semana' }, { ...ctx, esOwner: true });
  check('agenda dueño devuelve JSON', (() => { try { return typeof JSON.parse(agRes).total === 'number'; } catch (e) { return false; } })());

  console.log('\n== RESTAURANTE (MODO AFORO) ==');
  const TR = 'qa-resto-aforo';
  const tR = {
    id: TR,
    business: {
      nombre: 'QA Resto', agente_nombre: 'Reservas', horario_texto: '',
      profesionales: [],
      capacidad: { mesas: 2, max_comensales_por_reserva: 8 },
      horario: { dias_laborables: [1, 2, 3, 4, 5], franjas: [{ inicio: '13:00', fin: '16:00' }, { inicio: '20:00', fin: '23:30' }] }
    },
    services: { servicios: [{ nombre: 'Comida', precio_eur: null, duracion_min: 90 }, { nombre: 'Cena', precio_eur: null, duracion_min: 120 }] },
    tone: '', faq: '', policies: ''
  };
  const dataDirR = path.join(__dirname, 'data', TR);
  fs.mkdirSync(dataDirR, { recursive: true });
  fs.writeFileSync(path.join(dataDirR, 'bookings.json'), '[]');
  const ctxR = { tenant: tR, tenantId: TR, telefono: 'whatsapp:+34600000001', esOwner: false };

  check('sin comensales -> ERROR', (await cb.run({ nombre: 'Ana', contacto: '600111222', servicio: 'Comida', fecha: f1, hora: '13:00' }, ctxR)).startsWith('ERROR'));
  check('grupo grande -> deriva a persona', (await cb.run({ nombre: 'Grupo', contacto: '600333444', servicio: 'Comida', fecha: f1, hora: '13:00', comensales: 12 }, ctxR)).startsWith('GRUPO_GRANDE'));
  check('mesa 1 misma hora OK', (await cb.run({ nombre: 'Ana', contacto: '600111222', servicio: 'Comida', fecha: f1, hora: '13:00', comensales: 2 }, ctxR)).startsWith('OK'));
  check('mesa 2 misma hora OK (aforo 2)', (await cb.run({ nombre: 'Luis', contacto: '600555666', servicio: 'Comida', fecha: f1, hora: '13:00', comensales: 4 }, ctxR)).startsWith('OK'));
  check('mesa 3 misma hora -> OCUPADO', (await cb.run({ nombre: 'Eva', contacto: '600777888', servicio: 'Comida', fecha: f1, hora: '13:00', comensales: 2 }, ctxR)).startsWith('OCUPADO'));
  let rr = JSON.parse(await ca.run({ fecha: f1, servicio: 'Comida' }, ctxR));
  check('lleno: 13:00 no se ofrece', !rr.huecos.cualquiera.includes('13:00'));
  check('lleno: 14:30 sí se ofrece', rr.huecos.cualquiera.includes('14:30'));
  check('fuera de horario -> rechaza', !(await cb.run({ nombre: 'Tarde', contacto: '600999000', servicio: 'Cena', fecha: f1, hora: '18:00', comensales: 2 }, ctxR)).startsWith('OK: reserva creada'));
  check('cena a las 13:00 -> turno equivocado', (await cb.run({ nombre: 'Mix', contacto: '600123123', servicio: 'Cena', fecha: f1, hora: '13:00', comensales: 2 }, ctxR)).startsWith('FUERA_HORARIO'));
  rr = JSON.parse(await ca.run({ fecha: f1, servicio: 'Cena' }, ctxR));
  check('cena solo ofrece franja de noche', rr.huecos.cualquiera.every(h => parseInt(h) >= 19));
  const resR = JSON.parse(fs.readFileSync(path.join(dataDirR, 'bookings.json'), 'utf8'));
  check('comensales persistidos', resR.length === 2 && resR.every(x => x.comensales >= 2));
  fs.writeFileSync(path.join(dataDirR, 'bookings.json'), '[]');

  console.log('\n== CARTA (getMenu) ==');
  const rSin = JSON.parse(await gm.run({}, ctxR));
  check('sin carta -> aviso de no inventar', !!rSin.error);
  const tplR = ob.cargarPlantilla('restaurante');
  check('plantilla restaurante trae carta', !!(tplR.menu && tplR.menu.secciones.length));
  check('plantilla restaurante trae capacidad', !!(tplR.business.capacidad && tplR.business.capacidad.mesas > 0));
  const tRM = { ...tR, menu: tplR.menu };
  const ctxRM = { ...ctxR, tenant: tRM };
  const rMenu = JSON.parse(await gm.run({}, ctxRM));
  check('carta completa devuelve secciones', Array.isArray(rMenu.secciones) && rMenu.secciones.length >= 3);
  const rSec = JSON.parse(await gm.run({ seccion: 'postres' }, ctxRM));
  check('filtra por seccion', rSec.secciones.length === 1 && rSec.secciones[0].nombre === 'Postres');
  const rBus = JSON.parse(await gm.run({ busqueda: 'gluten' }, ctxRM));
  check('busca por alergeno', rBus.secciones && rBus.secciones.some(sx => sx.platos.length));
  const rNada = JSON.parse(await gm.run({ busqueda: 'sushi-inexistente' }, ctxRM));
  check('sin coincidencias -> lo dice', rNada.resultado === 'sin_coincidencias');
  const nombresCon = tools.schemas({ tenant: tRM }).map(x => x.function.name);
  const nombresSinMenu = tools.schemas({ tenant: tR }).map(x => x.function.name);
  check('getMenu ofrecida solo con carta', nombresCon.includes('getMenu') && !nombresSinMenu.includes('getMenu'));

  console.log('\n== RECORDATORIOS (pendientes) ==');
  const ahora = new Date(2026, 6, 10, 12, 0); // 10/07/2026 12:00
  const mk = (dias, hora, extra = {}) => { const d = new Date(2026, 6, 10 + dias); const p2 = n => String(n).padStart(2, '0'); return { estado: 'confirmada', nombre: 'X', fecha: `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`, hora, ...extra }; };
  let pen = rem.pendientes([mk(1, '11:00')], ahora); // faltan 23h
  check('a 23h -> recordatorio 24h', pen.length === 1 && pen[0].tipo === '24h');
  pen = rem.pendientes([mk(0, '13:30')], ahora); // faltan 1,5h
  check('a 1,5h -> recordatorio 2h', pen.length === 1 && pen[0].tipo === '2h');
  pen = rem.pendientes([mk(1, '11:00', { recordado_24h: 'x' })], ahora);
  check('ya recordado -> no repite', pen.length === 0);
  pen = rem.pendientes([mk(1, '11:00', { estado: 'cancelada' })], ahora);
  check('cancelada -> no recuerda', pen.length === 0);
  pen = rem.pendientes([mk(3, '11:00')], ahora); // faltan 71h
  check('lejana -> aún no', pen.length === 0);
  pen = rem.pendientes([mk(0, '10:00')], ahora); // ya pasó
  check('pasada -> no recuerda', pen.length === 0);

  console.log('\n== ONBOARDING (validaciones) ==');
  try { ob.crearTenant({ vertical: 'barberia', nombre: 'Sin Email' }); check('exige email', false); } catch (e) { check('exige email', true); }
  try { ob.crearTenant({ vertical: 'zzz', nombre: 'X', email_avisos: 'a@b.c' }); check('vertical inválido -> error', false); } catch (e) { check('vertical inválido -> error', true); }

  console.log('\n== SAFETY ==');
  check('detecta nombre de tool', !safety.inspeccionarRespuesta('uso checkAvailability').seguro);
  check('detecta "soy una IA"', !safety.inspeccionarRespuesta('soy una IA').seguro);
  check('texto normal pasa', safety.inspeccionarRespuesta('Te confirmo la cita a las 10').seguro);
  check('limpia markdown', safety.limpiarParaWhatsApp('**hola** `x`') === 'hola x');

  fs.writeFileSync(path.join(dataDir, 'bookings.json'), '[]');
  console.log(`\n===== ${pass} OK, ${fail} fallos =====`);
  process.exit(fail ? 1 : 0);
})();
