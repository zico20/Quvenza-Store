# Handoff: SoftoDev Storefront + Admin Redesign (Cobalt, light)

## Overview
A full visual redesign of the **SoftoDev** store — an Iraqi digital‑subscriptions
shop (ChatGPT Plus, Canva Pro, CapCut, Coursera, …). The redesign replaces the old
dark **"Voltage"** theme (near‑black + electric orange) with a **light, minimal,
Stripe‑inspired identity** called **Cobalt** (cobalt blue accent + neutral grays).
Scope: the entire storefront **and** the admin panel. Bilingual (Arabic RTL +
English LTR), mobile‑first, conversion‑focused.

**The tech stack does not change.** This is a design/UX layer only. Keep the same
Next.js 16 / React 19 / Tailwind v4 / Prisma / Zustand stack, the same routes/URLs,
and the same data logic (services, stores, API calls). Reuse the existing components
and their logic; change only styling/markup.

## About the design files
The files in `references/` are **design references created in HTML** — interactive
prototypes that show the intended look and behavior. **They are NOT production code
to copy.** They use a small custom render runtime (`support.js`) and inline styles so
they can stream in a preview tool; do **not** ship them.

Your task: **recreate these designs inside the existing Next.js app**, using its
established patterns (App Router, server components, the existing services/stores,
Tailwind v4, `next/font`, `next/image`, `lucide-react` → replace with the custom
`Icon` component below). Two artifacts are production‑ready and meant to be used
directly:
- **`globals.css`** — the Cobalt theme as Tailwind v4 `@theme` tokens. It keeps the
  **same token names** as your current `src/app/globals.css`, so it is a near drop‑in
  replacement: existing utility classes (`bg-bg-base`, `text-text-primary`,
  `border-border`, `.btn-accent`, `.input`, `.tag`, `.card`, …) keep working and just
  render the new light palette.
- **`Icon.tsx`** — the 40‑icon custom SVG set as a typed React component. Drop it at
  `src/components/ui/Icon.tsx`.

## Fidelity
**High‑fidelity (hifi).** Final colors, typography, spacing, radii, shadows and
interactions are all specified here and in `globals.css`. Recreate the UI
pixel‑accurately using the codebase's components and Tailwind utilities.

---

## How to apply the theme (do this first)
1. **Replace** `src/app/globals.css` with the provided `globals.css`. (It mirrors your
   existing token names; review the `@layer components` block — `.btn-accent` is now
   solid cobalt, `.btn-primary` is now the dark/neutral button, `.input` focus ring is
   blue, `.tag-*` are light.)
2. **Fonts** (`src/app/layout.tsx`, via `next/font/google`):
   - `Hanken_Grotesk` → CSS var `--font-hanken` (Latin UI + numbers)
   - `IBM_Plex_Sans_Arabic` → `--font-plex-ar` (Arabic body)
   - `Cairo` → `--font-cairo` (Arabic headings)
   - `JetBrains_Mono` → used for `.mono` / activation codes / SKUs
   Remove the old Space Grotesk / Inter wiring. Apply the vars on `<html>`/`<body>`.
3. **Icons**: add `Icon.tsx`, then replace `lucide-react` usages with
   `<Icon name="…" />`. Mapping of the icons used: see "Assets" below.
4. Keep `dir="rtl"` / `lang` switching exactly as today (the design assumes both).

---

## Design tokens (exact values)

### Color — Brand (Cobalt)
| Token | Hex | Use |
|---|---|---|
| accent / primary | `#2563EB` | primary buttons, links, active states |
| accent‑hover | `#1D4ED8` | hover/pressed |
| accent‑subtle | `#E8F0FE` | soft fills, selected chips, icon tiles |
| cyan (support) | `#06B6D4` | "instant" / trust cues; soft `#E0F7FB` |

### Color — Neutrals
| Token | Hex | Use |
|---|---|---|
| bg‑base (page) | `#F7F8FA` | page background |
| bg‑surface (card) | `#FFFFFF` | cards, panels, header |
| bg‑elevated | `#F3F4F6` | hover, chips, inputs‑muted |
| border | `#EAECEF` | hairline borders |
| border‑strong | `#D6DAE1` | input borders, dividers |
| text‑primary | `#111827` | body text (headings `#0B1220`) |
| text‑secondary | `#4B5563` | secondary text |
| text‑muted | `#9097A1` | captions, placeholders |
| dark surface | `#0B1220` → `#1E2A44` | footer, admin sidebar, dark cards (gradient) |

### Color — Semantic
| Token | Hex | Soft bg |
|---|---|---|
| success | `#16A34A` | `#E7F6EE` |
| warning / ★ rating | `#F59E0B` | `#FEF3C7` |
| error | `#EF4444` / `#DC2626` | `#FEECEC` |

### Typography
- **Latin + numbers:** Hanken Grotesk. **Arabic body:** IBM Plex Sans Arabic.
  **Arabic headings:** Cairo (700–800). **Mono:** JetBrains Mono.
- Scale (px): display 42 / h1 28–34 / h2 24–28 / h3 18–22 / body‑lg 16 / body 14.5 /
  small 13 / xs 12 / micro 11. Headings `letter-spacing:-0.01em`; body line‑height
  1.7 (Arabic 1.85). Prices/numbers always LTR + tabular (`.num` / `.ltr-nums`).

### Radius · Shadow · Spacing
- Radius: chips/inputs `8`, buttons `10`, cards `14–16`, panels `20`, pill `999`.
- Shadow: sm `0 1px 2px rgba(16,24,40,.04)`, md `0 4px 14px rgba(16,24,40,.08)`,
  lg `0 14px 36px rgba(16,24,40,.12)`, accent `0 8px 20px rgba(37,99,235,.28)`,
  focus ring `0 0 0 3px rgba(37,99,235,.16)`.
- Spacing: 8px base (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64).
- Card hover (products/categories): `translateY(-3px)` + shadow‑lg + border `#D6DAE1`,
  transition `.18s ease`. Buttons: `transform: translateY(1px)` on `:active`.

---

## Screens / Views → routes

Each reference maps 1:1 to a real route. Recreate markup with your components; the
prototypes are RTL‑Arabic by default with an in‑prototype AR/EN + Desktop/Mobile
toggle (that toggle is a **prototype aid only — do not build it**; use your real i18n
+ responsive system).

### Storefront
| Reference file | Route | Notes |
|---|---|---|
| `Home.dc.html` | `/` | Announcement bar; sticky header; hero (headline + CTAs + trust stars + dark "active subscriptions" visual card); 4 value‑props; categories (4); bestsellers grid (`ProductCard`); "How it works" 3 steps; **plan section** with monthly/yearly segmented toggle that swaps price; reviews (3); CTA band; footer. |
| `Products.dc.html` | `/products` | Left filter sidebar (category radio list w/ counts, plan‑type chips, price range, "instant only" toggle, clear) → collapses to a horizontal chip bar on mobile; sort `<select>`; results count; 3–4‑col `ProductCard` grid; empty state; pagination. Category + plan + sort filter the list live. |
| `Product.dc.html` | `/products/[slug]` | Gallery (big gradient tile + thumbs + trust strip); info column: category kicker, title, rating + reviews + sold, short desc, **plan selector** (monthly/yearly radio cards updating price), price box w/ qty stepper + Add to cart / Buy now / wishlist, "what you get" list; tabs **Description / Features / FAQ / Reviews** (FAQ = accordion, Reviews = rating bars + list); related products (4). |
| `Category.dc.html` | `/category/[slug]` | Category hero banner (icon, name, count, description, category‑tinted gradient); category chips; sort; product grid. |
| `Checkout.dc.html` | cart + `/checkout` | 4‑step flow: **Cart → Info → Payment → Confirmation** with a sticky live order summary (items, promo, subtotal, discount, total in USD + IQD, trust badges). Payment = ZainCash / Asia Hawala / Card (card form appears when Card selected). Includes cart empty state. |
| `Search.dc.html` | `/search` | Prominent search field (live filter by name), suggestion chips, results count, grid, and a "no results" empty state. |
| `About.dc.html` | `/about` | Hero, stat cards, mission panel, 3 value cards, CTA band, footer. |
| `NotFound.dc.html` | `not-found.tsx` (404) | Big 404, message, search field, primary/secondary CTAs, popular‑search chips. |

### Account
| Reference file | Route | Notes |
|---|---|---|
| `Account.dc.html` | `/account` (+ `/orders`, `/wishlist`, `/addresses`) | Left nav (Overview / Orders / Wishlist / Addresses / Profile) → horizontal on mobile. Overview: 4 stat cards + active subscriptions list (status badges) + recent orders. Orders: list w/ status. Wishlist: grid. Addresses: default address card. Profile: form + change password. |
| `OrderDetail.dc.html` | `/account/orders/[id]` | Order header + status badge + invoice button; **vertical order timeline**; items list each with a **maskable activation code** (Show/Hide + copy) — key for digital delivery; "sent to email/WhatsApp" note; summary side (subtotal/discount/method/total) + support card. |
| `Auth.dc.html` | `/login` + `/register` | Split layout: dark brand panel (value props + testimonial) | form panel. Toggles between Login (email, password, forgot) and Register (name, email, phone, password, terms). Google button. Inputs have leading icons. |

### Admin (`/admin/dashboard/*`)
| Reference file | Route | Notes |
|---|---|---|
| `Admin.dc.html` | `/admin/dashboard` | Dark sidebar + topbar. **6 switchable sections**: Dashboard (4 stat cards w/ trend, 7‑bar revenue chart, category donut via `conic-gradient`, recent‑orders table), Orders (table), Products (table), Customers (table), Categories (grid), Settings (form + toggles). |
| `AdminOrder.dc.html` | `/admin/dashboard/orders/[id]` | Status badge + **status‑change `<select>`**; items; **status‑history timeline**; internal‑note box; customer card; payment summary; invoice. |
| `AdminProductForm.dc.html` | `/admin/dashboard/products/[id]` & `/new` | Basic info; **pricing per plan** (monthly/yearly price + compare); SEO (meta title/desc); image upload area; visibility toggles (active / featured). |
| `AdminCustomer.dc.html` | `/admin/dashboard/customers/[id]` | Profile card; 4 stat cards; order‑history table. |
| `AdminNotifications.dc.html` | `/admin/dashboard/notifications` | Notification list (new order / low stock / new customer / status changed) with unread highlight + "mark all read". |

`Design System.dc.html` documents colors, type, tokens, all components, states
(empty / loading‑skeleton / error / toast) and the full icon set. `Index.dc.html` is
a navigation hub linking every page. `Redesign Brief.dc.html` is the original
analysis + palette rationale.

---

## Interactions & behavior
- **Plan toggle** (Home + Product): segmented monthly/yearly control swaps the visible
  price, period, savings badge and IQD estimate. (Lifetime was intentionally removed —
  monthly + yearly only.)
- **Product filters/sort** (Products, Category, Search): pure client state filtering
  the rendered list; live, no reload. Wire to your existing query/service params.
- **Checkout stepper**: linear next/back; the order summary recomputes subtotal /
  discount (10%) / total from cart items + quantities; IQD ≈ USD × 1310.
- **Tabs / accordion** (Product): show one tab panel at a time; FAQ rows expand
  (`max-height` transition).
- **Activation code reveal** (OrderDetail): masked `••••‑••••‑••••` → real code; add a
  copy‑to‑clipboard.
- **Admin nav**: active section highlighted in accent; status `<select>` updates the
  badge color/label; settings/visibility **toggles** flip state.
- **Hover/focus/active**: cards lift; buttons darken to `accent‑hover` and depress 1px;
  inputs get the blue focus ring; keyboard `:focus-visible` = 2px cobalt outline.
- **States**: every list has empty / loading‑skeleton / error variants (see Design
  System). Toasts: dark pill (success) / white pill (info), top/!bottom‑safe.
- **Responsive**: mobile‑first. The prototypes use CSS **container queries** to reflow
  (sidebars → top bars, 4‑col → 2‑col, nav links → menu). In the app, use your normal
  Tailwind responsive breakpoints / `next/image`, lazy‑load product imagery, prefer
  CSS over JS animation.

## State management
Reuse what exists — don't introduce new libraries. Zustand stores already cover cart &
wishlist; React Query/server components for products/orders. New **local UI** state per
screen: selected plan, active filters/sort, checkout step + form, active tab, FAQ open
index, revealed activation codes, admin active section + order status + form toggles.

## Assets
- **Icons:** the custom `Icon.tsx` set (40 icons) replaces `lucide-react`. Names used:
  `bolt, shield, bank, chat, sparkle, layers, video, book, search, cart, lock, check,
  checkCircle, heart, heartFill, star, arrow, arrowLeft, chevron, chevronL, x, menu,
  user, package, pin, filter, sort, trash, plus, minus, mail, phone, tag, info, eye,
  edit, logout, clock, grid, facebook, instagram, twitter`. Category mapping: AI→`sparkle`,
  Design→`layers`, Video→`video`, Learning→`book`. No emoji anywhere.
- **Product imagery:** prototypes use gradient placeholder tiles + a brand letter‑mark
  (e.g. "GPT", "Cv"). In production use the real `product.images[0]` via `next/image`;
  keep the gradient tile as the no‑image fallback.
- **Brand:** "S" logo mark = rounded square, gradient `135deg,#2563EB→#3B82F6`.

## Files in this bundle
- `globals.css` — production Tailwind v4 theme (drop‑in).
- `Icon.tsx` — production React icon component.
- `references/*.dc.html` — the 18 design prototypes + `Design System`, `Index`,
  `Redesign Brief`, plus `support.js` (runtime) and `Icon.dc.html` so they open in a
  browser as visual reference. **Reference only — do not ship.**
