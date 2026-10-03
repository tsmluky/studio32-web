# QA de la primera colección · 2026-10-02

## Estado productivo

Cloudflare Pages publica `site/` desde main en https://www.studio32.es/. PR #2 (colección) fusionado en `4e0a56d`, PR #3 (fuentes de recursos) en `4afa4f6`, PR #4 (portada/contraste) en `8dd3e00`. Netlify es integración heredada, no destino de revisión. Supabase operativo sin migraciones ni lectura de datos de clientes.

HTTP real: colección 200 con canonical www y sin noindex; robots/sitemap 200; URL inexistente 404/noindex; apex HTTP/HTTPS 301 conserva ruta y query. Hoja/fuentes de portada 200. El cliente Python sin User-Agent recibió 403; con User-Agent navegador y en navegador normal responde 200. No se desactivó ninguna protección.

## Verificaciones

- 21 páginas de producto/discovery, 24 URL de sitemap, cero errores SEO/JSON-LD.
- 34 HTML, 757 enlaces internos, cero fallos. HTMLParser excluye ejemplos comentados y detecta referencias reales con comillas simples.
- Calculadora: fórmula, límites, solapamiento, cero y rango. Eventos: consentimiento y ausencia de PII; no envío de cifras.
- Portada + 14 rutas en preview a 1440 y 390 px: 30 verificaciones con ancho real comprobado y cero overflow. Portada productiva en ambas dimensiones: H1 único y cero overflow. Demo conserva conversación y cambio de sector.
- Fuentes WOFF2 originales Inter/Playfair/Syne, manifest con URL/hash y licencias OFL. Sin CSS Google Fonts remoto en portada o colección. Archivos base styles.css, script.js y vertical.css conservan hashes iniciales.

## Rich Results oficial

Google rastreó la guía API productiva y encontró Article y BreadcrumbList válidos. dateModified incluye hora/zona. Imagen editorial ausente es recomendación opcional; no se inventó una imagen en schema.

[Resultado de Google](https://search.google.com/test/rich-results/result?id=GKL8sUNYmCsYGQYn9BKNyw).

## Rendimiento móvil de laboratorio

| Página y fase | Rendimiento | Accesibilidad | Buenas prácticas | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Guía API antes | 92 | 100 | 100 | 100 | 2,7 s | 2,7 s | 0 ms | 0,001 |
| Guía API publicada con fuentes locales | 100 | 100 | 100 | 100 | 1,2 s | 1,5 s | 0 ms | 0,001 |
| Portada antes | 88 | 96 | 100 | 100 | 3,0 s | 3,2 s | 0 ms | 0,001 |
| Portada preview final | 97 | 100 | 100 | 66 | 1,4 s | 2,6 s | 0 ms | 0 |
| Portada publicada, 05:37 CEST | 91 | 100 | 100 | 100 | 1,4 s | 3,0 s | 0 ms | 0 |

[Guía API publicada](https://pagespeed.web.dev/analysis/https-www-studio32-es-recursos-whatsapp-business-api/iri1vpwb8c?form_factor=mobile). [Portada publicada](https://pagespeed.web.dev/analysis/https-www-studio32-es/lfdyaauf03?form_factor=mobile).

La primera medición de portada durante propagación dio 83/97 y vio estilos anteriores; no se usa como resultado final. La posterior comprobación muestra los nuevos colores y fuentes. Portada todavía supera objetivo LCP 2,5 s: optimización pendiente. No atribuir mejora estable al pequeño cambio 3,2→3,0; FCP y contraste sí muestran una diferencia clara. Mantener animaciones e identidad mientras se investiga CSS/CDN/arranque. No hay CWV de campo; TBT no sustituye a INP y 100 automático no acredita accesibilidad completa.

## Evidencias locales

Capturas y JSON ignorados en `qa/`: redirect-http, production-final-http, verified-layout, home-production-http, home-production-layout, pagespeed-resource-production, pagespeed-home-production y home-production-desktop. No publicar capturas del dashboard en el sitio.

## Reproducción

```text
python _plantillas/generar-discovery.py
python _plantillas/seo-foundation.py
python _plantillas/validar-discovery.py
python _plantillas/revisar-enlaces.py
node _plantillas/test-calculator.cjs
node --check site/discovery-events.js
node --check site/consultas-calculator.js
git diff --check
```

## Pendientes reales

GA4 y consentimiento publicados; GSC sitemap procesado (24 páginas). Bing verificado por meta; sitemap procesado correctamente, 24 URL descubiertas. LCP de portada y CWV de campo. Sin adquisición atribuida ni prueba operativa de reserva de cliente real. No ampliar contenido antes de medir.

## Medición publicada · 02/10/2026

PR #6 fusionado: consentimiento básico propio, rechazo/aceptación iguales, footer integrado. 22 páginas; pruebas de medición/calculadora y SEO 21 páginas/24 URL correctas. Producción muestra cero tags antes de aceptar y el ID correcto tras aceptar, sin salto de scroll. Analytics confirma page_view de recursos/calculadora (QA propio). Vista de calculadora inicial corregida mediante orden de scripts; generator ya conserva ese orden.

Analytics tiempo real también confirma calculator_view, calculator_start, calculator_complete y calculator_result_view. Retirada en producción comprobada: recarga sin etiqueta de Google y preferencias disponibles.

## Iteración de arranque · 11:00 CEST

PR #5: entrada móvil sin overlay, escritorio con intro abreviada, explicación/CTA sin fade y seguridad desde DOMContentLoaded. Tres anchos reales 1440/1024/390 sin overflow; cuatro verticales también comprobadas. Cambio de sector Casa Duarte correcto. Preview sin overlay: rendimiento 93, LCP 3,1 s, FCP 1,4 s, Speed Index 2,7 s; no cumple objetivo LCP. Se descarta font-display optional y precarga adicional de Inter tras no obtener mejora LCP, conservando política de marca. No publicar como solución del LCP.

## Consolidación de portada · 14:33 CEST

Baseline actual producción con consentimiento: 87 rendimiento, FCP 2,1 s, LCP 3,1 s, TBT 30 ms, CLS 0, SI 5,8 s. Preview ce85887e: 96 rendimiento, 100 accesibilidad/buenas prácticas, SEO 66 por noindex de staging; FCP 1,2 s, LCP 2,7 s, TBT 0, CLS 0, SI 1,5 s. Fuentes/cascada originales, bundle exclusivo y precarga Inter. Home 1440/1024/390 sin overflow; cambio Restaurante/Casa Duarte correcto; preview no carga GA. SEO 21 páginas/24 URL, enlaces 34 HTML/801 referencias, consentimiento/calculadora pasan. Publicar mejora y comprobar producción; no dar LCP objetivo por cumplido.

## Portada consolidada publicada · 14:36 CEST

PR #5 fusionado c895a1e. Producción: 89 rendimiento, 100 accesibilidad/buenas prácticas/SEO, FCP 1,9 s, LCP 3,2 s, TBT 50 ms, CLS 0, Speed Index 4,2 s. https://pagespeed.web.dev/analysis/https-www-studio32-es/y6a28lg9bk?form_factor=mobile

La mejora de preview no acredita mejora de LCP productivo. HTTP confirma bundle/script nuevos; móvil 390 sin overflow, Inter original y preloader none; selector Restaurante muestra Casa Duarte. PR #7 consolida también measurement-consent.css en la portada para eliminar la segunda solicitud bloqueante, conservando orden y estilos.

## Ensayo CSS único no promovido · 14:40 CEST

PR #7 permanece en borrador. Preview 1d450566: 90 rendimiento, 100 accesibilidad/buenas prácticas, SEO 66 por noindex; FCP 1,9 s, LCP 3,1 s, TBT 20 ms, CLS 0, SI 4,5 s. No demuestra mejora frente a la variante previa ni cumple objetivo. Responsive real 390/1440 sin overflow; panel de consentimiento conserva estilos. Informe: https://pagespeed.web.dev/analysis/https-1d450566-studio32-web-pages-dev/6hah9n7vjq?form_factor=mobile. Producción sigue en PR #5, sin este ensayo.
# Demo: aislamiento de sesión y espera limitada · 02/10/2026

Antes, una respuesta de chat/panel pendiente sobrevivía al reinicio o al cambio
de sector. Ahora ambas peticiones se cancelan y cada respuesta comprueba la
generación de sesión antes de pintar. Chat: máximo 45 s; panel: 15 s. Sin reenvío
automático, porque cancelar la espera no prueba que el servidor no procesó el
mensaje. Al agotar espera se restablece el envío y se informa de esa incertidumbre.
El foco tras responder conserva scroll. Movimiento reducido omite también la
entrada GSAP de hero/navbar y conserva scroll nativo, manteniendo el inicio de demo.
Invitación final propia de cada sector, datos ficticios explícitos y demo_start
con sector elegido (enum) sin enviar el mensaje. Versiones de eventos y script
actualizadas en referencias y generadores, sin cambiar CSS ni fuentes.

Pruebas sin backend: `node _plantillas/test-demo-lifecycle.cjs` cubre reinicio,
cambio de tenant, respuesta tardía y error antiguo durante envío nuevo, panel
obsoleto, timeout sin reenvío y arranque único en ambos modos de movimiento.
Consentimiento, calculadora, SEO 21 páginas/24 URL y 801 enlaces pasan.
Preview 36bbbfb3: portada 390/1024/1440 y cuatro verticales 390/1440,
11 comprobaciones con anchos reales, sin overflow. Inter original; menú móvil
abre/cierra y llega a #control, selector Restaurante/Casa Duarte correcto,
invitación propia en cada vertical y cero etiquetas GA4 en staging. Revisión
final 876399c5 confirma sector restaurante, invitación y versiones correctas.
PR #8 publicado en Cloudflare (main ed44e93); producción confirma los scripts,
Casa Duarte, dataset restaurante e invitación correcta; 1440 sin overflow y
cero etiquetas Google con rechazo guardado. Captura local:
qa/demo-lifecycle-production.png. No se enviaron mensajes al backend ni se
crearon reservas durante QA. No acredita mejora de LCP ni
operación real de reservas de cliente.
## Control continuo y regreso desde demos · 02/10/2026

PR #9: workflow real success (run 37027708024, job 6 s). Local: SEO/fuentes,
804 enlaces, calculadora, consentimiento y demo pasan. Grafo: 24 canónicas,
203 conexiones, 21 importantes; máximo dos clics, sin páginas aisladas ni
salidas vacías. Tres pruebas verifican normalización, ciclos y orfandad.
Preview e8fa74c7: tres demos 390/1440 sin overflow, enlace con nombre accesible
Volver a Studio32. Regreso real de las tres a portada comprobado; L'Obscur
confirmado con clic nativo tras estabilizar layout. CSS/JS/diseño de demos
intactos. PR #9 fusionado en main caa6cb8 y publicado en Cloudflare. Producción
confirma enlace ../ con nombre accesible en Habitat y regreso real a portada.
CI de main 37028651678 correcto: job 7 s, total 12 s; checkout v7.0.1 con Node
24 y runner ubuntu-24.04. Captura local: qa/quality-main-success.png. No se
ha repetido PageSpeed: LCP conserva su última medida documentada de 3,2 s.

## Publicación y demo histórica · PR #10

Main ba978dc, Cloudflare publicado. Siete pruebas de seguridad editorial pasan;
SEO 21 páginas/24 URL, enlaces 34 HTML/806 referencias sin fallos y grafo 203
conexiones con máximo dos clics. Calculadora, consentimiento y demo pasan.
CI de PR 37038715825 success, job 7 s. Preview móvil 390: client/scroll 375,
sin overflow. Producción: noindex,follow; cuatro inputs deshabilitados; cero
formularios y cero scripts localhost; escritorio client/scroll 1265 iguales.
Clic de navegador en CTA lleva a https://www.studio32.es/#control. Captura:
qa/taberna-production-safe.png. Clic semántico inicial en preview no navegó;
control AX del navegador sí confirmó destino. No se rellenaron campos ni
enviaron reservas. Escáner es limitado, no auditoría integral de secretos/backend.
CI de main 37038917631 success; job 118 s, incluido checkout. No extrapolar los
siete segundos de la ejecución de PR a la ejecución de main.

## 2026-10-03 · Navegación móvil, cifras y prueba de rendimiento

PR #12 publicado, main 44755bc: entrada del hero móvil sin animación; escritorio
conservado. Menú con foco inicial, ciclo Tab/Shift+Tab, Escape con retorno al
botón, foco en destino interno y cierre al pasar a escritorio. Pruebas de
comportamiento automatizadas y navegador móvil 390/escritorio 1440. Producción:
foco inicial Pruébalo, Escape vuelve a Abrir menú, ancho client/scroll 375 iguales.
Captura qa/mobile-menu-production.png. CI main 37119581490 correcto.

PSI de producción tras PR #12, 03/10/2026 13:30 CEST: 89 rendimiento y 100 en
accesibilidad, buenas prácticas y SEO; FCP 1,9 s, LCP 3,3 s, TBT 60 ms, CLS 0,
SI 4,3 s. [Informe](https://pagespeed.web.dev/analysis/https-www-studio32-es/vj8dm159un?form_factor=mobile). No hay datos de campo. Preview había mostrado
93/FCP 1,2/LCP 3,2; esa mejora no se reproduce en esta medición de producción.
No cerrar el objetivo LCP <2,5 s ni inferir resultados comerciales.

PR #11 permanece en borrador, sin publicar: instancia estática de Inter original
redujo el archivo de 48.256 a 23.692 bytes, pero preview dio 88 y LCP 3,2 s.
No se ha cambiado la tipografía productiva por este experimento.

PR #13 publicado, main 1b212ee: cifras de portada con fuentes primarias clicables,
periodo INE explícito y umbral diez o más empleados; intención de inversión
YouGov/IONOS diferenciada de gasto ejecutado. IAB reproduce penetración mensual
sin extrapolar a toda la población internauta. Ver HOME_CLAIMS.md. Layout y
fuentes conservados; producción confirma las tres correcciones. CI PR
37119966128 correcto, job 9 s; main y Cloudflare correctos.

SEO: 21 páginas de producto/discovery, 24 URL de sitemap; 34 HTML y 806
referencias locales sin fallos. Siete pruebas editoriales correctas. Apartados
36–38 (fuentes/estadísticas/claims), 46 (accesibilidad) y 60–64 (QA); rendimiento
23/129 abierto. Paso 15 recoge datos mientras continúa el desarrollo; no se da
por terminado todo el maestro de 158 apartados.

## 2026-10-03 · Mantenimiento editorial y auditoría fiable

PR #14 publicado, main 617f034: fecha visible derivada de reviewedAt, guardas
de estado publicado/responsable/cronología/zona antes de escribir; registro
con publishedAt y cola de 17 revisiones (seis fuentes y once páginas). Cero
vencidas a 03/10; fuentes 31/12/2026, conceptual 02/10/2027. No se han cambiado
fechas públicas ni creado automatizaciones. Cinco pruebas nuevas en CI.

PR #15 publicado, main 68f8342: auditoría HTTP no sobrescribe baseline, fecha
UTC actual y guardado explícito exclusivo; fallo ante errores o soft 404. Tres
pruebas sin red en CI. Lectura pública 03/10 11:56 UTC: portada/robots/sitemap
200, ruta inexistente 404, apex acaba en www. La lectura sigue redirecciones,
no acredita el código del primer salto ni acceso de bots reales. Evidencia
local qa/http-20261003.json. La baseline original permanece intacta.

Apartados 54, 63, 104–105, 120, 149 (mantenimiento) y 18, 61–62, 126
(auditoría). HTML regenerado idéntico: no se modifican tipografía, diseño o
contenido público. Validación: 21 páginas/24 sitemap, 806 referencias locales
sin errores; siete pruebas de seguridad, cinco editoriales y tres HTTP.
REMAINING_PLAN.md detalla los bloques pendientes y sus condiciones. LCP sigue
abierto con última lectura 3,3 s; no se midió otra vez tras cambios de herramientas.

## 2026-10-03 · Chat de contacto accesible y experimento de LCP

PR #17 publicado, main a349dab: campo de chat con etiqueta accesible, diálogo
no modal, historial log anunciado, Escape y botón Cerrar con retorno a Hablemos.
Diseño y widget originales preservados. Pruebas sin backend cubren carga
inmediata/tardía y cierre. Navegador en preview y producción confirma etiqueta,
apertura, Escape y foco. Producción móvil 390: client/scroll 375 iguales.
Sin enviar mensajes, datos ni reservas. Captura qa/contact-accessibility-production.png.
CI de main 37122042769 y Cloudflare correctos; CI PR 37121994506, job 8 s.

Último PSI productivo 03/10 14:11 CEST: 92 rendimiento, 100 accesibilidad,
buenas prácticas y SEO; FCP 1,2 s, LCP 3,3 s, TBT 40 ms, CLS 0, SI 2,6 s.
[Informe](https://pagespeed.web.dev/analysis/https-www-studio32-es/j9ymwua046?form_factor=mobile). Medida de laboratorio aislada; no atribuir diferencia de
puntuación al cambio de accesibilidad ni cerrar LCP <2,5 s o CWV de campo.

PR #16 queda en borrador sin publicar. Widget bajo demanda pasa pruebas de
instancia única, apertura, fallo, timeout y respuesta tardía. Preview 14:06:
85/100/100/66 (noindex), FCP 1,9 s, LCP 3,8 s, TBT 50 ms, CLS 0, SI 4,2 s.
Control productivo 14:07: 89/100/100/100, FCP 1,9 s, LCP 3,2 s, TBT 10 ms.
No demostró mejora; no promoverlo por reducir una descarga. Desglose de LCP
en control previo: párrafo hero-desc, demora de render ~2,3 s. Diagnóstico abierto.

Referencias locales actuales: 807 (631 navegación, 176 recursos), cero errores;
24 URL de sitemap, 34 HTML. La nueva referencia es contact-accessibility.js,
no una página nueva. Grafo e inventario de páginas no se amplían.
Apartados 46–47, 60–62 (recorrido/QA); 23/129 permanecen abiertos.
