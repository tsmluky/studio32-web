# Plan · Agente para restaurantes
Fecha: 02/07/2026 · Base: studio32-agent v0.4.1

## Decisión de partida
**No se crea un producto nuevo.** El agente ya es multi-tenant y ya tiene plantilla `restaurante`. Lo que hacemos es convertir esa vertical de "simplificada" a **primera clase**: capacidad real de mesas, pedidos, y un paquete comercial (demo → onboarding → entrega) listo para vender.

---

## 1. Qué hace el agente de restaurante (alcance v1)

**Núcleo (reutiliza lo que ya funciona):**
- Reservar mesa: fecha, turno (comida/cena), hora, **nº de comensales**, nombre y teléfono.
- Cancelar y reprogramar reservas.
- Responder dudas: horarios, ubicación, carta, alérgenos, menú del día, parking, terraza.
- Grupos grandes y eventos privados → capta el dato y deriva al equipo (handoff), no confirma por chat.
- Captar leads (interés comercial que no es reserva).
- Modo dueño: "¿cuántas reservas tengo esta noche?" desde su propio WhatsApp.
- Aviso al equipo de cada reserva/cambio (email + WhatsApp) y cita en su Google Calendar.

**Nuevo desarrollo necesario (gap real detectado en el código):**
1. **Capacidad por turno**: hoy el motor de disponibilidad viene de barbería (profesional + hueco). El restaurante necesita `capacidad` en `business.json` (nº de mesas o de comensales por franja) y que `checkAvailability`/`createBooking` validen contra ese aforo, no contra "un hueco".
2. **Campo `comensales` en la reserva** como dato de primera clase (hoy va metido en la nota — insuficiente).
3. **`menu.json`** en la plantilla (secciones, platos, precios, alérgenos) y tool `getMenu` — la carta es el 50% de las preguntas.
4. **Recordatorio de reserva** (24h/2h antes, por WhatsApp) — reduce no-shows, es el argumento de venta más tangible.

**v1.1 (después de validar con 1-2 clientes):**
- **Pedidos para recoger** (tool `createOrder` sobre `menu.json`, aviso a cocina por WhatsApp/email). No delivery propio ni pago online en v1.
- Lista de espera cuando no hay hueco.

## 2. Conexiones

| Conexión | Para qué | Estado |
|---|---|---|
| **Google Calendar** | Agenda de reservas que ve todo el equipo (el dueño comparte su calendario con nuestro service account) | ✅ Ya integrado |
| **WhatsApp** (Meta Cloud API o Twilio) | Canal principal del cliente final | ✅ Código listo; por cliente hace falta su número/WABA |
| **Widget web** | Mismo agente embebido en la web del restaurante | ✅ Ya existe |
| **Email (SMTP)** | Avisos a sala/cocina y al dueño | ✅ Ya integrado |
| Google Business Profile | Que la ficha de Google lleve al agente (link WhatsApp/widget) | Config manual, sin código |
| TheFork / CoverManager | Si el restaurante ya los usa | ⏸ Valorar caso a caso; no en v1 |
| TPV (Ágora, Revo, Square) | Pedidos directos a caja | ⏸ v2, solo con demanda real |

Criterio: **v1 = Calendar + WhatsApp + widget + email.** Cada integración extra se añade cuando un cliente la pida y la pague, no antes.

## 3. Base de conocimiento por restaurante (`tenants/<id>/`)
- `business.json` — datos, horarios por turnos, **capacidad**, zonas (sala/terraza), timezone, calendar_id, teléfono del dueño.
- `menu.json` — carta con precios y alérgenos (nuevo).
- `faq.md` — parking, niños, mascotas, celiacos, grupos…
- `policies.md` — antelación mínima, tolerancia de retraso, política de grupos/no-show.
- `tone.md` — voz del restaurante (casual de barrio vs. fine dining).

## 4. Onboarding del cliente (proceso completo)

**Fase 0 — Venta (30 min, en el local o por videollamada)**
La herramienta de venta ya existe: `/onboarding` genera el tenant en vivo. Guion: rellenar el formulario delante del dueño con SUS datos → abrir `/demo?tenant=` → que el propio dueño le pida mesa al agente desde su móvil → le llega el aviso de reserva a su email en el momento. Esa experiencia cierra la venta. Pitch: *"Cada llamada que no cogéis en mitad del servicio es una mesa que se va a otro sitio. Esto contesta siempre."*

**Fase 1 — Configuración (1 sesión de 60–90 min con el dueño)**
1. Completar la base de conocimiento: carta, FAQs, políticas, tono (grabar 10 min de conversación con el dueño y destilarla).
2. Capacidad real: mesas por turno, zonas, duración media por tamaño de grupo.
3. Google Calendar: crear calendario "Reservas — [Restaurante]" y compartirlo con el service account. El equipo lo ve desde sus móviles sin aprender nada nuevo.
4. WhatsApp: decidir número (número nuevo dedicado = camino simple; su número actual requiere migrar a WABA — explicarlo honestamente).
5. Avisos: a qué email/WhatsApp llegan reservas y handoffs.

**Fase 2 — Piloto supervisado (1–2 semanas)**
Agente en marcha con handoff agresivo (ante cualquier duda, deriva). Revisión de transcripciones cada 2–3 días desde `/panel`; se ajustan prompt, FAQs y políticas con lo que pregunta la gente real. Criterio de salida: 20+ conversaciones reales sin errores de reserva.

**Fase 3 — Entrega en producción**
- Formación de 30 min al equipo: dónde ver las reservas (su Calendar), qué hace el agente, qué hacer cuando deriva a humano.
- Hoja de una página "Cómo funciona tu agente" (números, contactos, qué hacer si algo falla).
- Widget instalado en su web (si tiene; si no, es oportunidad de Pack Presencia).
- Revisión a los 30 días incluida.

## 5. Empaquetado comercial
Encaja como evolución natural del **Pack Presencia + IA** y como producto suelto para restaurantes que ya tienen web. Estructura: **setup inicial** (configuración + piloto + formación) + **cuota mensual** (hosting, WhatsApp, mantenimiento de la base de conocimiento, revisiones). [DEMO — precios a decidir con Juanma; el coste variable real es el LLM + número WhatsApp, ambos bajos.]

Palanca comercial ya construida: la demo web de **La Taberna de Ruzafa** — añadirle el widget del agente convierte esa demo en la demo del producto completo (web + agente), que es exactamente lo que vendemos.

## 6. Roadmap propuesto

| Semana | Entregable |
|---|---|
| 1 | Capacidad por turno + comensales en el motor de reservas, con tests QA nuevos |
| 1 | `menu.json` + `getMenu` en plantilla restaurante |
| 2 | Recordatorios de reserva; tenant demo restaurante completo (usar La Taberna como caso) |
| 2 | Widget en la demo de La Taberna + guion de venta probado |
| 3 | Desplegar a Railway; primer piloto con restaurante real |
| 4+ | v1.1 pedidos para recoger, según feedback del piloto |

## 7. Riesgos a vigilar
- **WhatsApp/Meta**: la verificación de la cuenta sigue siendo el bloqueo externo; Twilio sandbox vale para pilotos, no para producción de cliente.
- **Nunca inventar disponibilidad**: ya está blindado en QA; mantener esa suite al tocar el motor de capacidad.
- **RGPD**: guardamos nombre y teléfono de comensales — añadir aviso de privacidad en el primer mensaje y política de retención.
- **Dependencia de claves** (Juanma tiene OpenAI; Meta pendiente): documentado en el reporte de estado.
