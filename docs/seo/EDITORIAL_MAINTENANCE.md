# Mantenimiento editorial

Apartados 54, 63, 104–105, 120 y 149. Responsable: Studio32. Fuente de verdad:
`_plantillas/discovery-content.json`; registro derivado: `CONTENT_REGISTRY.json`.

El generador rechaza borradores, estados sin aprobación, responsable ausente,
fechas incoherentes o futuras y dateModified sin zona antes de escribir HTML.
El estado se comprueba también por página: un status draft/review/stale dentro
de una colección published bloquea toda la generación antes de escribir. Si
la página no define status, hereda el de la colección. No se publica un subconjunto
silenciosamente ni se convierte un borrador en publicado dentro del registro.
La fecha visible se obtiene de reviewedAt; no queda fijada al primer día.
No actualizar reviewedAt ni modifiedAt por formato, regeneración o cambios de
plantilla. Actualizarlos solo después de una revisión real de contenido.

La política inicial fija 90 días para las seis fuentes de proveedor/producto;
las once páginas tienen revisión conceptual anual. La revisión de las fuentes
puede exigir corregir antes las páginas afectadas. Cada tarea identifica esas
páginas. La fecha de publicación de la colección es 02/10/2026.

Ejecutar desde la raíz:

```powershell
python _plantillas/editorial-maintenance.py
python _plantillas/editorial-maintenance.py --as-of 2026-10-03 --output docs/seo/REVIEW_QUEUE.json
```

REVIEW_QUEUE.json es una fotografía fechada, no un servicio ni recordatorio.
No se creó ninguna automatización. A fecha 03/10: 17 tareas, cero vencidas;
fuentes el 31/12/2026, revisión conceptual el 02/10/2027. Las cifras de portada
tienen su revisión separada en HOME_CLAIMS.md (enero de 2027).

Una fuente vencida se informa para revisión humana; no cambia contenido, estado,
fechas públicas ni elimina una página automáticamente. Los errores estructurales
sí fallan en el validador existente y CI. Cinco pruebas cubren publicación de
borradores, cronología, fuentes, fecha visible y vencimiento sin mutaciones.

Este control no confirma que una fuente continúe correcta o una URL responda.
La revisión incluye abrir la documentación vigente, contrastar la afirmación y
registrar el cambio o la ausencia de cambio. Tampoco detecta por sí solo
canibalización semántica: revisar intención en CONTENT_REGISTRY antes de ampliar.
