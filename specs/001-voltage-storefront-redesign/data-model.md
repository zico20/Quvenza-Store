# Phase 1 Data Model: Design-Token Model

This feature introduces **no business-data entities**. The "model" here is the design-token system that screens consume. Business models (User, Product, Order, Cart, etc.) are unchanged.

## Token: Color

| Token (`@theme` var) | Value | Role |
|----------------------|-------|------|
| `--color-bg-base` | `#0A0A0C` | Page background (near-black canvas) |
| `--color-surface` | `#121216` | Cards, panels, inputs |
| `--color-elevated` | `#1A1A20` | Raised surfaces, chips, hover |
| `--color-elevated-2` | `#232329` | Higher elevation (menus, popovers) |
| `--color-border` | `#26262E` | Default border |
| `--color-border-strong` | `#36363F` | Emphasized border / outline buttons |
| `--color-text` | `#F7F7F8` | Primary text |
| `--color-text-secondary` | `#A6A6AE` | Secondary text |
| `--color-text-muted` | `#6C6C76` | Muted text / captions |
| `--color-accent` | `#FF7A33` | Electric-orange primary accent (CTAs, sells) |
| `--color-accent-hi` | `#FF9357` | Accent highlight / hover / icon strokes |
| `--color-plasma` | `#19D4E8` | Plasma-cyan secondary (tech/trust cues) |
| `--color-success` | `#34D399` | Success / in-stock / paid / delivered |
| `--color-warning` | `#FBBF24` | Warning / pending / low-stock |
| `--color-error` | `#FB7185` | Error / failed / cancelled |

## Token: Typography

| Token | Value | Role |
|-------|-------|------|
| `--font-display` | `"Space Grotesk"` | Headings (Latin) |
| `--font-sans` | `"Inter"` | Body (Latin) |
| `--font-arabic` | `"Cairo"` | All Arabic text (display + body) |

Type scale: Display 56/44 · H1 36 · H2 28 · Body 16 · SM 14. Arabic uses heavier weight (700–800) and looser line-height (1.4–1.9) for dark-bg readability.

## Token: Shape & Depth

| Token | Value | Role |
|-------|-------|------|
| `--radius-sm` | `6px` | Inputs, chips |
| `--radius-md` | `10px` | Buttons |
| `--radius-lg` | `16px` | Cards |
| `--radius-xl` | `20px` | Hero/feature panels |
| radius full | `999px` | Pills |
| `--shadow-sm` | `0 1px 2px rgb(0 0 0 / .4)` | Subtle lift |
| `--shadow-md` | `0 6px 18px rgb(0 0 0 / .45)` | Cards on hover |
| `--shadow-lg` | `0 16px 40px rgb(0 0 0 / .55)` | Modals/drawers |
| `--shadow-glow` | `0 0 24px rgb(255 122 51 / .5)` | Accent glow (logo, primary CTA, cart badge) |

## Token: Motion

| Token | Value | Role |
|-------|-------|------|
| `--duration-fast` | `120ms` | Hover/focus |
| `--duration-base` | `180ms` | Default transitions |
| `--duration-slow` | `260ms` | Drawer/modal |
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | Standard easing |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | Springy feedback (add-to-cart) |

All decorative motion must be suppressed under `prefers-reduced-motion: reduce`.

## Token: Spacing

8px base scale: `4 (xs) · 8 (sm) · 16 (md) · 24 (lg) · 32 (xl) · 48 (2xl)`.

## Derived: Status-pill semantic mapping

The status pill maps an UPPERCASE enum code to a (color token, localized label) pair. **Codes never change.**

| OrderStatus code | Color token | EN label | AR label |
|------------------|-------------|----------|----------|
| `PENDING` | warning | Pending | قيد الانتظار |
| `PROCESSING` | plasma | Processing | قيد التجهيز |
| `SHIPPED` | plasma | Shipped | تم الشحن |
| `DELIVERED` | success | Delivered | تم التسليم |
| `CANCELLED` | error | Cancelled | ملغي |
| `REFUNDED` | text-muted | Refunded | مُسترجع |

| PaymentStatus code | Color token | EN label | AR label |
|--------------------|-------------|----------|----------|
| `PENDING` | warning | Pending | قيد الانتظار |
| `PAID` | success | Paid | مدفوع |
| `FAILED` | error | Failed | فشل |
| `REFUNDED` | text-muted | Refunded | مُسترجع |

Unmapped value → neutral pill (`text-muted` on `elevated`) so it never renders invisibly. (Final Arabic wording confirmed against existing `StatusBadge` strings during implementation; codes stay UPPERCASE per Principle V.)

## Notes

- These tokens live in `src/app/globals.css` `@theme`. During migration, backward-compatible aliases for the old Graphite token names (`--color-bg-surface`, `--color-text-primary`, `--color-accent-hover`) may be kept temporarily, then removed in the cleanup task.
- No database migration, no Prisma change, no shared-type change is required by this feature.
