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

La web está en buen estado tras el rediseño comercial (último commit:
`feat(web): elevate landing visual system and FAQ`). No hay tarea abierta en este
repo. El foco del ecosistema está en el **Agent Platform / GH Dent**, que vive en
los repos `studio32-agent` y `studio32-panel`, no aquí.
