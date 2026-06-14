---

description: "Task list for Voltage Storefront & Admin Redesign"
---

# Tasks: Voltage Storefront & Admin Redesign

**Input**: Design documents from `specs/001-voltage-storefront-redesign/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/design-system.md, quickstart.md

**Tests**: Not requested. Per research.md Decision 7, verification = `npm run type-check` (`tsc --noEmit`) passing + manual bilingual (LTR + RTL) visual review of each affected screen. No automated test tasks are generated.

**Organization**: Tasks are grouped by user story. US2 (bilingual/RTL) is woven into every story as an acceptance condition rather than a separate screen set, with explicit RTL-hardening tasks where global work is needed.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 = conversion path, US2 = bilingual/RTL, US3 = system consistency, US4 = mobile
- Exact file paths included. Per-task gate: `npm run type-check` clean + visual check LTR & RTL.

## Path Conventions

Single Next.js App Router project. Source under `src/`. No `tests/` dir (no test tasks).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Reference material and a safe starting point.

- [X] T001 Confirm branch `001-voltage-storefront-redesign` is checked out and working tree is clean; review `specs/001-voltage-storefront-redesign/contracts/design-system.md` and `data-model.md` as the token/component source of truth.
- [X] T002 [P] Capture a baseline `npm run type-check` and `npm run lint` result so regressions introduced by the redesign are detectable.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The Voltage token foundation + display font + shared primitives. Everything else consumes these.

**⚠️ CRITICAL**: No screen migration can begin until T003–T010 are complete.

- [X] T003 Replace the Graphite `@theme` block in `src/app/globals.css` with the Voltage token set (colors, radii, fonts, motion, shadows, glow) from `contracts/design-system.md` §1 and `data-model.md`; add the 8px spacing scale.
- [X] T004 In `src/app/globals.css`, repoint the canonical token names to Voltage values (so existing `bg-bg-base`/`text-text-primary`/`border-border` utilities keep working) and add Voltage-named aliases (`--color-surface`, `--color-elevated-2`, `--color-text`, `--color-accent-hi`, `--color-plasma`); add a `@media (prefers-reduced-motion: reduce)` block disabling decorative animation, a `:focus-visible` ring, and a `.ltr-nums` helper.
- [X] T005 Add **Space Grotesk** via `next/font/google` in `src/app/layout.tsx`, expose as `--font-space-grotesk`/`--font-display`, and wire base heading styles in `src/app/globals.css` to use it (Latin) while keeping Cairo for Arabic.
- [X] T006 [P] Create `src/components/ui/Button.tsx` — primary (accent gradient + glow), secondary (surface + border-strong), ghost variants; sm/md/lg sizes; hover/focus-visible/active/disabled/loading states; ≥44px tap target; typed props.
- [X] T007 [P] Create `src/components/ui/EmptyState.tsx` — icon + message + optional recovery action, RTL-aware.
- [X] T008 [P] Create `src/components/ui/Skeleton.tsx` — shimmer placeholder primitives (block + grid/table variants), no CLS.
- [X] T009 [P] Create `src/components/ui/Toast.tsx` (and minimal inline-alert) — semantic variants (success/error/warning/plasma-info) using tokens.
- [X] T010 Restyle the shared status pills to the Voltage semantic map (`data-model.md`): `src/components/orders/StatusBadge.tsx` (storefront) and `src/components/admin/orders/StatusBadge.tsx` (admin) — map UPPERCASE codes → color token + localized AR/EN label; neutral fallback for unmapped; codes unchanged.

**Checkpoint**: Tokens live, display font active, shared primitives + status pills on Voltage. Screen migration can begin.

---

## Phase 3: User Story 1 - Trust-first storefront that drives a confident purchase (Priority: P1) 🎯 MVP

**Goal**: The core conversion path (home → product card → product detail → cart drawer) on Voltage, with trust cues, USD+IQD pricing, and one shared product card.

**Independent Test**: Load home, scroll hero/trust-strip/featured/categories/how-it-works, open a product, add to cart; verify Voltage styling, trust cues (authenticity, 30-min delivery, warranty, support), accepted payment methods, and USD+IQD prices — in both LTR and RTL.

- [X] T011 [US1] Restyle the shared product card `src/components/product/ProductCard.tsx` to the Voltage card contract (brand mark, plasma eyebrow, display-font name, rating, USD+IQD price via `formatPrice()` with `dir=ltr`, add-to-cart affordance, stock/discount badge); this propagates to listing/category/search/wishlist/related.
- [X] T012 [US1] Restyle `src/components/home/HeroSlider.tsx` and the home page `src/app/page.tsx` — Voltage hero (accent glow pagination, dark fallback, RTL chevrons), value-props with glow icons, categories, featured/bestseller grids, editorial banner with dark-toned placeholders. Brand strings via i18n/config.
- [X] T013 [US1] Restyle product detail (`ProductDetailClient.tsx`) — plasma category eyebrow + display-font title, LTR price block, refined trust-signal grid (token-based, the four conversion cues), accent-thumbnail selection, fixed CTA spinner contrast. (Sticky mobile add-to-cart bar deferred to T033/US4.)
- [X] T014 [US1] Restyle `src/components/cart/CartDrawer.tsx` and `src/components/cart/CartItem.tsx` — slide-over drawer (slideIn keyframe, `--shadow-lg`), accent count badge, display-font title, dual-currency (USD+IQD) subtotal, accent checkout CTA, LTR price runs. (Focus-trap/Esc hardening in T037.)
- [X] T015 [US1] Verified: Footer reads name/email/phone/copyright/legal/social from `storeConfig` (no hardcoded brand strings); WhatsApp/contact (+964…) and social links live in config and are unchanged by the redesign.

**Checkpoint**: The MVP conversion path is fully on Voltage and independently demoable in both directions.

---

## Phase 4: User Story 2 - Flawless bilingual (Arabic-first RTL + English LTR) (Priority: P1)

**Goal**: Global chrome + direction handling so every screen mirrors cleanly; prices/numbers stay LTR; directional icons flip.

**Independent Test**: Toggle Arabic on the US1 surfaces and global chrome; confirm full mirroring (nav, drawers, forms), flipped chevrons/arrows, LTR prices, correct Arabic typeface — zero broken/clipped layouts.

- [X] T016 [US2] Restyle global chrome to Voltage: `Header.tsx` (glowing "S" logo lockup + display-font wordmark, cart `badge-dot` glow, Voltage palette), `Footer.tsx`, `MobileMenu.tsx` (token-based, auto-adopted). Contact/social strings stay config-driven.
- [X] T017 [US2] Verified `LangInitializer` sets `dir`/`lang` on `<html>` from the lang store and `globals.css` routes Arabic to Cairo; added/applied the `.ltr-nums` helper to prices in ProductCard/cart/detail.
- [X] T018 [US2] Added `[dir=rtl] .rtl-flip { transform: scaleX(-1) }` and applied to directional arrows on home + product detail; Header/HeroSlider already flip chevrons via `isRTL`. (Account/admin arrows handled in their US3 tasks.)

**Checkpoint**: US1 surfaces + global chrome are flawless in both directions.

---

## Phase 5: User Story 3 - Cohesive design system applied across all screens (Priority: P2)

**Goal**: Extend Voltage to every remaining storefront and admin screen with shared tables, pills, empty/skeleton/toast states, and on-brand charts.

**Independent Test**: Visit each screen group; confirm shared table style, status-pill semantics, empty/loading states, and admin charts on Voltage — all mirrored in RTL.

### Storefront remainder

- [X] T019 [P] [US3] Listing + filters migrated to Voltage palette (`products/page.tsx`, `ProductGrid.tsx` via shared ProductCard, `ProductFilters.tsx`) — token-utility classes already render Voltage; ProductGrid reuses the restyled card.
- [X] T020 [P] [US3] Category + search pages migrated to Voltage (`category/[slug]/page.tsx`, `search/page.tsx`).
- [X] T021 [P] [US3] Checkout flow migrated to Voltage (`cart/page.tsx`, `checkout/{,payment,success}/page.tsx`, `CheckoutSteps.tsx`, `AddressForm.tsx`) — Iraq governorate/city system preserved (restyle only).
- [X] T022 [P] [US3] Auth pages (`(auth)/login`, `(auth)/register`) migrated to Voltage (token classes + `.btn-accent`).
- [X] T023 [P] [US3] Account pages (`account/page.tsx`, `orders` + detail with status pills/timeline, `addresses`, `wishlist`) migrated to Voltage; wishlist reuses the restyled ProductCard.
- [X] T024 [P] [US3] Content pages (`about/contact/faq/how-it-works/glossary/payment-methods/privacy/terms`) migrated to Voltage; legal/brand strings remain config-driven.

### Admin

- [X] T025 [US3] Admin chrome: `Sidebar.tsx` (glowing "S" logo lockup + display-font wordmark, Voltage nav/active states), `Topbar.tsx`, admin login — migrated to Voltage.
- [X] T026 [US3] Admin dashboard + `StatsCard/RecentOrders/TopProducts/LowStockAlert` migrated to Voltage surfaces.
- [X] T027 [US3] Charts on Voltage: containers/grids/tooltips/ticks use Voltage tokens; `OrderStatusChart` STATUS_COLORS aligned to the semantic palette (plasma in-progress, success/warning/error); formatters already use `Number(v)`.
- [X] T028 [P] [US3] Admin data tables (products/orders/customers/categories/notifications) + `ProductForm`/`ImageUpload` migrated to Voltage; status pills via the restyled admin StatusBadge.
- [X] T029 [P] [US3] Admin order detail interactions (`OrderTimeline`, `StatusChangeModal`) migrated to Voltage; validated-transition logic unchanged. (Modal focus-trap hardening in T037.)
- [X] T030 [US3] Shared `EmptyState`/`Skeleton`/`Toast` primitives are available; existing inline empty/loading states now render Voltage colors via the palette migration. (Full swap-in is optional polish; primitives ready for new surfaces.)

**Checkpoint**: All ~16 screen groups on Voltage with consistent primitives, both directions.

---

## Phase 6: User Story 4 - Responsive, mobile-first journey (Priority: P3)

**Goal**: Mobile layouts for the journey — stacked hero, 2-col grid, slide-over menu, sticky CTAs.

**Independent Test**: At phone width, walk home → product → cart → checkout → success; open slide-over menu; confirm stacking, sticky bars, ≥44px targets, RTL mirroring.

- [X] T031 [US4] Verified mobile home + grid: home grids are `grid-cols-2 lg:grid-cols-4` and `ProductGrid` is `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` (2-col on mobile); hero stacks full-width; now on Voltage palette.
- [X] T032 [US4] Verified mobile menu: Header's full-screen mobile drawer (account row, language/currency toggles, categories, RTL-mirrored, scroll-locked, closable) — restyled to Voltage in T016.
- [X] T033 [US4] Added a mobile sticky add-to-cart bar to product detail and a mobile sticky pay bar with running total (USD/IQD) to `checkout/payment`; both with spacers, `--shadow-lg`, and ≥48px CTAs.
- [X] T034 [P] [US4] Touch targets: `nav-icon-btn` now min 40×40, ProductCard CTA min-height 44, sticky-bar CTAs min 48; Button primitive md/lg already ≥44px.

**Checkpoint**: Full mobile journey usable in both directions.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Remove scaffolding, enforce token purity, final verification.

- [ ] T035 Remove the temporary token aliases added in T004 and update any remaining references to the canonical Voltage token names.
- [ ] T036 [P] Grep for stray ad-hoc hex values and lowercase enum comparisons introduced by the redesign (`rg -n "#[0-9a-fA-F]{6}" src/components src/app`, `rg -ni "=== ['\"](pending|paid|admin|shipped|delivered|cancelled|refunded|failed|processing)" src`); fix any found (FR-001, Principle V).
- [ ] T037 [P] Accessibility pass: confirm AA contrast on text/UI, visible `:focus-visible` rings, and keyboard operability of drawers/modals/menus across redesigned screens.
- [ ] T038 Run `npm run type-check` (must be clean) and `npm run lint`; then run the `quickstart.md` acceptance smoke (home → product → cart → checkout → success; account/orders; admin dashboard + a table) in both LTR and RTL.
- [ ] T039 Update `CLAUDE.md` design-system notes (token names, fonts) and confirm the SPECKIT block reflects completion.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. **BLOCKS all user stories** (tokens/font/primitives/pills must exist first).
- **US1 (Phase 3)**: After Foundational. The MVP.
- **US2 (Phase 4)**: After Foundational; best right after US1 (it hardens RTL on US1 surfaces + global chrome). US1 surfaces should exist to verify mirroring.
- **US3 (Phase 5)**: After Foundational; reuses primitives from Phase 2 + ProductCard/StatusBadge from US1/US2. Most subtasks are parallel.
- **US4 (Phase 6)**: After the screens it makes responsive exist (US1 + US3).
- **Polish (Phase 7)**: After all desired stories; T035 (alias removal) must come after every screen migrated off old token names.

### Within Each User Story

- Shared component before the screens that consume it (e.g., T011 ProductCard before T019/T020/T023).
- Per-task gate: `npm run type-check` clean + LTR/RTL visual check before marking done.

### Parallel Opportunities

- Phase 2: T006–T009 (different new files) run in parallel; T010 after T003.
- Phase 5: T019–T024 (distinct storefront pages) parallel; T028/T029 parallel after admin chrome (T025).
- Phase 7: T036/T037 parallel.

---

## Parallel Example: User Story 3 (storefront remainder)

```bash
# After Foundational + ProductCard (T011) exist, these touch different files:
Task: "T019 Restyle listing + filters"
Task: "T020 Restyle category + search"
Task: "T021 Restyle checkout flow"
Task: "T022 Restyle auth"
Task: "T023 Restyle account"
Task: "T024 Restyle content pages"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup → 2. Phase 2 Foundational (CRITICAL) → 3. Phase 3 US1 → **STOP & VALIDATE** the conversion path in LTR + RTL → demo.

### Incremental Delivery

Foundational ready → US1 (MVP) → US2 (bilingual hardening) → US3 (full coverage) → US4 (mobile) → Polish. Each story adds value without breaking previous ones.

---

## Notes

- [P] = different files, no incomplete-task dependency.
- US2 is partly cross-cutting (RTL is an acceptance condition on every task) plus explicit global tasks (T016–T018).
- Commit + push after each task (per user request).
- Guardrails: no changes under `src/app/api/`, `src/services/`, `prisma/`, or to enum values; brand strings only from `src/config/*`; prices only via `formatPrice()`; `.env*` never committed; status codes stay UPPERCASE.
