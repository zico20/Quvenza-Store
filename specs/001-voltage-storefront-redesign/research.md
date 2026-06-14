# Phase 0 Research: Voltage Redesign

All Technical Context items are known (the live stack was inspected directly). No `NEEDS CLARIFICATION` remained from the spec. This document records the key decisions that shape implementation.

## Decision 1 — Token foundation: swap the existing `@theme` block

- **Decision**: Replace the "Graphite" tokens in `src/app/globals.css` `@theme { … }` with the Voltage token set, keeping the same Tailwind v4 mechanism.
- **Rationale**: The project already uses Tailwind v4 `@theme` with CSS custom properties as design tokens. Swapping values in place means every utility class and component that references the tokens picks up the new look automatically, and it matches the design brief's delivered `@theme` block exactly.
- **Alternatives considered**: (a) A separate theme file imported alongside — rejected: two sources of truth, drift risk. (b) Inline hex per component — rejected: violates the spec's "no ad-hoc values" requirement (FR-001) and the migration checklist.
- **Note on token renames**: The old set uses `--color-bg-surface`, `--color-text-primary`, `--color-accent-hover`. The Voltage set uses `--color-surface`, `--color-text`, `--color-accent-hi`, and adds `--color-plasma`, `--color-elevated-2`. Where existing components reference old token names, either (i) keep backward-compatible aliases in `@theme` during migration, or (ii) update references per screen wave. Decision: **keep aliases initially** to avoid a big-bang break, remove them in the final cleanup task.

## Decision 2 — Display font via `next/font`

- **Decision**: Add **Space Grotesk** as the display/heading face through `next/font/google`, exposed as `--font-display`; keep Inter (Latin body) and Cairo (Arabic) as they are.
- **Rationale**: The design uses Space Grotesk for all headings. `next/font` is already the project's font mechanism (zero CLS, no external CSS request), so this is consistent and performant.
- **Alternatives considered**: `@import` from Google Fonts in CSS — rejected: adds a render-blocking request and CLS; inconsistent with current approach.

## Decision 3 — RTL via existing mechanism + logical CSS properties

- **Decision**: Restyle within the existing `dir`-based RTL handling. Use CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline-start`, `text-align: start`) and flip directional icons; force `dir="ltr"` on price/number runs.
- **Rationale**: The store already initializes language/direction (`LangInitializer`, `StoreChrome`). Logical properties mirror automatically without duplicate RTL stylesheets. Matches the design's RTL approach and the migration checklist ("wrap with dir, use logical props, flip chevrons; prices stay dir=ltr").
- **Alternatives considered**: A dedicated RTL stylesheet or `[dir=rtl]` overrides everywhere — rejected: doubles maintenance, easy to miss cases.

## Decision 4 — Shared primitives carry consistency

- **Decision**: Anchor the migration on shared components: one `ProductCard` (used by listing/category/search/wishlist/home/related), one storefront `StatusBadge`, one admin `StatusBadge`, plus new `src/components/ui/` primitives (Button, EmptyState, Skeleton, Toast) reused across both apps.
- **Rationale**: Restyling a shared component once propagates everywhere it's used, which is how the spec's consistency criteria (SC-008) are met cheaply. Matches the design's "Product card → reuse across listing, category, search, wishlist, related" checklist item.
- **Alternatives considered**: Per-screen styling — rejected: guarantees drift, fails SC-002/SC-008.

## Decision 5 — Status-pill semantics map codes → Voltage colors; Arabic label is display-only

- **Decision**: Define one mapping from each UPPERCASE status enum value to a Voltage pill treatment (color + label). The label may be localized to Arabic; the underlying code never changes. An unmapped status falls back to a neutral pill.
- **Rationale**: Satisfies FR-015/FR-016 and constitution Principle V (enums stay UPPERCASE). Centralizing the map in the `StatusBadge` component prevents lowercase-comparison bugs.
- **Alternatives considered**: Ad-hoc color per usage site — rejected: inconsistent semantics, violates SC-005.

## Decision 6 — Charts adopt Voltage palette; mirror in RTL

- **Decision**: Pass Voltage colors (surface, border, accent, plasma, success/warning/error) into the existing `recharts` dashboard charts; ensure axis/trend direction reads correctly in RTL. Use `Number(v ?? 0)` in Recharts `formatter` callbacks (per existing project rule) to avoid type errors.
- **Rationale**: Keeps the data-dense admin on-brand and avoids reintroducing the known Recharts `Formatter<ValueType, NameType>` typing pitfall.
- **Alternatives considered**: Replacing recharts — rejected: out of scope, adds a heavy dependency (FR-023).

## Decision 7 — No automated visual regression suite; verification is type-gate + manual bilingual review

- **Decision**: Quality verification per task = `tsc --noEmit` passes + manual visual check of the affected screen in both LTR and RTL. No new test framework is added.
- **Rationale**: The repo has no existing visual-test harness; adding one is out of scope (UI redesign). The constitution's hard gate is `tsc --noEmit`. Bilingual manual review directly validates SC-003.
- **Alternatives considered**: Playwright/visual snapshots — rejected for this feature: significant setup, not requested, out of scope.
