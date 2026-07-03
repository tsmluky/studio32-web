# Repo Map

Date reviewed: 2026-05-07

Workspace root: `C:\Users\lukx\Desktop\ejemplos landing`

## High-Level Structure

```text
.
├── index.html
├── Agencia-Portfolio/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── Landing1-L'Obscur/
│   ├── restaurant_landing.html
│   ├── styles.css
│   ├── script.js
│   └── assets/
├── Landing2-PrimeBurger/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── assets/
│   └── .git/
├── Landing3-Clinic/
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── Landing4-Habitat/
    ├── index.html
    ├── styles.css
    └── script.js
```

## Stack Detected

No app framework or package manager was detected.

- No `package.json`.
- No Vite, Next, Astro or bundler config.
- No npm/yarn/pnpm scripts.
- No automated build, lint or test commands.

The project is currently a static HTML/CSS/JavaScript collection using CDN dependencies.

External dependencies detected:

- Google Fonts.
- Lenis smooth scroll.
- GSAP and ScrollTrigger in the main landing and Habitat demo.
- SplitType in the main landing.
- Swiper in PrimeBurger, Clinic and Habitat.
- Unsplash-hosted remote images in several pages.

## Root

### `index.html`

Purpose: tiny redirect page to `./Agencia-Portfolio/index.html`.

Current behavior:

- Uses `meta refresh` with immediate redirect.
- Shows fallback text "Cargando el portfolio...".

Observations:

- Good enough as a static entry point for now.
- Later, root could become the main Studio32 landing directly, or remain as a redirect depending on deploy strategy.

## `Agencia-Portfolio/`

Role: current main Studio32/agency landing.

Entry:

- `Agencia-Portfolio/index.html`

Assets:

- No local image assets detected.
- Portfolio hover backgrounds use Unsplash URLs.

Dependencies:

- Google Fonts: Inter, Oswald.
- GSAP 3.12.2.
- ScrollTrigger.
- SplitType.
- Lenis 1.0.29.

Main sections:

- Preloader.
- Custom cursor.
- Hero.
- Philosophy/problem section.
- Capabilities/services.
- Portfolio links to four demos.
- Footer/contact CTA.

Current quality:

- Visually bold and animated.
- Has useful portfolio routing to all demos.
- Copy is too aggressive for the new Studio32 positioning: "dominación digital", "arsenal", "ventas despiadados", "construye tu imperio", "destrozar a tu competencia".
- It positions the company closer to a high-pressure marketing agency than a sober digital systems studio.
- Strong candidate to become the main landing, but it needs strategic copy and visual restraint before being client-ready.

## `Landing1-L'Obscur/`

Role: premium restaurant demo.

Entry:

- `Landing1-L'Obscur/restaurant_landing.html`

Important assets:

- `assets/hero-luxury.png`
- `assets/hero.png`
- `assets/menu-wagyu.png`
- `assets/menu-cocktail.png`
- `assets/dish1.png`
- `assets/dish2.png`

Dependencies:

- Google Fonts: Lato, Playfair Display.
- Lenis.

Features:

- Preloader.
- Custom cursor.
- Bilingual ES/EN content via in-page translation object.
- Reservation form UI.
- Mobile nav/hamburger elements.
- Local premium food imagery.

Current quality:

- One of the more mature demos visually.
- Good fit for the premium restaurant vertical.
- Entry file is not `index.html`, which can confuse static routing and portfolio links unless documented.
- Some prices use `$` and some copy is intentionally fictional/high-luxury; should be localized and reframed if used commercially.

## `Landing2-PrimeBurger/`

Role: urban burger/food brand demo.

Entry:

- `Landing2-PrimeBurger/index.html`

Important assets:

- `assets/hero-burger.png`
- `assets/bunker-interior.png`
- `assets/menu-prototype.png`
- `assets/menu-heavy-metal.png`
- `assets/menu-reactor.png`
- `assets/texture-closeup.png`

Dependencies:

- Google Fonts: Anton, Space Mono.
- Lenis.
- Swiper 11.

Features:

- Strong visual system.
- Mobile menu overlay.
- Language toggle ES/EN.
- Reviews carousel.
- Location/map CTA.
- Local food imagery.

Current quality:

- Visually distinctive and mature.
- Useful as an expressive food-brand demo, but the tone is intentionally intense and should stay inside the demo, not bleed into Studio32 brand copy.
- Contains a nested `.git` directory. This is a repository hygiene risk.
- The root Git status shows deleted old files and newly added moved assets in this folder, so there are existing uncommitted changes that must be handled carefully.

## `Landing3-Clinic/`

Role: dental clinic demo.

Entry:

- `Landing3-Clinic/index.html`

Assets:

- No local assets detected.
- Uses Unsplash-hosted images inline.

Dependencies:

- Google Fonts: Outfit, Playfair Display.
- Lenis.
- Swiper 11.

Features:

- Top bar with contact/location.
- Treatment cards.
- Trust/rating UI.
- Cases carousel.
- WhatsApp CTA and appointment form.
- Mobile nav toggle.

Current quality:

- Commercially direct and relevant to one of the priority verticals.
- Good CTA structure for a clinic.
- More conventional visually than L'Obscur and PrimeBurger.
- Uses emoji icons in visible UI; these should be replaced with a more premium icon treatment later.
- CSS defines `--color-text` but `body` references `var(--text-color)`, which is not defined. Browsers will fall back, but this is a real cleanup item.
- Copy contains a typo: "carillas de porcelana ultraginas" should likely be "ultrafinas".
- Medical claims and "primera cita gratuita" should be reviewed before real-client adaptation.

## `Landing4-Habitat/`

Role: architecture/interiorism/reforms demo.

Entry:

- `Landing4-Habitat/index.html`

Assets:

- No local assets detected.
- Uses Unsplash-hosted imagery inline.

Dependencies:

- Google Fonts: Inter, Playfair Display.
- Swiper 10 CSS/JS.
- Lenis.
- GSAP 3.12.2.
- ScrollTrigger.

Features:

- Editorial hero.
- Pillars/services.
- Before/after image sliders.
- Method/timeline.
- Lead-generation form.

Current quality:

- Strongest match for the sober premium editorial direction.
- Good reference for the future Studio32 visual restraint.
- Uses many inline styles in HTML, especially in the CTA/form section.
- The copy is strong but sometimes too absolute/risky: "cero imprevistos", "fecha exacta", "90% de las reformas acaban en juicio".
- Should be repositioned from reforms-only toward architecture/interiorism if that vertical remains the target.

## Git/Repo Hygiene

Current root status is dirty before documentation work:

- `.gitignore` is deleted.
- Several old PrimeBurger files are marked deleted.
- `Landing2-PrimeBurger/script.js` and `styles.css` are modified.
- Several folders/files are untracked.
- `Landing2-PrimeBurger/` contains its own nested `.git`.

Do not revert these changes without explicit user approval.

## How To Run

Because the project is static, it can be opened directly in a browser. A local static server is safer for consistent relative routing:

```bash
python -m http.server 8080
```

Routes:

- `/` redirects to `/Agencia-Portfolio/index.html`.
- `/Agencia-Portfolio/`
- `/Landing1-L'Obscur/restaurant_landing.html`
- `/Landing2-PrimeBurger/`
- `/Landing3-Clinic/`
- `/Landing4-Habitat/`

## Immediate Observations

- The main landing has the right structural role but wrong brand tone for Studio32 · Digital Systems.
- The four demos are useful and should be preserved as vertical proof.
- The codebase is simple enough to stabilize without a framework migration.
- The largest technical risks are repo hygiene, external dependency reliance, image performance and inconsistent routing/entry filenames.
- The best next move is to refine the main Studio32 landing strategy and copy before large visual implementation.
