# Experimento inicial

Fecha de preparación: 2026-10-02. Despliegue inicial: 2026-10-02 03:08 UTC, PR #2 / main 4e0a56d. Mejora de fuentes: 03:17 UTC, PR #3 / main 4afa4f6. Responsable: Studio32.

Hipótesis: guías operativas, páginas de problemas y una calculadora ayudarán a que negocios con dudas sobre recepción y citas encuentren el producto y evalúen una demo.

Cambio: foundation, siete recursos, tres problemas, una herramienta y tres hubs. Registro de URLs/intenciones: `CONTENT_REGISTRY.json`. Baseline HTTP y tamaños: `HTTP_BASELINE.json`, `PERFORMANCE_BASELINE.json`.

Métricas: consultas relevantes no marca, indexación, visitas por origen, uso de herramienta, solicitudes de demo y leads comerciales cualificados. Clic en WhatsApp no equivale a lead.

Resultado técnico: colección y consentimiento publicados; GA4 recibe vistas y eventos de calculadora de QA. GSC procesa el sitemap (24 páginas). Bing verificado, sitemap enviado. Adquisición comercial todavía sin evidencia. Decisión actual: mantener la colección y medir antes de ampliar.

## Siguiente tramo del informe maestro

Inicio de recogida real: 02/10/2026. Las primeras visitas y eventos son pruebas propias; no contabilizarlos como captación.

| Orden | Trabajo | Criterio para cerrarlo |
|---|---|---|
| 1 | Informes útiles en GA4: adquisición, páginas de entrada, uso de calculadora/demo y clics de contacto | Informes guardados con dimensiones page_type, sector y cta_type; distinguir interacciones de leads reales |
| 2 | Indexación de la colección en GSC/Bing | Revisar procesamiento de Bing y cobertura por URL; corregir causas reales de exclusión, sin asumir que sitemap implica indexación |
| 3 | Rendimiento de portada | LCP móvil objetivo 2,5 s comprobado en producción; conservar identidad y demo. PR #5 publicado: LCP productivo 3,2 s, objetivo abierto. PR #7 en borrador sin mejora demostrada |
| 4 | Registro comercial mínimo | Registrar fecha, origen conocido, necesidad y resultado de consultas reales; no enviar datos personales ni conversaciones a GA4 |
| 5 | Evaluación de la colección | Comparar consultas no marca, entradas por recurso, uso de herramienta y oportunidades cualificadas; modificar según evidencia |

Revisiones desde activación: 01/11/2026 (30 días), 01/12/2026 (60 días), 31/12/2026 (90 días). Son hitos del plan, no tareas automáticas programadas. Si el volumen no permite concluir, registrar esa limitación y mantener la observación; no inventar objetivos de tráfico ni declarar éxito por visitas propias.

El panel de tiempo real verifica la recepción de eventos. La decisión editorial/comercial requiere los informes acumulados y el registro de consultas. Medición solo de visitantes que aceptan; las cifras de GA4 no representan todas las visitas.

Mientras se acumulan datos, continuar correcciones técnicas, QA de recorridos y
mejoras de lo publicado. El usuario confirmó expresamente este trabajo activo;
la pausa del paso 15 se refiere a expansión editorial, no a inactividad.

## Cierres del tramo · 02/10/2026

Informes publicados en colección Studio32 · Captación y uso, tres dimensiones registradas y uso/contacto guardado. Bing sitemap Success (24 URL, cero errores). Google guía API indexable en prueba viva y solicitud de indexación aceptada; pendiente rastreo/indexación real. Registro comercial vacío preparado. El pendiente técnico principal sigue siendo LCP de portada; los resultados de adquisición requieren tiempo y consultas reales.

Ensayo PR #7: bundle de tres hojas, preview 90/100/100/66 (SEO noindex de staging), FCP 1,9 s, LCP 3,1 s, TBT 20 ms, CLS 0, SI 4,5 s. No supera el preview previo ni demuestra objetivo productivo. Conservar en borrador; no publicarlo por reducir solicitudes sin mejora observada. Las medidas aisladas tienen variación: diagnosticar el retraso de renderizado antes de otro cambio.

## Registro de decisiones · 03/10/2026

| Prueba | Preview | Producción | Decisión |
| --- | --- | --- | --- |
| #11 Inter estática original, 48.256 → 23.692 bytes | 88 rendimiento, FCP 2,1/LCP 3,2 s | No publicada | Borrador; bytes reducidos sin mejora acreditada |
| #12 Entrada móvil y foco de menú | 93 rendimiento, FCP 1,2/LCP 3,2 s | 89, FCP 1,9/LCP 3,3 s, CLS 0 | Publicada por corrección de accesibilidad; no cerrar LCP ni afirmar mejora productiva |
| #13 Cifras y fuentes | Diseño y destinos revisados | Tres textos y fuentes confirmados | Publicada por precisión; no experimento de conversión |
| #14–15 Mantenimiento y auditor | Pruebas y CI correctos | HTML público idéntico | Integradas; evitan fechas falsas, borradores y pérdida de baseline |

Medidas aisladas de laboratorio, sin grupo control ni efecto comercial probado.
No extrapolar preview a producción. Evidencia y reportes en QA.md.

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


## 2026-10-03 · Ronda acotada cerrada y aprobación por página

Una sola variante: prioridad alta en el preload existente de Inter, sin cambiar
fuentes, CSS, diseño o demo. Control productivo 19:24:08 CEST: rendimiento 91,
accesibilidad/buenas prácticas/SEO 100; FCP 1,7 s, LCP 3,3 s (3254 ms),
TBT 50 ms, CLS 0 y SI 2,8 s. Preview 19:24:27: rendimiento 88, FCP 2,0 s,
LCP 3,3 s (3285 ms), TBT 110 ms, CLS 0 y SI 4,3 s; SEO 66 por noindex.
Comparación aislada entre producción y preview, sin datos de campo: no demuestra
beneficio. PR #18 cerrada sin fusionar. Ronda finalizada; objetivo 2,5 s abierto,
sin ampliar experimentos ni modificar las fuentes originales.

Como siguiente corrección del maestro (104/121, reglas editoriales y validación),
PR #19 integrada en main cda1ea6: una página draft/review/stale o con estado vacío
ya no puede ocultarse dentro de una colección published. Se rechaza el conjunto
antes de generar; las páginas sin estado individual heredan el de la colección.
No se regeneraron contenidos ni fechas públicas. Validación: siete pruebas de
seguridad, seis editoriales y tres HTTP; 21 páginas/24 sitemap sin errores.
CI y Cloudflare de la PR correctos.

Informes: [control](https://pagespeed.web.dev/analysis/https-www-studio32-es/erpofuocre?form_factor=mobile), [variante](https://pagespeed.web.dev/analysis/https-7a271945-studio32-web-pages-dev/ebh9c9sf06?form_factor=mobile).
