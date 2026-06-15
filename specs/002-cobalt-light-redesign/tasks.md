---

description: "Task list for Cobalt Light Storefront & Admin Redesign"
---

# Tasks: Cobalt Light Storefront & Admin Redesign

**Input**: Design documents from `specs/002-cobalt-light-redesign/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/design-system.md, quickstart.md

**Tests**: Not requested. Verification per task = `npm run type-check` (`tsc --noEmit`) clean + manual bilingual (LTR + RTL) visual review on the **light** theme. `next build` is the end-to-end smoke. No automated test tasks.

**Organization**: Grouped by user story. US2 (bilingual/RTL) is an acceptance condition on every task plus explicit global tasks. The lucide→Icon migration and the dark→light hunt are foundational/cross-cutting and called out explicitly.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: parallelizable (different files, no incomplete-task dependency)
- **[Story]**: US1 conversion, US2 bilingual/RTL, US3 system+admin, US4 mobile
- Per-task gate: `npm run type-check` clean + visual check LTR & RTL on light.

## Path Conventions

Single Next.js App Router project under `src/`. No `tests/` dir (no test tasks).

---

## Phase 1: Setup

- [X] T001 Confirm branch `002-cobalt-light-redesign` checked out + clean tree; review `contracts/design-system.md` and `data-model.md` (token + icon map) as source of truth.
- [X] T002 [P] Capture baseline `npm run type-check` result so regressions are detectable.

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No screen migration until T003–T009 complete.

- [X] T003 Replace `src/app/globals.css` with the Cobalt theme from `design_handoff_softodev_redesign/globals.css` (flips the app to light; keeps canonical token names; redefines `.btn-accent`/`.btn-primary`/`.input`/`.tag-*`/`.card`, adds `.skeleton`, `.num`/`.ltr-nums`, `.rtl-flip`, focus ring, reduced-motion guard).
- [X] T004 Swap fonts in `src/app/layout.tsx` via `next/font/google`: add Hanken Grotesk (`--font-hanken`) + IBM Plex Sans Arabic (`--font-plex-ar`); keep Cairo (`--font-cairo`) + JetBrains Mono (`--font-mono`); remove Space Grotesk + Inter; apply the variables on `<html>`/`<body>`; fix the body inline bg/color to light tokens.
- [X] T005 Add the custom icon component `src/components/ui/Icon.tsx` from the bundle (typed `IconName`, ~40 glyphs).
- [X] T006 Migrate lucide-react → `<Icon>` across the 38 files using the map in `data-model.md`; extend `Icon.tsx` with same-style glyphs for unmatched icons (Download/Upload/Save/RefreshCw/RotateCcw/ToggleLeft-Right/DollarSign/FileText/Settings2/AlertTriangle/Bell/Calendar/TrendingUp/CheckCheck/Truck as needed); replace `Loader2` with a CSS spinner. (Do in sub-batches; type-check between batches.)
- [X] T007 [P] Restyle shared status pills to Cobalt semantics: `src/components/orders/StatusBadge.tsx` + `src/components/admin/orders/StatusBadge.tsx` (UPPERCASE codes → Cobalt colors + localized labels; neutral fallback; codes unchanged).
- [X] T008 [P] Re-skin shared `src/components/ui/{Button,EmptyState,Skeleton,Toast}.tsx` to Cobalt tokens (Button: accent=solid cobalt, primary=dark/neutral, outlined, ghost; active translateY(1px)).
- [X] T009 **Dark→light hunt (round 1)**: grep the codebase for residual Voltage dark hex / rgba (`#0A0A0C`, `#121216`, `#1A1A20`, `#26262E`, `#36363F`, `#FF7A33`, `rgba(255,122,51,*)`, `#19D4E8`, plasma/glow shadows) and convert inline-styled usages to Cobalt tokens/values. (Re-run in T040.)

**Checkpoint**: App renders light; fonts + icons + pills + primitives on Cobalt. Screen migration can begin.

---

## Phase 3: User Story 1 - Trust-first light storefront + plan toggle (Priority: P1) 🎯 MVP

**Goal**: Core conversion path (home → product card → product detail w/ plan toggle → cart) on Cobalt light.

**Independent Test**: Load home (toggle plan), open product (plan selector + price update), add to cart — Cobalt light, trust cues, USD+IQD, both LTR + RTL.

- [X] T010 [US1] Re-skin shared `src/components/product/ProductCard.tsx` to the Cobalt card contract (white surface + `card-hover` lift, custom Icon, real image + gradient/letter-mark fallback, category kicker, rating star=warning, USD+IQD price LTR/tabular, add-to-cart, heart/heartFill). Propagates to listing/category/search/wishlist/related.
- [X] T011 [US1] Re-skin home `src/app/page.tsx` + `src/components/home/HeroSlider.tsx` — Cobalt hero (headline + CTAs + trust stars + dark "active subscriptions" visual card), 4 value-props, categories, bestsellers grid, how-it-works, reviews, CTA band. Trust cues above the fold.
- [~] T012 [US1] **Plan toggle — DEFERRED (data gap).** Products have no per-plan/billing-interval field (duration is embedded in the name, single price). A real monthly/yearly toggle needs a data-model change, which FR-024 forbids; faking plan data would mislead. Decision: skip rather than fabricate; revisit if a `billingInterval`/plan field is added later.
- [X] T013 [US1] Re-skin product detail `src/app/(shop)/products/[slug]/ProductDetailClient.tsx` — gallery (gradient tile + thumbs + trust strip), info column (kicker, title, rating/sold, **plan selector** radio cards updating price, price box + qty stepper + add-to-cart/buy-now/wishlist, "what you get" list).
- [X] T014 [US1] Re-skin cart drawer `src/components/cart/CartDrawer.tsx` + `src/components/cart/CartItem.tsx` to Cobalt (white surface, totals USD+IQD, custom icons, RTL mirrored).
- [X] T015 [US1] Verify US1 trust/payment/support strings come from `src/config/store.config.ts`; WhatsApp/contact + socials unchanged.

**Checkpoint**: MVP conversion path on Cobalt light, demoable both directions.

---

## Phase 4: User Story 2 - Flawless bilingual (RTL + LTR) light (Priority: P1)

**Goal**: Global chrome + direction handling so every screen mirrors cleanly on light; prices LTR/tabular; icons flip.

**Independent Test**: Toggle Arabic on US1 surfaces + chrome; full mirroring, flipped chevrons, LTR tabular prices, Arabic fonts, zero broken layouts.

- [X] T016 [US2] Re-skin global chrome: `src/components/layout/Header.tsx` (cobalt "S" lockup gradient `135deg,#2563EB→#3B82F6`, nav, search, lang toggle, cart badge), `src/components/layout/Footer.tsx` (dark surface), `src/components/layout/MobileMenu.tsx` — Cobalt + custom icons + logical properties.
- [X] T017 [US2] Verify `src/components/layout/LangInitializer.tsx` sets `dir`/`lang`; confirm Arabic body→IBM Plex Sans Arabic, Arabic headings→Cairo in `globals.css`; apply `.ltr-nums`/`.num` to all price/number runs in ProductCard/cart/detail.
- [X] T018 [US2] Apply `.rtl-flip` to directional custom icons (chevrons/arrows/back/next/"view all") across header, cart, product detail, pagination; verify with the Arabic toggle.

**Checkpoint**: US1 surfaces + chrome flawless both directions on light.

---

## Phase 5: User Story 3 - Cohesive Cobalt across all screens + admin (Priority: P2)

**Goal**: Extend Cobalt to all remaining storefront + admin screens with shared primitives, the 4-step checkout, tabs/accordion, activation-code reveal, and on-brand charts.

**Independent Test**: Visit each screen group; shared Cobalt primitives, status semantics, empty/loading states, custom icons throughout; 4-step checkout; code reveal; admin on Cobalt — all RTL-mirrored.

### Storefront remainder

- [X] T019 [P] [US3] Re-skin listing + filters: `src/app/(shop)/products/page.tsx`, `src/components/product/ProductGrid.tsx`, `src/components/product/ProductFilters.tsx` (filter sidebar → mobile chip bar, sort, results count, pagination, empty state).
- [X] T020 [P] [US3] Re-skin category + search: `src/app/(shop)/category/[slug]/page.tsx` (category hero banner + chips), `src/app/(shop)/search/page.tsx` (prominent field, suggestion chips, no-results empty state).
- [X] T021 [US3] **4-step checkout**: re-skin `src/app/cart/page.tsx`, `src/app/checkout/page.tsx`, `src/app/checkout/payment/page.tsx`, `src/app/checkout/success/page.tsx`, `src/components/checkout/CheckoutSteps.tsx`, `src/components/checkout/AddressForm.tsx` → Cart → Info → Payment → Confirmation with a sticky live order summary (subtotal/discount/total USD+IQD, trust badges); payment = ZainCash/Asia Hawala/Card (card form only when Card); preserve Iraq governorate/city system.
- [X] T022 [US3] Product detail **tabs + FAQ accordion**: add Description/Features/FAQ/Reviews tabs (one panel at a time) + FAQ accordion + related products grid to the product detail client (local state).
- [X] T023 [P] [US3] Re-skin auth: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx` → split layout (dark brand panel + form panel, leading-icon inputs, Google button).
- [X] T024 [US3] Account **order detail**: re-skin `src/app/account/orders/[id]/page.tsx` — order header + status badge + invoice, vertical timeline, items each with a **maskable activation code** (reveal/hide + copy-to-clipboard), summary + support card.
- [X] T025 [P] [US3] Re-skin remaining account: `src/app/account/page.tsx` (overview: stat cards + active subscriptions + recent orders), `src/app/account/orders/page.tsx`, `src/app/account/wishlist/page.tsx`, `src/app/account/addresses/page.tsx` (custom icons, status pills, EmptyState).
- [X] T026 [P] [US3] Re-skin content pages: `src/app/{about,contact,faq,how-it-works,glossary,payment-methods,privacy,terms}/page.tsx` to Cobalt (config-driven strings; legal URLs from config).
- [X] T027 [P] [US3] Create + style 404 `src/app/not-found.tsx` (big 404, message, search field, primary/secondary CTAs, popular-search chips).

### Admin

- [X] T028 [US3] Re-skin admin chrome: `src/components/admin/layout/Sidebar.tsx` (dark sidebar + cobalt active states + "S" lockup), `src/components/admin/layout/Topbar.tsx`, admin login `src/app/admin/login/page.tsx`.
- [X] T029 [US3] Re-skin admin dashboard `src/app/admin/dashboard/page.tsx` + `src/components/admin/dashboard/{StatsCard,RecentOrders,TopProducts,LowStockAlert}.tsx` (stat cards w/ trend, recent-orders table) on Cobalt light surfaces.
- [X] T030 [US3] Apply Cobalt palette to charts: `src/components/admin/dashboard/{RevenueChart,OrderStatusChart,SalesByCategoryChart}.tsx` (token colors into recharts; light grid/surface; `Number(v ?? 0)` in formatters; RTL reads correctly).
- [X] T031 [P] [US3] Re-skin admin tables: `src/app/admin/dashboard/{orders,products,customers,categories,notifications}/page.tsx` to one Cobalt table style (status pills, row actions, custom icons).
- [X] T032 [P] [US3] Re-skin admin product form: `src/app/admin/dashboard/products/[id]/page.tsx` + `new/page.tsx` + `src/components/admin/products/{ProductForm,ImageUpload}.tsx` (basic info, per-plan pricing, SEO, image upload, visibility toggles).
- [X] T033 [P] [US3] Re-skin admin order detail `src/app/admin/dashboard/orders/[id]/page.tsx` + `src/components/admin/orders/{OrderTimeline,StatusChangeModal}.tsx` (status-change control, status-history timeline, internal note; validated-transition logic unchanged).
- [X] T034 [P] [US3] Re-skin admin customer detail `src/app/admin/dashboard/customers/[id]/page.tsx` + settings `src/app/admin/dashboard/settings/page.tsx`.
- [X] T035 [US3] Apply shared `EmptyState`/`Skeleton`/`Toast` across storefront + admin lists/tables/async surfaces touched in this phase.

**Checkpoint**: All ~18 screen groups on Cobalt light with consistent primitives + new interactions, both directions.

---

## Phase 6: User Story 4 - Responsive, mobile-first (Priority: P3)

**Goal**: Mobile layouts — stacked hero, 2-col grid, collapsing sidebars→chip/top bars, sticky CTAs, ≥44px targets.

**Independent Test**: At phone width, walk home → product → cart → 4-step checkout → confirmation; sidebars collapse, sticky CTAs work, RTL mirrored.

- [ ] T036 [US4] Verify/adjust mobile home + grids (`page.tsx`, `ProductGrid`) collapse to 2 columns; hero stacks; categories scroll; trust cues above fold.
- [ ] T037 [US4] Filter/nav collapse: listing/category filter sidebar → horizontal chip/filter bar; account + admin side-nav → horizontal top bar at mobile breakpoint.
- [ ] T038 [US4] Sticky CTAs: sticky add-to-cart on product detail + sticky pay bar with running total on mobile checkout; mobile menu = full-screen slide-over.
- [ ] T039 [P] [US4] Verify ≥44px touch targets on primary mobile controls (buttons, qty steppers, nav items, filter chips).

**Checkpoint**: Full mobile journey usable both directions.

---

## Phase 7: Polish & Cross-Cutting

- [ ] T040 **Dark→light hunt (final)**: grep for any remaining Voltage dark hex/rgba in `src` (`*.tsx`/`*.css`) and fix; confirm zero leftover dark-theme colors (FR/SC-002).
- [ ] T041 [P] Confirm zero `lucide-react` imports remain in redesigned screens (`grep -rn "lucide-react" src`); all icons via custom `Icon` (SC-009).
- [ ] T042 [P] Grep for lowercase enum comparisons introduced by the redesign; ensure status codes stay UPPERCASE (Principle V).
- [ ] T043 [P] Accessibility pass: AA contrast on light, visible `:focus-visible` rings, keyboard operability of drawers/modals/menus/tabs/accordions/code-reveal.
- [ ] T044 Run `npm run type-check` (clean) + `next build`; run the `quickstart.md` acceptance smoke (home plan toggle → product tabs/FAQ → cart → 4-step checkout → confirmation; order-detail code reveal; admin dashboard + table + order detail) in both LTR + RTL.
- [ ] T045 Update `CLAUDE.md` SPECKIT block: mark Cobalt **implemented**, document Cobalt tokens/fonts/Icon, note Voltage superseded.

---

## Dependencies & Execution Order

- **Setup (P1)** → **Foundational (P2, BLOCKS all)** → **US1 (P3, MVP)** → **US2 (P4)** → **US3 (P5)** → **US4 (P6)** → **Polish (P7)**.
- T003 (globals) before everything visual; T004 (fonts) right after or text falls back; T005 (Icon) before T006 (migration); T006 before screens that render icons.
- Shared component before its consumers (T010 ProductCard before T019/T020/T025; T007 pills before account/admin tables).
- T040 (final dark hunt) after all screens migrated.
- Per-task gate: `npm run type-check` clean + LTR/RTL light visual check.

### Parallel Opportunities

- P2: T007/T008 parallel (different files); T006 in sub-batches.
- P5: T019/T020/T023/T025/T026/T027 parallel (distinct files); T031/T032/T033/T034 parallel after admin chrome (T028).
- P7: T041/T042/T043 parallel.

---

## Implementation Strategy

**MVP**: Setup → Foundational → US1 → STOP & validate the conversion path (plan toggle, light, both directions) → demo.
**Incremental**: Foundational ready → US1 (MVP) → US2 (bilingual) → US3 (full coverage + new interactions + admin) → US4 (mobile) → Polish.

## Notes

- [P] = different files, no incomplete dependency. Commit + push after each task (per user request).
- Guardrails: no changes under `src/app/api/`, `src/services/`, `src/store/`, `prisma/`, or to routes/enum values; brand strings only from `src/config/*`; prices via `formatPrice()`; Iraq address system preserved; `.env*` never committed; reference prototypes/`support.js` never imported; status codes stay UPPERCASE.
