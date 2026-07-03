# AGENTS.md — studio32-agent

Guía corta y estable para cualquier agente de programación que trabaje en este
repo. (El manual extenso es `CLAUDE.md`.)

## Propósito
Núcleo de producto: agente conversacional multi-tenant para negocios locales
(WhatsApp; voz a futuro). Atiende, informa, capta leads y gestiona reservas, con
una configuración distinta por cliente.

## Mapa del repo
- `src/` — runtime del agente (server, orchestrator, llm, prompt, safety, notify).
- `src/channels/` — canales (hoy `whatsapp.twilio.js`).
- `src/tools/` — herramientas del agente (`{ schema, run }`).
- `src/store/` — persistencia (JSON; interfaz lista para Postgres).
- `tenants/<id>/` — datos de cada negocio (business, services, faq, policies, tone, handoff).
- `data/` — runtime generado (ignorado por git).
- `docs/` — ARCHITECTURE.md y PROJECT_MEMORY.md.

## Reglas de edición
- Español en código y comentarios. CommonJS, sin build.
- Datos del negocio → `tenants/`, nunca hardcodeados.
- OpenAI solo en `src/llm.js`; Twilio solo en `src/channels/`.
- Una tool por archivo, registrada en `src/tools/index.js`.
- Persistencia siempre vía `src/store/*`.

## Testing
- `npm run test:agent` (smoke, sin red) debe pasar antes y después de tu cambio.
- `npm run chat` para validar conversación (requiere `OPENAI_API_KEY`).

## Seguridad y secretos
- No subir ni imprimir secretos. `.env` y `credentials.json` en `.gitignore`.
- Si detectas una clave commiteada, avisa y recomienda rotarla.
- Mantén los guardrails de `src/safety.js`.

## Estilo de commits
- Mensajes claros en imperativo y en español: `feat: tool createBooking`,
  `fix: huecos solapados en checkAvailability`, `docs: actualizar ARCHITECTURE`.
- Un commit por cambio lógico. Diff mínimo.

## Criterios de calidad
- El smoke test pasa.
- No se rompe el aislamiento de capas (canal / core / tools / store / llm).
- No hay datos de negocio hardcodeados.
- No hay secretos en el árbol versionado.
