# Studio32 Web

Repositorio de la web pública de **Studio32** y del material de trabajo de la agencia.

## Contenido

| Carpeta | Qué es |
|---|---|
| `site/` | La web pública |
| `Templates/` | Plantillas reutilizables para proyectos de cliente |
| `clientes/` | Trabajo por cliente |
| `bot-atencion-leads/` | Bot de atención y captación de leads |
| `Tools/` | Utilidades internas (scripts de encoding, inventario de assets) |
| `docs/` | Documentación |
| `_backups/` | Copias previas a cambios grandes |

## Notas

- Producción y previews se publican en Cloudflare Pages (`studio32-web`), desde `main` y con salida `site/`. Dominio: `https://www.studio32.es`; el dominio raíz redirige en Cloudflare con 301 conservando ruta y query.
- Netlify está retirado: sus tres proyectos están desactivados y los builds de `studio-32` detenidos. `netlify.toml` solo conserva una guarda para cancelar builds accidentales; no usar Netlify para publicar ni revisar previews.
- `asset_manifest.json` y `file_inventory.json` se generan; no se editan a mano.
- Los scripts `fix-encoding.*` y `fix-mojibake.ps1` existen para reparar acentos rotos en ficheros heredados. Si los necesitas, algo se guardó con la codificación equivocada.
- `AGENTS.md`, `CLAUDE.md` y `PROMPT.md` son instrucciones para asistentes de código que trabajan sobre este repo.

---

[Studio32](https://studio32.es) — sistemas digitales para negocios reales.
