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

## Current Product Priority · July 2026

The current number-one product focus is **Studio32 Agent Platform**: a
multi-tenant reception system for WhatsApp with conversations, appointments,
human takeover and editable business knowledge.

- First vertical: dental clinics.
- MVP channel: Twilio Sandbox; real numbers later.
- Client surface: an independent responsive web panel.
- Data foundation: Supabase/PostgreSQL, Auth, RLS and Realtime.
- Completion criterion: WhatsApp → agent → appointment → panel → human takeover
  → updated knowledge used in the next conversation.

This priority does not remove the four service lines. Studio32 remains the
Digital Systems umbrella; Agent Platform is the flagship operational product.

Canonical strategic reference:
`../../00-direccion-y-operaciones/estrategia/NORTE-AGENT-PLATFORM-2026-07.md`.

## Repo Structure

This repository is `studio32-web`. Its public surface remains static:

- `site/index.html`: current Studio32 landing and Netlify publish entry.
- `site/Agencia-Portfolio/`: previous landing plus incomplete legal pages.
- `site/Landing1-L'Obscur/`: premium restaurant demo.
- `site/Landing2-PrimeBurger/`: urban burger/food brand demo; nested `.git` risk.
- `site/Landing3-Clinic/`: dental clinic demo.
- `site/Landing4-Habitat/`: architecture/interiorism/reforms demo.
- `site/Demos-Clientes/la-taberna-de-ruzafa/`: conceptual restaurant demo, not
  a real client case.
- `studio32-agent/`: complete reference/development copy of the agent inside the
  web repo. It is excluded from the Netlify publish surface.

Separate product surfaces:

- Canonical backend repo: `github.com/tsmluky/studio32-agent`; local clone
  `C:\Users\lukys\Desktop\Studio32\10-producto\studio32-agent`.
- Independent panel repo: `C:\Users\lukys\Desktop\Studio32\10-producto\studio32-panel`,
  currently deployed on a temporary Netlify URL and intended for
  `panel.studio32.es`.
- Shared data layer: Supabase project for Agent Platform; migrations live in
  the canonical backend repo.

The static web must not be converted wholesale to a framework. The panel uses
its own stack and build pipeline without changing `site/`.

## How To Run

Serve the public `site/` directory:

```bash
python -m http.server 8080 --directory site
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
- Treat La Taberna as a conceptual demo, never as a verified client or market proof.
- Keep web, agent backend and panel as independently deployable surfaces.
- Do not treat `Studio32/studio32-agent-deploy/` as canonical.
- Reconcile changes into the standalone agent repo deliberately; do not copy
  directories blindly between clones.
- Keep changes small, reviewable and scoped.
- Do not convert the entire repo to a framework without explicit approval.
- Do not install dependencies unless there is a clear maintenance or deploy reason.
- Before major UI redesigns, update the plan and explain the intended direction.
- Product work now prioritizes the Agent Platform foundation and dental MVP.
- Do not redesign the full Studio32 landing until the Agent Platform has a
  validated E2E flow and the user approves the commercial repositioning.
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

- The root worktree can be clean while ignored or nested repositories remain
  dirty. Inspect each Git boundary separately.
- `site/Landing2-PrimeBurger/` contains its own nested `.git` directory; handle carefully.
- `studio32-agent-deploy/` is an ignored nested clone with pre-existing changes.
- The standalone backend repo currently differs from the complete reference
  copy and must be reconciled before new backend deployment work.
- Several pages rely on external Unsplash/CDN assets, so offline rendering is incomplete.
- Documentation predating 11/07/2026 may still describe the restaurant-first
  roadmap or a client experience without a panel. The canonical north document
  supersedes those decisions when they conflict.
