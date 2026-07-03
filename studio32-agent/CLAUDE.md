# CLAUDE.md — studio32-agent

Manual de trabajo para agentes de programación (Claude Code) dentro de este repo.
Léelo antes de tocar nada. Esto NO es el runtime del producto: es contexto para
quien programa. El runtime es el código de `src/`.

## 1. Qué es esto
`studio32-agent` es el **núcleo de un producto**: un agente conversacional
multi-tenant para negocios locales premium (barberías, clínicas, restaurantes,
apartamentos turísticos, servicios locales). Hoy atiende por WhatsApp; está
diseñado para sumar voz más adelante.

El agente sabe: responder FAQs, explicar servicios/precios/horarios, captar
leads, consultar disponibilidad, crear reservas, derivar a humano, avisar al
equipo y guardar logs. Todo **por cliente (tenant)**.

Lo vendible no es "un chatbot": es un sistema configurable donde cada cliente es
una carpeta `tenants/<id>/` con su negocio, servicios, FAQ, tono y políticas.

## 2. Arquitectura (resumen)
```
Canal (WhatsApp/voz/webchat) → src/channels/* → orchestrator (core) → tools/* → store/ + notify → respuesta
```
- `src/orchestrator.js` — bucle LLM + tool-calling. No conoce el canal ni el tenant concreto.
- `src/llm.js` — único punto que sabe de OpenAI. Cambiar de proveedor = cambiar solo esto.
- `src/prompt.js` — construye el system prompt a partir de la config del tenant.
- `src/tools/*` — cada herramienta es `{ schema, run(args, ctx) }`.
- `src/store/*` — persistencia (JSON hoy, interfaz lista para PostgreSQL).
- `tenants/<id>/*` — base de conocimiento por cliente (datos, no código).
Detalle completo en `docs/ARCHITECTURE.md`. Historia y decisiones en `docs/PROJECT_MEMORY.md`.

## 3. Comandos
- `npm install` — dependencias.
- `npm run test:agent` — smoke test SIN red (no necesita API key). Verifica carga de tenant, tools y motor de disponibilidad.
- `npm run chat` — conversación interactiva real por terminal (necesita `OPENAI_API_KEY`).
- `npm run dev` — servidor con recarga.
- `npm start` — servidor en producción.

## 4. Convenciones
- Node.js + Express, CommonJS, sin framework ni build step.
- Código y comentarios en español.
- Una tool por archivo en `src/tools/`, registrada en `src/tools/index.js`.
- MODO AFORO (restaurantes): si `business.capacidad.mesas > 0`, el motor de
  disponibilidad cuenta reservas solapadas contra las mesas (en vez de 1 hueco =
  1 reserva por profesional). `comensales` es obligatorio en createBooking y
  los grupos > `max_comensales_por_reserva` se derivan (GRUPO_GRANDE → handoff).
  Lógica en `store/bookings.js` (`capacidadDe`), checkAvailability y createBooking.
- CARTA (restaurantes): `tenants/<id>/menu.json` (secciones/platos/alérgenos) +
  tool `getMenu` (solo se ofrece al modelo si el tenant tiene carta). El agente
  no debe inventar platos ni alérgenos — regla inyectada en prompt.js.
- La app habla con la persistencia SOLO vía `src/store/*`, nunca tocando archivos directamente.
- Nada específico de OpenAI fuera de `src/llm.js`. Nada específico de Twilio fuera de `src/channels/`.
- Datos del negocio en `tenants/<id>/`, NUNCA hardcodeados en el código.

## 5. Cómo probar un cambio
1. `npm run test:agent` debe seguir pasando.
2. Si tocas conversación, `npm run chat` y prueba el flujo (precio → disponibilidad → reserva).
3. Si tocas el canal WhatsApp, prueba `POST /chat` (mismo core, sin Twilio).

## 6. Decisiones técnicas tomadas (v0.1)
- Motor: OpenAI GPT-4o-mini (barato; aislado para poder cambiar).
- Reserva mediante **tool real** (`createBooking`), NO parseando texto del modelo (el prototipo usaba `CITA_CONFIRMADA|...`, frágil — descartado).
- Multi-tenant por archivos desde el día 1; el tenant se resuelve por el número de WhatsApp del negocio.
- Persistencia en JSON detrás de `store/` para migrar a Postgres sin reescribir el resto.

## 7. Qué NO hacer
- No poner el núcleo del agente en n8n. n8n es capa auxiliar (CRM, Sheets, emails, post-cita), no el cerebro.
- No hardcodear servicios, precios, horarios ni tono en el código: van en `tenants/<id>/`.
- No introducir un framework, build tool ni dependencias nuevas sin aprobación.
- No confirmar reservas sin pasar por `createBooking`.
- No mezclar lógica de OpenAI o Twilio fuera de sus módulos.
- No subir secretos. Si encuentras claves, ver sección 8.

## 8. Seguridad (límites)
- Nunca imprimas, copies ni subas secretos (`.env`, `credentials.json`, tokens).
- `.env` y `credentials.json` están en `.gitignore`. Mantenlo así.
- Si un cambio expone una clave, recomiéndalo rotar; no la reutilices.
- Los guardrails de salida viven en `src/safety.js`: no envíes al cliente texto interno ni menciones de herramientas/IA.

## 9. Estilo de trabajo
Lee los archivos antes de editar. Cambios quirúrgicos, un asunto a la vez, diff
mínimo. Propón plan si la tarea es grande. Al terminar: resumen de archivos
tocados, qué mejora y qué probar.
