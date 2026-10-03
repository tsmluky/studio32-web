# Backlog condicionado a evidencia

| Idea | Prioridad | Estado / condición |
|---|---|---|
| Apex → www | P0 | Cerrado: regla Cloudflare activa, 301 HTTP/HTTPS conservando path/query; ver INFRASTRUCTURE.md |
| GA4 + GSC + Bing | P0 | GA4 y consentimiento publicados, tiempo real confirma QA; GSC sitemap correcto (24 páginas); Bing verificado por meta; sitemap procesado correctamente, 24 URL descubiertas |
| Validación HTTP 404 tras publicar | P0 | Cerrado: producción devuelve 404 correcto tras PR #2; HTTP verificado |
| Rich Results y CWV | P0 | Google rastrea y valida guía API. PSI medido; CWV de campo sin datos, no inferir INP de TBT |
| RGPD y proveedores | P1 | No publicar sin revisión específica y fuentes jurídicas vigentes |
| Costes y recordatorios WhatsApp | P1 | Demanda observada y recorrido productivo validado; no prometer plantillas/outbox no desplegados |
| Calculadora de no-shows | P2 | Medir primero utilidad de calculadora inicial; separar oportunidad de costes |
| Datos/benchmarks | P2 | Solo datos reales, metodología y autorización pertinente |
| Casos de éxito | P2 | Piloto real y evidencia; nunca utilizar demos como clientes |
| Limpieza de demos antiguas | P2 | Favicon y regreso desde tres demos corregidos. PR #10 elimina widget localhost de Taberna; muestra visual sin datos/reservas y CTA a Studio32. Rediseño histórico fuera del alcance |
| Guardas de publicación / contenido | P1 | PR #10 publicado: rutas/fuentes validadas, siete pruebas, URLs locales/staging y archivos/firmas privadas comprobados. No certifica seguridad completa |
| Reversión crítica | P1 | Procedimiento documentado en PUBLICATION_SAFETY.md, con versiones nuevas para assets cacheados; no ensayado en producción |

No publicar por volumen. Cada nueva URL necesita intención, aporte operativo, fuente cuando corresponda, responsable y conexión con el producto.

## Pendiente verificado tras publicación de portada

Último PSI productivo tras PR #5: 89 rendimiento, LCP 3,2 s (objetivo 2,5), FCP 1,9 s; accesibilidad/SEO/buenas prácticas 100. El objetivo sigue abierto. PR #7 en borrador: consolidar también consentimiento dio LCP 3,1 s en preview, sin mejora acreditada. Diagnosticar retraso de renderizado antes de otra modificación; preservar demo e identidad. No presentar resultados de preview como producción.

## Actualización 03/10/2026

Menú móvil y fuentes de cifras de portada corregidos (#12/#13). LCP sigue
abierto: producción 3,3 s, objetivo 2,5; fuente estática #11 no publicada al
no mejorar preview. Siguiente diagnóstico: demora de render del párrafo hero;
evitar cambiar fuentes/diseño por una reducción de bytes sin mejora medida.

## Actualización de mantenimiento · 03/10/2026

Guardas editoriales y auditoría HTTP fiable integradas (#14/#15). Revisiones
recurrentes siguen pendientes de ejecución cuando correspondan. Desglose de
trabajo no acreditado/condicionado en REMAINING_PLAN.md. REVIEW_QUEUE.json es
fotografía, no recordatorio. No se ha ensayado rollback de producción.
