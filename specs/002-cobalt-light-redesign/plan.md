# Implementation Plan: Cobalt Light Storefront & Admin Redesign

**Branch**: `002-cobalt-light-redesign` | **Date**: 2026-06-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-cobalt-light-redesign/spec.md`

## Summary

Re-skin the entire softodeviq storefront + admin from the dark "Voltage" theme to the light, Stripe-inspired "Cobalt" system from the `design_handoff_softodev_redesign/` bundle. Presentation/UX only — no routes, API, data models, enums, services, or stores change. The bundle ships two production-ready drop-ins: a `globals.css` Cobalt theme that reuses the **same token names** (so existing utility classes re-skin automatically) and a typed custom `Icon.tsx` set (replaces lucide-react). The redesign also adds presentation-layer interactions: monthly/yearly plan toggle, 4-step checkout, product tabs/accordion, and activation-code reveal — all over existing data/stores.

Technical approach: replace `globals.css` (the foundation — flips the whole app to light), swap fonts in `layout.tsx` (Hanken Grotesk + IBM Plex Sans Arabic + Cairo + JetBrains Mono), add `Icon.tsx` and migrate the 38 lucide-react files via a name-mapping table, then restyle screens in waves anchored on shared components. The biggest risk is **dark→light inversion**: any hardcoded dark hex left from Voltage will look wrong on the light canvas and must be hunted down.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.2, Next.js 16.2 (App Router)

**Primary Dependencies**: Tailwind CSS v4 (`@theme` tokens), `recharts` (admin charts), `zustand`, `react-hook-form` + `zod`, `next/font`. Custom `Icon.tsx` replaces `lucide-react` in redesigned screens (lucide may stay installed, unused).

**Storage**: PostgreSQL via Prisma — **untouched** (no schema/data changes)

**Testing**: `tsc --noEmit` type gate; manual visual verification per screen in both LTR + RTL (light); `next build` as end-to-end smoke

**Target Platform**: Web (responsive desktop + mobile), modern browsers, **light theme**

**Project Type**: Single Next.js App Router app under `src/` (ground truth)

**Performance Goals**: No CWV regression; zero CLS from fonts (next/font); decorative motion respects `prefers-reduced-motion`

**Constraints**: AA contrast on light theme; visible keyboard focus; ≥44px touch targets; prices LTR + tabular; brand strings config-driven; status enum codes UPPERCASE/unchanged; reference prototypes never shipped

**Scale/Scope**: ~18 screen groups (≈30+ screens) storefront + admin, each LTR + RTL; **38 files** migrate off lucide-react; 1 token foundation file + 1 font wiring file + 1 icon component; 4 new interaction patterns

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Presentation-layer-only feature. Evaluated against all six principles:

| Principle | Impact | Compliance |
|-----------|--------|------------|
| I. Type Safety & Shared Contracts | `Icon.tsx` is typed (`IconName` union); restyled components keep typed props; no `any` introduced; shared types/enums untouched. | ✅ PASS |
| II. Layered Architecture | UI/components only. Pages fetch, components render; no Prisma in components; HTTP still via existing API client; services/stores reused, not changed. New interactions use local UI state only. | ✅ PASS |
| III. Validated & Consistent API Contract | No endpoints touched. Envelope, Zod schemas, route ordering unchanged. | ✅ PASS (N/A) |
| IV. Security & Authorization First | No auth logic touched; admin guards remain server-side; no secrets touched/logged; `.env*` stays ignored. | ✅ PASS |
| V. Data Integrity & Money Precision | `formatPrice()` reused (wraps `Number()`); plan toggle + checkout summary display existing prices, no new money math beyond display recompute; enum codes stay UPPERCASE (Arabic labels display-only); status transitions/soft-delete/atomic stock untouched. | ✅ PASS |
| VI. Configuration-Driven Customization & Localization | Brand strings stay in config; `formatPrice`/`formatDate` read config; Iraq governorate/city address system preserved (restyled); SoftoDev WhatsApp number unchanged; Arabic/RTL/IQD first-class. | ✅ PASS |

**Quality gates**: `tsc --noEmit` must pass before each task is complete; branch is `002-...` (spec-kit feature branch); no `.env*` committed; reference HTML/`support.js` never imported into the app.

**Result**: All gates pass. No violations → Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/002-cobalt-light-redesign/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (Cobalt token model + icon map)
├── quickstart.md        # Phase 1 output (apply + verify)
├── contracts/
│   └── design-system.md # Phase 1 output (token + component + icon contract)
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css                 # ← REPLACE with Cobalt globals.css (foundation; flips app to light)
│   ├── layout.tsx                  # ← swap fonts: Hanken Grotesk + IBM Plex Sans Arabic + Cairo + JetBrains Mono
│   ├── (auth)/{login,register}/    # Auth split-panel
│   ├── (shop)/{products,category,search}/
│   ├── cart/  checkout/{,payment,success}/   # → 4-step flow + live summary
│   ├── account/{,orders,orders/[id],addresses,wishlist}/   # order detail = activation-code reveal + timeline
│   ├── {about,contact,faq,how-it-works,glossary,payment-methods,privacy,terms}/
│   ├── not-found.tsx               # 404
│   └── admin/{login,dashboard,...}/
├── components/
│   ├── ui/      { Icon.tsx (NEW), Button, EmptyState, Skeleton, Toast }   # Icon replaces lucide
│   ├── layout/  { Header, Footer, MobileMenu, StoreChrome }
│   ├── product/ { ProductCard, ProductGrid, ProductFilters }   # + plan toggle on detail
│   ├── cart/    { CartDrawer, CartItem }
│   ├── checkout/{ CheckoutSteps, AddressForm }
│   ├── home/    { HeroSlider }
│   ├── orders/  { StatusBadge }
│   └── admin/   { layout/*, dashboard/* (recharts → Cobalt), orders/*, products/* }
├── config/   { store.config.ts, admin.config.ts }   # referenced, not edited for content
└── lib/      { utils.ts (formatPrice/formatDate/cn) }   # reused as-is
```

**Structure Decision**: Single Next.js App Router app under `src/`. The redesign centers on three foundation changes — `globals.css` (Cobalt drop-in), `layout.tsx` (fonts), and `components/ui/Icon.tsx` (new) — then propagates through existing shared components. New interactions add local-state logic to existing product/checkout/order-detail components. No new top-level directories, no new dependencies.

## Complexity Tracking

> No constitution violations. Table intentionally empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
