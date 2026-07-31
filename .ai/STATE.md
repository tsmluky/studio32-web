# Estado actual · studio32-web

> **Se sobrescribe, no se acumula.** Refleja dónde está el repo AHORA.
> Lo histórico va a `DECISIONS.md`. Tope: ~100 líneas.
> Última actualización: **2026-07-21**

## Qué es este repo

Web pública comercial de Studio32 → **studio32.es**. Superficie **estática**:
HTML/CSS/JS sin framework ni build. Es la cara comercial, no el producto.

Contexto del ecosistema completo (repos, dominios, infra, cliente activo):
**repo `Studio32` → `notes/CONTEXTO.md`**. No dupliques ese contenido aquí.

## Estructura real

```
site/                        ← ÚNICO directorio publicado (netlify.toml: publish = "site")
  index.html                 ← landing principal de Studio32
  styles.css · script.js
  Agencia-Portfolio/         ← landing anterior
  legal/                     ← aviso-legal.html · privacidad.html
  Landing1-L'Obscur/         ← demo restauración · entrada: restaurant_landing.html (NO index.html)
  Landing2-PrimeBurger/      ← demo food brand ("PRIME")
  Landing3-Clinic/           ← demo clínica ("NORD")
  Landing4-Habitat/          ← demo arquitectura ("HÁBITAT")
  Demos-Clientes/la-taberna-de-ruzafa/   ← demo conceptual, NO cliente real
  assets/ · robots.txt · sitemap.xml · _redirects
docs/ · Tools/ · clientes/ · _backups/   ← internos, fuera del deploy
```

Cada landing es autocontenida (HTML + CSS + JS). No hay componentes compartidos.

## Deploy

- **Cloudflare Pages** — `studio32-web.pages.dev` → `www.studio32.es`. Canónico.
- **Netlify** — sitio `studio-32`, publish `site`, rama `main`. **Sigue activo**: el
  apex desnudo `studio32.es` todavía apunta a Netlify (A `75.2.60.5`).
- Migración Netlify→Pages: cerrada para www/hub/dashboard. **Pendiente: cortar el
  apex.** No urgente, pero es lo único que queda de Netlify.
- Probar en local: `python -m http.server 8080 --directory site`

## Trampas del repo (verificado 2026-07-21)

- **Código duplicado embebido:** la raíz contiene copias antiguas de
  `studio32-agent/`, `Templates/`, `bot-atencion-leads/`, `clientes/`.
  **No editar ahí.** La fuente del agente es el repo `studio32-agent`.
- `.gitignore` excluye `studio32-agent/tenants/*` y `studio32-agent/data/*`
  (llevan `owner.token` y WhatsApp reales). No forzar su inclusión.
- El worktree raíz puede estar limpio con submódulos/ignorados sucios: revisar
  cada frontera git por separado.
- Hay scripts sueltos de arreglo de encoding en la raíz (`fix-*.ps1`, `fix-*.py`,
  `fix-encoding-node.js`) y ficheros de inventario. Legado; no ejecutar a ciegas.

## Riesgos ya resueltos (no volver a documentarlos como vivos)

- ~~`.git` anidado en `Landing2-PrimeBurger/`~~ → ya no existe (2026-07-21).
- ~~Legales en `Agencia-Portfolio/`~~ → están en `site/legal/`.
- ~~`index.html` raíz redirige~~ → la raíz publicada es `site/index.html`;
  `index.redirect.backup.html` guarda el redirect viejo.

## Git y sincronía entre máquinas

Este repo se trabaja desde **portátil y sobremesa**. Regla obligatoria:

1. **`git pull --rebase` al empezar** una sesión.
2. **Commit + push de `.ai/` al cerrar** una tarea.

Si te la saltas, `STATE.md` entra en conflicto. Rama de trabajo: `main`.

## Pendiente · a confirmar por el usuario

- ⚠️ **NORTE / prioridad "Agent Platform"** — el `CLAUDE.md` anterior ordenaba leer
  `NORTE-AGENT-PLATFORM-2026-07.md` antes de tocar producto. **Ese archivo no
  existe en ningún repo**: era de la estructura numerada del sobremesa
  (`00-direccion-y-operaciones/`), que nunca llegó a GitHub y puede estar perdida.
  El usuario **no ha confirmado** si esa dirección sigue vigente.
  → **No asumir que sigue vigente ni que ya no lo está.** Preguntar antes de
  tomar decisiones de producto o arquitectura basadas en ella.
  → Si sigue vigente, reconstruir el contenido aquí y no volver a depender de un
  archivo fuera de GitHub.

## Foco actual

Sesión del **2026-07-31**: se revisó la landing contra la que generó Polsia
(agente de terceros) y se decidió **no** migrar a su diseño — ver `DECISIONS.md`.
Se portaron solo las ganancias comerciales. Hecho en `site/`:

- **Chat demo corregido** (`index.html`, sección `#agente`): daba precio por
  WhatsApp, comportamiento que el agente real NO tiene. Ahora hace triage,
  ofrece valoración gratuita, cierra cita y ofrece escalar a humano.
- **Sección de tarifas propia** (`#tarifas`): el bloque `.commercial-model` sale
  de dentro de `#process`, gana cabecera propia (reutiliza `.verticals-header`) y
  una lista de incluidos por tramo (`.model-includes`, nueva en `styles.css`).
  Añadida al nav de escritorio y al menú móvil (índices móviles renumerados).
- **FAQ ampliada** de 6 a 10 preguntas: número nuevo, cambios de precio/horario,
  datos y RGPD, plazo de puesta en marcha.

- **Selector por sector** en `#portfolio`: las tres `.fit-card` pasan a ser
  pestañas (`role="tablist"`, flechas ←/→), cada una con su panel y una
  conversación completa distinta. Nuevo: `.fit-card--tab`, `.sector-panel`,
  `.sector-points`; en JS, `initSectorDemo()`.
- **Demo interactiva** en `#control` (`[data-live-demo]`): el visitante elige sus
  respuestas y el panel del negocio se actualiza en vivo — conversación espejada,
  contador, contacto, tarjeta de cita y relevo humano. El mockup estático de panel
  que había en esa sección **se eliminó**: ahora sólo existe el vivo.

### Cómo funciona la demo en vivo

**Habla con el agente REAL desplegado, sin guion** (decisión del usuario, 31/07).
Se probó primero con guion cerrado y se descartó: los botones de respuesta
predefinida delataban el mockup.

- `DEMO_AGENT` (`script.js`) → `POST https://web-production-d722c.up.railway.app/chat`
  con `{ tenant: 'clinica-cobalto', sesion, mensaje }`. Mismo backend y mismas
  herramientas que atienden WhatsApp. Verificado E2E el 31/07.
- La sesión es aleatoria por visita (`landing-xxxxxxxx`) y se renueva al reiniciar.
  En el agente, esa sesión hace de "teléfono": el tenant de demo tiene **agenda
  por sesión**, así que cada visitante ve la agenda limpia y solo sus reservas.
- **Ping de calentamiento** (`calentarAgente()`, arriba del todo en `script.js`):
  un GET al healthcheck en cuanto carga la página. Railway duerme el contenedor y
  el arranque en frío se comía ~15 s del primer mensaje; con el ping baja a ~10 s
  (el resto ya es el modelo). No gasta modelo ni consume rate limit.
- ⚠️ El tono del agente **no se edita aquí ni en `tenants/<id>/`**: Supabase pisa
  al archivo. Hay que ejecutar `node scripts/import-tenants-to-supabase.js <id>`
  en el repo `studio32-agent`. Ver su `DECISIONS.md` (2026-07-31).
- `CORS_ORIGINS` en el agente vale `*` por defecto, así que no hizo falta tocarlo.
- Tope de 25 turnos **en cliente** (`maxTurnos`) — es cosmético, se salta desde
  consola. El límite que cuenta es el `rateLimit` del servidor (30 req / 5 min
  por IP).

**Pendiente para que el panel sea del todo real:** la tarjeta de cita no se
rellena porque no hay endpoint público que devuelva el estado de una sesión. Hace
falta añadir en `studio32-agent` algo tipo `GET /demo/estado?sesion=` (sólo
lectura, acotado a esa sesión). Hoy el panel espeja la conversación real, pero la
cita no aparece aunque el agente la cree.
- `initChatDemo()` ahora maneja **varios** mockups (antes uno solo) y guarda las
  líneas de tiempo en `chatTimelines` para que el selector relance la animación
  de la pestaña que se abre.
- `.detail-status span` se acotó a `:first-child`: antes convertía en punto
  cualquier span hijo, y el marcado nuevo mete un segundo span con el texto.

**Pendiente decidir con el usuario:**
- Copy del `<h1>` del hero: hoy habla al negocio ("Tu negocio atiende aunque esté
  cerrado"), no al dueño. Cambiar el H1 es decisión de marca — no tocar sin visto
  bueno.
- Conectar la demo al agente real (`studio32-agent`) con tenant de demo y límite
  de uso. Sería fase 2 y **no vive en este repo**.

**Limpieza menor pendiente:** `.control-grid` quedó como CSS muerto (3 bloques:
`styles.css` ~1128, ~2725, ~3047). Ya no lo usa ningún HTML.

Nada de esto está commiteado todavía. El foco del ecosistema sigue siendo el
**Agent Platform / GH Dent** (`studio32-agent`, `studio32-panel`), no este repo.
