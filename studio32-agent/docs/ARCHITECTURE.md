# Arquitectura — studio32-agent

## Principio rector
Separar tres capas que la gente suele confundir:

1. **Contexto para coding agents** (`CLAUDE.md`, `AGENTS.md`, este `docs/`): ayudan
   a quien PROGRAMA el producto. No se ejecutan en runtime.
2. **El producto / runtime** (`src/`): el backend que atiende clientes 24/7.
3. **Base de conocimiento por cliente** (`tenants/<id>/`): datos editables de cada
   negocio. Es lo que se "rellena" al vender el agente a un cliente nuevo.

n8n NO está en el núcleo. Si se usa, es capa auxiliar (CRM, Sheets, emails,
tareas post-cita) que se dispara desde `notify`/tools, no el cerebro del agente.

## Flujo de un mensaje
```
WhatsApp (Twilio)                    webchat / debug
        │                                   │
   src/channels/whatsapp.twilio.js     POST /chat (server.js)
        │                                   │
        └───────────────┬───────────────────┘
                        ▼
              src/orchestrator.js   ← Studio32 Agent Core
              (bucle LLM + tool-calling, guardrails)
                        │
        ┌───────────────┼───────────────────────────┐
        ▼               ▼                           ▼
   src/llm.js      src/tools/*                 src/prompt.js
   (OpenAI)   getServices/checkAvailability/   (system prompt
              createBooking/registerLead/       desde el tenant)
              handoffHuman
                        │
                        ▼
              src/store/* (JSON)  +  src/notify.js (email/WhatsApp al negocio)
```

## Resolución de tenant
- WhatsApp: por el número de destino (`To` del webhook) → `resolverTenantPorNumero`.
  Si no hay match, `DEFAULT_TENANT`.
- `/chat`: el tenant llega en el body (`{ tenant, sesion, mensaje }`).
- La config del tenant se cachea en memoria al primer uso (`src/tenants.js`).

## Capas y sus contratos
- **Canal** → core: construye `ctx = { tenant, tenantId, telefono, twilioClient }`
  y llama `responder(ctx, mensaje)`.
- **Core** → LLM: `chat({ system, messages, tools })`.
- **Core** → tools: `ejecutar(nombre, args, ctx)`; cada tool es `{ schema, run }`.
- **Tools** → datos: solo a través de `src/store/*`.

## Persistencia (v0.1 → futuro)
Hoy: archivos JSON por tenant en `data/<tenant>/` (conversations, bookings,
leads, logs). Toda la app pasa por `src/store/*`. Migrar a PostgreSQL = reescribir
`src/store/_db.js` y los cuatro módulos, sin tocar tools ni orchestrator.

## Por qué reserva = tool (y no texto)
El prototipo cerraba citas pidiendo al modelo una línea `CITA_CONFIRMADA|...` que
luego se parseaba. Es frágil (el modelo puede cambiar el formato o filtrarla al
cliente). Aquí la reserva se cierra con `createBooking`, una herramienta real con
esquema validado. La disponibilidad nunca se inventa: sale de `checkAvailability`.

## Añadir un canal de voz (futuro)
Nuevo archivo en `src/channels/` (p. ej. `voice.twilio.js`) que transcriba audio
a texto, llame a `responder(ctx, texto)` y sintetice la respuesta. El core no
cambia.
