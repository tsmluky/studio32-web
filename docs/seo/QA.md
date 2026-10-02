# QA de primera entrega · 2026-10-02

## Resultado local

- Suite SEO: 21 páginas principales verificadas, 24 URL canónicas del sitemap, cero errores.
- Regeneración idempotente: fuente editorial + foundation no cambian hashes de salidas al repetirse sin editar fuentes.
- Enlaces globales: 34 HTML, 740 enlaces internos, cero fallos. Favicon ausente de la demo histórica sustituido por SVG local. Dos supuestas imágenes rotas eran ejemplos dentro de comentarios: auditor migrado a HTMLParser para inspeccionar elementos reales. Verificados comentarios, comillas simples e IDs reales; ahora devuelve código de error si hay fallos.
- Calculadora: fórmula, cero, porcentajes, entradas negativas/no finitas, límite superior y sensibilidad anual. Ejemplo: 200 × 40% × 50% × 20% × 100 € = 800 €/mes; 40 consultas en riesgo, 8 clientes potenciales; rango anual 7.680–11.520 €.
- Eventos: pruebas de contrato con consentimiento denegado/concedido; exclusión de email y cifras; sin red/persistencia por defecto.
- Navegador de Codex: 14 rutas nuevas en 1440 y 390 px, 28 comprobaciones. Un H1, CTA visible y sin desbordamiento de documento. Se detectó y corrigió el ancho mínimo de tablas en móvil; las siete páginas afectadas se revalidaron.
- Interacción real en móvil: cálculo de ejemplo, edición a 0%, resultado anterior oculto y cálculo a cero. Al restaurar 40% vuelve a 800 €.
- HTML completo sin depender de JS para guías, enlaces, fuentes, tablas o fórmula. La calculadora contiene alternativa noscript y computa solo en cliente.
- `styles.css`, `script.js` y `vertical.css` mantienen sus hashes originales. No se envió una consulta al agente ni se hizo una prueba de reserva con un cliente real.

Capturas locales en `qa/` (ignoradas por Git): recursos en escritorio, guía en móvil y cálculo en móvil. La vista de recursos queda abierta en el navegador de Codex.

## Vista previa del PR

[PR #2](https://github.com/tsmluky/studio32-web/pull/2), en borrador. [Vista previa Cloudflare](https://e100bb0b.studio32-web.pages.dev/recursos/) del commit `7454591`, verificada el 02/10. Recursos, calculadora y sitemap responden 200 con `X-Robots-Tag: noindex`; una URL inexistente responde 404. Canonical apunta a producción. Lectura de www confirma que el código nuevo todavía no está en producción. Evidencia local `qa/cloudflare-preview-http.json`.

Cloudflare Pages es el destino de publicación y revisión. Los checks de Netlify siguen pasando por una integración heredada; su preview se comprobó previamente, pero no es la referencia de entrega. Dominios y configuración efectiva: `INFRASTRUCTURE.md`.

## Comandos reproducibles

```text
python _plantillas/generar-discovery.py
python _plantillas/seo-foundation.py
python _plantillas/validar-discovery.py
python _plantillas/revisar-enlaces.py
node _plantillas/test-calculator.cjs
node --check site/discovery-events.js
node --check site/consultas-calculator.js
git diff --check
python -m http.server 8088 --directory site
```

Los renderizadores utilizan biblioteca estándar y generan HTML versionado. Tras regenerar verticales, ejecutar foundation para actualizar sitemap. El generador histórico solo contiene tres verticales: estética tiene HTML propio, como antes; no usarlo para reemplazar ese contenido.

## Límites

No hay resultados de adquisición todavía. No se ha desplegado ni comprobado el comportamiento del proveedor con el nuevo 404. Producción sirve actualmente una URL inexistente con 200 y hay dos hosts sin redirección. GSC/Bing/GA4 no configurados. Rich Results oficial, WAF y CWV de campo pendientes. El servidor Python local no interpreta _headers ni _redirects del proveedor.


## Cierre de fallos de infraestructura

Apex HTTP/HTTPS devuelve 301 a www conservando ruta/query; regla activa en Cloudflare. Suite SEO, calculadora y sintaxis JS correctas antes del lanzamiento. La petición posterior del usuario de resolver los fallos permite avanzar al cierre productivo; registrar resultado HTTP real después del despliegue.


## Rich Results oficial

Prueba Google del preview detectó Article y BreadcrumbList válidos. Preview no rastreable para indexación por noindex, como corresponde. Avisos opcionales: imagen ausente y fecha sin hora/zona. Se corrige dateModified con timestamp ISO de esta revisión y timezone; no añadir una imagen ficticia al schema solo para ocultar el aviso. Repetir sobre producción tras desplegar. Fuente: https://developers.google.com/search/docs/appearance/structured-data/article.


## Producción · 2026-10-02

PR #2 fusionado, commit main `4e0a56d570aaf762dc26549ed01226258612b38f`, 03:08 UTC. HTTP real: portada, recursos, guía API y herramienta 200; canonical www; sin noindex productivo. Robots y sitemap 200. URL inventada 404. Apex 301 verificado. Evidencia local `qa/production-http.json`.

Google Rich Results sobre guía API productiva: rastreo correcto y dos elementos válidos, Article y BreadcrumbList. Resultado: https://search.google.com/test/rich-results/result?id=GKL8sUNYmCsYGQYn9BKNyw. Falta imagen editorial como recomendación opcional; no falsear schema.

PSI móvil antes de mejora de fuentes: 92 rendimiento, 100 accesibilidad, 100 buenas prácticas, 100 SEO. LCP/FCP 2,7 s, TBT 0 ms, CLS 0,001. Sin datos de campo. Report: https://pagespeed.web.dev/analysis/https-www-studio32-es-recursos-whatsapp-business-api/dsty37xv1z?form_factor=mobile. Modificación localizada para probar: mismos WOFF2 de Google Fonts servidos por Cloudflare, licencias conservadas, preload de Playfair y sin CSS remoto en recursos.


## Fuentes locales · validación previa a publicación

14 rutas × 1440/390 px: H1 único, sin overflow, tipografía Playfair conservada y sin CSS Google Fonts remoto. Evidencia `qa/font-layout.json` y `qa/fonts-mobile.png`. Assets WOFF2 originales verificados contra manifest/hashes, licencias OFL conservadas. PSI del preview 17ed0174: rendimiento 100, LCP 1,5 s, FCP 1,2 s, TBT 0 ms, CLS 0,001; accesibilidad/buenas prácticas 100. SEO 66 corresponde a noindex del preview. Repetir en producción; no son métricas de campo. https://pagespeed.web.dev/analysis/https-17ed0174-studio32-web-pages-dev-recursos-whatsapp-business-api/r47z6gwhfs?form_factor=mobile.


## Cierre productivo de recursos y baseline de portada

Fuentes locales ya publicadas: 19 rutas públicas verificadas (colección completa, portada, robots/sitemap, 404 y fuente precargada); 200/canonical/indexabilidad correctos, 404 noindex, WOFF2 cache immutable. PSI productivo de guía API: 100 rendimiento/accesibilidad/buenas prácticas/SEO, LCP 1,5 s, FCP 1,2 s, TBT 0 ms, CLS 0,001.

Baseline móvil portada: 88 rendimiento, 96 accesibilidad, 100 buenas prácticas/SEO; LCP 3,2 s, FCP 3,0 s, TBT 0 ms, CLS 0,001. Avisos de contraste: tres citas de fuentes y footer-services. Corrección preparada: mismos Inter/Playfair/Syne originales y pesos, preload de Playfair normal/italic y texto pequeño con token text-muted. home-foundation.css solo en portada, sin cambiar styles.css/script.js/vertical.css ni demo. Verificar preview antes de publicar.
