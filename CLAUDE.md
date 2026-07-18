# CLAUDE.md — Studio32 Working Instruction Manual

> **Current product direction (11/07/2026):** read
> `../../00-direccion-y-operaciones/estrategia/NORTE-AGENT-PLATFORM-2026-07.md`
> before product or architecture work.
> This manual remains useful for the static commercial web, but its older repo
> map and "no backend" rules do not apply to the independent Agent Platform
> backend or independent panel.

This file is the operating reference for Claude Code inside this repository.
Read it before making any changes. Keep it updated when the project evolves.

---

## 1. What Studio32 Is

Studio32 is a digital systems studio for physical and local businesses that need to modernize their digital infrastructure.

The studio sells packaged digital systems — not commodity web pages. A landing page is only the visible layer. The deeper offer is:

- Premium web presence and mobile experience
- Conversion structure: contact, reservation, and lead capture flows
- Automation: WhatsApp flows, chatbots, form routing
- Applied AI: trained assistants for FAQs, booking guidance, lead qualification
- Operational systems: dashboards, basic CRM, inventory flows, integrations

The four service lines in order of entry:

1. **Digital Presence Audit** — entry offer; diagnoses current digital presence
2. **Presence Pack** — premium landing or corporate web, mobile-first
3. **Presence + AI Pack** — premium web plus intelligent assistant
4. **Digital System Custom** — dashboards, CRM, automations, integrations

Primary conversion path: visitor → audit request → project proposal.

---

## 2. Brand Positioning

Studio32 is **Studio32 · Digital Systems**.

It is not:
- A generic marketing agency
- A cheap landing-page factory
- An AI hype shop
- A founder personal portfolio
- A massive agency with dozens of services

It is:
- A compact, high-quality studio
- Technical + design + business thinking, combined
- A practical implementation partner for real businesses
- Premium enough to justify serious project fees
- Specific enough to avoid sounding like everyone else

Primary target clients:
- Premium restaurants and food businesses
- Dental and medical clinics
- Architecture, interiorism, and reform studios
- Local premium services (any vertical with strong real-world quality but weak digital presence)

Geographic context: national scope, not tied to any city or region. Do not name Valencia or Spain in marketing copy or imagery — Studio32 stands on its own. Prices in EUR. Copy in Spanish unless explicitly requested otherwise.

---

## 3. Tone of Voice

**Write in Spanish** unless the user explicitly requests English.

The correct tone is:
- Sober and premium
- Commercial but not pushy
- Technical but understandable for a business owner
- Direct and specific — no filler
- Human without being casual or overly familiar

Preferred vocabulary:
- "presencia digital", "sistema digital", "captación", "automatización"
- "IA práctica", "asistente inteligente", "flujo de contacto"
- "experiencia móvil", "posicionamiento", "conversión"
- "negocio físico", "negocio local", "auditoría"

Phrases to avoid entirely:
- "revolucionamos", "llevamos al siguiente nivel", "crecimiento exponencial"
- "dominación digital", "arsenal", "destrozar a tu competencia"
- "construye tu imperio", "ventas despiadadas"
- "somos apasionados de…", "nos encanta crear…"
- "marketing 360", "soluciones integrales"
- Empty superlatives without context

Do not invent metrics, awards, case study results, or client names unless clearly marked as placeholder/demo content.

---

## 4. Design Principles

The visual direction is: **editorial, sober, premium, modern**.

Main landing palette: deep near-black `#090908`, warm cream text `#f6f0e5`, gold accent `#c9a86a`. Film grain overlay. Playfair Display (headings) + Inter (body).

Each demo has its own palette that fits its vertical — preserve those identities.

Rules:
- Strong whitespace and vertical rhythm. Never compress spacing to fit more content.
- Typography hierarchy must be clear: label → heading → body → small detail.
- Sections must each have a clear commercial purpose (see Section Hierarchy below).
- No visual clutter. Every element must earn its place.
- Animations: subtle and purposeful. No animations that exist purely for spectacle.
- No cheap gradients, neon colors, hacker aesthetics, or crypto-style visuals.
- No emojis in production UI — use SVG icons or plain text alternatives.

Section hierarchy expected on the main landing:
1. Hero — who Studio32 is, primary CTA
2. Problem — why physical businesses need this
3. Services — the four service lines
4. Verticals/Demos — vertical proof of capability
5. Process — how the work happens
6. Final CTA — audit request

---

## 5. Copywriting Rules

1. Write in Spanish unless told otherwise.
2. Lead with business outcomes, not technical features.
3. Every heading must be specific. Generic headings get replaced.
4. CTAs must be action-oriented and clear: "Solicitar auditoría", "Ver demo", "Reservar cita".
5. No empty subheadings like "Nuestros servicios" or "¿Por qué nosotros?".
6. No fake testimonials, invented client names, or made-up metrics.
7. If content is clearly placeholder/demo, mark it: `[DEMO — cambiar por nombre real]`.
8. Avoid overclaiming: no "garantizamos", "cero imprevistos", "resultados en 30 días".
9. Be specific about the business problem being solved.
10. Keep CTAs consistent with the overall conversion funnel (audit first, then project).

---

## 6. Technical Rules

**Stack:** Vanilla HTML/CSS/JS. No framework. No build tool. No package.json.

**CDN dependencies in use (do not add new ones without justification):**
- Google Fonts
- GSAP 3.12.2 + ScrollTrigger (main landing and Habitat)
- SplitType (main landing)
- Lenis 1.0.29 (all landings)
- Swiper 11 (PrimeBurger, Clinic, Habitat)

**CSS rules:**
- Use CSS custom properties (`--variable-name`) for all colors, fonts, and transitions.
- Do not add inline styles to HTML — keep all styles in the corresponding `.css` file.
- Do not introduce a new CSS class without checking if an equivalent already exists.
- Follow existing naming conventions: BEM-adjacent, descriptive, kebab-case.

**JS rules:**
- Do not introduce new CDN libraries without explicit user approval.
- Keep JS scoped to the page it belongs to — no shared files yet.
- GSAP and ScrollTrigger setup is fragile; test animations after any edit.
- Lenis smooth scroll is initialized in every script.js — do not duplicate or conflict.

**HTML rules:**
- All pages must have: `<meta charset>`, `<meta viewport>`, `<title>`, `<meta description>`.
- Every page should have `<link rel="icon">` (even placeholder).
- Use semantic elements: `<nav>`, `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Heading hierarchy must be correct: one `<h1>` per page, then `<h2>`, `<h3>` in order.
- `aria-label` on icon-only buttons and nav toggles.

**Asset rules:**
- L'Obscur and PrimeBurger have local assets in `/assets/`. Prefer local assets over remote URLs.
- Clinic and Habitat currently use Unsplash remote URLs — flag this, avoid adding more.
- Do not download or store images from Unsplash as local assets without confirming licensing is appropriate.

**Deploy:**
- The project deploys as static files (Netlify/Vercel).
- Root `index.html` IS the main Studio32 landing (since 2026-07 it no longer redirects; `index.redirect.backup.html` keeps the old redirect). `Agencia-Portfolio/` holds the previous landing plus the legal pages (aviso-legal, privacidad) that the root landing links to.
- All relative links must work from a static server root — test with `python -m http.server 8080`.

---

## 7. Folder / Project Structure

```
ejemplos landing/
├── index.html                     ← MAIN Studio32 landing (no longer a redirect)
├── CLAUDE.md                      ← this file
├── AGENTS.md                      ← brand and positioning rules (legacy codex)
├── Agencia-Portfolio/             ← MAIN Studio32 landing (index.html + styles.css + script.js)
├── Landing1-L'Obscur/             ← Premium restaurant demo
│   ├── restaurant_landing.html    ← non-standard entry — note this when linking
│   ├── styles.css / script.js
│   └── assets/                   ← 6 local images
├── Landing2-PrimeBurger/          ← Urban burger demo
│   ├── index.html
│   ├── styles.css / script.js
│   ├── assets/                   ← 6 local images
│   └── .git/                     ← RISK: nested git repo, do not run git ops here
├── Landing3-Clinic/               ← Dental clinic demo
│   ├── index.html
│   └── styles.css / script.js    ← no local assets
├── Landing4-Habitat/              ← Architecture/interiorism demo
│   ├── index.html
│   └── styles.css / script.js    ← no local assets
└── docs/
    ├── project-brief.md
    ├── repo-map.md
    └── implementation-plan.md
```

Each landing is self-contained (HTML + CSS + JS). There are no shared components or partials.

---

## 8. What Not To Do

- **Do not** rewrite the entire visual system without explicit approval.
- **Do not** convert the project to React, Next.js, Astro, or any framework without a clear justification and user sign-off.
- **Do not** install npm packages or add a build system without approval.
- **Do not** add new CDN dependencies beyond what is already in use.
- **Do not** delete demo folders, assets, or existing content without explicit confirmation.
- **Do not** commit to or touch `Landing2-PrimeBurger/.git/` — it is a nested repo.
- **Do not** add emojis to production UI.
- **Do not** invent client data, metrics, testimonials, or case study results.
- **Do not** make the tone personal or founder-centric ("Francisco y Juanma…").
- **Do not** use aggressive marketing language ("revolucionamos", "dominación", "arsenal").
- **Do not** add backend or server functionality — this is a static frontend project.
- **Do not** write a `README.md` unless the user requests it.
- **Do not** add inline styles to HTML — use the CSS file.
- **Do not** break existing relative links between pages.

---

## 9. How to Approach Future Tasks

**Default workflow:**

1. Read the relevant files before writing any code.
2. Identify exactly what needs to change and why.
3. Propose a focused plan if the task is non-trivial — get approval before large edits.
4. Make changes surgically: one concern at a time, minimal diff.
5. Preserve existing design direction unless improvement is clearly needed and justified.
6. After editing, provide a concise summary: files changed, what improved, what to test manually.

**Before any copy edit:**
- Verify the existing copy is not already good — do not change for the sake of changing.
- Check tone against Section 3 (Tone of Voice) and Section 5 (Copywriting Rules).
- Write in Spanish.

**Before any CSS edit:**
- Check if a CSS custom property already covers the value.
- Check if an existing class can be reused or extended.
- Prefer editing existing rules over adding new classes.

**Before any structural edit:**
- Check how the section renders on mobile (900px and 540px).
- Check that heading hierarchy is preserved.
- Check that all internal links still resolve.

**When improving a demo:**
- Preserve the demo's visual identity — each vertical has a distinct look.
- The goal is to make it feel like a realistic, polished commercial landing.
- Add a "Demo · Studio32 · Digital Systems" attribution footer if not present.
- Do not make it feel like Studio32's own page — it should feel like a client page.

---

## 10. Manual Testing Checklist After Changes

Run this after any edit before considering the task done.

### Functional
- [ ] Open the page in a browser (static server or direct file open).
- [ ] Check that all internal navigation links scroll to the correct section.
- [ ] Check that all demo links open the correct demo page.
- [ ] Check that WhatsApp and email links in the CTA are correct and functional.
- [ ] Check that any form inputs are labelled and functional (even if static).

### Visual — Desktop (1440px+)
- [ ] Hero section: title, subtitle, CTA, and system-rail all visible and aligned.
- [ ] No text overflow or truncation in any heading.
- [ ] Service cards: correct layout, no broken grid.
- [ ] Vertical demo cards: images load, content is readable.
- [ ] Footer CTA: background image loads, button is centered.
- [ ] No console errors in browser DevTools.

### Visual — Tablet (900px–1200px)
- [ ] Two-column grids collapse correctly.
- [ ] Vertical cards stack to 2 columns.
- [ ] Custom cursor is hidden.

### Visual — Mobile (≤540px)
- [ ] Hero title is readable and not truncated.
- [ ] System rail stacks to 1 column.
- [ ] All sections have adequate padding.
- [ ] CTA button is full-width and tappable.
- [ ] No horizontal scroll.

### Copy
- [ ] No placeholder text left in (e.g., "Lorem ipsum", "[DEMO]" without intent).
- [ ] No typos in visible headings or CTAs.
- [ ] No aggressive/generic agency language.
- [ ] All Spanish — no accidental English fragments in Spanish copy.

### Known Issues to Watch
- Clinic CSS: `--color-text` vs `--text-color` variable mismatch — monitor after edits.
- L'Obscur: entry is `restaurant_landing.html`, not `index.html` — links must use this path.
- PrimeBurger: nested `.git` — do not run git commands from inside that folder.
- Hero and Habitat share the same Unsplash background image — flag if adding new images.
