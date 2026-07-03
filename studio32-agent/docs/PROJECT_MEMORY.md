# PROJECT_MEMORY — studio32-agent

Memoria viva del proyecto: de dónde venimos, qué decidimos y hacia dónde vamos.
Actualizar cuando se tomen decisiones relevantes.

## De dónde venimos
Dos prototipos previos (auditados el 25/06/2026):

### peluqueria-bot
Prototipo de reservas en un solo archivo (`index.js`, ~500 líneas). Motor Anthropic
(Claude) con tool-calling para disponibilidad, persistencia en Google Sheets,
historial en memoria.
- **Bueno:** lógica real de disponibilidad (franjas, duraciones, solapamientos),
  modelo de servicios con precio/duración, sugerencia de próximo día laborable.
- **Malo:** monolítico, servicios/precios/horarios hardcodeados, confirmación de
  cita frágil por texto (`CITA_CONFIRMADA|...`), sin multi-tenant, sin DB,
  dependencia fuerte de Google Sheets, **secretos commiteados y sin `.gitignore`**.

### studio32-customerbot
Bot de captación de leads, modular y limpio (`src/ai.js`, `prompt.js`, `tools.js`,
`notify.js`, `safety.js`, `server.js`, `store.js` + CLI). Motor OpenAI GPT-4o-mini,
webhook Twilio bien resuelto, tool `registrar_lead`, prompt comercial muy bueno.
- **Bueno:** estructura modular (patrón a seguir), guardrails, webhook correcto.
- **Malo:** orientado a leads (no reservas), sin multi-tenant, sin DB (Map en
  memoria), dedup en memoria, **secretos commiteados**.

## Qué se reutilizó
- **Base arquitectónica:** `studio32-customerbot` (su modularidad).
- **De peluqueria-bot:** el motor de disponibilidad y el modelo de servicios,
  portados a `src/tools/checkAvailability.js` y a `tenants/<id>/services.json`.
- **Descartado:** el patrón `CITA_CONFIRMADA` por texto → ahora `createBooking` (tool).

## Decisiones arquitectónicas
- Motor LLM: **OpenAI GPT-4o-mini**, aislado en `src/llm.js`.
- **Multi-tenant desde el día 1** por archivos (`tenants/<id>/`), resuelto por número.
- Persistencia **JSON detrás de `store/`**, lista para migrar a PostgreSQL.
- n8n **fuera del núcleo**; solo capa auxiliar.
- Reservas y leads vía **tools reales** con esquema, no parseo de texto.

## Estado actual
Madurez del producto vs. visión completa (multi-tenant, reservas+leads+voz,
vendible): **~50/100** tras v0.2 (24 → 35 → 50). v0.2 añade Google Calendar como
agenda real de reservas (con fallback JSON), config de despliegue (Railway) y
runbook (docs/SETUP.md). Lo que sube la nota desde aquí: dejarlo desplegado y
conectado a un número real, reprogramar/cancelar citas, segundo tenant (dental),
Postgres para leads/logs y panel.

## Roadmap
**v0.1 (este scaffold)** — núcleo modular, tenant demo barbería, tools (servicios,
disponibilidad, reserva simulada en JSON, lead, handoff), WhatsApp Twilio, logs y
memoria persistentes en JSON, CLI + smoke test. Sin voz, sin panel, sin DB.

**v0.2 (HECHO)** — Google Calendar como agenda real de reservas (service account,
fallback JSON), config de despliegue (Procfile/railway.json) y runbook SETUP.md.

**v0.2.1 (siguiente)** — desplegar + conectar Twilio (sandbox) y dejarlo operativo
entre nosotros; luego reprogramar/cancelar citas y segundo tenant (clínica dental).

**v0.2.1 EN CURSO (25/06/2026)** — modo simulación del LLM (provider mock, sin
API key), webchat de demo en /demo, y `npm run check`. Todo listo para que, en
cuanto Juanma facilite la OPENAI_API_KEY y el número/Twilio, sea pegar en `.env`
y funcionar. Probado: conversación de reserva completa de punta a punta en modo
simulación crea la cita correctamente.

**v0.2.2 (HECHO 25/06/2026)** — tools cancelBooking y rescheduleBooking
(cancelar y mover citas, con baja/movida en Calendar y avisos al equipo).
El ciclo de la cita queda completo: crear, cancelar, reprogramar.

**v0.2.3 (HECHO 25/06/2026)** — onboarding de clientes: plantillas por vertical
(templates/clinica_dental, restaurante, barberia), formulario guiado en /onboarding
que genera el tenant como borrador (handoff.email = email del dueño), y vista previa
en /demo?tenant=. Pensado como herramienta de venta en reunión: rellenar → probar →
el dueño recibe el aviso de reserva en su email (requiere SMTP). Prompt ajustado para
servicios sin precio (restaurante). Mock actualizado para parsear servicios con/sin precio.

**v0.3.0 (HECHO 25/06/2026)** — soporte DeepSeek (compatible OpenAI: provider
factory en src/providers/openai.js + selección en llm.js por LLM_PROVIDER /
autodetección de key). Tenant **studio32** (captador de leads + reserva de auditoría,
tono comercial). **Widget web embebible** (public/widget.js, /widget-demo, snippet
con data-tenant) con CORS + rate limit + tope de longitud en /chat. Esto permite
operar por WEB hoy con la key de DeepSeek, sin teléfono.

**v0.3.1 (HECHO)** — modo dueño + panel interno. El cliente NO usa panel: sus
citas van a su Google Calendar y le pregunta al agente ("¿qué tengo mañana?") vía
tool getAgenda, accesible solo en modo dueño (token por web /demo?owner=, o número
por WhatsApp). Tools y prompt se filtran por rol; un cliente no ve la agenda.
Panel interno de Studio32 en /panel (lista de agentes, uso por agente: mensajes,
reservas, leads, último uso; edición de email/tono/estado), protegible con
PANEL_TOKEN. Registro de uso en store/usage.js. Decisión de producto (Pancho):
web-first, sin fricción para clientes de 40+; WhatsApp = otro canal más adelante.

**v0.4.0 (HECHO 27/06/2026)** — WhatsApp por META CLOUD API directo (sin Twilio):
canal `src/channels/whatsapp.meta.js` (verificación webhook GET, recepción POST,
envío vía Graph API con fetch nativo), montado en `/whatsapp/meta/webhook`. Twilio
ELIMINADO del proyecto (notify ahora email + WhatsApp por Meta; whatsapp.twilio.js
queda como stub vacío porque el disco no deja borrar). Guía de alta en Meta para
Pancho/Juanma en `docs/WHATSAPP-META.md`. Config: META_VERIFY_TOKEN (elegido),
META_ACCESS_TOKEN, META_PHONE_NUMBER_ID. Decisión de Pancho: Meta directo, sin BSP.

**v0.4.1 (HECHO 27/06/2026)** — Twilio RESTAURADO conviviendo con Meta: hay DOS
canales de WhatsApp montados, Twilio en /whatsapp/webhook y Meta en
/whatsapp/meta/webhook (Meta se monta antes para no pisar la ruta). notify envía
WhatsApp por el canal configurado (Meta si hay claves, si no Twilio). Twilio es
para que Studio32 provisione/gestione los números (incluidos en la cuota). Probar
hoy con el sandbox de Twilio: docs/PRUEBA-WHATSAPP-TWILIO.md. Decisión de Pancho:
Twilio ahora (sandbox/numero ya), Meta cuando verifiquen la cuenta.

**Decisión de entrega (27/06/2026)**: las citas se entregan vía **Google Calendar**
(aviso nativo del móvil, gratis) + el encargado **pregunta al agente** (modo dueño,
reactivo y gratis). NO se construye un gestor de reservas propio: el calendario del
cliente ES el gestor. Evitar WhatsApp saliente por cada cita (cuesta: mensaje
iniciado por el negocio = plantilla de pago). Email solo como resumen opcional.
Un calendario SÍ maneja agendas densas (cada 15 min / 3 por hora). Guía operativa:
`docs/GOOGLE-CALENDAR.md` (una service account de Studio32 + cada cliente comparte
su calendario + calendar_id por tenant).

**Onboarding autoservicio de Calendar (planificado)** — botón "Conectar con Google"
(OAuth) para que el cliente conecte su calendario desde el móvil, sin el paso manual
de compartir con la service account. Requiere cliente OAuth + pantalla de
consentimiento en Google Cloud y verificación de la app por Google (test users hasta
100 mientras tanto). Decidido 27/06/2026: NO ahora; seguimos con service account +
compartir manual; se monta cuando se onboarden clientes en serio. El número de
WhatsApp NO es autoservicio (requiere provisión/verificación aparte).

**Widget web embebible (planificado, tras WhatsApp)** — convertir el webchat
de prueba (/demo) en un canal de producto: channels/webchat.js + snippet
embebible con data-tenant para studio32.es y webs de clientes. Mismo agente,
otra entrada. Requiere rate limiting, CORS (allowlist de dominios), tope de
longitud y sesión persistente en navegador, porque es público y cada mensaje
cuesta. Decidido el 25/06/2026: se hace DESPUÉS de tener WhatsApp operativo.

**v0.3** — migración a PostgreSQL, panel de administración mínimo (ver leads,
reservas, conversaciones por tenant), canal de voz (transcripción + TTS) para
reservas telefónicas, y conectores n8n para flujos post-cita/CRM.

## Endurecimiento (QA) 27/06/2026
Ronda de QA con suite de regresión (`npm run test:qa`, 22 casos, sin red). Bugs
reales encontrados y CORREGIDOS:
- createBooking permitía DOBLE-BOOKING (mismo hueco) y reservas FUERA DE HORARIO:
  ahora valida día laborable, franja horaria y hueco libre por su cuenta (no
  depende de que el modelo llame antes a checkAvailability).
- /chat usaba 'barberia_demo' fijo; ahora respeta DEFAULT_TENANT.
- mock: dejaba de confundir "soy de Valencia" con un nombre.
Suite cubre disponibilidad, reserva, cancelar, reprogramar, agenda del dueño,
onboarding y guardrails. Todo verde.

## Pendientes de seguridad (heredados)
Los dos prototipos traían secretos reales en el repo (claves de Anthropic, OpenAI,
Twilio, App Password de Gmail y una service account de Google). **Rotar todas**
antes de cualquier despliegue; asumir que están comprometidas.
