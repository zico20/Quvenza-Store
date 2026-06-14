# Full Redesign Brief — softodeviq Digital Subscriptions Store

> Paste this into Claude (Design / Artifacts) to drive a complete, professional visual redesign of the storefront and admin dashboard.

---

## ROLE

You are a **senior product designer and front-end engineer** specializing in premium e-commerce experiences for the MENA market. You have shipped polished, conversion-focused storefronts and data-dense admin dashboards. You care about typography, spacing rhythm, motion, accessibility, and bilingual (Arabic-first, RTL) design. Treat this as a real product you are responsible for — not a demo.

## OBJECTIVE

Completely **redesign the visual layer** of an existing, fully-functional digital-subscriptions e-commerce platform. The goal is a cohesive, modern, trustworthy, conversion-driven design system applied consistently across the customer storefront and the admin dashboard. **Elevate the craft to a level that would pass a design review at a top-tier product company.** Do not change business logic, data shapes, routes, or API contracts — redesign the UI/UX only.

## PRODUCT CONTEXT

- **Business**: `softodeviq` — the largest store for **authentic digital subscriptions in Iraq**. Products are activation-based digital goods (no physical shipping): ChatGPT Plus, Canva Pro, Adobe CC, Coursera Plus, CapCut Pro, Spotify Premium, YouTube Premium, Notion AI, Microsoft 365, Steam wallet/accounts, EA FC 26 coins, etc.
- **Tagline**: "Tech, curated for pros."
- **Market**: Iraq → MENA. **Arabic is the primary language and RTL is the primary layout direction**, with full English (LTR) parity. The design MUST be flawless in both directions.
- **Trust is the #1 conversion driver**: customers pay for accounts/codes and need to feel safe. Emphasize authenticity guarantees, instant activation, fast delivery (e.g. "delivered within 30 minutes"), warranty, and real support (WhatsApp/Telegram).
- **Currency**: prices shown in USD with IQD equivalent (rate ~1540 IQD/USD). Payment methods: Cash on Delivery, ZainCash, AsiaHawala, FastPay.
- **Audience**: tech-savvy young Iraqis, gamers, creators, students, freelancers.

## CURRENT TECH (KEEP — design within these constraints)

- **Next.js 16 (App Router) + React 19**, TypeScript.
- **Tailwind CSS v4** using the `@theme` directive with CSS custom properties as design tokens (see current tokens below). Deliver the new system as **Tailwind v4 `@theme` tokens + component classes**, not arbitrary inline hex values.
- Fonts via `next/font`: **Cairo** (Arabic) + **Inter** (Latin). You may propose alternative/superior font pairings (e.g. a stronger display face) but must keep robust Arabic support.
- Icons: `lucide-react`. Charts (admin): `recharts`.
- No new heavy UI dependencies unless clearly justified; prefer Tailwind + small primitives.

### Current design tokens (the baseline you are replacing/upgrading)
```
Theme: dark "Graphite" + orange accent
bg-base #0e0e10 · surface #17171a · elevated #1f1f23
text primary #f5f5f4 · secondary #a1a1a6 · muted #6b6b70
accent #ff6a2b · accent-hover #e55a1e
border #2a2a30 · border-strong #3a3a42
success #4ade80 · warning #fbbf24 · error #f87171
radius 4/6/8px · shadows sm/md/lg + accent glow
```
You may keep the dark+orange spirit or propose a refined evolution — but justify the direction and deliver a complete, named token set (color, spacing, radius, shadow, typography scale, z-index, motion).

## SCREENS IN SCOPE

**Storefront (customer):**
Home (hero slider + featured + categories), Product listing (with filters + pagination), Product detail (add-to-cart, trust badges, gallery), Category page, Search, Cart + slide-over Cart Drawer, Checkout (shipping/info → payment → success), Login, Register, Account (profile, orders list, order detail, addresses, wishlist), and content pages (About, Contact, FAQ, How-it-works, Glossary, Payment methods, Privacy, Terms). Global: Header (logo, nav, search, language toggle, cart), Footer, Mobile menu, Product card.

**Admin dashboard:**
Login, Dashboard overview (stats cards, revenue area chart, order-status donut, sales-by-category bar, recent orders, top products, low-stock alert), Products (data table + create/edit forms + image upload), Orders (data table with filters/search/export + detail with status timeline + status-change modal), Categories, Customers (list + detail), Notifications (table + filters), Settings. Global admin: Sidebar (with active states), Topbar (page title, notifications bell with unread badge, user menu).

## DELIVERABLES

1. **Design rationale** (concise): the chosen visual direction, mood, and why it fits a trust-driven Iraqi digital-goods store.
2. **Complete design system**:
   - Tailwind v4 `@theme` token set (colors incl. semantic + state, typography scale with Arabic/Latin handling, spacing, radii, shadows, motion/easing durations).
   - Component spec: buttons (variants/sizes/states), inputs & forms, cards, badges/status pills, tables, modals/drawers, toasts, tabs, pagination, empty states, skeleton loaders.
3. **Key screens as polished, production-quality React + Tailwind code** (or high-fidelity artifacts), at minimum: Home, Product detail, Product card, Cart drawer, Checkout success, Auth (login/register), and the Admin dashboard overview. Make them real and beautiful, not lorem-ipsum stubs.
4. **Responsive behavior**: mobile-first, with defined breakpoints; show mobile + desktop for the hero and product grid.
5. **RTL/LTR notes**: explicitly demonstrate how each key layout mirrors correctly in Arabic, including iconography, chevrons, and number/price alignment.

## DESIGN PRINCIPLES & QUALITY BAR

- **Trust & conversion first**: above-the-fold clarity, prominent authenticity/guarantee/instant-delivery cues, frictionless add-to-cart and checkout, visible payment-method and support trust signals.
- **Premium, restrained aesthetic**: confident type hierarchy, generous and consistent spacing rhythm (an 8px-based scale), purposeful use of the accent color, tasteful depth (shadows/borders) — avoid clutter and avoid generic "AI dashboard" look.
- **Motion with intent**: subtle, fast micro-interactions (hover, focus, add-to-cart feedback, drawer/modal transitions). Define durations/easing as tokens. Never gratuitous.
- **Accessibility**: WCAG AA contrast on the dark theme, visible focus rings, proper hit targets (≥44px on mobile), semantic structure, keyboard navigability for drawers/modals/menus.
- **Bilingual excellence**: Arabic must look first-class (correct weight/line-height for Cairo on dark backgrounds), not a bolted-on translation. Mirror layouts cleanly in RTL.
- **Data-dense admin done right**: legible tables, clear status semantics, scannable dashboard, charts that are readable and on-brand.
- **Consistency**: one system, applied everywhere. Same button, same card, same spacing logic across all 30+ screens.

## CONSTRAINTS

- Do **not** alter routes, API endpoints (`/api/v1/*`), data models, or enum values. Status enums are UPPERCASE (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED; PAID/FAILED/REFUNDED). Roles: USER/ADMIN.
- Keep the existing per-client config approach: brand strings (name, tagline, currency, locale, support, legal URLs) come from a single config file — never hardcode them in components.
- Keep prices handled as `number | string` and formatted via a `formatPrice()` helper reading currency/locale from config (show USD + IQD).
- The SoftoDev WhatsApp/contact details and social links are fixed.
- Output must be implementable with the current stack (Next.js 16 App Router, React 19, Tailwind v4, lucide-react, recharts). No proprietary design tools required to consume the result.

## OUTPUT FORMAT

1. Start with a short **Design Direction** summary (3–5 sentences) + a named palette and type scale.
2. Provide the **Tailwind v4 `@theme` token block** ready to drop into `globals.css`.
3. Provide a **component library section** with code for the core primitives.
4. Provide **full code for the priority screens** listed in Deliverables #3, each responsive and RTL-aware.
5. End with an **integration checklist** mapping your new tokens/components to the existing screens, so the rest of the 30+ pages can be migrated consistently.

Aim for production quality. Make deliberate, defensible design decisions and state them. If a trade-off exists, choose the option that maximizes trust and conversion for an Iraqi digital-subscriptions buyer, and explain why.
