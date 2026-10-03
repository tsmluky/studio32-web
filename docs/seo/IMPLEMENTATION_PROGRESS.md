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
| 5. Rendimiento | Recursos cerrado; portada pendiente | Recursos productivos 100 y LCP 1,5 s. Última producción tras #12 (03/10): FCP 1,9 s y LCP 3,3 s; objetivo 2,5 s pendiente. PR #7/#11 en borrador sin mejora demostrada. Fuentes originales conservadas; sin CWV de campo/INP real |
| 6. Arquitectura reutilizable | Hecho | Fuente editorial + renderizador; HTML versionado, sin CMS/framework/build npm |
| 7. Siete guías | Publicado | Registro e intención propia, fuentes, relacionados y CTA; sin inventar clientes/capacidades |
| 8. Tres problemas | Publicado | Opciones operativas antes de vender el producto |
| 9. Calculadora | Publicado | Fórmula explícita, riesgo/conversión, sensibilidad anual; sin email, almacenamiento ni envío de cifras |
| 10. Enlazado | Verificado | 806 referencias locales href/src: 631 navegación y 175 recursos, con repeticiones; cero destinos/anclas ausentes. 24 páginas en sitemap: portada + 23 subpáginas. Grafo: 203 conexiones, 21 importantes a máximo dos clics |
| 11. Fuentes | Hecho | Proveedor, URL y fecha; revisión de fuentes a 90 días; Meta corregido con documentación oficial |
| 12. Reglas editoriales | Aplicadas | Flujos/decisiones originales, sin páginas geográficas, cifras de tracción o garantías inventadas |
| 13. Medición | Activa | GA4 Studio32 recibe vistas de QA con consentimiento opcional; GSC procesa sitemap (24 páginas); Bing verificado por meta; sitemap procesado correctamente, 24 URL descubiertas |
| 14. QA | Verificado; control automático activo | SEO/JSON-LD/links/calculadora, escritorio/móvil; HTTP productivo correcto. PR #8: sesiones/timeout/sector. PR #9: CI activo. PR #10: siete pruebas de seguridad editorial y guardas de salida pública; demo histórica corregida y comprobada en producción, sin llamadas de reserva |
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

Apartados 121–125 y 132: PR #10 publicado, main ba978dc. Generador rechaza rutas
fuera de los hubs, duplicados, referencias ausentes y fuentes ejecutables o con
credenciales antes de escribir. Control de URLs activas locales/staging y
archivos/firmas privadas integrado en CI; siete pruebas pasan. Taberna conserva
noindex, desactiva inputs del ejemplo y no ofrece submit; enlace probado a la
demo principal. Procedimiento de reversión documentado, no ensayado en producción.

Apartados 61–64: workflow de QA activo tras PR #9, main caa6cb8; ejecución de
main 37028651678 correcta (job 7 s). Cloudflare confirma publicación. Grafo
comprueba alcance y profundidad. Apartados 137–140: matriz de
cobertura y ocho preguntas de diagnóstico preparadas, todavía sin muestreo de
resultados. No es otra colección pública ni prueba de menciones de Studio32.

Cerrar medición y observar demanda no marca, entradas por recurso, uso de calculadora, solicitudes de demo y leads cualificados. Fechas orientativas desde lanzamiento: 01/11/2026, 01/12/2026 y 31/12/2026; el análisis de conversiones necesita una baseline desde la activación real del tracker. No crear contenido RGPD, segunda calculadora, benchmarks o casos de éxito sin fuentes, datos o demanda que los justifiquen.

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
