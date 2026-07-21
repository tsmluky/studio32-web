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
