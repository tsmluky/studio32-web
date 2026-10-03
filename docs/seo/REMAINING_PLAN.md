# Lo que falta del maestro · 03/10/2026

El maestro tiene 158 apartados, además de la introducción. Incluye criterios,
opciones y fases futuras; no equivale a 158 cambios que deban publicarse ya.
La primera entrega del apartado 156 está publicada. Su paso 5 sigue abierto y
su paso 15 recoge evidencia mientras se corrige lo existente.

| Apartados | Trabajo no acreditado o pendiente | Condición para avanzar |
| --- | --- | --- |
| 23, 129–130 | LCP de portada ≤2,5 s; CWV reales, incluido INP | Última lectura de laboratorio tras #17: 92 rendimiento, FCP 1,2/LCP 3,3 s; diagnosticar retraso de render, comparar y validar producción. No hay datos de campo. |
| 19, 43–44, 65–68, 127, 143 | Indexación efectiva, consultas, impresiones y rendimiento orgánico de la colección | Sitemap procesado y envío aceptado no equivalen a indexación. Revisar informes acumulados; no atribuir histórico a páginas nuevas. |
| 42, 67, 137–138 | Referencias de IA y menciones/citas verificadas | Conjunto de preguntas preparado; falta muestrear respuestas y conservar fecha, producto y enlace. No hay menciones demostradas. |
| 39–41, 91–93, 134 | Leads cualificados y feedback ventas → contenido → producto | Registrar consultas reales y origen conocido; clics de WhatsApp y visitas de QA no son leads. No exportar PII a GA4. |
| 45, 106 | Observabilidad de bots en registros reales de CDN | Comprobar disponibilidad del plan/acceso antes de activar servicios. Un HTTP con user-agent declarado no prueba que acceda el bot real. Opcional en fase 1. |
| 47–48, 110 | Reserva real de cliente, agenda, concurrencia, fallo y control humano; revisión de RLS/Supabase | Validación del producto con tenant adecuado y evidencia. QA de web no certifica ese recorrido. |
| 54–59, 107–109, 119–120 | Revisión editorial recurrente, demanda, puntuación de candidatos y canibalización semántica | Control de fechas/estados y cola añadidos. Falta ejecutar revisiones cuando corresponda y usar consultas/prospects reales para priorizar. |
| 70–72 | Backlinks, relaciones editoriales y menciones de marca | Activos que aporten valor y contactos pertinentes. No se han enviado propuestas ni comprado enlaces. |
| 13, 75, 152 | Datos propios, benchmarks y primer caso de éxito verificable | Piloto real, metodología, resultados y autorización; demos no son clientes. |
| 12, 50, 76–77, 136 | Segunda calculadora, futuras verticales, comparativas y herramienta de auditoría | Demanda y aporte distinto; evitar nuevas URL por volumen o repetir intención. |
| 48, 51–53, 131 | Recursos normativos, SEO local, idiomas y programmatic SEO | Necesidad real, fuentes vigentes y alcance autorizado. No inventar dirección ni LocalBusiness; no se ha implantado expansión geográfica/multilingüe. |
| 88–89, 147 | Nuevas imágenes y diagramas originales para recursos | Aportar explicación que el texto no resuelva; conservar diseño y permisos. No es motivo para llenar todas las páginas de imágenes. |
| 117–118, 124–126 | Histórico de experimentos completo y ensayo de reversión | Registro ampliado con pruebas #11–#13; reversión documentada pero no ensayada en producción. Auditoría HTTP conserva ahora la baseline. |
| 66, 153–154 | Evaluación a 30/60/90 días y éxito a 6–12 meses | Acumulación de datos y volumen suficiente. Fechas del plan son hitos, no automatizaciones. |

Prioridad actual: correcciones comprobables y mantenimiento de la colección;
revisión de señales de indexación/adquisición cuando aporten evidencia. No marcar
como terminados trabajo recurrente, resultados futuros o capacidades de producto
por haber preparado un documento o pasado un test simulado.

## Cómo interpretar el LCP

3,3 s no es una catástrofe, pero cae en el intervalo «necesita mejorar» de
2,5–4 s. El objetivo de una buena experiencia se evalúa con el percentil 75 de
cargas reales, por dispositivo; una prueba de laboratorio aislada no lo acredita.
[Definición de LCP](https://web.dev/articles/lcp).

Google utiliza CWV dentro del posicionamiento; una puntuación perfecta no
garantiza posiciones. LCP no aparece como requisito técnico de indexación:
acceso de Googlebot, HTTP 200 y contenido indexable sí son requisitos básicos.
[Experiencia de página](https://developers.google.com/search/docs/appearance/page-experience),
[requisitos técnicos](https://developers.google.com/search/docs/essentials/technical).

Chat de contacto corregido y comprobado (#17). No equivale a validar una reserva real. Prueba #16 bajo demanda sin publicar; no mejora LCP acreditada.
