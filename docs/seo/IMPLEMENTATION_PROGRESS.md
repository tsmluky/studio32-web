# Avance del informe maestro · 2026-10-02

Referencia: informe entregado por el usuario, sección 156, pasos 1–15. El informe es especificación de trabajo; sus ejemplos de capacidades, ubicación o datos no se convierten automáticamente en hechos del producto.

## Entrega real

Primera colección publicada en https://www.studio32.es/recursos/: siete guías, tres problemas, una calculadora y tres hubs. PR #2 fusionado en `4e0a56d` (03:08 UTC); mejora de fuentes PR #3 en `4afa4f6` (03:17 UTC). Portada y contraste publicados mediante PR #4 en `8dd3e00`. Cloudflare Pages publica `site` desde main. Supabase conserva sus superficies operativas.

| Paso del brief | Estado | Evidencia y límite |
|---|---|---|
| 1. Inspección | Hecho | Repositorio, generadores, demo, Cloudflare, dominios y overview de Supabase; sin leer datos de clientes |
| 2. Auditoría | Hecho | SEO_AUDIT, URL_INVENTORY, HTTP_BASELINE y tamaños/hashes |
| 3. Plan | Hecho | SEO_IMPLEMENTATION_PLAN con alcance, riesgos y validación |
| 4. Foundation | Publicado | Organization, breadcrumbs, canonical, sitemap 24 URL, robots, OAI-SearchBot, apex 301 y 404 real; GA4 y GSC activos; Bing verificado por meta; sitemap procesado correctamente, 24 URL descubiertas |
| 5. Rendimiento | Recursos cerrado; portada pendiente | Recursos productivos 100 y LCP 1,5 s. PR #5 portada publicado: FCP 1,9 s y LCP 3,2 s; objetivo 2,5 s pendiente. PR #7 en borrador sin mejora demostrada. Fuentes originales conservadas; sin CWV de campo/INP real |
| 6. Arquitectura reutilizable | Hecho | Fuente editorial + renderizador; HTML versionado, sin CMS/framework/build npm |
| 7. Siete guías | Publicado | Registro e intención propia, fuentes, relacionados y CTA; sin inventar clientes/capacidades |
| 8. Tres problemas | Publicado | Opciones operativas antes de vender el producto |
| 9. Calculadora | Publicado | Fórmula explícita, riesgo/conversión, sensibilidad anual; sin email, almacenamiento ni envío de cifras |
| 10. Enlazado | Verificado | 804 referencias reales, cero fallos. Grafo: 24 canónicas, 203 conexiones, 21 importantes a máximo dos clics; demos con regreso al estudio |
| 11. Fuentes | Hecho | Proveedor, URL y fecha; revisión de fuentes a 90 días; Meta corregido con documentación oficial |
| 12. Reglas editoriales | Aplicadas | Flujos/decisiones originales, sin páginas geográficas, cifras de tracción o garantías inventadas |
| 13. Medición | Activa | GA4 Studio32 recibe vistas de QA con consentimiento opcional; GSC procesa sitemap (24 páginas); Bing verificado por meta; sitemap procesado correctamente, 24 URL descubiertas |
| 14. QA | Verificado; control automático activo | SEO/JSON-LD/links/calculadora, escritorio/móvil; prueba viva Google valida guía; HTTP productivo correcto. PR #8: sesiones/timeout/sector. PR #9 publicado: CI de SEO, enlaces, grafo, privacidad, calculadora y demo; main pasa en 7 s, sin llamadas al backend |
| 15. Detener y medir | En curso | No ampliar la colección. Revisiones a 30/60/90 días después de disponer de medición real |

## Fallos cerrados

- Host duplicado: regla Cloudflare `Studio32 apex a www` activa, 301 exacto, HTTP/HTTPS y ruta/query comprobados. No cambiar registros de correo/apps.
- Soft 404: ruta inventada responde 404 con página útil noindex, no portada 200.
- Favicon ausente: SVG local para la demo histórica; sin fotos ficticias añadidas.
- Auditoría falsa: parser HTML excluye los dos ejemplos dentro de comentarios y admite comillas simples; salida no cero ante fallos reales.
- Fecha Article: timestamp ISO con hora y zona; schema válido en Google. Imagen editorial ausente es recomendación opcional, no error: no falsear image para ocultar avisos.
- LCP de recursos: quitar CSS remoto de fuentes; conservar Inter/Playfair originales, licencias y layout.
- Portada: Inter/Playfair/Syne locales originales y contraste corregido. PR #5 publicado: bundle de estilos, intro móvil omitida, escritorio abreviado y explicación/CTA visible. Última producción: 89 rendimiento, 100 accesibilidad/SEO/buenas prácticas, FCP 1,9 s y LCP 3,2 s. El LCP sigue abierto; PR #7 permanece en borrador.

## Dependencias reales pendientes

GA4 Studio32 creado con Google personal autorizado; consentimiento publicado y vistas de QA recibidas en tiempo real. GSC dominio existente, sitemap procesado (24 páginas). Bing con Google personal autorizado verificado por meta; sitemap procesado correctamente, 24 URL descubiertas. No hay leads ni adquisición atribuida todavía. Ver MEASUREMENT.md.

No hay datos de CWV de campo; TBT de laboratorio no equivale a INP. Prueba de reserva/agenda de un cliente real y auditoría de RLS/Supabase pertenecen al producto y no se dan por realizadas por publicar la web.

Desarrollo activo mientras se mide: PR #8, main ed44e93, cierra errores de demo y
movimiento reducido sin ampliar contenido. Corresponde a apartados 39–41
(recorrido/medición), 46–47 (usabilidad/demo), 60–61 (QA) del maestro. El paso 15
mantiene recogida de datos; no bloquea correcciones de lo ya publicado.

## Siguiente decisión

Apartados 61–64: workflow de QA activo tras PR #9, main caa6cb8; ejecución de
main 37028651678 correcta (job 7 s). Cloudflare confirma publicación. Grafo
comprueba alcance y profundidad. Apartados 137–140: matriz de
cobertura y ocho preguntas de diagnóstico preparadas, todavía sin muestreo de
resultados. No es otra colección pública ni prueba de menciones de Studio32.

Cerrar medición y observar demanda no marca, entradas por recurso, uso de calculadora, solicitudes de demo y leads cualificados. Fechas orientativas desde lanzamiento: 01/11/2026, 01/12/2026 y 31/12/2026; el análisis de conversiones necesita una baseline desde la activación real del tracker. No crear contenido RGPD, segunda calculadora, benchmarks o casos de éxito sin fuentes, datos o demanda que los justifiquen.
