# Infraestructura verificada · 2026-10-02

Inspección de los dashboards abiertos por el usuario y lecturas HTTP públicas. Retirada de Netlify autorizada por el usuario. Proyectos desactivados de forma reversible; datos, correo, bases de datos y aplicaciones conservados.

## Publicación comercial

Cloudflare Pages `studio32-web` conecta con `tsmluky/studio32-web`. Producción automática desde `main`; sin comando de build, salida `site`, raíz por defecto. Dominio personalizado `www.studio32.es` activo con SSL. Producción observada antes de esta corrección: commit `635855a`. La rama `feat/organic-discovery` despliega previews, no producción.

Preview de referencia del commit `7454591`: https://e100bb0b.studio32-web.pages.dev/recursos/. HTTP verificado: recursos, calculadora y sitemap 200 + X-Robots-Tag noindex; URL inexistente 404. Canonicals de recursos/calculadora apuntan a www. Preview público: noindex evita indexación, no restringe acceso. No poner secretos o datos privados en `site/`.

## Dominios y Netlify heredado

Revisión completa del inventario de proyectos del equipo Netlify `tsmluky`:

| Proyecto | Publicación anterior | Estado final |
|---|---|---|
| `studio-32` | GitHub `tsmluky/studio32-web`, main y previews; última producción 02/10/2026 | Builds detenidos y proyecto desactivado |
| `agente-gh1-studio32` | Netlify Drop, 09/07/2026; demo GH Dent | Desactivado, recuperable |
| `agente-gh2-studio32` | Netlify Drop, 09/07/2026; otra demo GH Dent | Desactivado, recuperable |

Ninguno tiene dominio personalizado en Netlify: solo sus subdominios netlify.app.
No se han borrado proyectos ni despliegues. La vinculación Git heredada de
studio-32 permanece con builds detenidos; no se desvinculó porque ese proceso
borra claves/hooks y resetea preferencias. El proyecto desactivado conserva su
historial. No reactivarlo ni publicar/previsualizar allí.

DNS final: `www.studio32.es` CNAME `studio32-web.pages.dev`, DNS only.
El apex `studio32.es` ha cambiado de A `75.2.60.5` (Netlify) a A
`192.0.2.1`, **Proxied**, TTL Auto: dirección reservada para un host que solo
redirige, siguiendo la [configuración oficial de Cloudflare](https://developers.cloudflare.com/fundamentals/manage-domains/redirect-domain/).
Cloudflare resuelve la redirección antes del origen; no existe dependencia de
Netlify. Conservar la regla de redirección: sin ella este host no sirve una web.
No se modificaron MX/TXT, correo, API, hub, panel, restaurantos ni workers.

Single Redirect `Studio32 apex a www`, ID `499aa2ea9159464aa5020078b2704b30`,
activa y limitada a `http.host eq "studio32.es"`: 301 hacia
`concat("https://www.studio32.es", http.request.uri.path)`, preservando query.
Después del cambio se verificaron HTTP y HTTPS con rutas y query: 301 exacto
a www. Portada www 200; URL inexistente 404. Las tres URLs antiguas Netlify
se verifican inaccesibles tras la desactivación.

Producción y previews exclusivamente en Cloudflare Pages. `netlify.toml`
conserva `publish = "site"` para evitar exposición del repositorio ante un error,
y añade `ignore = "exit 0"` para cancelar builds Git si se reactiva la integración.
La [semántica de ignore](https://docs.netlify.com/build/configure-builds/ignore-builds/)
no impide subidas manuales; por eso se mantiene el proyecto desactivado y la
instrucción explícita de no usar Netlify.

Evidencia local ignorada en `qa/netlify-retired.jpg`,
`qa/cloudflare-apex-originless.jpg` y `qa/netlify-retirement-http.txt`.

## Supabase y superficies operativas

El proyecto Supabase `studio32-hub` está visible y healthy en la rama productiva main. No se consultaron filas de clientes ni claves. Cloudflare muestra proyectos independientes `studio32-hub`, `studio32-panel` y workers de clips. Su existencia no convierte la web comercial en una aplicación con backend.

Esta colección SEO y su calculadora no necesitan tablas, migraciones, funciones ni nuevos bindings de Supabase. Mantener la arquitectura actual y los datos operativos en sus superficies correspondientes. La inspección de overview no es una auditoría de RLS, autenticación o seguridad.

## Medición

GA4, Search Console y Bing configurados en la sesión del 02/10/2026; ver `MEASUREMENT.md`. Esta retirada de Netlify no cambia consentimiento, etiquetas ni verificaciones DNS.
