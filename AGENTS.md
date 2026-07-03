# Studio32 Codex Notes

## Positioning

Studio32 is **Studio32 · Digital Systems**: a digital systems studio for physical/local businesses that need premium online presence, practical automation and applied AI.

Do not frame Studio32 as a generic marketing agency or a cheap website provider. The website is the entry point; the broader offer is digital presence, lead capture, reservation/contact flows, simple automations, intelligent assistants and operational systems for real businesses.

## Brand Tone

- Sober, premium, serious, modern and technically credible.
- Commercial without aggressive hype.
- Human and clear without becoming informal or amateur.
- Explain technology in business terms: presence, capture, reservations, customer experience, operational efficiency.

Avoid:

- "Marketing 360", "revolucionamos", "crecimiento exponencial", "llevar al siguiente nivel" and similar empty agency copy.
- AI as spectacle, neon/hacker visuals, crypto aesthetics, excessive gradients or noisy animations.
- Over-personal founder copy when the section should explain the studio, method and business value.

## Offer Architecture

Use these four service lines as the commercial spine:

- **Digital Presence Audit**: audit of web, mobile, clarity, CTAs, local SEO, Google Business Profile, contact/reservation experience, visual image and automation/AI opportunities.
- **Presence Pack**: premium landing/corporate web for local businesses, mobile-first, WhatsApp/contact, map, services/products, gallery, form/reservation and basic local SEO.
- **Presence + AI Pack**: premium web plus assistant for FAQs, lead capture, booking/request support and basic business-data training.
- **Digital System Custom**: dashboards, basic CRM, internal automations, inventory, advanced reservations, internal panels and integrations with Sheets, Make, Zapier, n8n or similar.

## Repo Structure

This repo is currently a static multi-landing collection:

- Root `index.html`: redirects to the main agency landing.
- `Agencia-Portfolio/`: current Studio32 landing.
- `Landing1-L'Obscur/`: premium restaurant demo. Entry: `restaurant_landing.html`.
- `Landing2-PrimeBurger/`: urban burger/food brand demo. Entry: `index.html`.
- `Landing3-Clinic/`: dental clinic demo. Entry: `index.html`.
- `Landing4-Habitat/`: architecture/interiorism/reforms demo. Entry: `index.html`.

There is no detected `package.json`, Vite, Next, Astro or build pipeline yet. Treat the project as static HTML/CSS/JS until that changes.

## How To Run

Open files directly in a browser, or serve the repo root with a static server:

```bash
python -m http.server 8080
```

Then visit:

- `http://localhost:8080/`
- `http://localhost:8080/Agencia-Portfolio/`
- `http://localhost:8080/Landing1-L'Obscur/restaurant_landing.html`
- `http://localhost:8080/Landing2-PrimeBurger/`
- `http://localhost:8080/Landing3-Clinic/`
- `http://localhost:8080/Landing4-Habitat/`

External runtime dependencies are loaded from CDNs: Google Fonts, Lenis, GSAP, ScrollTrigger, SplitType and Swiper.

## Working Rules

- Preserve existing folders, assets and demos unless the user explicitly approves removal.
- Keep changes small, reviewable and scoped.
- Do not convert the entire repo to a framework without explicit approval.
- Do not install dependencies unless there is a clear maintenance or deploy reason.
- Before major UI redesigns, update the plan and explain the intended direction.
- Prefer improving the main Studio32 landing first, then connect and normalize the demos.
- Keep demos useful as vertical proof, not just visual experiments.

## Quality Criteria

Review changes against:

- Clear Studio32 positioning as Digital Systems.
- Premium but restrained visual hierarchy.
- Mobile responsiveness and readable text.
- Functional CTAs for audit, contact, reservation/demo viewing.
- Static deploy compatibility on Netlify/Vercel.
- Reasonable performance: image weight, CDN dependency count and animation cost.
- No broken internal links.
- Accessible basics: semantic headings, labels/aria where needed, visible focus states and no cursor-only interactions.

## Known Risks

- The worktree is currently dirty and includes prior changes/deletions not created by Codex.
- `Landing2-PrimeBurger/` contains its own nested `.git` directory; handle carefully.
- Several pages rely on external Unsplash/CDN assets, so offline rendering is incomplete.
- The current main landing copy is too aggressive for the target Studio32 brand and should be rewritten before commercial use.
