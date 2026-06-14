# Implementation Plan: Voltage Storefront & Admin Redesign

**Branch**: `001-voltage-storefront-redesign` | **Date**: 2026-06-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-voltage-storefront-redesign/spec.md`

## Summary

Apply the "Voltage" deep-tech design system (from the Claude Design handoff bundle) across every storefront and admin screen of the softodeviq digital-subscriptions store. The work is **presentation-layer only**: swap the existing "Graphite" Tailwind v4 `@theme` tokens for the Voltage token set, restyle shared primitives (product card, status pill, buttons, inputs, cards, tables, drawers/modals, toasts, empty/skeleton states), then migrate each screen group to the new system while preserving Arabic-first RTL + English LTR parity. No routes, API endpoints, data models, or enum values change.

Technical approach: token swap in `src/app/globals.css` (`@theme`) is the single foundation; everything else consumes those tokens. Restyle in waves anchored on shared components so visual consistency propagates automatically (one `ProductCard`, one `StatusBadge`, one button treatment reused everywhere). Fonts already load via `next/font` (Cairo/Inter) — add Space Grotesk as the display face. RTL already works via existing `dir` handling; the redesign restyles within it using logical CSS properties.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.2, Next.js 16.2 (App Router)

**Primary Dependencies**: Tailwind CSS v4 (`@tailwindcss/postcss`, `@theme` tokens), `lucide-react` (icons), `recharts` (admin charts), `zustand` (state), `react-hook-form` + `zod` (forms), `next/font` (Cairo, Inter, + Space Grotesk to add)

**Storage**: PostgreSQL via Prisma — **untouched by this feature** (no schema/data changes)

**Testing**: `tsc --noEmit` type gate (constitution quality gate); manual visual verification per screen in both LTR and RTL; `next lint`

**Target Platform**: Web (responsive: desktop + mobile breakpoints), modern browsers, dark theme

**Project Type**: Single Next.js web application (App Router) under `src/` — not a monorepo (this differs from the legacy `CLAUDE.md` description; live `src/` layout is ground truth)

**Performance Goals**: No regression to current Core Web Vitals; zero CLS from fonts (already handled by `next/font`); decorative motion respects `prefers-reduced-motion`

**Constraints**: AA contrast on dark theme; visible keyboard focus; ≥44px mobile touch targets; prices stay `dir=ltr`; brand strings stay config-driven; status enum codes stay UPPERCASE/unchanged

**Scale/Scope**: ~16 screen groups (≈30+ individual screens) across storefront + admin, each in LTR + RTL; ~30 existing components restyled; 1 token foundation file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This feature is presentation-layer only. Evaluated against all six principles:

| Principle | Impact | Compliance |
|-----------|--------|------------|
| I. Type Safety & Shared Contracts | Restyled components keep their typed props; any new shared UI helper is typed; no `any` introduced. Shared types (`@/types`, enums) untouched. | ✅ PASS |
| II. Layered Architecture | UI/components only. Pages still fetch, components still render; no Prisma in components; HTTP still via `src/lib/api.ts`. No service/handler logic changes. | ✅ PASS |
| III. Validated & Consistent API Contract | No endpoints touched. Response envelope, Zod schemas, route ordering all unchanged. | ✅ PASS (N/A — no API change) |
| IV. Security & Authorization First | No auth logic touched. Admin guards remain server-side. No secrets touched; `.env*` stays ignored. No tokens/secrets logged by new UI. | ✅ PASS |
| V. Data Integrity & Money Precision | `formatPrice()` reused as-is (wraps `Number()`); no money math added in UI. Enum values stay UPPERCASE — Arabic labels are display-only mappings, codes unchanged. Status transition map, soft-delete, atomic stock all untouched. | ✅ PASS |
| VI. Configuration-Driven Customization & Localization | Brand strings stay in `store.config.ts`/`admin.config.ts` — redesign references config, never hardcodes. `formatPrice`/`formatDate` read config. Iraq governorate/city address system preserved (restyled, not replaced). SoftoDev WhatsApp number unchanged. Arabic/RTL/IQD treated first-class. | ✅ PASS |

**Quality gates** (Development Workflow): `tsc --noEmit` must pass before each task is complete; branch prefix is `001-...` (spec-kit feature branch, acceptable); no `.env*` committed.

**Result**: All gates pass. No violations → Complexity Tracking table is empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-voltage-storefront-redesign/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (design-token model)
├── quickstart.md        # Phase 1 output (how to apply/verify the system)
├── contracts/
│   └── design-system.md # Phase 1 output (token + component contract)
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css                 # ← Voltage @theme token swap (the foundation)
│   ├── layout.tsx                  # ← add Space Grotesk display font (next/font)
│   ├── (auth)/{login,register}/    # auth screens
│   ├── (shop)/{products,category,search}/
│   ├── cart/  checkout/{,payment,success}/
│   ├── account/{,orders,addresses,wishlist}/
│   ├── {about,contact,faq,how-it-works,glossary,payment-methods,privacy,terms}/
│   └── admin/{login,dashboard,...}/
├── components/
│   ├── ui/       { Button, EmptyState, Skeleton, Toast }        # NEW shared primitives (storefront + admin)
│   ├── layout/   { Header, Footer, MobileMenu, StoreChrome }
│   ├── product/  { ProductCard, ProductGrid, ProductFilters }   # ProductCard = key shared primitive
│   ├── cart/     { CartDrawer, CartItem }
│   ├── checkout/ { AddressForm, CheckoutSteps }
│   ├── home/     { HeroSlider }
│   ├── orders/   { StatusBadge }                                # storefront status pill
│   └── admin/
│       ├── layout/    { Sidebar, Topbar, LangInitializer }
│       ├── dashboard/ { StatsCard, RevenueChart, OrderStatusChart, SalesByCategoryChart, RecentOrders, TopProducts, LowStockAlert }
│       ├── orders/    { StatusBadge, OrderTimeline, StatusChangeModal }
│       └── products/  { ProductForm, ImageUpload }
├── config/   { store.config.ts, admin.config.ts }              # brand strings — referenced, never edited for content
└── lib/      { utils.ts (formatPrice/formatDate/cn) }          # reused as-is
```

**Structure Decision**: Single Next.js App Router project under `src/`. The redesign centers on one foundation file (`src/app/globals.css` `@theme`) plus `src/app/layout.tsx` for the display font, then propagates through the existing shared components. No new top-level directories. New shared UI primitives (Button, EmptyState, Skeleton, Toast) land under `src/components/ui/` to be reused across storefront and admin.

## Complexity Tracking

> No constitution violations. Table intentionally empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
