# QA de la primera colección · 2026-10-02

## Estado productivo

Cloudflare Pages publica `site/` desde main en https://www.studio32.es/. PR #2 (colección) fusionado en `4e0a56d`, PR #3 (fuentes de recursos) en `4afa4f6`, PR #4 (portada/contraste) en `8dd3e00`. Netlify es integración heredada, no destino de revisión. Supabase operativo sin migraciones ni lectura de datos de clientes.

HTTP real: colección 200 con canonical www y sin noindex; robots/sitemap 200; URL inexistente 404/noindex; apex HTTP/HTTPS 301 conserva ruta y query. Hoja/fuentes de portada 200. El cliente Python sin User-Agent recibió 403; con User-Agent navegador y en navegador normal responde 200. No se desactivó ninguna protección.

## Verificaciones

- 21 páginas de producto/discovery, 24 URL de sitemap, cero errores SEO/JSON-LD.
- 34 HTML, 757 enlaces internos, cero fallos. HTMLParser excluye ejemplos comentados y detecta referencias reales con comillas simples.
- Calculadora: fórmula, límites, solapamiento, cero y rango. Eventos: consentimiento y ausencia de PII; no envío de cifras.
- Portada + 14 rutas en preview a 1440 y 390 px: 30 verificaciones con ancho real comprobado y cero overflow. Portada productiva en ambas dimensiones: H1 único y cero overflow. Demo conserva conversación y cambio de sector.
- Fuentes WOFF2 originales Inter/Playfair/Syne, manifest con URL/hash y licencias OFL. Sin CSS Google Fonts remoto en portada o colección. Archivos base styles.css, script.js y vertical.css conservan hashes iniciales.

## Rich Results oficial

Google rastreó la guía API productiva y encontró Article y BreadcrumbList válidos. dateModified incluye hora/zona. Imagen editorial ausente es recomendación opcional; no se inventó una imagen en schema.

[Resultado de Google](https://search.google.com/test/rich-results/result?id=GKL8sUNYmCsYGQYn9BKNyw).

## Rendimiento móvil de laboratorio

| Página y fase | Rendimiento | Accesibilidad | Buenas prácticas | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Guía API antes | 92 | 100 | 100 | 100 | 2,7 s | 2,7 s | 0 ms | 0,001 |
| Guía API publicada con fuentes locales | 100 | 100 | 100 | 100 | 1,2 s | 1,5 s | 0 ms | 0,001 |
| Portada antes | 88 | 96 | 100 | 100 | 3,0 s | 3,2 s | 0 ms | 0,001 |
| Portada preview final | 97 | 100 | 100 | 66 | 1,4 s | 2,6 s | 0 ms | 0 |
| Portada publicada, 05:37 CEST | 91 | 100 | 100 | 100 | 1,4 s | 3,0 s | 0 ms | 0 |

[Guía API publicada](https://pagespeed.web.dev/analysis/https-www-studio32-es-recursos-whatsapp-business-api/iri1vpwb8c?form_factor=mobile). [Portada publicada](https://pagespeed.web.dev/analysis/https-www-studio32-es/lfdyaauf03?form_factor=mobile).

La primera medición de portada durante propagación dio 83/97 y vio estilos anteriores; no se usa como resultado final. La posterior comprobación muestra los nuevos colores y fuentes. Portada todavía supera objetivo LCP 2,5 s: optimización pendiente. No atribuir mejora estable al pequeño cambio 3,2→3,0; FCP y contraste sí muestran una diferencia clara. Mantener animaciones e identidad mientras se investiga CSS/CDN/arranque. No hay CWV de campo; TBT no sustituye a INP y 100 automático no acredita accesibilidad completa.

## Evidencias locales

Capturas y JSON ignorados en `qa/`: redirect-http, production-final-http, verified-layout, home-production-http, home-production-layout, pagespeed-resource-production, pagespeed-home-production y home-production-desktop. No publicar capturas del dashboard en el sitio.

## Reproducción

```text
python _plantillas/generar-discovery.py
python _plantillas/seo-foundation.py
python _plantillas/validar-discovery.py
python _plantillas/revisar-enlaces.py
node _plantillas/test-calculator.cjs
node --check site/discovery-events.js
node --check site/consultas-calculator.js
git diff --check
```

## Pendientes reales

Propietarios de Google/Microsoft para GA4/GSC/Bing, configuración de consentimiento, verificación y envío de sitemap. LCP de portada y CWV de campo. Sin adquisición atribuida ni prueba operativa de reserva de cliente real. No ampliar contenido antes de medir.
