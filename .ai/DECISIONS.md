# Decisiones · studio32-web

> **Append-only.** Se añade abajo, nunca se reescribe ni se borra.
> Nadie lee este archivo entero: se consulta. Formato: fecha · decisión · por qué.
> Si una decisión se revierte, **no la borres** — añade una nueva que la anule.

---

## 2026-07-21 · Contexto compartido en `.ai/`, versionado en git

`CLAUDE.md` y `AGENTS.md` duplicaban positioning, tono y estructura de carpetas, y
habían divergido entre sí (uno describía `ejemplos landing/`, el otro `site/`).
Además apuntaban a rutas del sobremesa que ya no existen (`C:\Users\lukys\...`,
`10-producto/`, `00-direccion-y-operaciones/`).

**Decisión:** toda la sustancia pasa a `.ai/` (`STATE.md`, `DECISIONS.md`,
`CONVENTIONS.md`). `CLAUDE.md` y `AGENTS.md` quedan como punteros de tres líneas.

**Por qué:** fuente única → no puede haber contradicción entre agentes. Y al vivir
dentro del repo, GitHub sincroniza el contexto entre portátil y sobremesa gratis.

## 2026-07-21 · Prohibidas las rutas absolutas en documentación de contexto

**Decisión:** ni `C:\Users\...` ni nombres de máquina en `.ai/`, `CLAUDE.md` o
`AGENTS.md`. Referencias a otros repos por **nombre de repo + ruta interna**.

**Por qué:** causa raíz del podrido anterior. El usuario del sobremesa era `lukys`
y el del portátil es `lukx`; toda ruta absoluta se rompió al migrar tras el fallo
del sobremesa.

## 2026-07-21 · `.claude/settings.json` deja de estar ignorado

`.gitignore` excluía `.claude/` entero, lo que impedía que la configuración
compartida (hooks) viajara entre máquinas.

**Decisión:** excepción para `.claude/settings.json`. El resto de `.claude/`
(sesiones, caché, datos locales) sigue ignorado.

**Por qué:** sin esto, cada máquina tendría hooks distintos y la sincronía
dependería de que el usuario los recreara a mano en ambas.

## 2026-07-21 · Limpiados riesgos fantasma de la documentación

Se retiran de la doc viva tres avisos que ya no aplican: `.git` anidado en
`Landing2-PrimeBurger/`, legales en `Agencia-Portfolio/`, y el `index.html` raíz
como redirect. Verificado en disco el 2026-07-21.

**Por qué:** documentación que avisa de peligros inexistentes entrena al agente
(y al humano) a ignorar los avisos. Quedan registrados aquí como histórico y
listados en `STATE.md` como "resueltos" para que no se vuelvan a añadir.

## 2026-07-31 · No se adopta la landing generada por Polsia

Polsia (agente autónomo de terceros) generó en `studio32.polsia.io` una landing
alternativa, además de market research, misión y roadmap, partiendo solo de la URL
pública de studio32.es.

**Decisión:** **no** migrar a ese diseño. Se conserva el sistema visual propio
(vanilla, negro/crema/oro, Playfair + Inter) y se portan solo las ganancias
comerciales concretas.

**Por qué:** su landing es una plantilla Next.js + Tailwind + shadcn parametrizada
por **una sola variable de color** (`--brand-h: 192`), con Inter para títulos y
cuerpo. Es la misma plantilla para todos sus clientes. Adoptarla habría cambiado
el único diferenciador visual de Studio32 por la estética SaaS genérica que ya
usan Converpilot, SAPIENSDATAAI y el resto de competidores del vertical.

Estructuralmente no aportaba nada: la web ya tenía hero → problema → agente →
control → verticales → proceso → servicios → FAQ → CTA, es decir, el mismo
esqueleto.

**Su roadmap tampoco se adopta.** Está escrito para una empresa en día cero
(propone construir panel, demos sectoriales y editor de conocimiento, que ya
existen en `studio32-panel` y `studio32-agent`) y coloca en "Later" la
verificación del número en Meta, que es el bloqueante real del go-live.

## 2026-07-31 · El chat demo daba precios; el agente real no

El mockup de conversación de `site/index.html` mostraba a la clínica dando el
precio de una higiene por WhatsApp ("cuesta 45 €"). El agente real de GH Dent
tiene la regla contraria: no da precios ni confirma mutuas por chat, ofrece la
valoración gratuita.

**Decisión:** reescrita la conversación. Ahora hace triage de dolor sin
diagnosticar, deriva la cuestión del precio a la valoración sin coste, cierra la
cita y ofrece escalar a una persona.

**Por qué:** la demo vendía un comportamiento que el producto no tiene, y de paso
desperdiciaba la mejor baza comercial — el criterio del oficio es justo lo que el
Meta Business Agent (nativo, global desde el 03/06/2026 y gratis por ahora) no
sabe hacer. Regla para futuros mockups: toda conversación demo debe ser
comportamiento que el agente ejecute de verdad, y debe cerrar el bucle.

## 2026-08-01 · Una sola prueba del agente en la página, y que sea real

La página había acumulado **cinco interfaces de chat**: el mockup de `#agente`,
las tres conversaciones maquetadas del selector de `#portfolio`, y la demo en
vivo de `#control`. Se añadieron en sesiones sucesivas sin retirar lo anterior.

**Decisión:** dejar **una sola** y que sea la real.
- Se elimina el mockup de `#agente`, que pasa a explicar qué hay por detrás.
- Se elimina la sección `#portfolio` entera.
- La demo en vivo **sube** justo detrás de `#problema` y es el centro de la
  página. El menú pasa a "Pruébalo · El agente · …" y el CTA del hero apunta a
  ella.

**Por qué:** desde que el visitante puede hablar con el agente de verdad, una
captura de conversación no aporta — resta. Compiten entre sí por la misma
atención y diluyen la única prueba que de verdad convence. Repetir el mismo
argumento tres veces no lo refuerza, lo abarata.

**Siguiente paso acordado:** el selector por sector no desaparece como idea, se
traslada — clínica / restaurante / servicio local **sobre la demo real**, un
tenant por vertical. Hoy solo existe `clinica-cobalto`; hacen falta los otros dos
en `studio32-agent`. Eso es trabajo de arquetipos, reutilizable en producto, no
solo en la web.

## 2026-08-01 · El selector por sector habla con tenants REALES

`#portfolio` se eliminó porque sus tres conversaciones eran maquetas. La idea de
enseñar sectores no se pierde: se traslada **encima de la demo en vivo**.

**Decisión:** las tres pestañas (clínica / restaurante / servicio local) cambian
el **tenant** con el que se conversa, no el decorado. Cada una es un negocio real
del agente con su propia personalidad, servicios y políticas:
`clinica-cobalto`, `restaurante-demo` (Casa Duarte) y `servicios-demo`
(Instalaciones Vera). Al cambiar se reescriben los rótulos del chat y del panel,
se renueva la sesión y se relanza el guion de reclamo de ese sector.

**Por qué:** una maqueta por vertical dice "esto podría hacerse". Un tenant real
por vertical deja que el visitante lo compruebe — y de paso el trabajo sirve para
vender a cualquier restaurante, no solo para la landing.

**Efecto lateral valioso:** `restaurante-demo` es el primer tenant con
`menu.json`, así que la herramienta `getMenu` (carta, precios y alérgenos) pasa a
estar ejercitada en producción, no solo escrita.

## 2026-08-01 · Versión de assets congelada desde julio

Los cambios en `script.js` no llegaban al navegador ni con recarga dura. Causa:
`index.html` referencia `styles.css?v=…` y `script.js?v=…` con una versión fija
que no se tocaba desde el 19/07, así que la URL cacheada nunca cambiaba.

**Regla:** al tocar `styles.css` o `script.js`, **subir el sufijo `?v=`** de
`index.html`. Si no, Cloudflare y el navegador siguen sirviendo lo viejo y el
despliegue parece no haber ocurrido.

## 2026-08-01 · Cambio de registro: la web pasa a claro

Tras cinco intentos de dirección visual (comparador de 7 variantes, "turno de
noche", "una noche", "luz", shader WebGL), el usuario seguía viendo la web
"cutre y barata" y señalaba que la landing generada por Polsia —siendo una
plantilla genérica— le resultaba más atractiva.

**Diagnóstico:** el problema no era la paleta ni la tipografía. El registro
oscuro-editorial es de los más difíciles de ejecutar: una página negra con solo
tipografía y filetes de un píxel está a un paso de parecer una página sin
estilar, porque toda la profundidad depende del contraste. El registro claro es
**indulgente**: la profundidad la da la sombra, y se ve decente con mucho menos
acabado. Eso, y no el turquesa, es lo que hacía atractiva a la de Polsia.

**Decisión:** cambiar el registro a claro conservando la marca.
- Papel cálido `#f7f4ee`, nunca blanco puro. Superficies blancas con sombra en
  tres niveles (`--sombra-1/2/3`) en lugar de filetes sobre negro.
- **El hero se queda oscuro** a propósito: apertura dramática, cuerpo legible.
  Es el patrón habitual de las piezas que funcionan, y deja sitio al concepto
  de la noche si se retoma.
- El oro no tiene contraste sobre papel: se conserva como **relleno**
  (`--accent-fill`, botones y panel de tarifas) y baja a bronce `#8a6421`
  cuando hace de tinta.

**Trampas encontradas al invertir** (todas por colores escritos a pelo que se
saltaban los tokens):
- `body::before` es una capa **fija a pantalla completa** con el negro literal.
  Las secciones con fondo propio la tapaban y las que no —tarifas, servicios—
  la dejaban asomar: media página seguía oscura.
- `.faq` llevaba `#0d0c0a` dentro de su degradado.
- `.nav-link`, `.faq-a p`, `.contact-grid p` y el pie llevaban crema literal.
- `.btn-massive` usaba `background: var(--text-color)` con texto oscuro: al
  invertir los tokens quedó negro sobre negro.

Se verificó con un detector de contraste recorriendo `main`, `footer`, `nav` y
`.hero`. Cuidado: comprobar solo `background-color` da falsos positivos en el
hero, cuyo fondo es un degradado (`background-image`).

**Pendiente:** los ajustes de componente están al final de `styles.css` como
bloque aparte para ganar la cascada sin reescribir cada componente hoy. Hay que
plegarlos dentro de su componente y borrar el bloque, o el mismo componente
queda definido en dos sitios.

## 2026-08-01 · Ritmo, cifras, pie y retirada del widget

**Diagnóstico visual:** cinco secciones seguidas con la misma forma (etiqueta
entre corchetes → titular Playfair con cursiva dorada → fila de tarjetas con
filete). Al bajar, la página repetía en vez de avanzar. El problema no era el
color ni el contenido: era la **falta de variación de compás**.

**Cifras del mercado** (`.cifras`, en `#problema`): banda cálida a sangre
completa, sin tarjetas, con la cifra a tamaño de titular. Rompe el compás a
propósito.

**Regla dura sobre los datos:** cada cifra lleva su **fuente a la vista** en el
propio bloque. Son datos de terceros, nunca resultados de Studio32:
- 94% usa WhatsApp cada mes · IAB Spain y Elogia, Estudio de Redes Sociales 2026
- 21,1% de empresas de 10+ trabajadores usa IA (venía del 12,4%) · INE
- 35% de pymes invertirá en IA en 2026 (22% en 2025) · estudio IONOS

**Descartado:** "reducción de no-shows del 40–65%". Era una cifra **declarada por
competidores**, no un resultado propio ni verificable. Ponerla habría violado la
regla de no inventar métricas.

**Pie reconstruido:** antes tenía dos cierres seguidos —el panel de CTA y, justo
debajo, un titular de misión a cinco líneas— que se anulaban entre sí, más un
vacío grande abajo a la derecha. Ahora el titular baja de tamaño y el espacio se
usa para cuatro columnas de navegación real (13 enlaces internos, que además
ayudan al enlazado interno).

**Widget retirado de la vista:** su burbuja flotante se oculta por CSS. Con la
demo en el centro de la página había **dos chats a la vez hablando con tenants
distintos** (`studio32` vs. el de demo), lo que confunde, y la burbuja tapaba
contenido en la FAQ y el pie. La función se conserva: la abre el botón "Hablemos"
del menú vía `window.S32W.open()`, con vuelta a `#contact` si el widget no carga.
Su panel se adapta al registro claro desde `styles.css`, sin tocar el otro repo.

**Nota sobre SEO:** las imágenes no posicionan en una página así y pueden
perjudicar por peso (Core Web Vitals). Donde vive el SEO aquí es en el JSON-LD ya
puesto, en **más páginas** (una por vertical) y en **enlaces internos** — de ahí
que el pie nuevo sume. No añadir fotografía de stock: hunde la percepción de
calidad justo después de haberla ganado.

## 2026-08-01 · Páginas por vertical (SEO + venta)

studio32.es era **una sola página**: cero cobertura de búsqueda long-tail y nada
concreto que enviarle a un prospecto. Se añaden tres:

- `/agente-whatsapp-clinicas-dentales/`
- `/agente-whatsapp-restaurantes/`
- `/agente-whatsapp-servicios-locales/`

Cada una abre con **la demo ya apuntando a su tenant** (`data-live-demo="…"`),
así que el visitante habla con un negocio de su sector sin elegir nada.

**Diferenciación deliberada.** El vertical dental está saturado (ConverPilot dice
180 clínicas, ChatBotDental 70, Clientisima vende a 19 €/mes). Competir en
"chatbot 24/7" es competir en commodity. Estas páginas se apoyan en lo único que
ninguno ofrece: **poder hablar con el agente configurado ahí mismo**, más un
bloque de **límites** ("lo que NO hace") que en verticales regulados genera más
confianza que la lista de funciones.

### Decisiones técnicas

**El marcado de la demo pasó a plantilla en JS** (`plantillaDemo()`). Antes vivía
en `index.html`; replicarlo en cuatro páginas eran ~130 líneas duplicadas que
divergen a la tercera edición. Es INTERFAZ, no contenido indexable, así que
generarlo en cliente no cuesta posicionamiento.

**Las páginas por vertical NO cargan GSAP, Lenis ni SplitType.** Son páginas de
posicionamiento y cuatro librerías de CDN penalizan Core Web Vitals, que sí es
factor de ranking. `script.js` detecta su ausencia (`TIENE_GSAP`) y salta las
animaciones. La demo es DOM plano y funciona igual.

**Generador en `_plantillas/generar-verticales.py`** (fuera de `site/`, no se
despliega). Las tres páginas comparten cabecera, navegación, pie y demo: a mano
divergirían. El HTML generado se commitea, así que no hay paso de build.

### Trampas encontradas

- **Zona muerta temporal.** Sin preloader, `initHeroAnimations()` se llamaba de
  forma síncrona durante la evaluación del script, antes de que se inicializara
  `const SECTORES` → "Cannot access 'SECTORES' before initialization". Se resuelve
  con `queueMicrotask`. En la portada no se veía porque la llamada venía del
  `onComplete` del preloader, ya asíncrono.
- **La barra de navegación de la portada da por hecho el menú hamburguesa**: en
  móvil oculta enlaces Y botón. Sin toggle, estas páginas se quedaban sin acciones
  y la barra desbordaba.
- **`.huge-text` está calibrado para frases muy cortas** ("Puede verse mejor.").
  Con un titular más largo se salía del panel y arrastraba scroll horizontal.
- **Sangre completa y barra de scroll**: `calc(50% - 50vw)` desborda exactamente
  el ancho de la barra, porque `50vw` la incluye y `50%` no. Se recorta con
  `overflow-x: clip` en `html, body` — nunca `hidden`, que rompería el
  `position: sticky` de la cabecera de la FAQ.

## 2026-08-01 · Página "El panel de control" (tour de producto)

`/panel-de-control/`. El panel es la mitad de la oferta —el agente atiende, el
panel es donde el negocio ve y controla lo que hizo— y en la web solo aparecía
en miniatura dentro de la demo.

**Fidelidad al producto real, no invención.** Se leyó `studio32-panel` antes de
escribir nada. La página reproduce sus **cinco** secciones reales (Resumen ·
Inbox · Citas · Servicios · Asistente), sus métricas ("Conversaciones abiertas",
"En control humano", "Citas de hoy", "Atención requerida"), su calendario
mensual y sus servicios editables con activo/inactivo.

**Ojo:** el mockup pequeño de la demo de la portada muestra solo cuatro secciones
y llama "Agente" a lo que en el panel real es "Asistente". Queda pendiente
igualarlo.

**Regla:** si el panel real cambia, esta página hay que actualizarla. Un tour de
producto que enseña algo que no existe es peor que no tener tour — es el mismo
error que el chat demo que daba precios que el agente no da.

Los datos son de Clínica Cobalto, el mismo negocio ficticio de la demo, para que
quien venga de la portada reconozca las conversaciones. Marcado como
demostración en la propia página, dos veces.

**Nota sobre el capturador del navegador:** al hacer capturas con la página
desplazada, coloca mal los elementos `position: fixed` (la barra aparece a mitad
de página). El DOM y el hit-testing dicen lo correcto. No perseguir ese fantasma:
verificar con `getBoundingClientRect` y `elementFromPoint`, no con la captura.

## 2026-08-01 · Página de precio (`/precio-agente-whatsapp/`)

"Cuánto cuesta" es la pregunta número uno y una intención de búsqueda muy clara,
y no había página. Studio32 no publica cifras propias, así que la página explica
**el modelo** en vez de dar un número: los dos tramos, qué mueve el precio y
cinco preguntas que conviene hacerle a cualquier proveedor antes de firmar
(nosotros incluidos).

**El bloque diferenciador es el de Meta**, y sale de datos verificados:
- Meta **no cobra** cuando el cliente inicia la conversación y se responde dentro
  de 24 h. En una recepción eso es casi todo el volumen.
- Las primeras **1.000 conversaciones de servicio al mes** son gratuitas.
- Lo que se paga son los mensajes que **inicia el negocio** (campañas).

Casi todo el sector presenta ese coste como una incógnita vaga. Explicarlo bien
posiciona a Studio32 como el proveedor que no esconde nada, y de paso quita la
objeción antes de que aparezca.

Se evita dar una cifra cerrada de las tarifas de Meta: las revisa
periódicamente. La página lo dice explícitamente y remite a su página oficial.

**No se nombran competidores.** El rango de mercado (80–400 €/mes de
mantenimiento, ofertas de 19 €/mes que son plantillas) se da como contexto, sin
señalar a nadie.

## 2026-08-01 · CSS huérfano: analizado, NO borrado

`_plantillas/css-huerfano.py` compara las clases definidas en las hojas propias
contra todas las referenciadas, incluidas las que viven dentro de plantillas de
JavaScript (la demo en vivo se genera desde `script.js`, así que hay clases que
no aparecen en ningún `.html` y sí se usan).

**Se decidió no borrar.** El ahorro son unos kilobytes y el riesgo es romper la
web en producción. La salida tiene falsos positivos conocidos que están
documentados en el propio script: `.s32w-*` las inyecta el widget desde el otro
repo, las clases construidas por interpolación (`class="panel-conv${...}"`) se
cortan al leerlas, y trozos de URL (`.jpg`, `.webp`) se cuelan como clases.

**Muertas de verdad** (verificadas a mano, del layout anterior): `.agent-grid`,
`.agent-copy`, `.control-grid`, `.control-copy`, `.fit-grid`, `.fit-card`,
`.fit-card--primary`, `.fit-card--tab`, `.sector-panel`, `.sector-points`,
`.sector-detail`, `.sector-detail-label`, `.chat-frame`, `.chat-mockup`,
`.chat-body`, `.chat-note`, `.chat-typing`, `.live-replies`, `.msg-in`.

Ojo: `.chat-header`, `.chat-avatar`, `.chat-status`, `.chat-day`, `.chat-msg` y
`.detail-message*` SÍ se usan — las crea la plantilla de la demo.

## 2026-10-02 · Primera colección de descubrimiento orgánico

Se mantiene HTML estático y el patrón Python existente: fuente editorial JSON,
renderer que escapa texto y HTML versionado. Sin CMS, framework, npm ni nuevo CDN.
Se preparan siete guías, tres problemas y una calculadora; después medir antes de
ampliar. Marca, portada, demo y CSS/JS comercial base se conservan. Enlazado nuevo
en el footer existente, con temas específicos por página.

Se corrigen tarifas de Meta y cifras de mercado no documentadas. La entidad usa
Organization sin inventar dirección ni presentar una portada social como logo.
Se conserva la política GPTBot. Sitemap excluye noindex y mantiene las URLs de las
demos históricas, ahora con canonical explícito.

La calculadora multiplica fuera de horario por sin resolver dentro de esa franja;
no suma porcentajes. El rango anual es sensibilidad ±10 puntos, no intervalo de
confianza. No almacena ni envía entradas. Eventos locales con adaptador explícito
consentido: usuario confirmó que GA4/GSC/Bing aún no existen; no se activa tracking.

HTTP confirmó soft 404 y dos hosts con 200. El 404 está preparado, pero el host debe
resolverse en el proveedor: Cloudflare Pages no permite redirects por dominio en
_redirects. No se cambia DNS. Entrega en rama y PR para revisión; no fusionar ni
publicar contenido desde el generador sin revisión editorial. Fuentes y cierre
operativo en docs/seo/. No hay métricas de adquisición ni clientes inferidos de demos.


## 2026-10-02 · Cloudflare como referencia de revisión

El usuario confirmó Cloudflare + Supabase e indicó inspeccionar sus dashboards.
Pages `studio32-web` publica `site` desde `main` con www activo; preview de la
rama SEO verificado noindex/404. Supabase hub conserva función operativa, sin
backend nuevo para contenido/calculadora. Se sustituye el enlace de revisión
Netlify por Cloudflare. Netlify es heredado pero todavía sirve el apex (DNS A
proxied y x-nf-request-id); no desactivar hasta cerrar redirección/validación.
Evidencia y propuesta concreta de redirección: `docs/seo/INFRASTRUCTURE.md`.


## 2026-10-02 · Cierre autorizado de fallos

El usuario pidió resolver los fallos y avanzar tras revisar la entrega. Se aplicó
Single Redirect apex a www en Cloudflare: hostname exacto, 301, path/query
conservados. Sin cambios de DNS, correo, Supabase o permisos. HTTP verificado.
La auditoría tenía dos falsos positivos en comentarios y un favicon realmente
ausente: HTMLParser sustituye regex, retorno no cero ante fallos, favicon SVG
local coherente con la demo. 34 páginas, 740 referencias, cero fallos.
Publicar la primera colección tras checks permite corregir el soft 404 real;
no ampliar el número de recursos hasta contar con medición.


## 2026-10-02 · Fuentes de recursos desde el mismo origen

PSI móvil real: rendimiento 92, LCP 2,7 s, TBT 0 ms, CLS 0,001; SEO,
accesibilidad y buenas prácticas 100. Google Fonts CSS bloquea 750 ms en
modelo de laboratorio. Mantener las mismas familias y pesos con WOFF2
originales, Latin/Latin-ext, source manifest + hashes y licencias OFL. Solo
recursos/problemas/herramientas: @font-face en discovery.css y preload de
Playfair normal Latin; quitar CSS externo de esas páginas. No modificar
styles.css, vertical.css, script.js ni demo. Verificar marca y PSI antes de
atribuir una mejora. No interpretar TBT como INP ni laboratorio como CWV real.


## 2026-10-02 · Carga y contraste de portada

Baseline PSI móvil muestra LCP 3,2 s y contraste insuficiente en citas y
footer-services. Aplicar en una hoja exclusiva home-foundation.css los mismos
font-face Inter/Playfair/Syne, licencias OFL y preload de Playfair normal/italic.
Mantener archivos base y demo intactos; texto pequeño cambia solo a text-muted.
No generalizar Syne a verticales: allí la familia existente cae a Inter.

Contraste adicional detectado al renderizar la demo: avatar, estado, nota, label
Inbox y figcaption. Usar el mismo text-muted, sin cambiar interacción o identidad.

## 2026-10-02 · Analytics real con consentimiento básico

El usuario autoriza Google personal; cuenta/propiedad Studio32 separadas de
KittyCorner. ID G-ZKX0QLRZ47, España/EUR. Una finalidad opcional, tag bloqueada
antes de aceptar, preferencias al pie, retirada con bloqueo y recarga. No
medición mejorada ni Ads. URL canónica y referente solo origen; no campañas
UTM hasta contar con etiquetas permitidas. Banner propio de tinta/papel y
igual prominencia; consentimiento global es excepción justificada al JS por página.

## 2026-10-02 · Verificación Bing

Google personal también autorizado expresamente para Bing. Alta manual y meta
msvalidate.01 publicada en portada; no importar Search Console ni conceder
acceso amplio a sus propiedades. Preferencias de consentimiento enfocan el
footer con preventScroll para conservar la posición del lector.

## 2026-10-02 · Primera vista sin espera artificial en movil

El preloader y el fade de hero-bottom aplazan una explicación ya disponible.
Mantener introducción breve en escritorio; móvil hasta 540 px y movimiento
reducido pasan directamente al contenido. Hero-bottom no vuelve a ocultar texto
ni CTA. Red de seguridad desde DOMContentLoaded, independiente del widget.
Cambio localizado en script.js: demo, agente y sectores intactos. Baseline
histórica se conserva; PERFORMANCE_APPROVED registra excepción de hash revisable.
Cache busting del script también en verticales y su generador.

## 2026-10-02 · Consolidación de estilos de portada

home-bundle.css generado desde styles.css y home-foundation.css, en ese orden,
sin minificar ni cambiar sus fuentes/URLs/cascada. Portada reduce una solicitud
CSS bloqueante y precarga Inter original; demás páginas mantienen sus hojas.
Regenerar con python _plantillas/generar-home-css.py tras cambiar cualquiera
de las fuentes CSS. Las fuentes WOFF2 y licencias originales no cambian.
Hash aprobado del script conserva variante CRLF y LF porque Git normaliza
saltos al fusionar; no se modifica baseline histórica ni se permite otro código.
# 2026-10-02 · Separar mejora visual publicada de objetivo LCP

PR #5 publicó bundle de estilos y arranque revisado preservando fuentes y demo.
El último PSI productivo dio LCP 3,2 s; el objetivo 2,5 s sigue abierto.
PR #7 añade consentimiento al bundle pero su preview dio LCP 3,1 s, sin mejora
demostrada. Mantenerlo en borrador. Reducir peticiones no justifica promover un
ensayo por sí solo. Informes GA4 y sitemaps están operativos; adquisición, leads
e indexación efectiva necesitan observación, no cifras propias de QA.
## 2026-10-02 · Trabajo activo y ciclo de sesión de demo

Usuario aclara continuar desarrollo/pendientes mientras se recoge medición.
Paso 15 frena expansión editorial; no bloquea correcciones técnicas. PR #8
cancela peticiones y descarta respuestas por generación de sesión para evitar
mezclar sectores/paneles. Espera limitada sin reenvío: abortar cliente no prueba
cancelación en servidor. Invitación propia por sector, datos ficticios explícitos
y evento con sector elegido. Movimiento reducido mantiene scroll nativo y demo,
sin entrada GSAP. Sin modificar fuentes/diseño ni dar LCP por resuelto.
## 2026-10-02 · QA ligero y conexión de demos

Workflow de un job con paths, permisos de lectura, sin instalaciones ni backend;
checkout oficial fijado a commit. Se guardó vía sesión web existente porque
OAuth de Git carece de scope workflow; no ampliar credencial. Grafo cuenta
orígenes distintos y rutas mínimas entre canónicas del sitemap; enforce hasta
tres clics para colección/principales, no regla SEO universal. Tres demos sin
salida se corrigen convirtiendo la atribución existente en enlace, sin nuevo
bloque ni rediseño. Matriz y preguntas IA preparadas, sin fingir resultados.

## 2026-10-02 · Runtime de comprobaciones

Primera ejecución avisó de checkout con runtime obsoleto. Se actualiza a
checkout oficial v7.0.1/Node 24 fijado a SHA y runner ubuntu-24.04 para evitar
un cambio silencioso de ubuntu-latest. Main caa6cb8 pasa (run 37028651678).
Son controles visibles, sin activar protección de rama ni ampliar scopes.

## 2026-10-02 · Retirada efectiva de Netlify

Usuario aclara que Netlify está deprecado y autoriza corregir el dominio y la
publicación. Había despliegues Git duplicados y apex A 75.2.60.5, aunque una
regla Cloudflare ya redirigía a www. Apex pasa a A reservado 192.0.2.1 proxied
para redirección sin origen; www sigue en Pages. Se detienen builds de studio-32
y se desactivan reversiblemente los tres proyectos Netlify (los otros dos son
demos GH Dent manuales de julio, sin dominios propios ni referencias en los
repos activos revisados). No borrar historial ni claves/hooks. ignore=exit 0
es una segunda guarda frente a reactivación accidental; no bloquea uploads
manuales. Se corrigen instrucciones de publicación en README/PROMPT/STATE.
HTTP/HTTPS mantienen 301 con ruta/query, www 200 y URL inexistente 404.

## 2026-10-02 · Límites editoriales y formulario histórico

PR #10 valida rutas/fuentes y relaciones antes de escribir; escape por sí solo
no impide href javascript ni traversal de salida. Guardas de publicación y
siete pruebas integradas en validador existente, sin cambiar workflow/scopes.
Taberna pedía datos para un widget servido desde localhost del visitante:
se conserva como muestra visual, sin submit ni inputs activos, con acceso a
la demo de Studio32. No activar tenant antiguo sin validación de producto.

## 2026-10-03 · Evidencia antes de optimizar y publicar cifras

No promover fuente estática de PR #11 sin mejora demostrada. PR #12 corrige
accesibilidad del menú independientemente de LCP; preview no prueba mejora en
producción. Mantener objetivo abierto (última medida 3,3 s). PR #13 precisa
periodo, población e intención de las cifras y enlaza fuentes primarias sin
atribuir esos resultados a Studio32. No extrapolar penetración IAB a todos los
internautas sin revisar el denominador del estudio completo.

## 2026-10-03 · Mantenimiento sin falsa actualización

Estado y cronología se validan antes de generación. La cola informa vencimientos,
no revisa fuentes ni publica automáticamente. No modificar fechas por regenerar.
Auditoría HTTP conserva baseline con escritura exclusiva; errores fallan y
descarga no se interpreta como LCP ni respuesta final como código de primer salto.
