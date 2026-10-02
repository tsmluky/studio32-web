# Primera entrega orgánica

Fecha: 2026-10-02. El objetivo es añadir recursos útiles alrededor de la recepción por WhatsApp preservando marca, demo y páginas comerciales. Límite: siete guías, tres problemas, una herramienta; después medir.

| Cambio | Motivo y resultado | Archivos | Riesgo | Validación |
|---|---|---|---|---|
| Fuente editorial estructurada y renderizador Python estándar | Reutilizar el patrón de generadores existente sin framework, npm ni build nuevo; HTML se versiona | _plantillas/discovery-content.json, generar-discovery.py | drift entre fuente y salida | regeneración idempotente |
| Estilo editorial y hubs | Lectura amplia, tablas y pasos; preservar tokens de marca | site/discovery.css, tres hubs | móvil y legibilidad | navegador desktop/móvil, sin overflow |
| Siete recursos | API, número, citas, agenda, bot/agente, recepción y handoff; intención propia y criterio operativo | site/recursos/ | claims | fuentes fechadas, evidencia producto, enlaces |
| Tres problemas | Fuera de horario, recepción saturada, consultas perdidas; opciones antes del producto | site/problemas/ | repetición | revisión editorial y enlaces contextuales |
| Calculadora | Cuantificar supuestos sin prometer recuperación | site/herramientas/calculadora-consultas-perdidas/, consultas-calculator.js | doble conteo, NaN y precisión falsa | fórmula explícita, solapamiento y límites, pruebas numéricas |
| Foundation | Organization, BreadcrumbList, sitemap sin noindex, 404, corrección tarifaria | site/index.html, precio, robots, generadores | indexabilidad | suite SEO y HTTP |
| Descubrimiento desde páginas actuales | Enlaces discretos y específicos dentro del footer existente, sin añadir secciones a la portada | portada, verticales, panel y precio; plantilla vertical | regeneración futura | auditoría de enlaces y persistencia de plantilla |
| Eventos mínimos | Uso herramienta, demo iniciada, WhatsApp y CTA sin datos de formulario; red solo si integración consentida | discovery-events.js | privacidad | pruebas sin red/almacenamiento, contrato de integración |

Responsabilidad editorial: equipo Studio32. Fuentes de proveedor: revisar a los 90 días o antes si cambia el servicio. Ninguna página nueva afirma implantaciones reales o resultados comerciales. El presupuesto permanece personalizado.

Entrega en rama dedicada y PR revisable. No fusionar ni desplegar automáticamente. Preparar QA, vista local y manual de activación GSC/Bing/analytics; publicar esta ampliación exige revisar el resultado concreto. La segunda calculadora, RGPD, datos propios y más recursos permanecen en backlog hasta evidencia y medición.
