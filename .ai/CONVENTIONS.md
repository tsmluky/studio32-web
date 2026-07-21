# Convenciones · studio32-web

> Reglas estables del repo. Cambian poco. Si algo aquí deja de ser cierto,
> corrígelo aquí — no lo dupliques en otro archivo.

## Regla de rutas (importante)

**Nunca escribas rutas absolutas** (`C:\Users\...`) en ningún archivo de `.ai/`,
`CLAUDE.md` ni `AGENTS.md`. Este repo se trabaja desde dos máquinas distintas
(portátil y sobremesa) y las rutas absolutas se rompen al cruzar.

- Dentro del repo: rutas relativas a la raíz del repo (`site/index.html`).
- A otro repo del ecosistema: **por nombre de repo + ruta interna**
  (`repo Studio32 → notes/CONTEXTO.md`), nunca por ruta de disco.

## Stack

Vanilla HTML/CSS/JS. Sin framework, sin build, sin `package.json` en `site/`.

Dependencias CDN en uso — **no añadir nuevas sin aprobación explícita**:
Google Fonts · GSAP 3.12.2 + ScrollTrigger · SplitType · Lenis 1.0.29 · Swiper 11.

## Reglas técnicas

**CSS**
- Custom properties (`--nombre`) para todos los colores, fuentes y transiciones.
- Sin estilos inline en HTML.
- Antes de crear una clase, comprobar si ya existe una equivalente.
- Naming BEM-adjacent, descriptivo, kebab-case.

**JS**
- JS acotado a su página. No hay archivos compartidos.
- GSAP/ScrollTrigger es frágil: probar animaciones después de cada edición.
- Lenis se inicializa en cada `script.js` — no duplicar ni provocar conflicto.

**HTML**
- Toda página: `<meta charset>`, `<meta viewport>`, `<title>`, `<meta description>`, `<link rel="icon">`.
- Semántica: `<nav>`, `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Un solo `<h1>` por página; jerarquía correcta después.
- `aria-label` en botones de solo icono y toggles de navegación.

**Assets**
- Preferir assets locales a URLs remotas.
- Clinic y Habitat tiran de Unsplash remoto — no añadir más; señalarlo si aparece.

## Marca y tono

Studio32 · Digital Systems. Estudio de sistemas digitales para negocios físicos.
**No** es agencia de marketing genérica, ni fábrica de landings baratas, ni tienda
de hype de IA, ni portfolio personal de los fundadores.

**Escribe en español** salvo petición explícita. Tono: sobrio, premium, comercial
sin ser agresivo, técnico pero entendible por el dueño de un negocio, directo y
específico. Humano sin ser coloquial.

Vocabulario: presencia digital, sistema digital, captación, automatización, IA
práctica, asistente inteligente, flujo de contacto, experiencia móvil, conversión,
negocio físico, negocio local, auditoría.

Prohibido: "revolucionamos", "llevamos al siguiente nivel", "crecimiento
exponencial", "dominación digital", "arsenal", "construye tu imperio", "marketing
360", "soluciones integrales", "somos apasionados de…", superlativos vacíos.

Sin emojis en UI de producción. Sin mencionar Valencia ni España en copy ni
imágenes: alcance nacional, Studio32 se sostiene solo. Precios en EUR.

## Copy

1. Liderar con resultado de negocio, no con feature técnica.
2. Todo titular debe ser específico. Los genéricos se sustituyen.
3. CTAs accionables: "Solicitar auditoría", "Ver demo", "Reservar cita".
4. Nada de subtítulos vacíos ("Nuestros servicios", "¿Por qué nosotros?").
5. **Nunca inventar** métricas, premios, testimonios, casos de éxito ni nombres
   de cliente. Si es placeholder, marcarlo: `[DEMO — cambiar por nombre real]`.
6. Sin sobrepromesa: nada de "garantizamos", "cero imprevistos", "resultados en 30 días".
7. Tono no personalista: la web habla del estudio y el método, no de los fundadores.

## Diseño

Dirección visual: editorial, sobrio, premium, moderno.

Paleta de la landing principal: negro `#090908`, crema cálido `#f6f0e5`, oro
`#c9a86a`. Overlay de grano. Playfair Display (títulos) + Inter (cuerpo).
**Cada demo tiene su propia paleta según su vertical — preservar esa identidad.**

- Whitespace generoso y ritmo vertical. No comprimir para meter más contenido.
- Jerarquía tipográfica clara: label → título → cuerpo → detalle.
- Cada sección con propósito comercial claro.
- Animaciones sutiles y con intención. Nada por espectáculo.
- Sin gradientes baratos, neón, estética hacker ni cripto.

Jerarquía de la landing: Hero → Problema → Servicios → Verticales/Demos →
Proceso → CTA final.

## Qué NO hacer

- No convertir a React/Next/Astro ni ningún framework sin aprobación explícita.
- No añadir build system ni dependencias npm sin aprobación.
- No añadir CDNs nuevos.
- No borrar demos, assets ni contenido sin confirmación explícita.
- No añadir backend aquí: esta superficie es estática.
- No editar el código embebido duplicado (ver `STATE.md` → Trampas del repo).
- No escribir `README.md` salvo petición.
- No romper enlaces relativos entre páginas.

## Checklist manual tras cambios

**Funcional:** navegación interna hace scroll a la sección correcta · enlaces de
demo abren la página correcta · WhatsApp y email del CTA funcionan · sin errores
en consola.

**Desktop 1440px+:** hero completo y alineado · sin desbordes en títulos ·
grids de servicios y verticales sin romper · footer CTA centrado.

**Tablet 900–1200px:** grids de dos columnas colapsan bien · cards de vertical a
2 columnas · cursor custom oculto.

**Móvil ≤540px:** título de hero legible sin truncar · rail a 1 columna · padding
suficiente · CTA full-width y pulsable · **sin scroll horizontal**.

**Copy:** sin placeholder olvidado · sin erratas en titulares ni CTAs · sin
lenguaje de agencia agresivo · todo en español, sin fragmentos en inglés.
