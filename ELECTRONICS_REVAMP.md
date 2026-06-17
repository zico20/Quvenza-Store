# Electronics Revamp — Plan

Transform the store from **digital subscriptions** → **premium physical electronics**
(Phones, Laptops, Tablets, Headphones from famous brands). Iraqi market kept as-is
(USD + IQD, Iraq governorate addresses, ZainCash/AsiaHawala/FastPay/COD).

Branch: `transform`. Work in small, reviewable commits; verify (`tsc`, build) after each phase.

## What stays (reused, not rewritten)
Auth, cart mechanics, checkout + payment-gateway abstraction, Order/OrderItem/status
flow + history, Reviews, admin dashboard, the **Cobalt** design system + tokens,
i18n/RTL, currency (USD+IQD), Iraq address system.

## What changes (digital → physical delta)
The "digital" concept lives in **content/data + missing models**, not in core mechanics.
No license-key/subscription/digital-fulfillment models exist to remove.

### Phase 1 — Data model + migration
- **Brand** (name, nameAr, slug, logo, multilingual) → has many products + device-types.
- **DeviceType / Category** kept & extended: a `kind` enum (PHONE/LAPTOP/TABLET/HEADPHONE)
  + `nameAr`; products link to brand + category.
- **Product (model)**: + `brandId`, `nameAr`, `descriptionAr`, `specs` (Json, type-shaped),
  `rating`, keep price/stock/images/SEO. `basePrice` = cheapest variant.
- **Variant**: storage/color/RAM each with own price, stock, SKU → belongs to product.
  Cart/OrderItem gain optional `variantId`.
- Switch from `db push` to real **`prisma migrate dev`** migrations.
- Update `src/types/index.ts` (Brand, Variant, ProductSpecs, extend Product/CartItem/OrderItem).

### Phase 2 — Seed
Brands (Apple, Samsung, Sony, Dell, HP, Lenovo, Asus, Bose, JBL, Sennheiser),
device types per brand, 5–6 real current models each with realistic specs, variants,
prices, placeholder images, bilingual.

### Phase 3 — Services / API
product + category services: brand/type/variant/specs, filters (brand/price/specs), sort.

### Phase 4 — Browse pages
Brand page (device types → models), type listing (All Phones/Laptops/Headphones) with
filters+sort+pagination, product detail (gallery, variant selectors w/ live price+stock,
specs table, reviews, related, add-to-compare, add-to-cart).

### Phase 5 — Compare
Compare page (side-by-side specs) + "Add to compare" (local store).

### Phase 6 — Navbar
Brands + device-types mega-menu (both browse modes) + mobile chips.

### Phase 7 — Cart / Checkout / Account
Variant-aware cart + checkout (shipping address + method already physical-ready).

### Phase 8 — Home / SEO / states / i18n
Home (featured brands + devices), 404, empty/loading/error, product structured data,
sitemap, all labels + content bilingual.

### Phase 9 — Final verify
type-check + lint + build + browser smoke.

## Run

### Local (Node)
```bash
npm install
npm run prisma:migrate   # apply migrations (creates Brand/Variant/DeviceKind, etc.)
npm run prisma:seed      # wipe + seed electronics catalog (10 brands, 80 models, 164 variants)
npm run dev              # http://localhost:3000
```
> The seed is idempotent and clears prior data FK-safely before reseeding.
> If migrating an existing DB non-interactively, run
> `npx prisma migrate reset --force --skip-seed` first, then `prisma migrate dev`.

### Docker
```bash
docker compose up -d --build app   # rebuilds app to pick up new code
# postgres + app come up; app on http://localhost:3000
# (re-seed inside the running stack if needed:)
docker compose exec app npm run prisma:seed
```

### Seeded test accounts
| Role     | Email                    | Password         |
|----------|--------------------------|------------------|
| Admin    | admin@quvenzaiq.com      | Admin@2026!      |
| Customer | customer@quvenzaiq.com   | Customer@2026!   |

---

## Status — ✅ COMPLETE (all 9 phases)

| Phase | Delivered | Verified |
|-------|-----------|----------|
| 1 Data model | Brand, DeviceKind enum, Variant (storage/color/RAM/SKU/price/stock), bilingual + specs Json; cart/orders variant-aware; **real Prisma migration** | tsc, migration applied |
| 2 Seed | 10 brands · 16 categories · 80 real models · 164 variants · 24 reviews, bilingual | queried live DB |
| 3 Services/API | brand/category/product services + filters (brand, kind, price, sort); brand.service; brands API route | tsc clean |
| 4 Browse | `/brands`, `/brands/[slug]`, `/products` (device-kind tabs + brand/price filters + sort), product detail (variant selectors w/ live price+stock, specs table, real reviews, related) | build passes |
| 5 Compare | `/compare` side-by-side spec table + global add-to-compare bar (max 4) | build passes |
| 6 Navbar | brands + device-type mega-menu (both browse modes), device chips, brand drawer | build passes |
| 7 Cart/Checkout | variant-aware cart store, CartItem/Drawer/cart page, checkout payload + variant stock decrement/restore + price snapshot | build passes |
| 8 Home/SEO | electronics home (device hero, featured brands, device tiles), JSON-LD/sitemap/404/metadata purged of digital content | build passes |
| 9 Verify | `tsc` clean · `next build` 68 pages · digital-content sweep clean · Docker rebuild + 11-route browser smoke (all 200, electronics data renders) | ✅ |

**Quality gates:** `npx tsc --noEmit` → 0 errors. `next build` → success (68 static pages).
New code adds **0 new lint errors** (remaining ESLint errors are a pre-existing,
codebase-wide `set-state-in-effect`/`component-in-render` pattern the build does not enforce).

**Key new files:** `services/brands/brand.service.ts`, `app/api/v1/brands/route.ts`,
`store/compare.store.ts`, `app/(shop)/brands/{page,[slug]/page}.tsx`,
`app/(shop)/compare/page.tsx`, `components/compare/CompareBar.tsx`.

**Iraqi context preserved:** USD+IQD, 18-governorate addresses, ZainCash/AsiaHawala/FastPay/COD,
WhatsApp/contact numbers unchanged.
