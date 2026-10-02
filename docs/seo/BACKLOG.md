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
| Limpieza de demos antiguas | P2 | Favicon corregido; dos avisos eran comentarios. Sin enlaces rotos. Rediseño histórico fuera del alcance |

No publicar por volumen. Cada nueva URL necesita intención, aporte operativo, fuente cuando corresponda, responsable y conexión con el producto.

## Pendiente verificado tras publicación de portada

Último PSI productivo tras PR #5: 89 rendimiento, LCP 3,2 s (objetivo 2,5), FCP 1,9 s; accesibilidad/SEO/buenas prácticas 100. El objetivo sigue abierto. PR #7 en borrador: consolidar también consentimiento dio LCP 3,1 s en preview, sin mejora acreditada. Diagnosticar retraso de renderizado antes de otra modificación; preservar demo e identidad. No presentar resultados de preview como producción.
