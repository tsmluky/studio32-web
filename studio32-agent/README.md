# Studio32 Agent

Núcleo de un agente conversacional **multi-tenant** para negocios locales premium.
Atiende por WhatsApp, responde dudas, explica servicios y precios, consulta
disponibilidad, **crea reservas**, capta leads y deriva a una persona cuando hace
falta. Diseñado para sumar **voz** más adelante.

Cada cliente es una carpeta en `tenants/`. El mismo motor sirve para una barbería,
una clínica o un restaurante cambiando solo esa configuración.

## Arranque rápido

```bash
npm install
npm run check          # qué está configurado y qué falta
npm run test:agent     # smoke test, sin red ni API key
```

**Sin API key funciona igual, en modo simulación** (un motor mock que hace las
reservas de verdad, sin coste). Ideal para probar y demostrar hoy:

```bash
npm run chat           # conversación por terminal (simulación si no hay key)
npm run dev            # servidor → webchat de demo en http://localhost:3000/demo
```

Cuando pongas `OPENAI_API_KEY` en `.env` (copia `.env.example`), pasa solo a
OpenAI real. Para forzar un modo: `LLM_PROVIDER=mock` o `LLM_PROVIDER=openai`.

Ejemplo de conversación (tenant `barberia_demo`):

```
Tú: hola, cuánto cuesta un corte de pelo?
Bot: Hola! Un corte son 13 euros y unos 30 minutos. ¿Te busco hueco?
Tú: sí, mañana por la tarde con Jose
Bot: (consulta disponibilidad real y propone horas; al confirmar, crea la reserva)
```

## Estructura

```
studio32-agent/
├── src/
│   ├── server.js          Express: healthcheck, canal WhatsApp y /chat de pruebas
│   ├── orchestrator.js    Núcleo: bucle LLM + tool-calling + guardrails
│   ├── llm.js             Adaptador OpenAI (aislado)
│   ├── prompt.js          System prompt construido desde el tenant
│   ├── safety.js          Guardrails de salida
│   ├── notify.js          Avisos al negocio (email/WhatsApp)
│   ├── tenants.js         Carga de tenants
│   ├── config.js          Configuración (.env)
│   ├── channels/whatsapp.twilio.js
│   ├── tools/             getServices · checkAvailability · createBooking · registerLead · handoffHuman
│   └── store/             conversations · bookings · leads · logs (JSON → Postgres)
├── tenants/barberia_demo/ business.json · services.json · faq.md · policies.md · tone.md · handoff.json
├── data/                  runtime generado (ignorado por git)
├── docs/                  ARCHITECTURE.md · PROJECT_MEMORY.md
├── CLAUDE.md · AGENTS.md  contexto para agentes de programación
└── .env.example · .gitignore
```

## Motor LLM: OpenAI o DeepSeek

El agente funciona con **OpenAI** o con **DeepSeek** (compatible con la API de
OpenAI), o en **simulación** si no hay ninguna key. Se autodetecta por la key que
pongas en `.env`, o fuerza con `LLM_PROVIDER`:

```
# DeepSeek (lo que tenemos ahora):
DEEPSEEK_API_KEY=...        # y LLM_PROVIDER=deepseek (o se autodetecta)
# OpenAI:
OPENAI_API_KEY=...
```

`npm run check` te dice qué proveedor está activo.

## Widget web embebible

El mismo agente, como chat flotante en cualquier web. Pruébalo en
**http://localhost:3000/widget-demo** (simula studio32.es). Para incrustarlo en
una web real basta una línea:

```html
<script src="https://TU-DOMINIO/widget.js" data-tenant="studio32" defer></script>
```

Opcionales: `data-title`, `data-accent`, `data-welcome`. El endpoint `/chat` está
protegido con CORS (`CORS_ORIGINS`), límite de ritmo y tope de longitud.

## Panel interno de Studio32

En **http://localhost:3000/panel**: lista de agentes desplegados, su estado, uso
(mensajes, reservas, leads, último uso) y edición rápida (email de avisos, tono,
estado). Es interno; protégelo definiendo `PANEL_TOKEN` en `.env`.

## WhatsApp (Meta Cloud API, sin Twilio)

El canal de WhatsApp es directo contra Meta. Pasos de alta en `docs/WHATSAPP-META.md`.
Webhook: `/whatsapp/meta/webhook`. Variables: `META_VERIFY_TOKEN`, `META_ACCESS_TOKEN`,
`META_PHONE_NUMBER_ID`.

## El cliente no necesita panel

El dueño del negocio no entra a ningún sitio: las citas caen en su **Google
Calendar** y puede **preguntarle al agente** ("¿qué tengo mañana?"). Esa consulta
es modo dueño y solo funciona con su enlace privado
(`/demo/?tenant=<id>&owner=<token>`) o, por WhatsApp, desde su número. Un cliente
normal nunca ve datos de la agenda.

## Onboarding de clientes (alta guiada)

Arranca el servidor (`npm run dev`) y abre **http://localhost:3000/onboarding**.
Es la herramienta comercial: eliges el sector (clínica, restaurante, barbería),
se prerrellena una plantilla, el dueño retoca sus datos y su email, y en un clic
queda su agente como **borrador** con un enlace para **probarlo al momento**
(`/demo/?tenant=<id>`). Studio32 revisa y activa.

> Momento "wow" en una reunión: pide el **email del dueño** en el formulario; al
> reservar en la demo, le llega el aviso a su correo (y al móvil). Para que el
> email salga de verdad hay que tener el SMTP configurado en `.env` (ver SETUP).

## Dar de alta un cliente nuevo (manual)
1. Copia `tenants/barberia_demo/` a `tenants/<nuevo>/`.
2. Edita `business.json` (nombre, número de WhatsApp, horario, profesionales),
   `services.json`, `faq.md`, `policies.md`, `tone.md`, `handoff.json`.
3. Apunta el webhook de ese número de WhatsApp a `/whatsapp/webhook`.

## WhatsApp (Twilio)
Webhook (POST): `https://TU-DOMINIO/whatsapp/webhook`. Variables en `.env`
(`TWILIO_*`). En local, expón el puerto con un túnel y úsalo en el sandbox de
Twilio. El destino de los avisos se define por tenant en `handoff.json`.

## Seguridad
- `.env` y `credentials.json` están en `.gitignore`: nunca subas claves.
- Si vienes de los prototipos anteriores, **rota todas las claves** antes de producir.
- Los guardrails (`src/safety.js`) evitan que el agente filtre detalles internos.
- Memoria y datos en JSON bajo `data/` (por tenant). Para producción seria, migrar a PostgreSQL.

> v0.1 — scaffold. Sin voz, sin panel de administración, sin base de datos. Ver `docs/PROJECT_MEMORY.md` para el roadmap.
