# Estado actual · studio32-web

Actualizado: **2026-10-03**. Estado canónico; histórico en DECISIONS.md.

## Producto y publicación

Web comercial Studio32 → `https://www.studio32.es`. HTML/CSS/JS estático; solo
`site/` se publica. Sin framework ni npm/build para el sitio. Cloudflare Pages
confirmado en dashboard: proyecto `studio32-web`, repositorio conectado, rama
productiva `main`, salida `site` y dominio `www.studio32.es` activo con SSL.
Supabase `studio32-hub` conserva su función operativa; esta web sigue estática.
Netlify está retirado: tres proyectos desactivados y builds de `studio-32`
detenidos. El apex redirige en Cloudflare sin origen Netlify. `netlify.toml`
mantiene `ignore = "exit 0"` como guarda ante una reactivación accidental.
Ver `docs/seo/INFRASTRUCTURE.md`.

## Último avance · 03/10/2026

Ronda acotada de rendimiento terminada: una variante, PR #18 cerrada sin fusionar.
Prioridad alta de Inter no demuestra mejora: control 19:24 CEST 91/100/100/100,
FCP 1,7 s, LCP 3,3 s, TBT 50 ms, CLS 0; preview 88, LCP 3,3 s y TBT 110 ms.
Sin cambios de fuentes/diseño; objetivo 2,5 s abierto, sin datos de campo.
Siguiente corrección integrada: PR #19 cda1ea6 impide publicar páginas borrador
dentro de una colección aprobada; seis pruebas editoriales, CI/Cloudflare correctos.
PR #17 conserva accesibilidad del chat verificada en producción. #7/#11/#16
siguen sin publicar. 807 referencias locales, 24 URL sitemap y 34 HTML.
Pendientes/condiciones en docs/seo/REMAINING_PLAN.md; evidencia en QA.md.

## Trabajo actual

Primera colección publicada el 2026-10-02 en Cloudflare desde `main`, PR #2
fusionado en `4e0a56d`. HTTP real: rutas 200, sitemap/robots 200, URL inexistente
404 y apex 301 a www con path/query conservados. Google rastrea la guía API y
valida Article/Breadcrumb. Informe maestro adoptado; preservar marca y demo.
Documentación: `docs/seo/`; estado por pasos en `IMPLEMENTATION_PROGRESS.md`.

PR #3 fusionado en `4afa4f6`: mejora de rendimiento de recursos con las
mismas Inter/Playfair servidas localmente, licencias OFL y preload del titular.
No afecta CSS/JS ni fuentes de portada, verticales o demo.

- Siete guías, tres problemas, una calculadora y tres hubs.
- Organization, BreadcrumbList, sitemap generado, OAI-SearchBot permitido.
- Tarifas de Meta corregidas con fuente oficial; sin rangos de mercado inventados.
- Enlaces nuevos solo en footer comercial: portada y demo conservan estructura.
- styles.css y vertical.css mantienen hashes iniciales; script.js tiene cambio de arranque aprobado en PERFORMANCE_APPROVED.json.
- Eventos enumerados; adaptador GA4 solo tras consentimiento, sin PII ni cifras de calculadora.
- GA4 Studio32 / Studio32 · Web activo; GSC/Bing sitemaps procesados (24 URL cada uno).

## Estructura publicada

```text
site/
  index.html · styles.css · home-bundle.css · home-foundation.css · script.js
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
registro `docs/seo/CONTENT_REGISTRY.json` tiene estado `published`.

```text
python _plantillas/generar-discovery.py
python _plantillas/seo-foundation.py
python _plantillas/validar-discovery.py
python _plantillas/revisar-enlaces.py
python _plantillas/revisar-grafo.py
python _plantillas/test-grafo.py
node _plantillas/test-calculator.cjs
node _plantillas/test-measurement.cjs
node _plantillas/test-demo-lifecycle.cjs
python _plantillas/generar-home-css.py
python -m http.server 8088 --directory site
```

Generador histórico `generar-verticales.py`: tres verticales; estética tiene HTML
propio. Mantiene discovery al regenerar; después ejecutar foundation/sitemap.
No ejecutar una regeneración de verticales como sustituto de revisar cambios
manuales anteriores. Sitemap mantiene hashes y fechas estables en SITEMAP_STATE.

QA: 21 páginas principales, 24 URL sitemap, cero errores SEO; 34 HTML y 807
referencias locales href/src (631 navegación, 176 recursos; incluye repeticiones),
cero enlaces rotos; auditor HTMLParser excluye ejemplos comentados y detecta comillas simples. Navegador: 15 rutas en
1440/390 px, tablas móviles corregidas, calculadora con ejemplo y cero verificados.
Capturas locales ignoradas en `docs/seo/qa/`. Rich Results oficial productivo válido para guía API; CWV de campo sin datos.
Inventario actual: 24 páginas de sitemap (portada + 23 subpáginas), ocho HTML
noindex y dos históricos/alias fuera del sitemap. Las 24 URL canónicas respondieron
200 en consulta HTTP del 02/10/2026. No equivale a indexación. Ver PAGE_INVENTORY.md.

## Límites actuales confirmados

Apex → www corregido mediante Single Redirect activo en Cloudflare, 301 con
path/query conservados. HTTP y HTTPS comprobados; sin cambio de DNS. URL inexistente en www devuelve 404 correcto tras publicar.
DNS verificado tras retirar Netlify: www CNAME a Pages; apex A proxied a
192.0.2.1, dirección reservada para redirección sin origen. Regla activa en
Cloudflare; no apunta a Netlify. Si se elimina la regla, el apex dejaría de
redirigir: conservarla. HTTP/HTTPS, rutas/query, www 200 y 404 verificados.
Preview Cloudflare devuelve noindex/404 correcto; producción ya comprobada. Python local
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

## Medición publicada

PR #6 fusionado en 1800cdc: cuenta GA4 Studio32 creada y activa con Google
personal autorizado por usuario. Consentimiento básico en 22 páginas, tracker
solo tras aceptar, parámetros enumerados y URLs filtradas. Test de retirada,
rechazo, caducidad y privacidad correcto. Producción activa: Analytics tiempo
real muestra recursos/calculadora, tráfico propio de QA. GSC dominio existente
con Google personal: sitemap procesado, 24 páginas descubiertas. Ver MEASUREMENT.md para IDs/estado.
PR #5 publicado en c895a1e: CSS de portada consolidado y
precarga Inter original; intro móvil omitida, escritorio abreviado, CTA visible.
Preview 96 rendimiento, FCP 1,2 s, LCP 2,7 s. Producción 89 rendimiento,
FCP 1,9 s, LCP 3,2 s, CLS 0: objetivo no acreditado. PR #7 queda en borrador:
incluir consentimiento en el bundle dio preview 90 rendimiento y LCP 3,1 s;
no demuestra mejora y no se ha publicado. No confundir preview con producción.
Originales CSS intactos; bundle generado conserva cascada. Cambios de arranque
aprobados y hashes CRLF/LF exactos en PERFORMANCE_APPROVED.json.

Colección GA4 Studio32 · Captación y uso publicada; dimensiones de evento
page_type/sector/cta_type y reporte Uso y contacto guardados. Bing sitemap
Success con 24 URL. Guía API en Google descubierta/sin indexar; prueba viva
indexable y solicitud aceptada. Registro comercial vacío en docs/seo.

## Desarrollo activo mientras se recogen datos

PR #8 corrige demo: aborta chat/panel al cambiar sesión, descarta respuestas
anteriores y limita espera (chat 45 s, panel 15 s), sin reenvío automático.
Invitación coherente por sector y datos ficticios explícitos. Movimiento reducido
conserva scroll nativo y omite entrada de hero/navbar. demo_start usa el sector
elegido (enum), sin mensaje ni datos personales. Preview móvil/escritorio de
portada y cuatro verticales correcto; pruebas de carreras/timeout sin backend.
Versiones actuales: script 20261003-mobile-1, discovery-events 20261002-events-2.
Publicado en Cloudflare tras PR #8, main ed44e93. Producción confirma versiones,
Restaurante/Casa Duarte, invitación y dataset correctos, 1440 sin overflow,
cero etiquetas GA4 con rechazo guardado. No se enviaron mensajes ni reservas
reales en QA; las carreras y timeouts se probaron con respuestas simuladas.

El paso 15 pausa expansión editorial, no correcciones técnicas ni validación de
recorridos. Continuar trabajo activo autorizado mientras se acumula medición.

## Pendientes y próxima decisión

PR #9 publicado en Cloudflare desde main caa6cb8: CI de SEO/enlaces/privacidad/
calculadora/demo/grafo en PR y main, sin paquetes, secretos ni backend; paths
filtra cambios documentales. Ejecución de main success (run 37028651678,
job 7 s). Runner ubuntu-24.04 y checkout oficial v7.0.1 con Node 24,
fijado a commit. No se ampliaron permisos. Grafo: 24 canónicas,
203 conexiones, 21 importantes; máximo dos clics y sin huérfanas/salidas vacías.
Tres demos enlazan desde su atribución existente a Studio32; 390/1440 sin
overflow y regreso real comprobado. Preparadas TOPIC_COVERAGE y AI_QUERY_SET;
sin citas/menciones de IA muestreadas aún. Producción confirma enlace de regreso
de Habitat y navegación a portada; las tres demos se comprobaron en preview.

PR #10 fusionado en main ba978dc: generador valida rutas/fuentes/referencias
antes de escribir; siete pruebas de seguridad editorial pasan en CI. El
validador bloquea URLs HTML activas locales/staging y archivos/firmas privadas
con diagnóstico sin valores. Taberna no carga localhost, mantiene noindex y
presenta campos de ejemplo deshabilitados, sin submit; CTA lleva a #control.
Preview 390 sin overflow y destino confirmado mediante clic de navegador.
Producción confirma noindex, cuatro inputs deshabilitados, cero formularios y
scripts localhost, sin overflow a 1265; CTA navega a www/#control. CI de main
37038917631 success. Captura local qa/taberna-production-safe.png.
Procedimiento de reversión en PUBLICATION_SAFETY.md; no ejecutado en producción.

Resolver LCP móvil con evidencia productiva (objetivo 2,5 s), observar indexación
efectiva y demanda. No confundir solicitud/sitemap con indexación ni QA con
captación. Registro comercial: copiar plantilla a un lugar privado antes de usar.
Revisiones 01/11, 01/12 y 31/12/2026; no son automatizaciones programadas.
Seguimiento: `docs/seo/MEASUREMENT.md`, `BACKLOG.md`, `EXPERIMENTS.md`, `QA.md`.
