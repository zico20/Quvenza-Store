# Contract: Cobalt Design System (UI Contract)

The interface every redesigned screen must conform to — the design analog of an API contract.

## 1. Token contract (drop-in `@theme`)

Screens MUST consume Cobalt tokens; no ad-hoc values, no leftover dark/Voltage colors. The authoritative `@theme` block is the bundle's `design_handoff_softodev_redesign/globals.css`, which replaces `src/app/globals.css` verbatim. It keeps the canonical token names (`--color-bg-base`, `--color-text-primary`, `--color-accent`, `--color-border`, …) so existing utilities re-skin automatically, and binds `--font-hanken` / `--font-plex-ar` / `--font-cairo` / `--font-mono`. Full values: see `data-model.md`.

## 2. Component contract

| Component | Contract |
|-----------|----------|
| **Button** | `.btn-accent` = solid cobalt (white text, accent shadow, darkens to `#1D4ED8` on hover); `.btn-primary` = dark/neutral (`#0B1220`); `.btn-secondary` = white outlined; `.btn-ghost`. Active = `translateY(1px)`. ≥44px tap target. |
| **Input / form** | White bg, `#D6DAE1` border, radius 8, blue focus ring `0 0 0 3px rgba(37,99,235,.16)`, error state, leading-icon support. RTL `text-align: start`. |
| **Card** | `.card` white, `#EAECEF` border, radius 14–16, shadow-sm; `.card-hover` lifts `translateY(-3px)` + shadow-lg + `#D6DAE1` border. |
| **ProductCard** (shared) | Real `product.images[0]` via `next/image` with gradient-tile + letter-mark fallback; category kicker, title, rating (warning star), price (USD+IQD, LTR tabular), add-to-cart, wishlist (`heart`/`heartFill`). One treatment everywhere. |
| **Status pill** (shared) | UPPERCASE enum → Cobalt color + localized label (see data-model). Pill radius full. Codes never change. |
| **Table** | White surface, hairline row borders, status pills, consistent row actions, RTL mirrored. |
| **Modal / Drawer** | Scrim, shadow-lg, slide/scale via motion tokens, keyboard operable (Esc, focus trap), RTL slide mirrored. |
| **Tabs / Accordion** | Product tabs show one panel at a time; FAQ accordion expands via `max-height`; keyboard navigable. |
| **Toast / inline alert** | Cobalt semantic colors; dark pill (success) / white pill (info) per design. |
| **Pagination** | Prev/next chevrons flip in RTL (`.rtl-flip`); current-page emphasis. |
| **Empty state** | Icon + message + recovery action (empty cart, no results, no orders, empty wishlist). |
| **Skeleton** | `.skeleton` shimmer matching real layout (no CLS), for grids/tables. |
| **Icon** | Single custom `Icon` set (`<Icon name="…" />`); no emoji, no lucide in redesigned screens. |

## 3. New interaction contract (presentation-layer only)

- **Plan toggle** (home + product): segmented monthly/yearly control swaps displayed price, period, savings badge, IQD estimate — client-side, no reload, over existing product plan data.
- **4-step checkout**: Cart → Info → Payment → Confirmation; linear next/back; live order summary recomputes subtotal/discount/total (USD+IQD) from cart items×qty; card form appears only when Card is selected.
- **Product tabs + FAQ accordion**: one tab panel visible at a time; FAQ rows expand/collapse.
- **Activation-code reveal** (order detail): masked `••••-••••-••••` → real code with reveal/hide + copy-to-clipboard; vertical order timeline.

## 4. Behavioral contract

- **Bilingual**: every screen correct in `dir=rtl` (Arabic, primary) and `dir=ltr` (English); directional icons flip; prices/numbers LTR + tabular.
- **Motion**: motion tokens; respects `prefers-reduced-motion`.
- **Accessibility**: AA contrast on light; visible `:focus-visible` ring; ≥44px touch targets; drawers/modals/menus/tabs/accordions keyboard-operable.
- **Config-driven**: brand strings via config; prices via `formatPrice()`.

## 5. Invariants this contract MUST NOT break

- No route/URL, API endpoint, data model, enum value, service, or store changes.
- Status enum codes stay UPPERCASE; Arabic labels display-only.
- SoftoDev WhatsApp/contact + social links unchanged; Iraq governorate/city address system preserved.
- No new heavy UI dependency; reference prototypes + `support.js` never shipped.
