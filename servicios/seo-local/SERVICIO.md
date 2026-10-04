# Presencia y descubrimiento · Studio32

Servicio para negocios físicos: comprobar cómo los encuentran, corregir los obstáculos de su web y medir qué contactos llegan. Se integra con Digital Presence Audit y Presence Pack; el agente de WhatsApp puede cubrir la atención posterior cuando encaje.

## Tres entregas

1. **Diagnóstico inicial:** web pública, Search Console con acceso autorizado, Google Business Profile, datos reales del negocio, experiencia móvil, contacto/reserva y consentimiento. Informe con evidencia, alcance, prioridades y presupuesto de corrección.
2. **Corrección técnica y de contenido:** URLs, enlaces, canónicas, indexabilidad, metadatos, información local coherente, rendimiento verificable y recorrido de contacto. Acordar páginas incluidas, CMS/plataforma, acceso, plazo y criterio de aceptación antes de intervenir. Copia o control de versiones, preview y reversión.
3. **Seguimiento:** consultas de marca y servicio, impresiones, clics, páginas indexadas y contactos válidos, con periodos comparables. Informar cambios, límites y decisiones para el siguiente ciclo. No confundir subida de una herramienta con ventas.

Precio: presupuesto según páginas, plataforma, estado inicial, accesos y alcance. No se han fijado ni publicado tarifas sin conocer costes y capacidad de entrega. Separar diagnóstico, puesta en marcha y acompañamiento mensual.

## Evidencias y promesas

Search Console manda en datos Google. Respuestas HTTP y navegador acreditan comportamiento actual. PageSpeed/CrUX describen rendimiento en su contexto. HubSpot/Seobility complementan comprobaciones limitadas.

Promesa defendible: «Revisamos cómo te encuentran, corregimos los obstáculos de tu web y medimos los contactos que llegan». Evitar «primer puesto», «SEO espectacular», garantías de clientes o credenciales de casos aún no medidos. Studio32 es la primera implementación propia, con resultados técnicos y poca visibilidad orgánica al 04/10/2026; no un caso de éxito de captación.

## Ejecutar el diagnóstico público

Python 3.10 o superior, sin paquetes, cuentas ni servicios de pago. En Windows, abrir `auditar.bat` e introducir URL, nombre y sector. Cada ejecución crea una carpeta nueva con `informe.html` y `evidencia.json`, conservando la baseline.

```text
python servicios/seo-local/auditar.py --site https://www.studio32.es/ --name Studio32 --sector "Sistemas digitales para negocios" --out ../outputs/seo-servicio-studio32
```

Solo descarga HTML público, robots y sitemap, hasta 25 páginas por defecto y 50 como máximo. Respeta robots al recorrer páginas adicionales. No ejecuta JavaScript, no entra a cuentas, no evalúa automáticamente Google Business Profile, no confirma indexación y no revisa todos los enlaces o sitemaps anidados. Es el inicio del diagnóstico; el trabajo manual se registra en `FICHA-CLIENTE.md`.

No enviar informes, contactar negocios, crear accesos ni cambiar datos públicos sin encargo. Outputs y datos de clientes se guardan en una ubicación privada; los informes no se publican en `site/`.

## Revisión local manual

Registrar ubicación real, zonas atendidas y servicios prioritarios. En Google Business Profile comprobar titularidad autorizada, categoría principal, datos de contacto, horarios, web y servicios. Verificar su coherencia con la web; no crear direcciones ficticias ni incorporar reseñas inventadas. No modificar la ficha hasta acordar el alcance con el titular.

Comprobar primero [elegibilidad de la actividad](https://support.google.com/business/answer/13763036): contacto presencial durante el horario declarado, en un local o visitando clientes, salvo excepciones de Google. Un negocio exclusivamente online no obtiene una ficha por tener domicilio fiscal. Si no procede, marcar Google Maps como no aplicable y trabajar la búsqueda web.

Separar búsquedas de marca de búsquedas de servicio y ubicación. Guardar fecha, ubicación y dispositivo de cualquier comprobación de posiciones: los resultados locales varían. Google explica que intervienen relevancia, distancia y popularidad; el servicio puede mejorar información y presencia, pero no controlar la distancia del usuario.

Fuentes de referencia: [factores locales de Google](https://support.google.com/business/answer/7091?hl=es) y [fundamentos de la Búsqueda](https://developers.google.com/search/docs/essentials?hl=es). Revisarlas en cada nuevo encargo.

## Cierre verificable

Antes de publicar, copiar `FICHA-CLIENTE.md` y `REGISTRO-CONTACTOS.csv` a una ubicación privada. Registrar allí cada consulta real, sin guardar conversaciones ni datos personales en este repositorio. Fuentes: google_organico, google_maps, referido, directo o desconocido; certeza: confirmada, declarada o desconocida. Estados: consulta, cualificada, cliente o descartada. `es_qa` y `es_duplicado` excluyen pruebas y duplicados. Un clic no abre por sí solo una fila de lead confirmado.

Fijar una primera revisión de rastreo a los 7 días, otra de consultas a los 14 y una comparación a los 28, adaptándolas al volumen real. No esperar dos meses para detectar una URL inaccesible. La ficha debe distinguir trabajo cerrado, mejora abierta y resultado todavía no observable.

- Cada problema tiene URL, evidencia, fecha, impacto, acción y prueba de cierre.
- Noindex/duplicados se interpretan antes de modificarlos.
- Antes/después comparten alcance y condiciones; descarga HTTP no se vende como LCP.
- Contactos de pruebas y personal interno no cuentan como captación.
- Consentimiento y retirada se prueban; preservar marca y accesibilidad.
- Seguimiento empieza tras publicación y registro de baseline, con fecha pactada con el cliente. Este documento no programa una automatización.
