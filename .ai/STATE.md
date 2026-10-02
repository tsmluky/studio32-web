# Estado actual · studio32-web

Actualizado: **2026-10-02**. Estado canónico; histórico en DECISIONS.md.

## Producto y publicación

Web comercial Studio32 → `https://www.studio32.es`. HTML/CSS/JS estático; solo
`site/` se publica. Sin framework ni npm/build para el sitio. Cloudflare Pages
confirmado en dashboard: proyecto `studio32-web`, repositorio conectado, rama
productiva `main`, salida `site` y dominio `www.studio32.es` activo con SSL.
Supabase `studio32-hub` conserva su función operativa; esta web sigue estática.
Netlify es una integración heredada; el apex ya redirige a Pages en Cloudflare.
Ver `docs/seo/INFRASTRUCTURE.md`.

## Trabajo actual

Primera colección publicada el 2026-10-02 en Cloudflare desde `main`, PR #2
fusionado en `4e0a56d`. HTTP real: rutas 200, sitemap/robots 200, URL inexistente
404 y apex 301 a www con path/query conservados. Google rastrea la guía API y
valida Article/Breadcrumb. Informe maestro adoptado; preservar marca y demo.
Documentación: `docs/seo/`; estado por pasos en `IMPLEMENTATION_PROGRESS.md`.

Rama `fix/discovery-font-loading`: mejora de rendimiento de recursos con las
mismas Inter/Playfair servidas localmente, licencias OFL y preload del titular.
No afecta CSS/JS ni fuentes de portada, verticales o demo.

- Siete guías, tres problemas, una calculadora y tres hubs.
- Organization, BreadcrumbList, sitemap generado, OAI-SearchBot permitido.
- Tarifas de Meta corregidas con fuente oficial; sin rangos de mercado inventados.
- Enlaces nuevos solo en footer comercial: portada y demo conservan estructura.
- `styles.css`, `script.js`, `vertical.css` mantienen hashes iniciales.
- Eventos locales sin red, cookies, persistencia, PII ni cifras de calculadora.
- Usuario confirmó que GA4, GSC y Bing **todavía no están configurados**.

## Estructura publicada

```text
site/
  index.html · styles.css · script.js
  vertical.css · panel.css · panel.js
  agente-whatsapp-clinicas-dentales/
  agente-whatsapp-restaurantes/
  agente-whatsapp-centros-esteticos/
  agente-whatsapp-servicios-locales/
  precio-agente-whatsapp/ · panel-de-control/
  recursos/ · problemas/ · herramientas/
  discovery.css · discovery-events.js · consultas-calculator.js
  404.html · legal/ · assets/ · robots.txt · sitemap.xml
  Landing1-4 · Demos-Clientes · Agencia-Portfolio
```

## Fuentes, generación y QA

`_plantillas/discovery-content.json` es fuente editorial estructurada: intención,
copy, bloques, fuentes fechadas, relacionados y destino comercial. Todo texto se
escapa; solo referencias internas `[[ruta|texto]]` crean links. HTML versionado;
registro `docs/seo/CONTENT_REGISTRY.json` tiene estado `review`.

```text
python _plantillas/generar-discovery.py
python _plantillas/seo-foundation.py
python _plantillas/validar-discovery.py
python _plantillas/revisar-enlaces.py
node _plantillas/test-calculator.cjs
python -m http.server 8088 --directory site
```

Generador histórico `generar-verticales.py`: tres verticales; estética tiene HTML
propio. Mantiene discovery al regenerar; después ejecutar foundation/sitemap.
No ejecutar una regeneración de verticales como sustituto de revisar cambios
manuales anteriores. Sitemap mantiene hashes y fechas estables en SITEMAP_STATE.

QA: 21 páginas principales, 24 URL sitemap, cero errores SEO; 34 HTML y 754 enlaces,
cero enlaces rotos; auditor HTMLParser excluye ejemplos comentados y detecta comillas simples. Navegador: 14 rutas en
1440/390 px, tablas móviles corregidas, calculadora con ejemplo y cero verificados.
Capturas locales ignoradas en `docs/seo/qa/`. Rich Results oficial productivo válido para guía API; CWV de campo sin datos.

## Límites actuales confirmados

Apex → www corregido mediante Single Redirect activo en Cloudflare, 301 con
path/query conservados. HTTP y HTTPS comprobados; sin cambio de DNS. URL inexistente en www devuelve 404 correcto tras publicar.
DNS verificado: www CNAME a Pages; apex A proxied a 75.2.60.5 y cabecera Netlify.
Preview Cloudflare devuelve noindex/404 correcto; repetir tras publicar. Python local
no interpreta `_headers` ni `_redirects`. No modificar DNS por una nota vieja.

Producto canónico en repo `studio32-agent`: piloto pendiente, sin evidencia de
cliente real operando el recorrido completo. Las guías explican evaluación y
criterios de implantación; no vender coexistencia/agenda como alta universal o
garantía de ausencia de conflictos. No usar demos como tracción comercial.

## Reglas técnicas que importan

- Subir `?v=` si se modifica CSS/JS compartido; mismo valor en referencias y fuentes.
- No `overflow:hidden` en padres de sticky; usar clip cuando proceda.
- Demo HTML vive en `script.js`, con sector por `data-live-demo`.
- Verticales y recursos no añaden GSAP/Lenis/SplitType; recursos tampoco cargan agente.
- Registro visual claro: papel cálido, tinta, bronce, Playfair Display + Inter.
- No ampliar contenido antes de medir esta primera colección.

## Próximo cierre

Validar mejora de fuentes en preview y publicar → cuentas/consentimiento →
GSC/Bing y baseline de adquisición. Apex/404 y publicación inicial cerrados.
Seguimiento y criterios: `docs/seo/MEASUREMENT.md`, `BACKLOG.md`, `EXPERIMENTS.md`.
