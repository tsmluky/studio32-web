# QA de primera entrega · 2026-10-02

## Resultado local

- Suite SEO: 21 páginas principales verificadas, 24 URL canónicas del sitemap, cero errores.
- Regeneración idempotente: fuente editorial + foundation no cambian hashes de salidas al repetirse sin editar fuentes.
- Enlaces globales: 34 HTML, 742 enlaces internos. Solo tres assets ausentes en la plantilla noindex Demos-Clientes, ya presentes en baseline. Sin enlaces nuevos rotos.
- Calculadora: fórmula, cero, porcentajes, entradas negativas/no finitas, límite superior y sensibilidad anual. Ejemplo: 200 × 40% × 50% × 20% × 100 € = 800 €/mes; 40 consultas en riesgo, 8 clientes potenciales; rango anual 7.680–11.520 €.
- Eventos: pruebas de contrato con consentimiento denegado/concedido; exclusión de email y cifras; sin red/persistencia por defecto.
- Navegador de Codex: 14 rutas nuevas en 1440 y 390 px, 28 comprobaciones. Un H1, CTA visible y sin desbordamiento de documento. Se detectó y corrigió el ancho mínimo de tablas en móvil; las siete páginas afectadas se revalidaron.
- Interacción real en móvil: cálculo de ejemplo, edición a 0%, resultado anterior oculto y cálculo a cero. Al restaurar 40% vuelve a 800 €.
- HTML completo sin depender de JS para guías, enlaces, fuentes, tablas o fórmula. La calculadora contiene alternativa noscript y computa solo en cliente.
- `styles.css`, `script.js` y `vertical.css` mantienen sus hashes originales. No se envió una consulta al agente ni se hizo una prueba de reserva con un cliente real.

Capturas locales en `qa/` (ignoradas por Git): recursos en escritorio, guía en móvil y cálculo en móvil. La vista de recursos queda abierta en el navegador de Codex.

## Vista previa del PR

[PR #2](https://github.com/tsmluky/studio32-web/pull/2), en borrador. [Vista previa](https://deploy-preview-2--studio-32.netlify.app/recursos/) disponible. Cloudflare Pages y checks Netlify de headers, redirects y preview pasaron. HTTP de preview: recursos, calculadora y sitemap responden 200 con `X-Robots-Tag: noindex`; una URL inexistente responde 404. Canonical apunta a producción. Lectura de www confirma que el código nuevo todavía no está en producción. Evidencia local `qa/preview-http.json`.

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
