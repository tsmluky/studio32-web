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

- El despliegue se hace con Netlify (`netlify.toml`).
- `asset_manifest.json` y `file_inventory.json` se generan; no se editan a mano.
- Los scripts `fix-encoding.*` y `fix-mojibake.ps1` existen para reparar acentos rotos en ficheros heredados. Si los necesitas, algo se guardó con la codificación equivocada.
- `AGENTS.md`, `CLAUDE.md` y `PROMPT.md` son instrucciones para asistentes de código que trabajan sobre este repo.

---

[Studio32](https://studio32.es) — sistemas digitales para negocios reales.
