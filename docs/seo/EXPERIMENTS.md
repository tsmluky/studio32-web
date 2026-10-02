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
