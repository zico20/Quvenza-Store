<div align="center">

# Quvenza — Premium Electronics Store

**A production-grade e‑commerce platform for selling phones, laptops, tablets & headphones — built for the Iraqi market.**

Browse by brand or by device type · variant-aware cart & checkout · side‑by‑side device comparison · full Arabic (RTL) + English (LTR) · IQD & USD pricing · a complete admin dashboard.

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-Proprietary-lightgrey?style=flat)

</div>

---

## ✨ Highlights

- **Two browse modes** — shop **by brand** (Apple → iPhones → models) or **by device type** (All Phones / Laptops / Tablets / Headphones, cross‑brand) with brand, price & spec filters and sorting.
- **Variants done right** — storage / color / RAM, each with its own price, stock & SKU. Live price + stock update as you pick options; the cart, checkout and orders are fully variant‑aware (atomic stock decrement, price snapshot).
- **Compare** — add up to 4 devices and compare them side‑by‑side on a unified spec table.
- **Bilingual & RTL‑first** — every label and content string ships in Arabic (RTL) and English (LTR); prices stay LTR + tabular under RTL.
- **Dual currency** — USD & IQD with a single config‑driven exchange rate and a header toggle.
- **Admin dashboard** — products (+ image upload), orders (status workflow, Excel export, PDF invoice), customers, categories, notifications, low‑stock alerts, and analytics charts.
- **SEO out of the box** — per‑page metadata, JSON‑LD (Product / Organization / LocalBusiness / FAQ / Breadcrumb), dynamic `sitemap.xml`, `robots.txt`, and an `llms.txt` for AI crawlers.
- **Cobalt design system** — a clean, light, conversion‑focused UI on Tailwind v4 design tokens, a single custom SVG icon set (no icon library bloat), and shared primitives.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, Server Components, Route Handlers) |
| Language | **TypeScript 5** (strict) |
| UI | **React 19** · **Tailwind CSS v4** (`@theme` tokens) · custom `Icon` set |
| State | **Zustand** (cart, wishlist, compare, auth, language, currency) |
| Forms | **React Hook Form** + **Zod** |
| Data | **Prisma 5** ORM · **PostgreSQL 16** |
| Auth | **JWT** (access + refresh) via **jose**, **bcryptjs** hashing |
| Media | **Cloudinary** (product image hosting) |
| Reports | **ExcelJS** (orders export) · **PDFKit** (invoices) |
| Charts | **Recharts** · **TanStack Table** (admin tables) |
| HTTP | **Axios** (interceptors for auth + 401 handling) |
| Fonts | Hanken Grotesk · IBM Plex Sans Arabic · Cairo · JetBrains Mono (`next/font`) |
| Tooling | ESLint 9 · Docker (multi‑stage, standalone output) |

> Single Next.js application — frontend storefront, admin dashboard, and the REST API (`/api/v1/*`) all live in one codebase under `src/`.

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── (shop)/            # storefront: products, brands, category, compare, search
│   ├── (auth)/            # login, register
│   ├── account/           # profile, orders, addresses, wishlist
│   ├── admin/             # dashboard: products, orders, customers, categories, notifications
│   ├── api/v1/            # 44 route handlers — auth, products, brands, cart, orders,
│   │                      #   payments, users, admin, notifications
│   ├── (content pages)    # about, faq, how-it-works, payment-methods, glossary, terms, privacy
│   ├── sitemap.ts · robots.ts · llms.txt   # SEO surfaces
│   └── layout.tsx         # fonts, metadata, header/footer chrome
├── components/            # ui/ (Icon, Button, Toast…) · product/ · cart/ · compare/ · layout/ · admin/
├── services/             # business logic — products, brands, categories, orders,
│                         #   notifications, payments (gateway abstraction)
├── store/                # Zustand stores
├── lib/                  # prisma, auth, api client, i18n, schema (JSON-LD), cloudinary, utils
├── config/              # store.config.ts / admin.config.ts — single source for branding
└── types/               # shared TypeScript interfaces
prisma/
├── schema.prisma         # 15 models · 5 enums
├── migrations/           # real migration history
└── seed.ts              # full electronics catalog seed
```

**Data model** — 15 models incl. `Brand`, `Category` (with a `DeviceKind` enum), `Product`, `Variant`, `Review`, `Cart`/`CartItem`, `Order`/`OrderItem`/`OrderStatusHistory`, `Address`, `Notification`, and a `BlogPost`/`BlogCategory` pair. Money fields use `Decimal(10,2)`; status enums are UPPERCASE everywhere.

**Key decisions**
- **Payment gateway abstraction** (`IPaymentGateway`) — swap providers without touching business logic. A stub ships by default so the app runs without live keys.
- **Atomic stock protection** — order creation decrements variant/product stock with a conditional `updateMany` guard inside a transaction (no overselling under concurrency).
- **Validated order‑status transitions** — `PENDING → PROCESSING → SHIPPED → DELIVERED`, with cancellation restoring stock.
- **Config‑driven branding** — name, currency, locale, payment methods, social links all live in `src/config/*`; never hard‑coded in components.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+** and **npm**
- **PostgreSQL 16** (local) — or use the Docker option below (no local Postgres needed)

### Option A — Local (Node)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   → set DATABASE_URL and JWT secrets (see "Environment Variables" below)

# 3. Set up the database
npm run prisma:migrate      # apply migrations
npm run prisma:seed         # seed the electronics catalog

# 4. Start the dev server
npm run dev                 # http://localhost:3000
```

### Option B — Docker (app + database, one command)

```bash
# 1. Configure environment
cp .env.docker.example .env.docker
#   → set JWT secrets (and Cloudinary keys if you want image uploads)

# 2. Build & start (Postgres + app)
docker compose up -d --build

# 3. Apply the schema + seed (first run only)
docker compose run --rm migrate          # pushes the Prisma schema
docker compose exec app npm run prisma:seed

# App → http://localhost:3000   ·   DB → localhost:5432
```

> **Note:** whenever you change `.env.docker`, recreate the container so it picks up the new values:
> `docker compose up -d --force-recreate app`

### Seeded test accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@quvenzaiq.com` | `Admin@2026!` |
| **Customer** | `customer@quvenzaiq.com` | `Customer@2026!` |

Seed data: **10 brands · 16 categories · 80 real device models · 164 variants · 24 reviews** + a sample delivered order.

---

## 🔑 Environment Variables

Local dev reads `.env`; Docker reads `.env.docker`. Both are git‑ignored — only the `*.example` templates are committed. **Never commit real secrets.**

| Variable | Required | Description |
|----------|:---:|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (auto‑set by `docker-compose` for the Docker path) |
| `JWT_SECRET` | ✅ | Access‑token secret — min 32 chars (`openssl rand -base64 48`) |
| `JWT_REFRESH_SECRET` | ✅ | Refresh‑token secret — different, min 32 chars |
| `JWT_EXPIRES_IN` · `JWT_REFRESH_EXPIRES_IN` | – | Token lifetimes (default `15m` / `7d`) |
| `NEXT_PUBLIC_SITE_URL` · `NEXT_PUBLIC_API_URL` | – | Public URLs the browser uses |
| `CLOUDINARY_CLOUD_NAME` · `CLOUDINARY_API_KEY` · `CLOUDINARY_API_SECRET` | ⚪ | Product image uploads (free Cloudinary account). Without these the storefront shows clean brand+device placeholders. |
| `TELEGRAM_BOT_TOKEN` · `TELEGRAM_CHAT_ID` | ⚪ | Optional new‑order notifications |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` · `NEXT_PUBLIC_FB_VERIFICATION` | ⚪ | Search‑console / domain verification |

---

## 🖼️ Product Images

Products ship **image‑less** and render a clean Cobalt placeholder (brand mark + device‑type icon + model name). To add real photos:

1. Create a free **[Cloudinary](https://cloudinary.com)** account and put the 3 keys in your env file.
2. Sign in to the admin → **Products → Edit** a product → upload images → save.

Uploaded images are stored on Cloudinary and replace the placeholder automatically — no code changes. Source images from your **supplier's media kit** or **your own product photography** (avoid scraping manufacturer/competitor sites — copyright). Brand logos are real, open‑licensed SVGs under `public/brands/`.

---

## 📜 Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run type-check` | `tsc --noEmit` |
| `npm run prisma:migrate` | Create/apply a dev migration |
| `npm run prisma:seed` | Seed the catalog (idempotent — wipes & reseeds) |
| `npm run prisma:studio` | Open Prisma Studio (DB browser) |

---

## 🔌 API Overview

REST API under **`/api/v1`** (44 route handlers). Standard response envelope:

```json
{ "success": true, "data": <T>, "message": "optional" }
```

| Group | Endpoints (selected) |
|-------|----------------------|
| Auth | `POST /auth/login` · `/register` · `/refresh` · `/logout` · `GET /auth/me` |
| Catalog | `GET /products` (filters: `brandSlug`, `kind`, `minPrice`, `maxPrice`, `sort`…) · `GET /products/:slug` · `GET /brands` · `GET /categories` |
| Cart | `GET /cart` · `POST /cart/items` · `PATCH`/`DELETE /cart/items/:id` |
| Orders | `POST /orders` · `GET /orders` · `GET /orders/:id` |
| Payments | `POST /payments/initiate` · `/confirm` · `/refund` |
| Admin | `/admin/stats` · `/admin/orders` (+ `export`, `:id/invoice`, `:id/status`) · `/admin/customers` · `/admin/products/low-stock` |
| Notifications | `GET /notifications` · `unread-count` · `read-all` · `:id/read` |

Admin routes are guarded by a `requireAdmin` check; protected user routes require a valid bearer token.

---

## ☁️ Deployment

Built for **standalone output** (`next.config.ts` → `output: 'standalone'`) and ships a multi‑stage **Dockerfile**, so it runs anywhere that hosts a container or a Node server.

- **App** → any Node/container host (Railway, Render, Fly.io, a VPS) or Vercel.
- **Database** → a managed PostgreSQL 16 instance; set `DATABASE_URL`.
- **Images** → Cloudinary (set the 3 keys).
- Generate fresh `JWT_SECRET` / `JWT_REFRESH_SECRET`, set `NODE_ENV=production`, and run migrations against the production DB before first boot.

---

## 🌍 Localization & Market

Designed for **Iraq / MENA**: 18 Iraqi governorates with dependent city selection in the address form, IQD + USD pricing, and local payment methods (**Cash on Delivery · ZainCash · AsiaHawala · FastPay**). Full Arabic RTL throughout, with English as a first‑class second language.

---

## 📄 License

Proprietary — © Quvenza. All rights reserved. Not licensed for redistribution.

<div align="center">
<br />
<sub>Built with Next.js 16, Prisma & a lot of attention to detail.</sub>
</div>
