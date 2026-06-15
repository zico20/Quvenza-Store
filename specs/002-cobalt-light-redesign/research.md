# Phase 0 Research: Cobalt Light Redesign

All Technical Context items are known (live stack inspected directly; bundle README is explicit). No `NEEDS CLARIFICATION` remained. Key decisions below.

## Decision 1 — Foundation: replace `globals.css` with the Cobalt drop-in

- **Decision**: Replace `src/app/globals.css` wholesale with the bundle's `globals.css`. It keeps the **same canonical token names** as today, so existing utility classes (`bg-bg-base`, `text-text-primary`, `border-border`, `.btn-accent`, `.input`, `.tag`, `.card`) re-skin to the light Cobalt palette automatically — same mechanism that flipped the app to Voltage, in reverse.
- **Rationale**: Lowest-risk, highest-impact: one file flips the whole app to light. The drop-in also redefines `.btn-accent` (solid cobalt), `.btn-primary` (dark/neutral), `.input` focus ring (blue), `.tag-*` (light), and adds `.skeleton`, keyframes, and the `--font-*` vars the new fonts bind to.
- **Caveat**: The drop-in's `--font-*` vars reference `--font-hanken`, `--font-plex-ar`, `--font-cairo` — these MUST be wired in `layout.tsx` (Decision 2) or text falls back to system fonts.
- **Alternatives considered**: Incremental token edits — rejected: slower, drift risk, and the bundle file is authoritative.

## Decision 2 — Fonts via `next/font`

- **Decision**: In `layout.tsx`, load **Hanken Grotesk** (`--font-hanken`, Latin UI + numbers), **IBM Plex Sans Arabic** (`--font-plex-ar`, Arabic body), keep **Cairo** (`--font-cairo`, Arabic headings), keep **JetBrains Mono** (`.mono`/codes). Remove the Voltage Space Grotesk + Inter wiring. Apply the vars on `<html>`/`<body>`.
- **Rationale**: Matches the Cobalt type system; `next/font` is the project mechanism (no CLS, no external request). Cairo + JetBrains Mono already exist, so only two fonts are added and two removed.
- **Alternatives considered**: Google Fonts `@import` in CSS — rejected: render-blocking + CLS, inconsistent with the codebase.

## Decision 3 — Custom `Icon.tsx` replaces lucide-react via a name-mapping table

- **Decision**: Add the bundle's `Icon.tsx` at `src/components/ui/Icon.tsx`. Migrate the **38** files importing `lucide-react` to `<Icon name="…" />` using an explicit mapping table (built during implementation). Keep lucide-react installed but unused (removal is optional cleanup).
- **Rationale**: One typed icon set = visual consistency (SC-009) and matches the design. A mapping table makes the migration mechanical and reviewable.
- **Gap handling (important)**: ~50 unique lucide icons are used but the custom set has ~40 names with **different identifiers**. Several lucide icons have **no direct custom equivalent** (e.g. `Calendar`, `Download`, `Save`, `RefreshCw`, `RotateCcw`, `TrendingUp`, `ToggleLeft/Right`, `DollarSign`, `FileText`, `Key`, `Loader2`, `Settings2`, `Upload`, `AlertTriangle`, `Truck`, `Bell`, `CheckCheck`). Strategy: (a) map to the closest custom icon where sensible (e.g. `Search`→`search`, `Eye`→`eye`, `Trash2`→`trash`, `SlidersHorizontal`/`Filter`→`filter`, `ShoppingCart`/`ShoppingBag`→`cart`, `Settings2`→`edit`/`info`, `Bell`→`info`, `Truck`→`package`, `TrendingUp`→`arrow`, `Loader2`→a CSS spinner not an icon); (b) for icons with no reasonable match, **extend `Icon.tsx`** with a new entry drawn in the same style rather than reintroducing lucide. A short mapping table lives in `data-model.md`.
- **Alternatives considered**: Keep lucide for unmapped icons — rejected: violates "single icon set" (FR-004/SC-009) and mixes visual styles.

## Decision 4 — Dark→light inversion is the top correctness risk; hunt residual dark hex

- **Decision**: After the token swap, systematically grep for **hardcoded dark colors** left from Voltage (e.g. `#0A0A0C`, `#121216`, `#1A1A20`, `#F7F7F8` as text-on-dark, `rgba(255,122,51,*)`, plasma `#19D4E8`, glow shadows) and any inline `style` using dark surfaces/light text. Each must be re-expressed via Cobalt tokens or corrected for a light background.
- **Rationale**: Token-named utilities re-skin automatically, but **inline-styled** components (ProductCard, Header, home page, admin pages — many use inline hex) will keep dark values and look broken on light. This is the #1 source of "looks wrong" after the swap.
- **Alternatives considered**: Trust the token swap alone — rejected: inline hex bypasses tokens; verified many such usages exist from the Voltage work.

## Decision 5 — New interactions are local UI state over existing data

- **Decision**: Plan toggle (home + product), 4-step checkout stepper, product tabs + FAQ accordion, and activation-code reveal are built with React local state (`useState`) over existing product/cart/order data and the existing stores. No new stores, no new endpoints.
- **Rationale**: Honors Principle II and FR-024 (no logic/store/API changes). Matches the README ("reuse what exists — don't introduce new libraries").
- **Details**: plan toggle swaps displayed price/period/savings/IQD from existing product plan data; checkout summary recomputes subtotal/discount/total from cart items × qty (discount/exchange from existing config/logic); activation-code reveal masks `product`/order item code client-side with copy-to-clipboard.
- **Alternatives considered**: New Zustand slices — rejected: unnecessary; local state suffices and keeps blast radius small.

## Decision 6 — Charts adopt Cobalt; keep recharts

- **Decision**: Pass Cobalt token colors (accent cobalt, cyan, semantic, light grid/surface) into the existing recharts dashboard charts; ensure RTL reads correctly. Keep `Number(v ?? 0)` in any `formatter` callbacks (avoids the known Recharts typing pitfall).
- **Rationale**: On-brand data-dense admin without a new dependency (FR-026).
- **Alternatives considered**: Replace recharts / the conic-gradient donut from the prototype — rejected: out of scope, recharts already integrated.

## Decision 7 — Verification: type gate + manual bilingual light review (no new test suite)

- **Decision**: Per-task verification = `tsc --noEmit` clean + manual visual check of the affected screen in both LTR and RTL on the **light** theme. `next build` as the end-to-end smoke. No new test framework.
- **Rationale**: No existing visual-test harness; adding one is out of scope. `tsc --noEmit` is the constitution's hard gate; bilingual light review directly validates SC-002/SC-003.
- **Alternatives considered**: Playwright/visual snapshots — rejected for this feature: setup cost, not requested.
