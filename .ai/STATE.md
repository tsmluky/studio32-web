# Estado actual · studio32-web

> **Se sobrescribe, no se acumula.** Refleja dónde está el repo AHORA.
> Lo histórico va a `DECISIONS.md`. Tope: ~100 líneas.
> Última actualización: **2026-08-01**

## Qué es este repo

Web pública comercial de Studio32 → **studio32.es**. Superficie **estática**:
HTML/CSS/JS sin framework ni build. Es la cara comercial, no el producto.

Contexto del ecosistema completo: **repo `Studio32` → `notes/CONTEXTO.md`** y el
traspaso `Studio32 → reportes/2026-08-01-traspaso.md`.

## Estructura publicada

```
site/                                   ← ÚNICO directorio publicado
  index.html                            ← portada
  styles.css · script.js                ← base, las cargan todas las páginas
  vertical.css                          ← páginas interiores
  panel.css · panel.js                  ← tour del panel
  agente-whatsapp-clinicas-dentales/    ┐
  agente-whatsapp-restaurantes/         ├ páginas por vertical
  agente-whatsapp-servicios-locales/    ┘
  precio-agente-whatsapp/               ← "cuánto cuesta"
  panel-de-control/                     ← tour de producto del panel
  legal/ · assets/ · robots.txt · sitemap.xml · _redirects
  Landing1-L'Obscur/ … Landing4-Habitat/  ← demos de diseño web (estilo antiguo)
  Demos-Clientes/la-taberna-de-ruzafa/    ← plantilla SIN TERMINAR, en noindex
_plantillas/                            ← fuera del deploy
  generar-verticales.py                 ← genera las 3 páginas por vertical
  revisar-enlaces.py                    ← auditoría de enlaces internos
```

## Cómo se trabaja

- **Las 3 páginas por vertical se GENERAN**: editar
  `_plantillas/generar-verticales.py` y ejecutarlo. Editar el HTML a mano se
  pierde en la siguiente regeneración.
- **El marcado de la demo vive en `script.js`** (`plantillaDemo()`), no en el
  HTML. Cualquier página con `<div class="live-demo" data-live-demo="SECTOR">`
  la recibe entera. Sectores: `clinica`, `restaurante`, `servicios`.
- **Auditar enlaces antes de dar por buena una reorganización**:
  `python _plantillas/revisar-enlaces.py` (17 páginas, 220 enlaces).
- Probar en local: `python -m http.server 8080 --directory site`

## 🚨 Reglas que se rompen solas si no se miran

1. **Subir el `?v=` al tocar `styles.css` o `script.js`.** Está en `index.html` y
   en el generador (constante `VERSION`). Si no se sube, Cloudflare y el
   navegador siguen sirviendo lo viejo y parece que el despliegue no ocurrió.
2. **Nunca `overflow: hidden` en un contenedor con hijos `sticky`.** Rompió la
   cabecera de la FAQ. Usar `clip`.
3. **Los bloques a sangre completa** (`calc(50% - 50vw)`) desbordan el ancho de
   la barra de scroll. Por eso hay `overflow-x: clip` en `html, body`.
4. **Las páginas por vertical NO cargan GSAP/Lenis/SplitType** (Core Web Vitals).
   `script.js` lo detecta con `TIENE_GSAP`. No dar por hecho que existen.
5. **Sin preloader, `initHeroAnimations()` va en `queueMicrotask`**, o revienta
   por zona muerta temporal de las `const` de más abajo.

## Registro visual

**Claro** desde el 01/08. Papel cálido `#f7f4ee`, tinta `#1c1812`, bronce
`#8a6421` para texto y el oro de marca `#c9a86a` como relleno. Profundidad por
sombra (`--sombra-1/2/3`), no por contraste. Playfair Display + Inter.

⚠️ Los ajustes de componente del cambio de registro están **al final de
`styles.css`** como bloque aparte. Pendiente plegarlos dentro de cada componente
y borrar el bloque, o el mismo componente queda definido en dos sitios.

## Lo que hay en la portada

`#problema` (con banda de cifras) → `#control` (demo en vivo con el agente REAL,
selector de 3 sectores) → `#agente` → `#process` → `#tarifas` → `#services` →
`#faq` → `#contact`.

La demo habla con `POST /chat` del agente en Railway. El widget propio sigue
cargado pero **su burbuja está oculta**: lo abre el botón "Hablemos" del menú.

## Deuda conocida

- Código huérfano del selector anterior: `.fit-card--tab`, `.sector-panel`,
  `.sector-points`, `.agent-grid`, `.control-grid` en CSS; `initSectorDemo()` e
  `initChatDemo()` en JS (ya no hay `[data-chat-demo]`).
- Las demos `Landing1-4` siguen en el **estilo oscuro antiguo**: quien llega
  desde el pie se encuentra otro sitio. Sin decidir si se rediseñan o se retiran.
- `Demos-Clientes/la-taberna-de-ruzafa/` es una plantilla sin terminar (faltan
  3 imágenes, quedan marcadores `{{...}}`). Está en `noindex` y no enlazada.
- El apex desnudo `studio32.es` todavía apunta a Netlify (A `75.2.60.5`); lo
  canónico es Cloudflare Pages. Pendiente cortar el apex.

## Foco actual

La web está en buen estado. **El cuello de botella del negocio no está aquí**:
es GH Dent, bloqueado en verificar el número en Meta y conectar Google Calendar
(repo `studio32-agent`). Ninguna de las dos cosas es programar.
