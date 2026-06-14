# Contract: Voltage Design System (UI Contract)

This is the **UI contract** for the redesign — the interface screens must conform to. It is the design analog of an API contract: any screen claiming to be "on the Voltage system" must satisfy these.

## 1. Token contract (drop-in `@theme`)

Screens MUST consume these tokens and MUST NOT introduce ad-hoc hex/spacing values. The authoritative block (from the design handoff) to place in `src/app/globals.css`:

```css
@theme {
  --color-bg-base: #0A0A0C;
  --color-surface: #121216;
  --color-elevated: #1A1A20;
  --color-elevated-2: #232329;
  --color-border: #26262E;
  --color-border-strong: #36363F;

  --color-text: #F7F7F8;
  --color-text-secondary: #A6A6AE;
  --color-text-muted: #6C6C76;

  --color-accent: #FF7A33;
  --color-accent-hi: #FF9357;
  --color-plasma: #19D4E8;
  --color-success: #34D399;
  --color-warning: #FBBF24;
  --color-error: #FB7185;

  --radius-sm: 6px; --radius-md: 10px;
  --radius-lg: 16px; --radius-xl: 20px;
  --font-display: "Space Grotesk";
  --font-sans: "Inter";
  --font-arabic: "Cairo";
  --ease-out: cubic-bezier(.16,1,.3,1);
  --duration-base: 180ms;
  --shadow-glow: 0 0 24px rgb(255 122 51 / .5);
}
```

(Spacing, full radius, additional shadows, and motion durations from `data-model.md` complete the set.)

## 2. Component contract

Each primitive has a fixed visual contract reused everywhere it appears:

| Component | Contract |
|-----------|----------|
| **Button** | Variants: primary (accent gradient + glow), secondary (surface + border-strong), ghost. Sizes: sm/md/lg. States: hover, focus-visible ring, active, disabled, loading. ≥44px tap target on mobile. |
| **Input / form control** | Surface bg, border, `--radius-sm`, visible focus ring (accent), error state (error border + message), label + helper. RTL: `text-align: start`, mirrored. |
| **Card** | Surface bg, `--color-border`, `--radius-lg`, optional hover lift (`--shadow-md`). |
| **ProductCard** (shared) | Image/brand mark, category eyebrow (plasma), name (display font), rating, price (USD + IQD, `dir=ltr`), add-to-cart affordance, stock/discount badge. Same in every context. |
| **Status pill** (shared) | Maps UPPERCASE enum → color token + localized label (see data-model). Pill radius full. Codes never change. |
| **Table** | Surface rows, border separators, legible header, status pills in cells, consistent row actions, RTL mirrored. |
| **Modal / Drawer** | Overlay scrim, `--shadow-lg`, slide/scale transition (`--duration-slow` `--ease-out`), keyboard operable (Esc, focus trap), RTL slide direction mirrored. |
| **Toast / inline alert** | Semantic color (success/error/warning/info-plasma), icon, message. |
| **Tabs** | Active underline/fill in accent, keyboard navigable. |
| **Pagination** | Prev/next chevrons flipped in RTL, current-page emphasis. |
| **Empty state** | Icon + message + recovery action. Used for empty cart, no results, no orders, empty wishlist. |
| **Skeleton loader** | Shimmer placeholder matching the real layout (no CLS), for grids and tables. |

## 3. Behavioral contract

- **Bilingual**: Every screen renders correctly in `dir=rtl` (Arabic, primary) and `dir=ltr` (English). Directional icons flip; prices/numbers stay `dir=ltr`.
- **Motion**: Uses motion tokens; respects `prefers-reduced-motion: reduce`.
- **Accessibility**: AA contrast; visible `:focus-visible` ring; ≥44px mobile targets; drawers/modals/menus keyboard-operable.
- **Config-driven**: Brand strings via config; prices via `formatPrice()`.

## 4. Invariants this contract MUST NOT break

- No route, API endpoint, data model, or enum value changes.
- Status enum codes remain UPPERCASE; Arabic labels are display-only.
- SoftoDev WhatsApp/contact details and social links unchanged.
- No new heavy UI dependency (Tailwind + small primitives + existing lucide/recharts only).
