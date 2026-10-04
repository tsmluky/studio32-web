# Correcciones y servicio repetible · 04/10/2026

## Evidencia de partida

Search Console: siete clics, 52 impresiones; consultas visibles mayormente de
marca. Resumen indexación 21/09 anterior a publicación; sitemap leído 03/10
correcto con 24 URLs. API WhatsApp indexada, dental/restaurante descubiertas,
precios/calculadora desconocidas en inspección individual. Precios pasa prueba
publicada. Sin acciones manuales/seguridad; CWV sin volumen de campo.

HubSpot aportado por el usuario suma 98/100; no prueba captación ni LCP.

## Cambio preparado

- Demos indexables: canónicas, sitemap y enlaces usan rutas finales sin .html.
- Alias concretos en minúsculas y entrada histórica de L'Obscur redirigen;
  rutas encadenadas inexistentes conservan 404. Favicon por defecto tiene destino.
- PrimeBurger conserva dirección visual y traducción, con un H1 principal.
- Consentimiento reconocible: Cookies y privacidad, rechazar/aceptar equivalentes,
  Configurar cookies y Escape en preferencias ya elegidas. Sin mover el foco al
  footer al tomar la primera elección; retorno al abrir preferencias.
- Siete assets minimizados con Terser 5.51.2 (sin compresión lógica/mangle) y
  clean-css 5.3.3. Fuentes legibles intactas y herramientas fuera del proyecto;
  Cloudflare sigue publicando `site/` sin build. Manifiesto comprueba hashes LF.
- Kit `servicios/seo-local/`: diagnóstico HTTP con HTML/JSON por ejecución,
  ficha de cliente, alcance y oferta defendible. Datos cliente fuera de `site/`.

## Regeneración

Después de generar páginas/CSS, ejecutar foundation y minimización. El test de
assets bloquea fuentes modificadas sin regenerar sus salidas.
La minimización conserva la versión si las fuentes coinciden y genera una
nueva versión por hash al cambiarlas, para no reutilizar URLs de caché publicadas.

```text
python _plantillas/seo-foundation.py
node _plantillas/minificar-assets.cjs --tools <directorio externo con herramientas>
python _plantillas/seo-foundation.py
```

Herramientas externas, sin package.json ni dependencias en el proyecto:

```text
npm install --prefix <directorio externo> --ignore-scripts --no-audit --no-fund terser@5.51.2 clean-css@5.3.3
```

## Verificación

SEO/enlaces/grafo/consentimiento/minificados/demo/calculadora y cuatro pruebas
del auditor reutilizable. Navegador local: 390×844 y escritorio, aviso legible,
rechazo, reapertura y Escape con retorno de foco. Cero etiquetas GA4 con rechazo.
Python local no reproduce `_redirects`: rutas se verifican en preview/producción.

MINIFIED_ASSETS conserva bytes y gzip estimado antes/después. No se ha acreditado
un nuevo LCP ni ganancia de visitas: no inferirla de una reducción de archivos.

## Seguimiento

PR #20 fusionado en `315b9a0`, con CI y despliegue Cloudflare correctos.
Producción comprobada el 04/10/2026: 24 URLs del sitemap devuelven 200 sin
redirección. Alias minúsculos de L’Obscur, PrimeBurger y Habitat y favicon
redirigen 301 al destino correcto. Apex conserva path y query. Inexistentes
y rutas anidadas absurdas mantienen 404. Aviso de cookies visible y coherente
en producción; el diseño principal permanece.

Kit `servicios/seo-local/` incluye auditor, ficha, procedimiento y propuesta
adaptable. Diagnóstico HTTP de Studio32 tras publicación: ningún hallazgo en
las comprobaciones acotadas del auditor; esto no acredita ranking ni captación.

Search Console confirmó «Se ha solicitado la indexación» para precios,
clínicas dentales, restaurantes y calculadora. Cada confirmación se conservó
en la evidencia privada de la revisión. No se ha confirmado su indexación;
enviar la solicitud no cambia las posiciones ni obliga a Google a indexar.

Publicar tras preview/CI; revisar HTTP y Google en producción. Solicitar las
URLs comerciales prioritarias después de comprobar prueba publicada; guardar
estado de solicitud, sin afirmar que Google las haya indexado. La evolución de
consultas/contactos queda sujeta a datos posteriores. No ampliar colección ni
publicar garantías comerciales por la puntuación de HubSpot.

Reversión: revertir este cambio completo (HTML, assets, versiones y sitemap),
no reemplazar archivos minificados bajo una versión de caché ya publicada.
