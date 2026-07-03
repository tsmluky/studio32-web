# Reporte de estado · Studio32
Fecha: 02/07/2026 · Verificado sobre el repositorio y ejecución real de tests

## En una frase
Todo lo construido funciona: la web pública está completa, las 4 demos verticales enlazan bien, hay una demo de cliente real (La Taberna de Ruzafa) y el producto estrella —`studio32-agent`— pasa hoy todas sus verificaciones (check, 22/22 QA, 12/12 seguridad). El siguiente paso natural es la vertical de restaurantes.

---

## 1. Inventario de la carpeta Studio32

| Pieza | Qué es | Estado |
|---|---|---|
| `index.html` (raíz) | Landing principal de Studio32 (ya NO es redirect) | Operativa |
| `Agencia-Portfolio/` | Versión anterior de la landing + aviso legal y privacidad | Operativa (legal enlazado) |
| `Landing1-L'Obscur/` | Demo restaurante premium (entry: `restaurant_landing.html`) | OK |
| `Landing2-PrimeBurger/` | Demo burger urbana (⚠ `.git` anidado — no tocar) | OK |
| `Landing3-Clinic/` | Demo clínica dental (assets remotos Unsplash) | OK |
| `Landing4-Habitat/` | Demo arquitectura/interiorismo (assets remotos) | OK |
| `Demos-Clientes/la-taberna-de-ruzafa/` | Demo para cliente real (restaurante, Ruzafa) | OK |
| `clientes/la-taberna.json` | Ficha del cliente/prospecto | OK |
| `studio32-agent/` | **Producto: agente conversacional multi-tenant** | v0.4.1, madurez ~80/100 |
| `bot-atencion-leads/` (+ .zip) | Prototipo antiguo | Legacy — superado por studio32-agent |
| `docs/` | Brief, mapa de repo, plan de implementación | OK |

## 2. Estado de studio32-agent (verificado hoy)

**Lo que hace ya:** conversación con tono por negocio, FAQs, disponibilidad real (nunca inventa huecos), crear/cancelar/reprogramar reservas, captar leads, handoff a persona, avisos por email/WhatsApp, modo dueño ("¿qué tengo mañana?"), panel interno `/panel`, onboarding guiado `/onboarding`, widget web embebible, multi-tenant por archivos.

**Canales:** webchat/widget (operativo), WhatsApp por Twilio (claves sandbox puestas — listo), WhatsApp por Meta Cloud API (código listo, faltan claves de Meta).

**Integraciones activas:** Google Calendar (las citas viven en el calendario del negocio), SMTP Hostinger (avisos), LLM = DeepSeek (con fallback mock para pruebas sin coste).

**Verificaciones ejecutadas hoy (modo mock, sin coste):**
- `npm run check` → "Probar por webchat", "IA real" y "WhatsApp Twilio" en verde; Meta pendiente de claves.
- `npm run test:qa` → **22 OK, 0 fallos** (anti doble-booking, fuera de horario, onboarding, safety).
- `npm run test:sec` → **12 OK, 0 fallos** (aislamiento multi-tenant, tokens, owner-only). El único aviso (SMTP) es porque el sandbox no tiene salida de red — no es un fallo del código.

## 3. Incidencias y limpieza recomendada

1. **CLAUDE.md desactualizado**: dice que `index.html` raíz redirige a `Agencia-Portfolio/`, pero ya es la landing completa (existe `index.redirect.backup.html`). Actualizar el manual.
2. **Archivos sueltos en la raíz**: `fix-encoding-node.js`, `fix-encoding.py`, `fix-mojibake.ps1`, `fix-studio32-root.ps1`, `repo_tree.txt`, `file_inventory.json`, `asset_manifest.json`, `bot-atencion-leads.zip`. Son restos de trabajos pasados — mover a `/_archivo` o borrar.
3. **Tenants de prueba** en el agente marcados `[PRUEBA]` (clinica-sonrisa-*, la-terraza-ygad, pollo-loco, qa-test-*): borrar a mano cuando se pueda.
4. **Seguridad**: sigue pendiente rotar las claves que venían commiteadas en los prototipos (OpenAI, Twilio, Gmail, service account Google). El `.env` actual contiene claves reales — confirmar que no se sube a ningún remoto.
5. **Git**: el repo raíz tiene un solo commit ("first commit"). Conviene commitear el estado actual antes de empezar la vertical de restaurantes.

## 4. Bloqueos externos (no de código)
- Claves de Meta (WhatsApp Cloud API) → verificación de cuenta pendiente.
- Despliegue a Railway (Procfile y railway.json ya listos).
- Incrustar el widget en studio32.es (una línea de script).

---
Siguiente documento: `PLAN-AGENTE-RESTAURANTES.md` — cómo llevamos este agente a restaurantes como producto vendible.
