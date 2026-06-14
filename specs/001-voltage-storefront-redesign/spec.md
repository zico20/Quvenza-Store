# Feature Specification: Voltage Storefront & Admin Redesign

**Feature Branch**: `001-voltage-storefront-redesign`

**Created**: 2026-06-14

**Status**: Draft

**Input**: User description: "Fetch this design file, read its readme, and implement the relevant aspects of the design. Implement: Store Index.dc.html" — applying the "Voltage" deep-tech design system (handoff bundle from Claude Design) across the softodeviq storefront and admin dashboard.

## Overview

A complete visual redesign of the **softodeviq** digital-subscriptions store. The redesign replaces the current "Graphite + Orange" visual layer with a refined, cohesive design system called **"Voltage"** — a near-black, high-contrast dark theme with an electric-orange accent and a plasma-cyan trust/tech cue. The redesign is delivered as a single, consistently-applied system spanning every customer-facing storefront screen and every admin dashboard screen.

The change is **visual and experiential only**. Business logic, data shapes, API contracts, routes, and enum values are not changed. Every screen must remain flawless in both **Arabic (RTL, primary)** and **English (LTR)**.

The redesign exists to increase buyer trust and conversion: above-the-fold authenticity, instant-delivery, warranty, and live-support cues; a frictionless add-to-cart and checkout; and visible payment-method trust signals — the things an Iraqi digital-goods buyer needs to see before purchasing.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trust-first storefront that drives a confident purchase (Priority: P1)

A first-time visitor lands on the home page, immediately understands what the store sells and why it is safe to buy, browses subscriptions, opens a product, and adds it to the cart — all within a single cohesive, premium-feeling visual experience that signals authenticity and instant delivery at every step.

**Why this priority**: This is the core conversion path and the primary reason for the redesign. Trust and conversion are the #1 business driver; the home page, product card, product detail, and cart drawer are where buying decisions are made. If only this slice ships, the store already delivers a markedly more trustworthy, conversion-oriented experience.

**Independent Test**: Can be fully tested by loading the home page, scrolling through hero/trust-strip/featured/categories/how-it-works, opening a product detail page, and adding an item to the cart drawer — verifying the new visual system, trust signals (authenticity, 30-minute delivery, warranty, support, accepted payment methods), and pricing display (USD + IQD) appear consistently. Delivers a complete, visibly upgraded shopping journey on its own.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page, **When** the page loads, **Then** the hero presents the store's value proposition with prominent trust cues (authenticity guarantee, instant/30-minute delivery, warranty, live support) and a clear primary call-to-action, styled in the Voltage system.
2. **Given** a visitor viewing any product, **When** they look at the price, **Then** the price is shown in USD with the IQD equivalent, formatted via the existing price helper and rendered left-to-right even in RTL layout.
3. **Given** a visitor on a product card anywhere (home, listing, category, search, wishlist, related), **When** they interact with it, **Then** the card uses one consistent visual treatment with a clear add-to-cart affordance and visible stock/badge state.
4. **Given** a visitor who adds an item to the cart, **When** the cart drawer opens, **Then** it slides over the page, shows the line items, totals (USD + IQD), and a clear checkout call-to-action, with the slide-over mirroring correctly in RTL.
5. **Given** any storefront page, **When** the trust strip and accepted-payment-methods area render, **Then** they display the fixed payment methods (ZainCash, FastPay, AsiaHawala, Cash on Delivery) and the fixed support channels (WhatsApp, Telegram).

---

### User Story 2 - Flawless bilingual (Arabic-first RTL + English LTR) experience (Priority: P1)

An Arabic-speaking buyer uses the store entirely in Arabic with a right-to-left layout that feels native — not a translated afterthought — while an English-speaking buyer gets full left-to-right parity. Toggling language flips the layout direction cleanly across every screen.

**Why this priority**: Arabic is the primary language and RTL is the primary layout direction for this Iraqi market. A redesign that is not flawless in RTL fails its primary audience. This is co-equal with the conversion path (P1) because it applies to every screen in Story 1 and beyond.

**Independent Test**: Can be tested by switching the store to Arabic and confirming that every key screen mirrors correctly — layout direction, icon/chevron orientation, navigation, drawers/modals, and text alignment — while prices and any Latin/numeric runs stay left-to-right and legible. Delivers a verifiably first-class Arabic experience.

**Acceptance Scenarios**:

1. **Given** the store set to Arabic, **When** any redesigned screen renders, **Then** the entire layout mirrors right-to-left, including navigation, cards, sidebars, drawers, and form fields.
2. **Given** an RTL screen with directional icons (chevrons, arrows, "next"/"previous" affordances), **When** it renders, **Then** those icons are flipped to point in the correct reading direction.
3. **Given** an RTL screen showing a price or other inherently left-to-right content, **When** it renders, **Then** that content stays left-to-right and correctly aligned within the mirrored layout.
4. **Given** Arabic content, **When** it renders, **Then** Arabic text uses an Arabic-appropriate typeface with comfortable weight and line-height on the dark background (not a bolted-on Latin font).
5. **Given** a user toggling the language control in the header, **When** they switch language, **Then** the layout direction and all labels update consistently with no broken or clipped layouts.

---

### User Story 3 - Cohesive design system applied consistently across all screens (Priority: P2)

A buyer or admin moving between any two screens — listing, category, search, checkout, account/orders, content pages, and the full admin dashboard — experiences one consistent system: the same buttons, inputs, cards, status pills, tables, modals, drawers, toasts, empty states, and skeleton loaders, with the same spacing rhythm, color semantics, and motion.

**Why this priority**: Consistency is what makes a redesign read as "one product" rather than a patchwork. It builds on the P1 primitives (cards, trust cues, RTL) by extending the same system to the remaining 30+ screens, including the data-dense admin. It is P2 because the highest-value conversion surfaces (P1) deliver value first, but full coverage is required for the redesign to be considered complete.

**Independent Test**: Can be tested by visiting each screen group (storefront listing/category/search, product detail, cart/checkout/success, auth, account profile/orders/order-detail/addresses/wishlist, content pages, admin dashboard and management screens, plus mobile and states/feedback) and confirming each uses the shared component set and tokens consistently — same status-pill semantics, same table style, same empty/loading states.

**Acceptance Scenarios**:

1. **Given** the admin dashboard, **When** it renders, **Then** KPI cards, the revenue chart, the order-status donut, the sales-by-category bars, recent orders, top products, and the low-stock alert all use the Voltage surfaces, colors, and chart treatment, and mirror correctly in RTL.
2. **Given** any data table (admin products/orders/customers/categories/notifications), **When** it renders, **Then** it uses one consistent table style with legible rows, clear status pills, and consistent row actions.
3. **Given** an order or payment status shown anywhere (storefront account, admin tables, order timeline, notifications), **When** it renders, **Then** its status pill uses consistent color semantics, the underlying status codes remain the existing UPPERCASE enum values, and Arabic shows a localized label while the code stays unchanged.
4. **Given** any list/search/orders view with no results, **When** it renders an empty state, **Then** it uses the shared empty-state pattern with an appropriate message and recovery action.
5. **Given** any screen loading data, **When** content is pending, **Then** a shared skeleton-loader pattern is shown rather than a blank or layout-shifting screen.
6. **Given** any user action that needs feedback (e.g., add-to-cart, save, error), **When** it completes, **Then** feedback uses the shared toast/inline-alert pattern in the correct semantic color.

---

### User Story 4 - Responsive, mobile-first journey (Priority: P3)

A buyer on a phone gets a layout built for small screens: a stacked hero, prominent search, trust chips above the fold, a 2-column product grid, a slide-over mobile menu, a product detail with a sticky add-to-cart bar, and a mobile checkout with a sticky pay bar — all with comfortable touch targets, in both RTL and LTR.

**Why this priority**: A large share of the Iraqi audience shops on mobile, so responsive behavior is important — but the desktop conversion path and bilingual correctness (P1) and system consistency (P2) come first. Mobile is P3 because it refines and extends the same system to small screens.

**Independent Test**: Can be tested at a phone-width viewport by walking the home → product → cart → checkout → success path, opening the slide-over menu, and confirming layouts stack appropriately, touch targets are comfortable, sticky bars work, and everything mirrors correctly in RTL.

**Acceptance Scenarios**:

1. **Given** a phone-width viewport, **When** the home page renders, **Then** the hero stacks, search stays prominent, trust chips appear above the fold, categories scroll horizontally, and the product grid collapses to two columns.
2. **Given** a phone-width viewport, **When** the user opens the menu, **Then** a slide-over/full-screen navigation appears with account, language toggle, and support links, mirroring in RTL.
3. **Given** a phone-width product detail, **When** the user scrolls, **Then** a sticky add-to-cart bar remains accessible.
4. **Given** a phone-width checkout, **When** the user proceeds, **Then** a sticky pay bar with the running total remains visible, followed by an order-success screen with the 30-minute activation cue.
5. **Given** any interactive element on mobile, **When** the user taps it, **Then** the touch target is comfortably sized for finger input.

---

### Edge Cases

- **Direction switch mid-session**: When a user toggles language on any screen, the layout must re-mirror without broken, clipped, or overlapping elements, and without losing their place.
- **Long Arabic strings and long product names**: Text must wrap gracefully (titles, badges, table cells) in both directions without overflowing cards or breaking alignment.
- **Mixed-direction content**: Prices, numbers, and Latin brand names embedded in Arabic copy must remain left-to-right and correctly positioned.
- **Status values with no obvious color**: Every order/payment status enum value must map to a defined pill style; an unmapped status must still render legibly with a safe default rather than an unstyled or invisible pill.
- **Empty and loading states**: Empty cart, no search results, no orders, empty wishlist, and any pending data must render the shared empty/skeleton patterns, including in RTL.
- **Out-of-stock / unavailable products**: Product cards and detail pages must clearly communicate unavailable state without breaking the layout.
- **Discounted prices**: When a compare-at price exists, the discount must be shown consistently (e.g., a discount badge and the original vs. current price) across cards and detail.
- **Accessibility under the dark theme**: Text and interactive elements must remain legible and distinguishable, with visible focus indication for keyboard users and clear hover/active feedback.
- **Reduced-motion preference**: Decorative motion (glows, transitions) should respect a user's reduced-motion preference rather than forcing animation.

## Requirements *(mandatory)*

### Functional Requirements

#### Design system foundation

- **FR-001**: The product MUST adopt a single named design system ("Voltage") whose color palette, typography scale, spacing rhythm, corner radii, elevation/shadows, and motion durations/easings are defined as reusable design tokens and used consistently — no ad-hoc one-off color or spacing values in screens.
- **FR-002**: The visual theme MUST be a near-black dark theme using the Voltage palette: a layered set of dark surfaces, an electric-orange primary accent, a plasma-cyan secondary accent for tech/trust cues, and defined success/warning/error semantic colors (see Key Entities for exact values).
- **FR-003**: Typography MUST use a strong display typeface for headings, a clean body typeface for Latin text, and an Arabic-appropriate typeface for Arabic text, applied via a defined, consistent type scale.
- **FR-004**: The system MUST define and reuse a consistent component library across all screens: buttons (variants, sizes, states), inputs and form controls, cards, badges/status pills, data tables, modals/drawers, toasts/inline alerts, tabs, pagination, empty states, and skeleton loaders.
- **FR-005**: Spacing MUST follow a consistent 8px-based rhythm across all screens.

#### Bilingual / RTL

- **FR-006**: Every redesigned screen MUST render correctly in both Arabic (RTL) and English (LTR), with Arabic treated as a first-class primary experience.
- **FR-007**: When the layout direction is RTL, the entire layout (navigation, grids, sidebars, drawers, modals, forms) MUST mirror, and directional icons (chevrons/arrows) MUST flip to the correct reading direction.
- **FR-008**: Prices, numeric runs, and embedded Latin content MUST remain left-to-right and correctly aligned even within an RTL layout.
- **FR-009**: Switching the language toggle MUST update both labels and layout direction consistently across the screen with no broken layouts.

#### Conversion & trust

- **FR-010**: Storefront screens MUST present trust signals prominently — authenticity guarantee, instant/30-minute delivery, warranty, and live support — above the fold on key conversion surfaces (home, product detail).
- **FR-011**: The accepted payment methods (ZainCash, FastPay, AsiaHawala, Cash on Delivery) MUST be displayed as trust signals on relevant storefront surfaces, and the support channels (WhatsApp, Telegram) MUST be presented as fixed, prominent contact options.
- **FR-012**: A single product-card treatment MUST be reused across listing, category, search, wishlist, home/featured, and related-products contexts.
- **FR-013**: Prices MUST be shown in USD with the IQD equivalent, formatted via the existing price-formatting helper that reads currency/locale from the brand configuration.
- **FR-014**: The cart MUST be presented as a slide-over drawer that mirrors correctly in RTL and shows line items, totals (USD + IQD), and a clear checkout action.

#### Status semantics

- **FR-015**: Order and payment statuses MUST be displayed via consistent, color-coded status pills wherever they appear (storefront account, admin tables, order timeline, notifications).
- **FR-016**: Status display MUST preserve the existing UPPERCASE enum codes unchanged; Arabic MAY show a localized human-readable label, but the underlying status code/value MUST NOT change.

#### Scope of screens

- **FR-017**: The redesign MUST cover all storefront screens: home, product listing (with filters, sort, pagination), product detail, category, search, cart and cart drawer, checkout (info → payment → success), login, register, account (profile, orders list, order detail with status timeline, addresses, wishlist), and content pages (About, Contact, FAQ, How-it-works, Glossary, Payment methods, Privacy, Terms), plus global header, footer, and mobile menu.
- **FR-018**: The redesign MUST cover all admin screens: admin login, dashboard overview (KPI cards, revenue chart, order-status donut, sales-by-category bars, recent orders, top products, low-stock alert), products (table + create/edit form + image upload), orders (table with filters/search/export + detail with status timeline + status-change modal), categories, customers (list + detail), notifications (table + filters), and settings, plus the global admin sidebar and topbar (page title, notifications bell with unread badge, user menu).
- **FR-019**: Admin charts MUST adopt the Voltage surfaces and accent colors and MUST mirror appropriately in RTL (e.g., trend direction reads correctly).

#### Constraints (must NOT change)

- **FR-020**: The redesign MUST NOT alter routes, API endpoints, data models, or enum values; it changes the presentation layer only.
- **FR-021**: All brand strings (store name, tagline, currency, locale, support details, legal URLs) MUST continue to come from the single brand configuration source and MUST NOT be hardcoded into screens.
- **FR-022**: The fixed SoftoDev contact details (WhatsApp/contact number) and social links MUST be preserved exactly as they currently are.
- **FR-023**: The redesign MUST be implementable within the project's existing technology stack without introducing heavy new UI dependencies.

#### Quality

- **FR-024**: Interactive elements MUST provide subtle, fast micro-interactions (hover, focus, add-to-cart feedback, drawer/modal transitions) defined by the system's motion tokens, and decorative motion MUST respect a user's reduced-motion preference.
- **FR-025**: The dark theme MUST meet AA-level text/UI contrast, provide visible keyboard focus indication, keep mobile touch targets comfortably sized, and keep drawers/modals/menus operable by keyboard.
- **FR-026**: Empty states and loading states MUST use the shared empty-state and skeleton-loader patterns rather than blank screens or layout-shifting content.

### Key Entities *(include if feature involves data)*

This feature does not introduce new business data. The "entities" here are the **design-system definitions** that screens consume. The redesign does not change order, product, user, or any other data model.

- **Voltage color tokens**: bg-base `#0A0A0C`, surface `#121216`, elevated `#1A1A20`, elevated-2 `#232329`, border `#26262E`, border-strong `#36363F`; text `#F7F7F8`, text-secondary `#A6A6AE`, text-muted `#6C6C76`; accent `#FF7A33`, accent-hi `#FF9357`, plasma `#19D4E8`; success `#34D399`, warning `#FBBF24`, error `#FB7185`.
- **Typography tokens**: display = "Space Grotesk", body/sans = "Inter", arabic = "Cairo"; defined type scale (display, H1, H2, body, small) with Arabic/Latin handling.
- **Shape & depth tokens**: radius sm 6px / md 10px / lg 16px / xl 20px / full (pills); elevation sm/md/lg plus an accent "glow" shadow (`0 0 24px rgb(255 122 51 / .5)`).
- **Motion tokens**: durations fast 120ms / base 180ms / slow 260ms; easings ease-out `cubic-bezier(.16,1,.3,1)` and spring `cubic-bezier(.34,1.56,.64,1)`.
- **Spacing scale**: 8px base (4, 8, 16, 24, 32, 48).
- **Component primitives**: button, input/form control, card, status pill, table, modal/drawer, toast/inline alert, tabs, pagination, empty state, skeleton loader — each with defined variants/states reused across screens.
- **Status-pill semantic mapping**: each order status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED) and payment status (PENDING, PAID, FAILED, REFUNDED) maps to a defined pill color/treatment; codes stay UPPERCASE, Arabic labels are localized for display only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of in-scope screens (all storefront and admin screens listed in FR-017 and FR-018) render in the Voltage design system in both Arabic (RTL) and English (LTR).
- **SC-002**: 100% of color, typography, spacing, radius, shadow, and motion values used in redesigned screens come from the defined design tokens (zero ad-hoc/arbitrary values introduced by the redesign).
- **SC-003**: A reviewer switching any redesigned screen between Arabic and English observes correct mirroring (layout, icons, alignment) with zero broken, clipped, or overlapping layouts.
- **SC-004**: On every storefront conversion surface (home, product detail), all four core trust cues — authenticity, instant/30-minute delivery, warranty, live support — are visible above the fold.
- **SC-005**: Every order and payment status displayed anywhere uses the consistent status-pill treatment, and 100% of the existing status enum codes remain unchanged.
- **SC-006**: Zero changes are made to routes, API endpoints, data models, or enum values as a result of the redesign (verified by diff review of those areas).
- **SC-007**: Prices on every product-bearing screen display USD and the IQD equivalent, formatted via the existing price helper, and remain left-to-right in RTL.
- **SC-008**: A single shared product-card and a single shared status-pill component are reused everywhere they apply (no divergent duplicates introduced).
- **SC-009**: The redesigned UI meets AA contrast on text and key UI elements, exposes a visible keyboard focus indicator on interactive elements, and keeps mobile touch targets at a comfortable minimum size.
- **SC-010**: At a phone-width viewport, the full home → product → cart → checkout → success path is usable with appropriate stacking, working sticky bars, and a working slide-over menu, in both directions.
- **SC-011**: Empty and loading states across lists, search, and tables use the shared empty-state and skeleton patterns rather than blank or shifting screens.

## Assumptions

- **Visual source of truth**: The "Voltage" design from the Claude Design handoff bundle (`Store Index.dc.html` and its linked screen files, anchored by the `SoftoDev Redesign.dc.html` design-system page) is the authoritative visual reference. The exported HTML/CSS are prototypes; the goal is to recreate the visual output in the project's real components, not to copy prototype markup verbatim.
- **Stack alignment**: The live project already matches the design brief's assumed stack (Next.js 16 / React 19 / Tailwind CSS v4 with `@theme` tokens, `lucide-react`, `recharts`), so the design's Tailwind v4 `@theme` token block can be adopted as the token foundation. (Note: this differs from the older monorepo description in `CLAUDE.md`; the live single-app structure under `src/` is treated as ground truth.)
- **Logic untouched**: Only the presentation layer changes. No routes, API endpoints (`/api/v1/*`), data models, or enum values are modified. Status enums remain UPPERCASE.
- **Config-driven branding**: Brand strings and `formatPrice()` continue to read from the existing `store.config.ts` / `admin.config.ts`; the redesign does not hardcode brand strings.
- **Bilingual mechanism exists**: The store already supports an Arabic/English experience with a language toggle and RTL handling; the redesign restyles within that mechanism rather than introducing a new internationalization system.
- **Dark theme only**: A light theme is out of scope for this redesign (the design system is dark-first); a light variant can be a future pass.
- **Imagery placeholders**: Where final product/brand imagery is unavailable, branded placeholder treatments (gradients, logo lockups, drawn marks) are acceptable, consistent with the prototype's approach.
- **Mobile = responsive of the same screens**: Mobile is delivered as responsive behavior of the redesigned screens (stacking, sticky bars, slide-over menu), not as a separate native app.
- **Out of scope**: New features or business capabilities (real payment gateway, email notifications, reviews, coupons, etc.) are not part of this redesign; it is UI/UX only.

## Dependencies

- The Claude Design handoff bundle (design files, screenshots, and the design-system/token page) must remain available as the visual reference during implementation.
- The existing brand configuration and `formatPrice()` helper must remain the source for brand strings and price formatting.
- The existing language/RTL mechanism must remain available for the redesign to restyle within.
