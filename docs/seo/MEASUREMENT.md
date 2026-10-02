# Medición de Studio32 · estado 02/10/2026

## Cuenta real

El usuario indicó info@studio32.es y después autorizó usar su Google personal tras no existir una identidad Google para el buzón. Cuenta Analytics **Studio32** (410468845), propiedad **Studio32 · Web** (557087225), flujo **Studio32 · sitio web** (15942157248), URL https://www.studio32.es, ID **G-ZKX0QLRZ47**. España, hora peninsular y EUR; objetivos tráfico y oportunidades de venta. Condiciones aceptadas con confirmación explícita del usuario. KittyCorner conserva su historial separado y ya no es la propiedad activa.

## Integración

measurement-consent.js y CSS propios en las 21 páginas comerciales/discovery y privacidad. Modo básico: sin etiqueta/pings de Google antes de aceptar. Igual prominencia para aceptar/rechazar; preferencias accesibles al pie de página. Solo finalidad analítica; Ads, personalización y señales de Google desactivados. Medición mejorada desactivada en GA4: no captura automática de búsquedas/formularios/enlaces.

Preferencia local de aceptación/rechazo con 180 días de caducidad. No contiene ID de visitante. Cookies _ga y _ga_ZKX0QLRZ47 hasta 180 días, solo tras aceptar. Retirada bloquea adaptador, borra cookies accesibles y recarga si la etiqueta se había ejecutado. URLs canónicas sin query/hash; referrer reducido a origen. **No atribuye campañas UTM**, para no enviar valores libres de URL; sí puede observar referentes de búsqueda/ChatGPT. Configurar campañas con etiquetas permitidas y verificadas como trabajo posterior.

Eventos: calculator_view/start/input_change/complete/result_view/cta_click, demo_start/cta_click, whatsapp_click, budget_request_click. Parámetros exclusivamente enumerados page_type, sector y cta_type. No mensajes, correos, teléfonos, importes o consultas. Los eventos previos a aceptar se descartan, no se reproducen.

Referencias: [modo básico de Google](https://developers.google.com/tag-platform/security/concepts/consent-mode), [implementación de consentimiento](https://developers.google.com/tag-platform/security/guides/consent), [criterio AEPD sobre aceptar/rechazar](https://www.aepd.es/preguntas-frecuentes/17-internet-y-redes-sociales/FAQ-1707-importancia-de-las-cookies-en-la-proteccion-de-datos). Estas comprobaciones describen la implementación; no son una auditoría legal integral del negocio.

## Validación y pendientes

node _plantillas/test-measurement.cjs verifica espera/rechazo, aceptación, retirada, caducidad, staging, URL/PII y almacenamiento bloqueado. Test de calculadora y SEO correctos. PR #6 publicado en Cloudflare; preview móvil/escritorio sin overflow. Producción comprobada: 0 etiquetas antes de aceptar, 1 tras aceptar con G-ZKX0QLRZ47; sin salto de lectura. Analytics tiempo real confirma vistas de recursos y calculadora: es QA propio, no adquisición. Se corrigió orden de scripts para calculator_view con consentimiento guardado.

Search Console ya tenía propiedad de dominio studio32.es accesible bajo Google personal. Sitemap www enviado y procesado correctamente: 24 páginas descubiertas. Historial previo: 7 clics, 6 páginas indexadas, 9 sin indexar; no atribuir a esta colección. Bing www.studio32.es verificado con meta publicada y Google personal autorizado; sitemap enviado, procesamiento pendiente.

Clics en WhatsApp o presupuesto son microconversiones, no leads cualificados. La confirmación comercial y su origen requieren proceso operativo. No ampliar la primera colección antes de medir. Revisiones a 30/60/90 días desde baseline real; separar tráfico propio de QA.

Analytics tiempo real también confirma calculator_view, calculator_start, calculator_complete y calculator_result_view. Retirada en producción comprobada: recarga sin etiqueta de Google y preferencias disponibles.
