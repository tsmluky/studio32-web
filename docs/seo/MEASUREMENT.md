# Medición y lanzamiento

Estado 02/10/2026: el usuario confirmó que GA4, Search Console y Bing todavía no están configurados. Los cambios están preparados para revisión; no hay tráfico o leads atribuidos a esta entrega.

## Antes de publicar

1. Revisar siete guías, tres problemas y una calculadora en la vista previa de Cloudflare enlazada en QA.md. El estado del registro es `review`, no prueba de publicación.
2. Resolver en el proveedor la redirección de `studio32.es` a `https://www.studio32.es`, conservando path y query y comprobando HTTPS. Ambos hosts devuelven 200 actualmente. No cambiar DNS a partir de la nota histórica sin verificar su estado.
3. Verificar que previews están protegidas de indexación mediante cabecera noindex o acceso. Cloudflare confirmado: preview `e100bb0b` sirve cabecera noindex. Repetir al cambiar de despliegue. El canonical por sí solo no es una protección de staging.
4. Validar Rich Results y comprobar el diseño de marca. JSON-LD parseable no equivale a validación oficial ni a resultados enriquecidos garantizados.
5. Revisar el modelo de consentimiento y actualizar la política antes de activar analytics. La entrega no carga GA4 y no modifica el texto vigente de privacidad.

## Google Search Console

Crear propiedad de dominio para `studio32.es` con la cuenta que controla el negocio. Verificar mediante el método ofrecido por Google, conservando los registros DNS existentes. Registrar propietario, fecha y acceso. Enviar `https://www.studio32.es/sitemap.xml` tras publicar.

Tomar baseline antes del lanzamiento: rendimiento por página y consulta, marca/no marca, país y dispositivo; indexación, acciones manuales y CWV. Revisar unas pocas URLs principales con inspección de URL. No hay cifras iniciales disponibles en este repo.

## Bing Webmaster Tools

Crear/verificar el sitio bajo la cuenta del negocio, o importar la propiedad de GSC cuando proceda. Enviar el mismo sitemap. Revisar rastreo e indexación. No implementar IndexNow para esta pequeña colección estática sin una necesidad demostrada.

## GA4 y contrato de eventos

Crear una propiedad y flujo web con la cuenta del negocio. Obtener un ID real `G-…`; no introducir uno ficticio ni cargar scripts de analytics sin integración de consentimiento revisada. La instrumentación usa:

```js
// Lo debe definir la integración de analytics solo cuando corresponda.
window.Studio32Analytics = {
  consent: 'granted',
  send: (name, params) => window.gtag('event', name, params)
};
// Al retirar consentimiento: consent = 'denied'; detener también el tracker.
```

Este adaptador no instala GA4 ni sustituye una CMP. Por defecto los eventos son `CustomEvent` locales (`studio32:discovery`), sin red, cookies, persistencia o reproducción posterior. El adaptador se comprueba al emitir cada evento.

| Evento | Qué significa |
|---|---|
| calculator_view | El código de la calculadora está cargado |
| calculator_start | Primera interacción o cálculo |
| calculator_input_change | Edición de un supuesto, sin enviar su valor |
| calculator_complete | Cálculo válido solicitado |
| calculator_result_view | Resultado mostrado en DOM; no implica tiempo de lectura |
| calculator_cta_click | Clic en la demo desde el resultado |
| demo_cta_click | Clic en un enlace que lleva a la demo |
| demo_start | Primera solicitud no vacía en la demo; no garantiza respuesta del backend |
| whatsapp_click | Clic de salida hacia WhatsApp |
| budget_request_click | Clic hacia WhatsApp cuyo enlace solicita presupuesto |

Parámetros: `page_type`, `sector`, y `cta_type` cuando corresponde. No se incluyen cifras de calculadora, teléfono, email, texto de consulta, referrer, URL completa ni query. La URL de landing y adquisición se deben configurar en el tracker con política de exclusión de datos personales. La web conserva los UTM del enlace entrante; no necesita guardarlos para que el tracker pueda atribuirlos tras activación.

Crear segmentos de Google organic, Bing organic y referrals de ChatGPT por fuente/campaña observada. Los clics en WhatsApp o presupuesto son microconversiones: para medir leads cualificados hace falta confirmar la conversación comercial y su origen. No hay formulario nuevo ni evento de envío ficticio.

## Tras desplegar

Comprobar página principal y nuevas rutas con HTTP 200, robots, sitemap, canonical y recursos. Una URL inexistente debe responder 404, no portada con 200. Comprobar apex → www. Repetir con user-agents de crawler si el CDN presenta restricciones; revisar WAF en cuenta. Pruebas de navegador no verifican reglas de firewall.

Registrar fecha real del despliegue en `EXPERIMENTS.md`. Activar y probar eventos en DebugView solo después de configurar consentimiento. Verificar las URLs en GSC/Bing. La demo mantuvo su JS original; el recorrido con número y agenda de cliente requiere una prueba separada.

## 30, 60 y 90 días

- 30: rastreo, indexación, primeras consultas, rutas de entrada, uso de calculadora y errores.
- 60: demanda no marca, consultas relevantes y clics hacia demo/contacto; corregir recursos que no resuelvan la intención.
- 90: leads cualificados, implantaciones y trabajo comercial evitado; decidir el próximo contenido con esa evidencia.

No añadir nuevas páginas hasta revisar esta primera colección. Sin datos, la conclusión es pendiente de medición, no éxito SEO.
