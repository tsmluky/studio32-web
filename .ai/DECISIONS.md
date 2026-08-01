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

## 2026-08-01 · El mockup del dashboard se convierte en preview navegable

La demo ya mostraba una conversación real, pero “Pruébalo tú mismo” vaciaba el
panel y reutilizaba la primera fila. Además, Inbox, Citas, Servicios y Agente se
dibujaban como navegación inerte. El resultado enseñaba menos producto del que
existe y hacía desaparecer justo la prueba que acababa de completar el showreel.

**Decisión:** conservar el showreel como conversación atendida e insertar una
conversación nueva encima cuando entra el visitante. La lista gana suficientes
filas para tener scroll propio. La navegación lateral pasa a ser interactiva y
abre previews de agenda, catálogo y configuración del agente; los contenidos de
Servicios y Conocimiento cambian con el sector seleccionado.

**Por qué:** la landing debe demostrar el sistema completo —no sólo el chat— sin
obligar al visitante a entrar en un dashboard externo. Los datos ilustrativos se
mantienen dentro del mockup marcado como “datos ficticios”; conversación y cita
siguen conectadas al agente real cuando el visitante toma el control.
