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
```
npm run prisma:migrate   # apply migrations (dev)
npm run prisma:seed      # seed electronics catalog
npm run dev              # http://localhost:3000
```
