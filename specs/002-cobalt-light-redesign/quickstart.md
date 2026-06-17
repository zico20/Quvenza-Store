# Quickstart: Applying & Verifying the Cobalt Light Redesign

## Prerequisites

- Branch `002-cobalt-light-redesign`
- `npm install` done; PostgreSQL running (or Docker `postgres` up); `.env`/`.env.local` present (git-ignored)
- Dev: `npm run dev` → http://localhost:3000 (admin under `/admin`)
- Reference: `design_handoff_softodev_redesign/` — `globals.css` + `Icon.tsx` are drop-ins; `references/*.dc.html` are visual reference only (never import).

## The foundation (do first)

1. **Tokens** — replace `src/app/globals.css` with `design_handoff_softodev_redesign/globals.css` (flips the app to light). 
2. **Fonts** — in `src/app/layout.tsx`, load Hanken Grotesk (`--font-hanken`), IBM Plex Sans Arabic (`--font-plex-ar`); keep Cairo + JetBrains Mono; remove Space Grotesk + Inter; apply vars on `<html>`/`<body>`.
3. **Icon** — copy `Icon.tsx` to `src/components/ui/Icon.tsx`.

## Migration order (waves) — each is a task

1. Foundation: globals.css, fonts, Icon.tsx.
2. Icon migration: replace lucide-react across the 38 files using the map in `data-model.md`; extend `Icon.tsx` for unmatched glyphs; `Loader2` → CSS spinner.
3. Shared primitives: ProductCard, storefront + admin StatusBadge, ui/{Button,EmptyState,Skeleton,Toast}; **hunt residual dark hex** (Decision 4).
4. Global chrome: Header (cobalt "S" lockup), Footer (dark surface), MobileMenu.
5. Home + product: home (hero, value-props, categories, bestsellers, how-it-works, **plan section toggle**, reviews, CTA), product detail (**plan selector**, tabs + FAQ accordion, related), listing/category/search.
6. Commerce: cart + **4-step checkout** (Cart→Info→Payment→Confirmation) with live summary; confirmation.
7. Auth + account: login/register split-panel; account overview/orders/**order-detail (activation-code reveal + timeline)**/wishlist/addresses/profile.
8. Content + 404: about/contact/faq/how-it-works/glossary/payment-methods/privacy/terms; not-found.
9. Admin: sidebar/topbar, dashboard + charts (Cobalt), products (+per-plan pricing form), orders (+status timeline), customers, categories, notifications, settings.
10. States & responsive polish: empty/skeleton everywhere; mobile (collapsing sidebars→chip bars, side-nav→top bar, sticky CTAs); reduced-motion; a11y.
11. Cleanup: grep stray dark hex + lowercase enums; confirm zero lucide imports in redesigned screens.

## Verify each task (the gate)

```bash
npm run type-check    # tsc --noEmit — MUST pass before a task is done
```

Then **manual bilingual light check** of the affected screen:
- Load in English (LTR) and Arabic (RTL) via the header language toggle.
- Confirm: light Cobalt look, layout mirrors, chevrons flip, prices LTR/tabular, no dark leftovers, no broken/clipped layout, icons all from the custom set.

## Acceptance smoke (whole feature)

Walk both directions: home (toggle plan) → product (plan selector + tabs/FAQ) → add to cart → 4-step checkout → confirmation; account → order detail (reveal/copy activation code); `/admin` dashboard + a table + an order detail. All on Cobalt light, `tsc --noEmit` clean, `next build` succeeds.

## Guardrails (do not violate)

- No changes under `src/app/api/`, `src/services/`, `src/store/`, `prisma/`, or to enum values/routes.
- Brand strings only from `src/config/*`; prices only via `formatPrice()`; Iraq address system preserved.
- `.env*` never committed; reference prototypes/`support.js` never imported. Status codes stay UPPERCASE.
