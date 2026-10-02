# Infraestructura verificada · 2026-10-02

Inspección de los dashboards abiertos por el usuario y lecturas HTTP públicas. Sin cambios en DNS, reglas, proyectos o bases de datos.

## Publicación comercial

Cloudflare Pages `studio32-web` conecta con `tsmluky/studio32-web`. Producción automática desde `main`; sin comando de build, salida `site`, raíz por defecto. Dominio personalizado `www.studio32.es` activo con SSL. Producción observada: commit `fa03784`. La rama `feat/organic-discovery` despliega previews, no producción.

Preview de referencia del commit `7454591`: https://e100bb0b.studio32-web.pages.dev/recursos/. HTTP verificado: recursos, calculadora y sitemap 200 + X-Robots-Tag noindex; URL inexistente 404. Canonicals de recursos/calculadora apuntan a www. Preview público: noindex evita indexación, no restringe acceso. No poner secretos o datos privados en `site/`.

## Dominios y Netlify heredado

DNS observado: `www.studio32.es` CNAME `studio32-web.pages.dev`, DNS only. Apex `studio32.es` A `75.2.60.5`, proxied. HTTP del apex contiene `x-nf-request-id`, mientras www sirve desde Pages. Ambos responden 200 con HTML distinto. Netlify sigue siendo un origen efectivo del apex y una integración de checks/previews del repositorio; no retirarlo hasta resolver y verificar el host.

Cierre propuesto en Cloudflare, sin migrar dominio ni tocar registros de correo/apps: una Single Redirect limitada al hostname exacto `studio32.es`, respuesta 301 hacia `concat("https://www.studio32.es", http.request.uri.path)`, con preservación de query string. Revisar reglas existentes antes de activarla. Verificar `/`, una ruta interior, query UTM y HTTPS; deben terminar en www conservando ruta y query. Repetir comprobación de 404 tras publicar el nuevo `404.html` en main. Este documento es una especificación de cambio, no evidencia de que la regla esté aplicada. Referencias oficiales consultadas el 02/10: [gestión de subdominios](https://developers.cloudflare.com/fundamentals/manage-domains/manage-subdomains/) y [ajustes Single Redirects](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/settings/).

## Supabase y superficies operativas

El proyecto Supabase `studio32-hub` está visible y healthy en la rama productiva main. No se consultaron filas de clientes ni claves. Cloudflare muestra proyectos independientes `studio32-hub`, `studio32-panel` y workers de clips. Su existencia no convierte la web comercial en una aplicación con backend.

Esta colección SEO y su calculadora no necesitan tablas, migraciones, funciones ni nuevos bindings de Supabase. Mantener la arquitectura actual y los datos operativos en sus superficies correspondientes. La inspección de overview no es una auditoría de RLS, autenticación o seguridad.

## Medición pendiente

GA4, Search Console y Bing no configurados, confirmado por el usuario. Los eventos actuales son locales. Configurar cuentas bajo control del negocio y consentimiento antes de activar la integración; GSC se verifica mediante TXT en Cloudflare sin reemplazar registros existentes. Pasos en `MEASUREMENT.md`.
