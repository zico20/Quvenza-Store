# Phase 1 Data Model: Cobalt Design-Token Model + Icon Map

No business-data entities are introduced. This documents the Cobalt token system and the lucide→custom icon mapping that screens consume. Business models (User, Product, Order, Cart, …) are unchanged.

## Token: Color (light)

| Token (`@theme` var) | Value | Role |
|----------------------|-------|------|
| `--color-bg-base` | `#F7F8FA` | Page canvas |
| `--color-bg-surface` / `--color-surface` | `#FFFFFF` | Cards, panels, header |
| `--color-bg-elevated` / `--color-elevated` | `#F3F4F6` | Hover, chips, muted inputs |
| `--color-bg-subtle` | `#FFFFFF` | Menus, popovers |
| `--color-border` | `#EAECEF` | Hairline borders |
| `--color-border-strong` | `#D6DAE1` | Input borders, dividers |
| `--color-text-primary` / `--color-text` | `#111827` | Body text (headings `#0B1220`) |
| `--color-text-secondary` | `#4B5563` | Secondary text |
| `--color-text-muted` | `#9097A1` | Captions, placeholders |
| `--color-accent` | `#2563EB` | Cobalt — primary buttons, links, active |
| `--color-accent-hover` / `--color-accent-hi` | `#1D4ED8` | Hover/pressed |
| `--color-accent-subtle` | `#E8F0FE` (`rgba(37,99,235,.10)`) | Soft fills, selected chips, icon tiles |
| `--color-cyan` / `--color-plasma` (alias) | `#06B6D4` | "Instant"/trust cues; soft `#E0F7FB` |
| dark surface | `#0B1220` → `#1E2A44` | Footer, admin sidebar, dark brand cards (gradient) |
| `--color-success` | `#16A34A` | Success (soft `#E7F6EE`) |
| `--color-warning` | `#F59E0B` | Warning + rating star (soft `#FEF3C7`) |
| `--color-error` | `#EF4444`/`#DC2626` | Error (soft `#FEECEC`) |

## Token: Typography

| Token | Value | Role |
|-------|-------|------|
| `--font-hanken` | Hanken Grotesk | Latin UI + numbers |
| `--font-plex-ar` | IBM Plex Sans Arabic | Arabic body |
| `--font-cairo` | Cairo | Arabic headings |
| `--font-mono` | JetBrains Mono | Codes, SKUs, `.mono` |

Scale (px): display 42 / h1 28–34 / h2 24–28 / h3 18–22 / body-lg 16 / body 14.5 / small 13 / xs 12 / micro 11. Headings `letter-spacing:-0.01em`; body line-height 1.7 (Arabic 1.85). Prices/numbers LTR + tabular (`.num`/`.ltr-nums`).

## Token: Shape, Depth & Motion

| Token | Value | Role |
|-------|-------|------|
| radius sm | `8px` | chips, inputs |
| radius md | `10px` | buttons |
| radius lg | `14–16px` | cards |
| radius xl | `20px` | panels |
| radius full | `999px` | pills |
| shadow sm | `0 1px 2px rgba(16,24,40,.04)` | subtle |
| shadow md | `0 4px 14px rgba(16,24,40,.08)` | cards |
| shadow lg | `0 14px 36px rgba(16,24,40,.12)` | modals, hover lift |
| shadow accent | `0 8px 20px rgba(37,99,235,.28)` | accent CTA |
| focus ring | `0 0 0 3px rgba(37,99,235,.16)` | input focus |
| card hover | `translateY(-3px)` + shadow-lg + border `#D6DAE1` | product/category cards |
| button active | `translateY(1px)` | press feedback |
| durations | 120 / 180 / 260 ms | fast / base / slow |

## Token: Spacing

8px base: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`.

## Icon map (lucide → custom `Icon` name)

Custom set names: `bolt, star, heart, heartFill, shield, bank, chat, sparkle, layers, video, book, search, cart, lock, check, checkCircle, arrow, arrowLeft, chevron, chevronL, x, menu, user, package, pin, filter, sort, trash, plus, minus, mail, phone, tag, info, eye, edit, logout, clock, grid, facebook, instagram, twitter`.

| lucide (used in repo) | → custom `name` | Notes |
|---|---|---|
| Search | `search` | |
| ShoppingCart / ShoppingBag | `cart` | |
| Heart | `heart` / `heartFill` | fill variant for active wishlist |
| Star | `star` | rating (warning color) |
| User / Users | `user` | |
| Eye / EyeOff | `eye` | toggle via state, single glyph |
| Trash2 | `trash` | |
| Filter / SlidersHorizontal | `filter` | |
| Plus / Minus | `plus` / `minus` | qty stepper |
| Check / CheckCircle / CheckCircle2 / CheckCheck | `check` / `checkCircle` | |
| X / XCircle | `x` | |
| Menu | `menu` | |
| ChevronLeft / ChevronRight | `chevronL` / `chevron` | flip under RTL via `.rtl-flip` |
| ArrowLeft / ArrowRight | `arrowLeft` / `arrow` | |
| Package | `package` | |
| MapPin | `pin` | |
| Mail | `mail` | Phone → `phone` |
| Tag | `tag` | |
| Info | `info` | |
| Edit / Edit2 | `edit` | |
| LogOut | `logout` | |
| Lock / Key | `lock` | |
| Shield | `shield` | |
| Zap | `bolt` | "instant" cue |
| Clock / Calendar | `clock` | |
| LayoutDashboard / Grid | `grid` | |
| Truck | `package` | closest match |
| Bell | `info` | or extend Icon with a `bell` glyph |
| TrendingUp | `arrow` | trend cue |
| **No clean match → extend `Icon.tsx`** | (new) | `Download`, `Upload`, `Save`, `RefreshCw`, `RotateCcw`, `ToggleLeft/Right`, `DollarSign`, `FileText`, `Settings2`, `AlertTriangle` — add same-style glyphs as needed |
| Loader2 | — (not an icon) | use a CSS spinner (`animate-spin`) |

Mapping is finalized per-file during implementation; unmatched glyphs are **added to `Icon.tsx`**, never left as lucide (FR-004 / SC-009).

## Component primitives

button (accent/dark/outlined/ghost) · input/form control · card (+`card-hover` lift) · status pill · table · modal/drawer · tabs · accordion (FAQ) · toast/inline alert · pagination · empty state · skeleton (`.skeleton` shimmer) · `Icon`.

## Status-pill semantic mapping

Order status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED) and payment status (PENDING, PAID, FAILED, REFUNDED) each map to a Cobalt color (success/warning/error/accent/cyan/muted). **Codes stay UPPERCASE; Arabic labels are display-only.** Unmapped value → neutral pill.

## Notes

- No DB migration, no Prisma change, no shared-type change. New interactions (plan toggle, checkout stepper, tabs/accordion, code reveal) are local component state over existing data/stores.
