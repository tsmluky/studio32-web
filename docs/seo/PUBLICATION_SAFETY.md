# Publicación y contenido seguro · apartados 121–125 y 132

El validador ejecutado por CI incluye las guardas de publicación y siete
pruebas de seguridad editorial. No necesita paquetes, secretos ni red.

- Rechaza rutas editoriales fuera de los hubs o capaces de salir de site,
  duplicados, relacionados ausentes y fuentes no declaradas antes de escribir.
- Las fuentes deben usar HTTPS, sin credenciales ni esquemas ejecutables.
- Texto/atributos se escapan y JSON-LD no permite cerrar el script desde datos.
- Rechaza URLs activas de localhost y previews Pages en href/src/action del HTML;
  los ejemplos comentados no cuentan como peticiones del navegador.
- Rechaza archivos .env, claves privadas, bases de datos y firmas conocidas de
  tokens privados en la salida pública. Solo informa ruta/tipo, nunca el valor.

Esto cubre errores concretos, no certifica ausencia de todos los secretos,
vulnerabilidades, URLs construidas dinámicamente ni seguridad del backend.
Los tokens públicos de medición no se consideran credenciales privadas.

La demo histórica de Taberna cargaba un script activo de localhost:3000.
Se elimina esa dependencia inservible para visitantes y su atribución existente
ofrece probar el asistente en la portada. Conserva noindex, diseño y archivos;
identifica los datos como ficticios. No se activa un nuevo tenant o widget.

## Revertir una modificación crítica

1. Identificar el commit publicado y la modificación concreta. Guardar su diff,
   pruebas y URL de despliegue; no restaurar todo el árbol por una nota antigua.
2. Crear una rama desde main actualizado y revertir ese commit con git revert.
   Revisar el diff antes de publicar; si requiere conservar cambios posteriores,
   preparar una corrección mínima en lugar de una reversión completa.
3. Si se revierte CSS/JS con cache immutable, usar una versión nueva en todas
   sus referencias y generadores. Recuperar una versión antigua puede reutilizar
   caché del navegador. Verificar hashes/manifiestos aprobados cuando corresponda.
4. Ejecutar los controles del workflow, abrir PR y revisar preview. Después del
   merge comprobar HTTP, canonical/robots/sitemap y el recorrido afectado.
5. Las reglas externas de Cloudflare se revierten en su configuración: un revert
   de Git no modifica DNS ni reglas del dominio. Documentar antes su valor real.

No se ha ejecutado una reversión en producción como prueba. No se han cambiado
DNS, controles de acceso, reglas de rama ni permisos del backend.
