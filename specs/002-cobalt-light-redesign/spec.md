# Feature Specification: Cobalt Light Storefront & Admin Redesign

**Feature Branch**: `002-cobalt-light-redesign`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: Apply the new "Cobalt" design (light/minimal, Stripe-inspired — cobalt-blue accent + neutral grays) from the `design_handoff_softodev_redesign/` bundle across the entire storefront and admin, replacing the current dark "Voltage" theme. Design/UX layer only — no route/API/data-logic changes. Bilingual (Arabic RTL + English LTR), mobile-first.

## Overview

A complete visual re-skin of the **softodeviq** digital-subscriptions store, replacing the current dark **"Voltage"** theme (near-black + electric orange) with a new light, minimal, Stripe-inspired identity called **"Cobalt"** (cobalt-blue accent `#2563EB` + neutral grays on a light `#F7F8FA` canvas). The redesign spans every storefront screen and the full admin panel, and remains flawless in both **Arabic (RTL, primary)** and **English (LTR)**.

The change is **presentation/UX only** — routes, API endpoints, data models, enum values, services, and stores are unchanged. The handoff bundle provides two production-ready artifacts (a drop-in `globals.css` Cobalt theme using the same token names, and a typed custom `Icon.tsx` set) plus 18 HTML reference prototypes that define the target look and a few new interactions.

This redesign also introduces several **new presentation-layer interactions** the current UI lacks: a monthly/yearly plan toggle that swaps displayed prices, a 4-step checkout flow with a live order summary, maskable activation-code reveal on order detail, and product tabs/accordion — all built on the existing data and stores.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trust-first light storefront that drives a confident purchase (Priority: P1)

A first-time visitor lands on the home page in the new light Cobalt look, immediately understands what the store sells and why it's safe to buy, browses subscriptions, opens a product, selects a plan (monthly/yearly), and adds it to the cart — all in one cohesive, premium, light visual experience.

**Why this priority**: This is the core conversion path and the main reason for the redesign. The home page, product card, product detail (with the new plan toggle), and cart are where buying decisions happen. Shipping just this slice already delivers the new identity on the highest-value surfaces.

**Independent Test**: Load the home page, scroll hero → value-props → categories → bestsellers → how-it-works → plan section → reviews → footer; open a product; switch the plan toggle and confirm the price/period/savings update; add to cart. Verify the Cobalt light system, trust cues, and USD+IQD pricing appear consistently in both LTR and RTL.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page, **When** it loads, **Then** it renders in the Cobalt light theme (light canvas, cobalt-blue accent, custom icons, new fonts) with prominent trust cues (authenticity, instant/30-minute delivery, warranty, support) and clear CTAs.
2. **Given** a visitor on the home plan section or a product page, **When** they toggle monthly/yearly, **Then** the displayed price, period label, savings badge, and IQD estimate update immediately without a page reload.
3. **Given** a visitor viewing any price, **When** it renders, **Then** it shows USD with the IQD equivalent via the existing price helper, stays left-to-right and tabular even in RTL.
4. **Given** a product card anywhere (home/listing/category/search/wishlist/related), **When** it renders, **Then** it uses one shared Cobalt card treatment (light surface, hover lift, custom icons, real product image with a gradient-tile fallback).
5. **Given** a visitor adds an item, **When** the cart opens, **Then** it shows line items and totals (USD + IQD) in the Cobalt style and mirrors correctly in RTL.

---

### User Story 2 - Flawless bilingual (Arabic-first RTL + English LTR) light experience (Priority: P1)

An Arabic-speaking buyer uses the store entirely in Arabic with a native-feeling RTL light layout; an English buyer gets full LTR parity. Switching language flips direction and labels cleanly on every screen.

**Why this priority**: Arabic-first RTL is the primary audience requirement; a re-skin that breaks in RTL fails its main users. Applies to every screen in Story 1 and beyond, so it is co-equal P1.

**Independent Test**: Switch to Arabic and confirm every key screen mirrors correctly (layout, custom icons/chevrons, nav, drawers, forms, alignment), Arabic uses an Arabic-appropriate typeface, and prices/numbers stay LTR and tabular.

**Acceptance Scenarios**:

1. **Given** the store set to Arabic, **When** any redesigned screen renders, **Then** the whole layout mirrors RTL (nav, grids, sidebars, drawers, forms).
2. **Given** an RTL screen with directional icons (chevrons/arrows/back/next), **When** it renders, **Then** those icons flip to the correct reading direction.
3. **Given** RTL with prices/numbers/Latin runs, **When** they render, **Then** they stay left-to-right, tabular, and correctly aligned.
4. **Given** Arabic content, **When** it renders, **Then** Arabic body and Arabic headings use Arabic-appropriate typefaces with comfortable weight/line-height on the light background.
5. **Given** a user toggling language, **When** they switch, **Then** direction and labels update consistently with no broken/clipped layouts.

---

### User Story 3 - Cohesive Cobalt system applied across all screens (Priority: P2)

A buyer or admin moving between any screens — listing, category, search, the 4-step checkout, account (overview/orders/order-detail/wishlist/addresses/profile), auth, content pages, and the full admin — experiences one consistent Cobalt system: the same buttons, inputs, cards, status pills, tables, modals, tabs, toasts, empty states, and skeleton loaders, with the same spacing, color semantics, and motion. The custom icon set replaces all prior icons.

**Why this priority**: Consistency is what makes the re-skin read as "one product." It extends the P1 primitives to the remaining 30+ screens including the data-dense admin. P2 because the highest-value surfaces (P1) deliver value first, but full coverage is required for completion.

**Independent Test**: Visit each screen group and confirm shared Cobalt primitives, status-pill semantics (codes stay UPPERCASE), empty/loading states, and the custom icon set throughout — all mirrored in RTL.

**Acceptance Scenarios**:

1. **Given** the checkout, **When** the user proceeds, **Then** it presents a 4-step flow (Cart → Info → Payment → Confirmation) with a live order summary (items, promo, subtotal, 10% discount logic as designed, total in USD + IQD, trust badges) and payment options (ZainCash / Asia Hawala / Card, with the card form appearing only when Card is selected).
2. **Given** an order detail page, **When** it renders, **Then** each purchased item shows a maskable activation code (masked by default, with reveal/hide and copy-to-clipboard) plus a vertical order timeline.
3. **Given** a product detail page, **When** the user uses the tabs (Description / Features / FAQ / Reviews), **Then** one panel shows at a time and the FAQ rows expand/collapse as an accordion.
4. **Given** any order/payment status shown anywhere (account, admin tables, timelines, notifications), **When** it renders, **Then** it uses consistent Cobalt status-pill semantics and the underlying enum codes remain the existing UPPERCASE values.
5. **Given** the admin dashboard, **When** it renders, **Then** KPI cards, the revenue chart, the category breakdown, recent orders, and the management tables all use the Cobalt surfaces/colors and mirror correctly in RTL.
6. **Given** any list/search/table with no results or pending data, **When** it renders, **Then** it uses the shared Cobalt empty-state and skeleton-loader patterns; action feedback uses the shared toast/inline-alert.
7. **Given** any screen, **When** icons render, **Then** they come from the single custom icon set (no emoji, no leftover third-party icons).

---

### User Story 4 - Responsive, mobile-first journey (Priority: P3)

A buyer on a phone gets a layout built for small screens: stacked hero, prominent search, trust cues above the fold, a 2-column product grid, filter sidebars that collapse to top chip bars, account/admin side-nav that becomes a horizontal bar, sticky CTAs, and comfortable touch targets — in both RTL and LTR.

**Why this priority**: Much of the audience shops on mobile, but desktop conversion (P1), bilingual correctness (P1), and system consistency (P2) come first. Mobile refines the same system to small screens.

**Independent Test**: At phone width, walk home → product → cart → 4-step checkout → confirmation; confirm hero stacks, grids collapse to 2 columns, sidebars become top bars, sticky CTAs work, touch targets are comfortable, all mirrored in RTL.

**Acceptance Scenarios**:

1. **Given** a phone-width viewport, **When** the home page renders, **Then** the hero stacks, search stays prominent, trust cues sit above the fold, categories scroll, and the product grid is two columns.
2. **Given** a phone-width listing/category, **When** it renders, **Then** the filter sidebar collapses into a horizontal chip/filter bar.
3. **Given** a phone-width account or admin screen, **When** it renders, **Then** the side navigation becomes a horizontal bar and tables remain readable.
4. **Given** a phone-width product/checkout, **When** the user scrolls, **Then** the primary action (add-to-cart / pay) stays reachable.
5. **Given** any interactive element on mobile, **When** the user taps it, **Then** the touch target is comfortably sized.

---

### Edge Cases

- **Dark→light inversion leftovers**: Any hardcoded dark color from the old Voltage theme that survives the re-skin will look wrong on the light canvas; all surfaces/text must read correctly on light.
- **Direction switch mid-session**: Toggling language on any screen re-mirrors without broken/clipped/overlapping elements and without losing place.
- **Plan toggle with single-plan products**: If a product has only one plan, the monthly/yearly toggle must degrade gracefully (hide or disable, no broken price).
- **Activation code states**: Codes are masked by default; reveal and copy must work; an order with no code yet must show an appropriate placeholder.
- **Long Arabic strings / long product names**: Wrap gracefully (titles, badges, table cells) both directions.
- **Mixed-direction content**: Prices, numbers, and Latin brand names in Arabic copy stay LTR and tabular.
- **Unmapped status**: Every order/payment enum value maps to a defined Cobalt pill; an unmapped value still renders legibly with a safe default.
- **Empty & loading states**: Empty cart, no search results, no orders, empty wishlist, and pending data use the shared empty/skeleton patterns, including in RTL.
- **No-image products**: Product imagery falls back to the gradient tile + letter-mark.
- **Accessibility on light theme**: AA contrast on the light palette, visible keyboard focus, comfortable touch targets, reduced-motion respected.

## Requirements *(mandatory)*

### Functional Requirements

#### Design system foundation

- **FR-001**: The product MUST adopt the "Cobalt" design system whose colors, typography, spacing, radii, shadows, and motion are defined as reusable design tokens and used consistently — no ad-hoc one-off values introduced by the redesign.
- **FR-002**: The theme MUST be a light theme using the Cobalt palette: light canvas/surfaces, cobalt-blue primary accent, a supporting cyan for "instant"/trust cues, neutral gray text scale, dark surfaces reserved for footer/admin-sidebar/brand panels, and defined success/warning/error semantics (exact values in Key Entities).
- **FR-003**: Typography MUST use the Cobalt type system: a Latin UI/number face, an Arabic body face, an Arabic heading face, and a monospace face for codes/SKUs, applied via a defined type scale; the previous Voltage fonts MUST be removed.
- **FR-004**: A single custom icon set MUST replace all prior icons across every screen; no emoji and no leftover third-party icons remain.
- **FR-005**: The system MUST define and reuse a consistent component library across all screens: buttons (accent/dark/outlined/ghost), inputs and form controls, cards (with hover lift), badges/status pills, tables, modals/drawers, tabs, accordions, toasts/inline alerts, pagination, empty states, and skeleton loaders.
- **FR-006**: Spacing MUST follow a consistent 8px-based rhythm; cards/buttons MUST use the defined hover/active micro-interactions (card lift, button depress).

#### Bilingual / RTL

- **FR-007**: Every redesigned screen MUST render correctly in both Arabic (RTL, primary) and English (LTR).
- **FR-008**: In RTL, the entire layout MUST mirror (nav, grids, sidebars, drawers, modals, forms) and directional icons MUST flip.
- **FR-009**: Prices, numbers, and embedded Latin runs MUST stay left-to-right and tabular even in RTL.
- **FR-010**: Switching language MUST update labels and direction consistently with no broken layouts, reusing the existing language/RTL mechanism (no new i18n system).

#### Conversion, trust & new interactions

- **FR-011**: Storefront conversion surfaces (home, product) MUST present trust signals prominently — authenticity, instant/30-minute delivery, warranty, live support — above the fold.
- **FR-012**: The fixed payment methods (ZainCash, Asia Hawala, Card; plus existing Cash on Delivery where applicable) MUST be presented as trust signals/options, and the support channels (WhatsApp, Telegram) MUST remain prominent.
- **FR-013**: A monthly/yearly plan toggle MUST be available on the home plan section and on product detail; toggling MUST update the displayed price, period, savings badge, and IQD estimate immediately (client-side, no reload), wired to existing product/price data.
- **FR-014**: Checkout MUST present a 4-step flow (Cart → Info → Payment → Confirmation) with a live order summary that recomputes subtotal, discount, and total (USD + IQD) from cart items/quantities; the card form appears only when Card is selected.
- **FR-015**: Product detail MUST provide tabs (Description / Features / FAQ / Reviews) showing one panel at a time, with the FAQ as an expand/collapse accordion, plus related products reusing the shared product card.
- **FR-016**: Order detail MUST show each purchased item's activation code masked by default with reveal/hide and copy-to-clipboard, plus a vertical order timeline.
- **FR-017**: A single shared product-card treatment MUST be reused across listing, category, search, wishlist, home/featured, and related-products contexts.
- **FR-018**: Prices MUST be shown in USD with the IQD equivalent via the existing price-formatting helper reading currency/locale from the brand configuration.

#### Status semantics

- **FR-019**: Order and payment statuses MUST be displayed via consistent Cobalt status pills wherever they appear (account, admin tables, timelines, notifications).
- **FR-020**: Status display MUST preserve the existing UPPERCASE enum codes; Arabic MAY show a localized label, but the underlying code MUST NOT change.

#### Scope of screens

- **FR-021**: The redesign MUST cover all storefront screens: home, product listing (filters/sort/pagination), product detail, category, search, cart + 4-step checkout + confirmation, login, register, account (overview, orders, order detail, wishlist, addresses, profile), content pages (About, Contact, FAQ, How-it-works, Glossary, Payment methods, Privacy, Terms), the 404/not-found page, plus global header, footer, and mobile menu.
- **FR-022**: The redesign MUST cover all admin screens: admin login, dashboard overview (stat cards, revenue chart, category breakdown, recent orders), products (table + create/edit form with per-plan pricing + SEO + image upload + visibility toggles), orders (table + detail with status-change control + status-history timeline + internal note), customers (list + detail), categories, notifications, and settings, plus the dark admin sidebar and topbar.
- **FR-023**: Admin charts MUST adopt the Cobalt palette and mirror appropriately in RTL.

#### Constraints (must NOT change)

- **FR-024**: The redesign MUST NOT alter routes/URLs, API endpoints, data models, enum values, services, or stores; it changes presentation/markup only and reuses existing component logic.
- **FR-025**: Brand strings (name, tagline, currency, locale, support, legal URLs) MUST continue to come from the single brand configuration and MUST NOT be hardcoded; the fixed SoftoDev WhatsApp/contact number and social links MUST be preserved.
- **FR-026**: The redesign MUST be implementable within the existing technology stack without introducing new heavy UI dependencies; the reference HTML prototypes and their runtime MUST NOT be shipped.
- **FR-027**: The Iraq governorate/city address system MUST be preserved (restyled, not replaced).

#### Quality

- **FR-028**: Interactive elements MUST provide subtle, fast micro-interactions defined by motion tokens, and decorative motion MUST respect a reduced-motion preference.
- **FR-029**: The light theme MUST meet AA contrast on text/UI, provide visible keyboard focus, keep mobile touch targets comfortable, and keep drawers/modals/menus/tabs/accordions keyboard-operable.
- **FR-030**: Empty and loading states MUST use the shared empty-state and skeleton patterns rather than blank or layout-shifting screens.

### Key Entities *(include if feature involves data)*

No new business data is introduced. The entities are the **Cobalt design-system definitions** that screens consume; order/product/user/etc. models are unchanged.

- **Cobalt color tokens**: bg-base `#F7F8FA`, surface `#FFFFFF`, elevated `#F3F4F6`, border `#EAECEF`, border-strong `#D6DAE1`; text `#111827` (headings `#0B1220`) / secondary `#4B5563` / muted `#9097A1`; accent `#2563EB`, accent-hover `#1D4ED8`, accent-subtle `#E8F0FE`, cyan `#06B6D4`; dark surface gradient `#0B1220`→`#1E2A44`; success `#16A34A` (`#E7F6EE`), warning/star `#F59E0B` (`#FEF3C7`), error `#EF4444`/`#DC2626` (`#FEECEC`).
- **Typography tokens**: Latin/numbers = Hanken Grotesk; Arabic body = IBM Plex Sans Arabic; Arabic headings = Cairo; mono = JetBrains Mono. Scale: display 42 / h1 28–34 / h2 24–28 / h3 18–22 / body-lg 16 / body 14.5 / small 13 / xs 12 / micro 11; headings `letter-spacing:-0.01em`, body line-height 1.7 (Arabic 1.85); prices LTR + tabular.
- **Shape, depth & motion tokens**: radius chips/inputs 8 / buttons 10 / cards 14–16 / panels 20 / pill 999; shadows sm/md/lg + accent + focus ring `0 0 0 3px rgba(37,99,235,.16)`; durations 120/180/260ms; card hover lift `translateY(-3px)`, button active `translateY(1px)`.
- **Spacing scale**: 8px base (4/8/12/16/24/32/48/64).
- **Custom icon set**: ~40 named line/solid SVG icons replacing the prior icon library (e.g., bolt, shield, cart, search, check, heart, star, user, chevron, etc.); category mapping AI→sparkle, Design→layers, Video→video, Learning→book.
- **Component primitives**: button (accent/dark/outlined/ghost), input/form control, card (+hover), status pill, table, modal/drawer, tabs, accordion, toast/inline alert, pagination, empty state, skeleton — each reused across screens.
- **Status-pill semantic mapping**: each order status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED) and payment status (PENDING, PAID, FAILED, REFUNDED) maps to a defined Cobalt color; codes stay UPPERCASE, Arabic labels are display-only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of in-scope screens (all storefront + admin screens in FR-021/FR-022) render in the Cobalt light system in both Arabic (RTL) and English (LTR).
- **SC-002**: 100% of color, typography, spacing, radius, shadow, and motion values used in redesigned screens come from the Cobalt tokens (zero ad-hoc values introduced by the redesign; zero leftover dark-theme/Voltage colors).
- **SC-003**: A reviewer switching any redesigned screen between Arabic and English observes correct mirroring (layout, icons, alignment) with zero broken/clipped/overlapping layouts.
- **SC-004**: On every storefront conversion surface (home, product), the four core trust cues are visible above the fold.
- **SC-005**: The monthly/yearly plan toggle updates price, period, savings, and IQD estimate on home and product with no page reload, for every multi-plan product.
- **SC-006**: The checkout completes the 4-step flow (Cart → Info → Payment → Confirmation) with a live order summary whose totals (USD + IQD) recompute from cart items/quantities.
- **SC-007**: Every purchased item on order detail can reveal/hide and copy its activation code; codes are masked by default.
- **SC-008**: Every order/payment status uses the consistent Cobalt pill, and 100% of existing enum codes remain unchanged.
- **SC-009**: 100% of icons across the app come from the single custom icon set (zero emoji, zero leftover third-party icons).
- **SC-010**: Zero changes to routes/URLs, API endpoints, data models, enum values, services, or stores result from the redesign (verified by diff review).
- **SC-011**: Prices on every product-bearing screen show USD + IQD via the existing helper and stay LTR/tabular in RTL.
- **SC-012**: A single shared product-card and a single shared status-pill component are reused everywhere they apply (no divergent duplicates).
- **SC-013**: The redesigned UI meets AA contrast on the light theme, exposes a visible keyboard focus indicator, and keeps mobile touch targets at a comfortable minimum size.
- **SC-014**: At phone width, the full home → product → cart → 4-step checkout → confirmation journey is usable (stacking, collapsing sidebars, working sticky CTAs) in both directions.
- **SC-015**: Empty and loading states across lists/search/tables use the shared empty-state and skeleton patterns.

## Assumptions

- **Visual source of truth**: The Cobalt handoff bundle (`design_handoff_softodev_redesign/`) is authoritative. `globals.css` and `Icon.tsx` are production-ready drop-ins; the `references/*.dc.html` prototypes (and `support.js` runtime) are visual reference only and are NOT shipped.
- **Drop-in tokens**: The provided `globals.css` keeps the same token names as the current `src/app/globals.css`, so replacing it re-skins existing utility classes (`bg-bg-base`, `text-text-primary`, `.btn-accent`, `.input`, `.tag`, `.card`, …) to the light palette automatically.
- **Replaces Voltage**: This redesign fully replaces the dark Voltage theme (light-only). A dark/light toggle is out of scope.
- **Stack unchanged**: Next.js 16 / React 19 / Tailwind v4 / Prisma / Zustand stay as-is; the live single-app structure under `src/` is ground truth. Logic in services/stores/API is reused, not rewritten.
- **Fonts via existing mechanism**: Fonts load via `next/font` (Hanken Grotesk, IBM Plex Sans Arabic, Cairo, JetBrains Mono); the prior Space Grotesk/Inter wiring is removed.
- **Custom Icon replaces lucide-react**: `Icon.tsx` is added under the components UI folder and lucide-react usages are migrated to it; lucide-react may remain installed but is no longer used in redesigned screens.
- **Bilingual mechanism exists**: The store already supports Arabic/English with a language toggle and RTL; the prototypes' in-page AR/EN + Desktop/Mobile toggle is a prototype aid only and is NOT built.
- **New interactions are presentation-layer**: Plan toggle, 4-step checkout, tabs/accordion, and activation-code reveal use local UI state over existing data/stores; no new backend.
- **Discount/exchange display**: The prototypes show a 10% promo discount and IQD ≈ USD × ~1310 in summaries; final discount rules and the exchange rate come from existing config/logic, not hardcoded by the redesign.
- **Out of scope**: New business capabilities (real payment gateway, email/notification delivery, reviews persistence, coupon engine) are not part of this redesign; it is UI/UX only.

## Dependencies

- The Cobalt handoff bundle (`design_handoff_softodev_redesign/` — `globals.css`, `Icon.tsx`, and the `references/` prototypes) must remain available as the source of truth during implementation.
- The existing brand configuration and `formatPrice()` helper remain the source for brand strings and price formatting.
- The existing language/RTL mechanism, cart/wishlist stores, and product/order services remain available for the redesign to restyle and wire into.
