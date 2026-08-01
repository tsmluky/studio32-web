# Estado actual · studio32-web

> Se sobrescribe, no se acumula. Refleja dónde está el repo AHORA.
> Lo histórico va a `DECISIONS.md`. Última actualización: **2026-08-01**.

## Qué es este repo

Web pública comercial de Studio32 → **studio32.es**. Superficie estática:
HTML/CSS/JS sin framework ni build. La única raíz publicada es `site/`.

Contexto del ecosistema completo: repo `Studio32` → `notes/CONTEXTO.md`.

## Deploy y trabajo local

- Cloudflare Pages publica `main` en `www.studio32.es`.
- Netlify sigue sirviendo el apex desnudo `studio32.es`; cortar ese resto de la
  migración no es urgente.
- Local: `python -m http.server 8080 --directory site`.
- Al tocar `styles.css` o `script.js`, subir ambos `?v=` en `index.html`.
  Versión actual: `20260801-dashboard-2`.
- Repo compartido entre dos máquinas: `git pull --rebase` al empezar y commit +
  push de `.ai/` al cerrar.

## Estructura relevante

```
site/
  index.html · styles.css · script.js    ← landing principal
  Landing1-L'Obscur/                     ← demo restauración
  Landing2-PrimeBurger/                  ← demo food brand
  Landing3-Clinic/                       ← demo clínica
  Landing4-Habitat/                      ← demo arquitectura
  legal/ · assets/
docs/                                    ← prototipos fuera del deploy
```

La raíz contiene copias antiguas de agente, templates y herramientas. No editar
`studio32-agent/` dentro de este repo: la fuente vive en el repo separado
`studio32-agent`.

## Estado de la landing principal

Registro visual claro: papel cálido, superficies blancas, sombras y bronce como
tinta. Estructura:

`#problema` → `#control` → `#agente` → `#process` → `#tarifas` → `#services` →
`#faq` → `#contact`.

La demo de `#control` es la única interfaz de conversación de la página y tiene
dos fases:

1. Showreel local, sin coste ni backend, que enseña criterio y termina con cita.
2. Relevo “Pruébalo tú mismo”, que abre una sesión nueva contra el agente real.

Los tres sectores cambian de tenant real:

- Clínica → `clinica-cobalto`
- Restaurante → `restaurante-demo`
- Servicio local → `servicios-demo`

El panel consulta `GET /demo/estado` y muestra la cita creada realmente. La
agenda del agente está aislada por sesión en tenants demo.

## Dashboard demostrativo dentro de `#control`

El mockup ya funciona como preview navegable y replica la estructura de las
vistas reales de `studio32-panel`:

- **Inbox:** conversación viva, historial espejado y tres filas explicativas.
- **Citas:** selector Calendario/Lista, navegación mensual, celdas con chips y
  panel de día seleccionado.
- **Servicios:** catálogo seleccionable + editor de nombre, descripción,
  duración y precio.
- **Agente:** vista de solo lectura con capacidades, FAQ y solicitud de cambio.

Al pulsar “Pruébalo tú mismo” no se borra el showreel: queda archivado como
conversación atendida, se inserta “Nuevo contacto” arriba y el resto baja. Al
reiniciar o cambiar de sector se restaura la pila inicial.

Verificado en navegador interno:

- 1280 × 900 y 390 × 844: sin scroll horizontal ni errores de composición.
- La lista pasa de 3 a 4 conversaciones al tomar el control y conserva la cita.
- Servicios cambia catálogo y editor con cada sector y permite seleccionar fila.
- Sin errores ni avisos de consola; `node --check` y `git diff --check` limpios.

## Deuda y siguiente foco

- Los overrides del tema claro siguen al final de `styles.css`; plegarlos dentro
  de cada componente cuando se haga una pasada de deuda, no durante un cambio UI.
- Queda CSS/JS huérfano del selector y chats antiguos (`initSectorDemo`,
  `initChatDemo`, `.control-grid`, `.fit-card--tab`, etc.).
- Las cuatro demos de presencia digital necesitan una evolución más ambiciosa.
  Tratar cada una como una landing que demuestra criterio; no volver a escenas
  literales construidas con cajas CSS. El concepto de amanecer sigue aparcado
  hasta elegir una dirección y los assets adecuados.
