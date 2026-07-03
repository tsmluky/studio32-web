# Implementation Plan

## Phase 1: Stabilize Repo And Documentation

Status: started.

Goals:

- Document the real repository structure.
- Record the Studio32 positioning and quality rules.
- Identify how each page runs.
- Preserve current demos without destructive cleanup.
- Decide the deploy model before changing architecture.

Recommended tasks:

- Keep `AGENTS.md`, `docs/project-brief.md`, `docs/repo-map.md` and this plan updated.
- Add or restore a root `.gitignore` after confirming whether the deletion was intentional.
- Decide what to do with the nested `.git` inside `Landing2-PrimeBurger/`.
- Add a simple `README.md` with run/deploy instructions if useful.
- Optionally standardize static entry names by adding a redirect or duplicate entry for `Landing1-L'Obscur/index.html`, without breaking the existing link.

## Phase 2: Elevate The Main Studio32 Landing

Goal: turn `Agencia-Portfolio/` into a sober premium commercial landing for **Studio32 · Digital Systems**.

Direction:

- Replace aggressive agency language with digital systems positioning.
- Make the primary CTA "Solicitar auditoría" or equivalent.
- Make "Ver demos" the secondary CTA.
- Present the four service lines clearly.
- Add a problem/solution narrative for physical/local businesses.
- Keep animations subtle and remove anything that makes the brand feel juvenile, hostile or hype-driven.

Suggested structure:

1. Hero: Studio32 · Digital Systems.
2. Problem: strong businesses with weak digital infrastructure.
3. Solution: premium presence, automation, applied AI and vertical systems.
4. Services: Audit, Presence Pack, Presence + AI, Digital System Custom.
5. Verticals/demos.
6. Process.
7. Why Studio32.
8. Final audit CTA.

## Phase 3: Connect Vertical Demos From The Main Landing

Goal: make demos feel like intentional Studio32 proof, not disconnected experiments.

Tasks:

- Rename labels around industries rather than fictional client names only.
- Keep demo links stable.
- Add short vertical descriptions:
  - Restaurants: reservations, presentation and customer contact.
  - Food brands: mobile conversion, menu clarity and visual impact.
  - Dental clinics: trust, treatment clarity and first-consultation capture.
  - Architecture/interiorism: portfolio, authority and inquiry flow.
- Consider adding a small "Demo by Studio32" footer/back-link in each demo.
- Ensure links work both via direct file open and static server.

## Phase 4: Homogenize Demo Quality

Goal: preserve each vertical's personality while raising consistency and commercial credibility.

Tasks:

- Review mobile layouts for each demo.
- Replace emoji UI in Clinic with premium icon or text treatments.
- Clean risky claims in Clinic and Habitat.
- Fix obvious copy issues such as "ultraginas".
- Localize currency/language inconsistencies in L'Obscur.
- Reduce inline styles in Habitat where they make maintenance harder.
- Normalize CTA quality across demos: reservation, WhatsApp, form, map, consultation.
- Check image weight and replace remote images with curated local assets where needed.

## Phase 5: Prepare Static Deploy

Goal: make the project easy to publish on Netlify or Vercel without a framework migration.

Recommended path:

- Keep as static HTML/CSS/JS initially.
- Use root as the publish directory.
- Decide whether `/` should redirect to `Agencia-Portfolio/` or host the main landing directly.
- Add redirect rules only if required by platform.
- Add basic metadata, favicons and social preview images.
- Verify all relative links after deploy.

Potential future path:

- If maintenance becomes painful, consider a small static-site architecture later.
- Do not migrate to React/Next/Astro until there is clear benefit: shared layouts, content reuse, SEO templates, or multi-page routing.

## Phase 6: Prepare The Commercial System

Goal: convert Studio32 from a portfolio into a real acquisition surface.

Tasks:

- Define the Digital Presence Audit CTA flow.
- Choose first contact mechanism: WhatsApp, email form, Calendly/TidyCal or simple static form provider.
- Add audit intake questions:
  - Business name.
  - Industry.
  - Current website/Instagram/Google profile.
  - Main problem.
  - Desired timeline.
- Add a lightweight lead routing plan.
- Define maintenance packages in private/internal docs before deciding whether to expose pricing.
- Prepare case-study framing for each demo: problem, system, expected business outcome.

## Next Recommended Step

Start Phase 2 with a focused main-landing pass:

- Rewrite the hero, service architecture and vertical section copy.
- Keep the existing static structure and most layout mechanics.
- Reduce the most aggressive visual/copy cues.
- Run a browser pass on desktop and mobile after changes.
