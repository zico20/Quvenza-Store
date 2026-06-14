# Quickstart: Applying & Verifying the Voltage Redesign

## Prerequisites

- Repo on branch `001-voltage-storefront-redesign`
- `npm install` done; PostgreSQL running; `.env` / `.env.local` present (already git-ignored)
- Dev server: `npm run dev` → http://localhost:3000 (admin under `/admin`)

## The foundation (do first)

1. **Tokens** — replace the Graphite `@theme` block in `src/app/globals.css` with the Voltage set (see `contracts/design-system.md` §1). Keep temporary aliases for old token names used by existing components; remove them in the final cleanup.
2. **Display font** — add Space Grotesk via `next/font/google` in `src/app/layout.tsx`, expose as `--font-display`, apply to headings.

## Migration order (waves)

Each wave is a task; anchor on shared components so consistency propagates:

1. Shared primitives: `components/ui/` (Button, EmptyState, Skeleton, Toast), `ProductCard`, storefront + admin `StatusBadge`.
2. Global chrome: `Header`, `Footer`, `MobileMenu`.
3. Home + product surfaces: home page, `HeroSlider`, product detail, listing/category/search, `ProductGrid`/`ProductFilters`.
4. Commerce flow: `CartDrawer`/`CartItem`, cart page, checkout (info → payment → success), `CheckoutSteps`/`AddressForm`.
5. Auth + account: login/register, account profile/orders/order-detail/addresses/wishlist.
6. Content pages: about, contact, faq, how-it-works, glossary, payment-methods, privacy, terms.
7. Admin: sidebar/topbar, dashboard + all charts, products/orders/customers/categories/notifications/settings tables & forms, status modal/timeline.
8. States & responsive polish: empty/skeleton states everywhere; mobile sticky bars, slide-over menu; reduced-motion.
9. Cleanup: remove token aliases; grep for stray hex/lowercase-enum.

## Verify each task (the gate)

```bash
# Type gate — MUST pass before a task is "done"
npm run type-check        # tsc --noEmit

# Lint
npm run lint
```

Then **manual bilingual check** of the affected screen:
- Load it in English (LTR) and in Arabic (RTL) via the header language toggle.
- Confirm: layout mirrors, chevrons/arrows flip, prices stay LTR, no clipped/overlapping elements.
- Confirm trust cues (home/product), status pills (orders), empty/loading states render in both directions.

## Acceptance smoke (whole feature)

Walk the path in both directions: home → product detail → add to cart (drawer) → checkout → payment → success; then account/orders; then `/admin` dashboard + one table. All on Voltage tokens, both LTR and RTL, with `tsc --noEmit` clean.

## Guardrails (do not violate)

- No changes under `src/app/api/`, `src/services/`, `prisma/`, or to enum values.
- Brand strings only from `src/config/*`; prices only via `formatPrice()`.
- `.env*` never committed. Status codes stay UPPERCASE.
