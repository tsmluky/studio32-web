# Auditoría orgánica · 2026-10-02

Inspección previa a cambios, rama `feat/organic-discovery`. Base Git limpia y `git pull --rebase` actualizado. El informe maestro se utiliza como especificación adoptada por el usuario; sus ejemplos no justifican inventar capacidades o datos.

## Arquitectura y evidencia

HTML/CSS/JS estático, sin framework ni build. Solo `site/` se publica. Configuración Netlify presente; `.ai/STATE.md` describe Cloudflare Pages como destino principal. Actualización tras inspección del dashboard: Cloudflare Pages confirmado, salida `site`, rama `main`, www activo; apex conserva origen Netlify. Ver `INFRASTRUCTURE.md`. WAF no auditado. Canonical existente: `https://www.studio32.es`. No migrar el dominio.

Inventario inicial: 19 HTML. Siete páginas comerciales: portada, cuatro verticales, precio y panel. Demos: Landing1 (dos HTML), Landing2, Landing3, Landing4 y Demos-Clientes. Tres legales y tres documentos históricos de Agencia-Portfolio. Inventario completo automatizado: `URL_INVENTORY.json`.

| Hallazgo | Severidad | Estado inicial | Cambio previsto | Archivos | Riesgo |
|---|---|---|---|---|---|
| Tarifas y cifras sin soporte | high | Precio menciona 1.000 conversaciones gratis y rangos de mercado sin fuente | Corregir modelo de Meta con fuente primaria; retirar rangos no documentados, mantener presupuesto a medida | precio-agente-whatsapp/index.html | bajo |
| Sitemap | high | Incluye Landing3 con noindex y demos sin canonical; mantenimiento manual | Generar desde HTML indexable con canonical; conservar URLs de demos y añadirles canonical | sitemap.xml, _plantillas | bajo |
| Medición | high | No GA4 ni CMP; privacidad declara ausencia de cookies analíticas | Instrumentación local sin red/PII, adaptador solo con consentimiento e integración explícita; documentar activación pendiente | discovery-events.js, docs/seo | bajo |
| Entidad | medium | ProfessionalService, priceRange y logo que es una portada social | Organization con datos reales, sin localización postal ficticia ni logo falso | index.html | bajo |
| Arquitectura temática | medium | Solo páginas comerciales, sin hubs ni recursos | Siete guías, tres problemas y una calculadora; enlazado contextual y hubs | recursos/, problemas/, herramientas/ | medio editorial |
| Breadcrumb | medium | Migas visibles sin marcado uniforme | BreadcrumbList en páginas comerciales y nuevas | generadores, páginas comerciales | bajo |
| 404 | medium | No 404.html explícito | Página útil noindex; comprobar HTTP real después de despliegue | 404.html | bajo |
| Soft 404 confirmado | high | URL inexistente devuelve portada con HTTP 200 en producción | 404.html de nivel superior para Cloudflare Pages; verificar tras publicar | 404.html, HTTP_BASELINE.json | bajo |
| Host duplicado confirmado | high | Apex y www sirven HTML diferente con HTTP 200 | Mantener www como canonical; redirección apex en proveedor antes de dar foundation por cerrada | configuración externa | requiere acceso al proveedor |
| Enlaces históricos | low | 3 assets ausentes en plantilla noindex Demos-Clientes | Registrar deuda existente sin mezclar rediseño de demos | Demos-Clientes | existente |
| Rendimiento | medium | Portada usa GSAP, Lenis y SplitType; interiores son ligeros | Recursos sin esas dependencias ni carga de agente; presupuesto y QA separado | discovery.css, páginas nuevas | bajo |

## Producto, privacidad y límites

La demo pública usa el agente real mediante `script.js`. No se modifica su flujo. Se inspeccionó el repo canónico `studio32-agent`: takeover/release, agenda y conector de coexistencia tienen código, pero su STATE indica piloto pendiente y cambios locales sin despliegue comprobado. Los nuevos recursos deben explicar criterios de implantación y enlazar demo/panel; no presentarlos como clientes activos, integración universal o garantía de cero conflictos. Recordatorios productivos y coexistencia requieren validación por negocio.

No rutas privadas del panel en este directorio publicado. Legales y plantilla incompleta ya llevan noindex. No bloquearlos en robots porque hay que poder leer ese noindex. `Allow: /` ya permite OAI-SearchBot. No cambiar la política GPTBot. Sin llms.txt, CMS, nuevos CDN, contenido jurídico, estadísticas inventadas ni URLs geográficas.

## Baseline y validación

`python _plantillas/revisar-enlaces.py`: 19 páginas, 297 enlaces internos, 3 fallos preexistentes solo en plantilla incompleta. No hay build/lint/typecheck del sitio. Se añadirá comprobación de metadatos, canonical, JSON-LD, sitemap, enlaces, borradores e inputs de calculadora. Tamaño y latencia HTTP se registran aparte; no equivalen a LCP/INP/CLS. CWV de campo, Search Console, Bing y conversiones requieren acceso a cuentas o datos reales; no se darán por medidos.

La lectura HTTP del 02/10 está en `HTTP_BASELINE.json`: www, robots y sitemap responden 200; apex también responde 200 sin redirigir y una URL inventada devuelve la portada con 200. DNS/CDN verificados posteriormente en dashboard, con resultados en `INFRASTRUCTURE.md`. Cloudflare documenta que un `404.html` de nivel superior evita el fallback SPA; sus `_redirects` no soportan redirecciones por dominio. Fuentes: [serving pages](https://developers.cloudflare.com/pages/configuration/serving-pages/) y [redirects](https://developers.cloudflare.com/pages/configuration/redirects/), consultadas el 02/10/2026. No añadir una regla de host inválida al archivo ni migrar DNS por suposición.
