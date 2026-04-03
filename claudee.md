# CLAUDE.md — Complete Project Intelligence File
# E-Commerce Platform by SoftoDev (softodeviq.com)
# Last Updated: April 2026
# Read this entire file before touching any code.

---

## 0. WHO IS READING THIS

You are a Claude AI instance being onboarded to an active, production-grade
e-commerce platform built by SoftoDev (Baghdad, Iraq). This document is your
complete project memory. The human you are working with (Ghaith) built this
system incrementally using Claude Code and Claude.ai. Everything you need to
understand the architecture, make decisions, and continue development is here.

**Your first job**: Read this file completely. Do not write a single line of
code until you have finished reading. Then confirm: "I have read CLAUDE.md and
I understand the full project."

---

## 1. PROJECT IDENTITY

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Project name     | E-Commerce Platform                        |
| Company          | SoftoDev                                   |
| Domain           | softodeviq.com                             |
| Location         | Baghdad, Iraq                              |
| Primary market   | Iraq → regional → international            |
| Business model   | SaaS: one backend, many client frontends   |
| Project root     | `ecommerce-platform/`                      |
| Status           | Scaffold 100% complete, locally runnable   |
| Started          | April 2026                                 |

---

## 2. FINAL VISION & BUSINESS GOAL

This is NOT a one-off store. It is a **multi-tenant SaaS e-commerce engine**:

- SoftoDev builds ONE backend (Node.js/Express/PostgreSQL).
- Every client gets their OWN frontend (`FRONTEND/apps/<client-name>/`).
- The backend is shared, scalable, and never duplicated per client.
- When a client wants a mobile app, React Native connects to the SAME API.
- When a client wants a different payment gateway, ONE file changes.

### Target client types:
1. General merchandise stores (clothing, electronics, etc.)
2. Food & restaurant ordering
3. Digital product stores (software, courses)
4. Any B2C business in Iraq/MENA region

### Revenue model for SoftoDev:
- Monthly SaaS fee per client
- Setup + customization fee
- Optional hosting management fee

---

## 3. TECHNOLOGY STACK (NON-NEGOTIABLE)

### Monorepo
- **Tool**: Turborepo
- **Root**: `ecommerce-platform/`
- **Workspaces**: `FRONTEND/*`, `BACKEND`

### Backend (`BACKEND/`)
| Technology       | Package / Version     | Purpose                        |
|------------------|-----------------------|--------------------------------|
| Runtime          | Node.js 18+           | Server runtime                 |
| Framework        | Express               | HTTP server                    |
| Language         | TypeScript 5.3+       | Type safety                    |
| ORM              | Prisma                | Database access + migrations   |
| Database         | PostgreSQL            | Primary data store             |
| Auth             | jsonwebtoken          | JWT access + refresh tokens    |
| Password         | bcryptjs              | Password hashing (12 rounds)   |
| Validation       | Zod                   | Schema validation              |
| File upload      | Multer                | Image uploads                  |
| Security         | helmet                | HTTP security headers          |
| CORS             | cors                  | Cross-origin requests          |
| Logging          | morgan                | HTTP request logging           |
| Rate limiting    | express-rate-limit    | 100 req/15min on /api/         |
| Config           | dotenv                | Environment variables          |
| Images (future)  | cloudinary            | Cloud image storage            |

### Frontend — Store (`FRONTEND/apps/store/`)
| Technology       | Package               | Purpose                        |
|------------------|-----------------------|--------------------------------|
| Framework        | Next.js 14            | App Router, SSR/SSG            |
| Language         | TypeScript            | Type safety                    |
| Styling          | Tailwind CSS v3       | Utility-first CSS              |
| Components       | shadcn/ui             | Accessible UI components       |
| State            | Zustand               | Cart + Auth global state       |
| Forms            | React Hook Form + Zod | Form handling + validation     |
| HTTP client      | Axios                 | API calls with interceptors    |
| Icons            | lucide-react          | Icon set                       |

### Frontend — Admin (`FRONTEND/apps/admin/`)
| Technology       | Package               | Purpose                        |
|------------------|-----------------------|--------------------------------|
| Framework        | Next.js 14            | App Router                     |
| Language         | TypeScript            | Type safety                    |
| Styling          | Tailwind CSS v3       | Utility-first CSS              |
| Components       | shadcn/ui             | Accessible UI components       |
| State            | Zustand               | Auth global state              |
| Tables           | TanStack Table v8     | Data tables with sorting       |
| Charts           | Recharts              | Revenue + analytics charts     |
| Forms            | React Hook Form + Zod | Form handling + validation     |
| HTTP client      | Axios                 | API calls with interceptors    |

### Shared Types (`FRONTEND/packages/types/`)
- Package name: `@repo/types`
- Imported by: store, admin, backend (reference)
- Contains: All shared TypeScript interfaces

### Deployment (Target)
| Service          | Provider              | What runs there                |
|------------------|-----------------------|--------------------------------|
| Store frontend   | Vercel                | FRONTEND/apps/store            |
| Admin frontend   | Vercel                | FRONTEND/apps/admin            |
| Backend API      | Railway or Render     | BACKEND/                       |
| Database         | Railway or Render     | PostgreSQL instance            |
| Images           | Cloudinary            | Product image storage          |

---

## 4. COMPLETE DIRECTORY STRUCTURE

```
ecommerce-platform/                          ← Monorepo root
├── package.json                             ← Workspaces: FRONTEND/*, BACKEND
├── turbo.json                               ← Turborepo pipeline config
├── tsconfig.json                            ← Base TypeScript config
├── .gitignore
├── .env.example
├── README.md
├── CLAUDE.md                                ← THIS FILE
│
├── FRONTEND/
│   ├── packages/
│   │   └── types/                           ← @repo/types shared package
│   │       ├── package.json
│   │       └── src/
│   │           └── index.ts                 ← All shared TypeScript interfaces
│   │
│   └── apps/
│       ├── store/                           ← Customer-facing storefront (:3000)
│       │   ├── src/
│       │   │   ├── app/
│       │   │   │   ├── layout.tsx           ← Root layout, providers, fonts
│       │   │   │   ├── page.tsx             ← Homepage: hero, featured, categories
│       │   │   │   ├── (shop)/
│       │   │   │   │   ├── products/
│       │   │   │   │   │   ├── page.tsx     ← Product listing, filters, pagination
│       │   │   │   │   │   └── [slug]/
│       │   │   │   │   │       └── page.tsx ← Product detail, add to cart
│       │   │   │   │   ├── category/
│       │   │   │   │   │   └── [slug]/page.tsx
│       │   │   │   │   └── search/page.tsx
│       │   │   │   ├── cart/page.tsx
│       │   │   │   ├── checkout/
│       │   │   │   │   ├── page.tsx         ← Step 1: Shipping info form
│       │   │   │   │   ├── payment/page.tsx ← Step 2: Payment method
│       │   │   │   │   └── success/page.tsx ← Order confirmed
│       │   │   │   ├── (auth)/
│       │   │   │   │   ├── login/page.tsx
│       │   │   │   │   └── register/page.tsx
│       │   │   │   └── account/
│       │   │   │       ├── layout.tsx       ← Account sidebar layout
│       │   │   │       ├── page.tsx         ← Profile settings
│       │   │   │       ├── orders/
│       │   │   │       │   ├── page.tsx     ← Order history
│       │   │   │       │   └── [id]/page.tsx← Order detail
│       │   │   │       └── wishlist/page.tsx
│       │   │   ├── components/
│       │   │   │   ├── ui/                  ← shadcn/ui components
│       │   │   │   ├── layout/
│       │   │   │   │   ├── Header.tsx       ← Logo, nav, cart icon, auth buttons
│       │   │   │   │   ├── Footer.tsx
│       │   │   │   │   └── MobileMenu.tsx
│       │   │   │   ├── product/
│       │   │   │   │   ├── ProductCard.tsx  ← Image, name, price, add-to-cart
│       │   │   │   │   ├── ProductGrid.tsx  ← Responsive grid wrapper
│       │   │   │   │   └── ProductFilters.tsx
│       │   │   │   ├── cart/
│       │   │   │   │   ├── CartDrawer.tsx   ← Slide-over cart panel
│       │   │   │   │   └── CartItem.tsx
│       │   │   │   └── checkout/
│       │   │   │       └── CheckoutSteps.tsx
│       │   │   ├── lib/
│       │   │   │   ├── api.ts               ← Axios instance + all API functions
│       │   │   │   ├── utils.ts             ← cn(), formatPrice(), formatDate()
│       │   │   │   └── validators/
│       │   │   │       ├── auth.validator.ts
│       │   │   │       ├── checkout.validator.ts
│       │   │   │       └── product.validator.ts
│       │   │   ├── hooks/
│       │   │   │   ├── useCart.ts
│       │   │   │   ├── useAuth.ts
│       │   │   │   └── useProducts.ts
│       │   │   └── store/
│       │   │       ├── cart.store.ts        ← Zustand: CartItem[], drawer state
│       │   │       └── auth.store.ts        ← Zustand + persist: user, tokens
│       │   ├── .env.local                   ← NEXT_PUBLIC_API_URL=:5000/api/v1
│       │   ├── .env.local.example
│       │   ├── package.json
│       │   └── tsconfig.json
│       │
│       └── admin/                           ← Admin dashboard (:3001)
│           ├── src/
│           │   ├── app/
│           │   │   ├── layout.tsx
│           │   │   ├── page.tsx             ← Redirects to /dashboard
│           │   │   ├── login/page.tsx       ← Admin-only login
│           │   │   └── dashboard/
│           │   │       ├── layout.tsx       ← Sidebar + topbar shell
│           │   │       ├── page.tsx         ← Stats: revenue, orders, products
│           │   │       ├── products/
│           │   │       │   ├── page.tsx     ← TanStack Table, all products
│           │   │       │   ├── new/page.tsx ← Create product form
│           │   │       │   └── [id]/page.tsx← Edit form + image manager + delete
│           │   │       ├── orders/
│           │   │       │   ├── page.tsx     ← Orders table, status filter, search
│           │   │       │   └── [id]/page.tsx← Detail: items, info, status update
│           │   │       ├── categories/
│           │   │       │   └── page.tsx     ← CRUD with modal dialog
│           │   │       └── customers/
│           │   │           └── page.tsx     ← Read-only customer list
│           │   ├── components/
│           │   │   ├── ui/                  ← shadcn/ui components
│           │   │   ├── layout/
│           │   │   │   ├── Sidebar.tsx      ← Nav links with active state
│           │   │   │   └── Topbar.tsx       ← Page title + user menu
│           │   │   ├── dashboard/
│           │   │   │   ├── StatsCard.tsx    ← Revenue, orders, products, users
│           │   │   │   └── RevenueChart.tsx ← Recharts AreaChart, 30-day data
│           │   │   ├── orders/
│           │   │   │   └── StatusBadge.tsx  ← Color-coded status pill
│           │   │   └── products/
│           │   │       ├── ProductForm.tsx  ← Shared create/edit form
│           │   │       └── ImageUpload.tsx  ← Drag-drop image upload
│           │   ├── middleware.ts            ← Protects /dashboard/* → /login
│           │   ├── lib/
│           │   │   ├── api.ts               ← Admin Axios instance
│           │   │   └── utils.ts
│           │   └── store/
│           │       └── auth.store.ts        ← Admin auth Zustand store
│           ├── .env.local
│           ├── .env.local.example
│           ├── package.json
│           └── tsconfig.json
│
└── BACKEND/
    ├── src/
    │   ├── app.ts                           ← Express app factory
    │   ├── server.ts                        ← Entry: listen on PORT
    │   ├── config/
    │   │   ├── env.ts                       ← Validates + exports all env vars
    │   │   ├── database.ts                  ← Prisma client singleton
    │   │   └── constants.ts                 ← JWT_EXPIRES_IN, BCRYPT_ROUNDS
    │   ├── middlewares/
    │   │   ├── auth.middleware.ts           ← verifyToken, requireAdmin
    │   │   ├── error.middleware.ts          ← AppError class + global handler
    │   │   ├── validate.middleware.ts       ← Zod validation wrapper
    │   │   └── upload.middleware.ts         ← Multer config
    │   ├── routes/
    │   │   ├── index.ts                     ← Mounts all at /api/v1
    │   │   ├── auth.routes.ts
    │   │   ├── product.routes.ts
    │   │   ├── category.routes.ts
    │   │   ├── cart.routes.ts
    │   │   ├── order.routes.ts
    │   │   ├── payment.routes.ts
    │   │   ├── user.routes.ts
    │   │   └── admin.routes.ts
    │   ├── controllers/
    │   │   ├── auth.controller.ts
    │   │   ├── product.controller.ts
    │   │   ├── category.controller.ts
    │   │   ├── cart.controller.ts
    │   │   ├── order.controller.ts
    │   │   ├── payment.controller.ts
    │   │   └── user.controller.ts
    │   ├── services/
    │   │   ├── auth/
    │   │   │   ├── auth.service.ts          ← register, login, refresh, logout
    │   │   │   └── token.service.ts         ← generateTokens, verifyToken
    │   │   ├── products/
    │   │   │   └── product.service.ts       ← CRUD, search, filter, pagination
    │   │   ├── orders/
    │   │   │   └── order.service.ts         ← createOrder, updateStatus
    │   │   └── payments/
    │   │       ├── payment.gateway.ts       ← IPaymentGateway interface
    │   │       ├── stripe.gateway.ts        ← Stub (ready for real keys)
    │   │       └── payment.service.ts       ← Uses gateway abstraction
    │   ├── schemas/
    │   │   ├── auth.schema.ts
    │   │   ├── product.schema.ts
    │   │   └── order.schema.ts
    │   └── utils/
    │       ├── response.ts                  ← sendSuccess, sendError, sendPaginated
    │       ├── pagination.ts                ← parsePaginationQuery
    │       └── slugify.ts
    ├── prisma/
    │   ├── schema.prisma                    ← Full DB schema (8 models)
    │   └── seed.ts                          ← 2 users, 6 categories, 12 products
    ├── .env                                 ← Local dev (never commit)
    ├── .env.example                         ← Template (safe to commit)
    ├── package.json
    └── tsconfig.json
```

---

## 5. DATABASE SCHEMA (PostgreSQL via Prisma)

### Models Overview

```
User ──────────────┬── Order (1:many)
                   ├── Address (1:many)
                   └── Cart (1:1)

Category ──────────── Product (1:many)

Product ───────────┬── CartItem (1:many)
                   └── OrderItem (1:many)

Cart ──────────────── CartItem (1:many)

Order ─────────────── OrderItem (1:many)
```

### Model Details

```prisma
model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  password     String
  role         Role      @default(USER)      // USER | ADMIN
  refreshToken String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  orders       Order[]
  addresses    Address[]
  cart         Cart?
}

model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  image     String?
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  products  Product[]
}

model Product {
  id           String      @id @default(cuid())
  name         String
  slug         String      @unique
  description  String
  price        Float
  comparePrice Float?
  stock        Int         @default(0)
  images       String[]
  isActive     Boolean     @default(true)
  categoryId   String
  category     Category    @relation(...)
  orderItems   OrderItem[]
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  user      User       @relation(...)
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String  @id @default(cuid())
  cartId    String
  cart      Cart    @relation(...)
  productId String
  product   Product @relation(...)
  quantity  Int
  @@unique([cartId, productId])
}

model Order {
  id              String        @id @default(cuid())
  userId          String
  user            User          @relation(...)
  status          OrderStatus   @default(PENDING)
  total           Float
  paymentMethod   String
  paymentStatus   PaymentStatus @default(PENDING)
  shippingAddress Json
  items           OrderItem[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(...)
  productId String
  product   Product @relation(...)
  quantity  Int
  price     Float
}

model Address {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(...)
  fullName  String
  phone     String
  city      String
  address   String
  country   String
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
}

enum Role          { USER ADMIN }
enum OrderStatus   { PENDING PROCESSING SHIPPED DELIVERED CANCELLED REFUNDED }
enum PaymentStatus { PENDING PAID FAILED REFUNDED }
```

---

## 6. API REFERENCE (Complete Endpoint Map)

**Base URL**: `http://localhost:5000/api/v1` (dev) | `https://api.yourdomain.com/api/v1` (prod)

**Response envelope** (always):
```json
{ "success": true, "data": <T>, "message": "optional" }
{ "success": false, "message": "error description", "errors": [] }
```

**Paginated response**:
```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 10, "total": 45, "pages": 5 }
}
```

### Auth Routes (`/auth`)
| Method | Path              | Auth      | Description              |
|--------|-------------------|-----------|--------------------------|
| POST   | /auth/register    | Public    | Create account           |
| POST   | /auth/login       | Public    | Login → tokens           |
| POST   | /auth/refresh     | Public    | Refresh access token     |
| POST   | /auth/logout      | Bearer    | Invalidate refresh token |
| GET    | /auth/me          | Bearer    | Get current user         |

### Product Routes (`/products`)
| Method | Path                    | Auth      | Description              |
|--------|-------------------------|-----------|--------------------------|
| GET    | /products               | Public    | List (page, limit, search, category) |
| GET    | /products/:slug         | Public    | Single product by slug   |
| POST   | /products               | Admin     | Create product           |
| PUT    | /products/:id           | Admin     | Update product           |
| DELETE | /products/:id           | Admin     | Soft delete (isActive=false) |
| POST   | /products/:id/images    | Admin     | Upload product images    |

### Category Routes (`/categories`)
| Method | Path               | Auth   | Description              |
|--------|--------------------|--------|--------------------------|
| GET    | /categories        | Public | List all active          |
| GET    | /categories/:slug  | Public | Single category          |
| POST   | /categories        | Admin  | Create                   |
| PUT    | /categories/:id    | Admin  | Update                   |
| DELETE | /categories/:id    | Admin  | Delete                   |

### Cart Routes (`/cart`)
| Method | Path              | Auth   | Description              |
|--------|-------------------|--------|--------------------------|
| GET    | /cart             | Bearer | Get user's cart          |
| POST   | /cart             | Bearer | Add item                 |
| PUT    | /cart/:productId  | Bearer | Update quantity          |
| DELETE | /cart/:productId  | Bearer | Remove item              |
| DELETE | /cart             | Bearer | Clear entire cart        |

### Order Routes (`/orders`)
| Method | Path                    | Auth   | Description              |
|--------|-------------------------|--------|--------------------------|
| GET    | /orders                 | Bearer | Get user's orders (paginated) |
| GET    | /orders/:id             | Bearer | Single order detail      |
| POST   | /orders                 | Bearer | Create order from cart   |
| PATCH  | /orders/:id/status      | Admin  | Update order status      |
| GET    | /admin/orders           | Admin  | All orders (admin view)  |

### Payment Routes (`/payments`)
| Method | Path                       | Auth   | Description                |
|--------|----------------------------|--------|----------------------------|
| POST   | /payments/intent           | Bearer | Create payment intent      |
| POST   | /payments/confirm          | Bearer | Confirm payment            |
| POST   | /payments/refund/:orderId  | Admin  | Issue refund               |

### User Routes (`/users`)
| Method | Path              | Auth   | Description              |
|--------|-------------------|--------|--------------------------|
| GET    | /users/profile    | Bearer | Get profile              |
| PUT    | /users/profile    | Bearer | Update profile           |
| GET    | /users/addresses  | Bearer | List addresses           |
| POST   | /users/addresses  | Bearer | Add address              |
| PUT    | /users/addresses/:id | Bearer | Update address        |
| DELETE | /users/addresses/:id | Bearer | Delete address        |

### Admin Routes (`/admin`)
| Method | Path              | Auth  | Description              |
|--------|-------------------|-------|--------------------------|
| GET    | /admin/users      | Admin | List all users           |
| GET    | /admin/stats      | Admin | Dashboard statistics     |
| GET    | /admin/orders     | Admin | All orders               |

---

## 7. SHARED TYPES (`@repo/types`)

```typescript
// User & Auth
interface User {
  id: string; name: string; email: string;
  role: 'customer' | 'admin'; createdAt: string;
}
interface AuthTokens { accessToken: string; refreshToken: string; }

// Products
interface Product {
  id: string; name: string; slug: string; description: string;
  price: number; comparePrice?: number; stock: number;
  images: string[]; categoryId: string; isActive: boolean; createdAt: string;
}
interface Category { id: string; name: string; slug: string; image?: string; }

// Cart
interface CartItem { productId: string; product: Product; quantity: number; }
interface Cart { items: CartItem[]; total: number; }

// Orders
type OrderStatus = 'pending'|'processing'|'shipped'|'delivered'|'cancelled'|'refunded';
type PaymentStatus = 'pending'|'paid'|'failed'|'refunded';
interface OrderItem { id: string; productId: string; product: Product; quantity: number; price: number; }
interface Order {
  id: string; userId: string; items: OrderItem[]; status: OrderStatus;
  total: number; shippingAddress: Address; paymentMethod: string; createdAt: string;
}

// Address
interface Address {
  id?: string; fullName: string; phone: string;
  city: string; address: string; country: string; isDefault?: boolean;
}

// API Wrappers
interface ApiResponse<T> { success: boolean; data: T; message?: string; }
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: { page: number; limit: number; total: number; pages: number; }
}

// Payment
interface PaymentIntent {
  id: string; amount: number; currency: string;
  status: PaymentStatus; provider: string;
}
```

---

## 8. KEY ARCHITECTURAL DECISIONS

### 8.1 Payment Gateway Abstraction
**Why**: Clients in Iraq need different payment providers. The interface ensures
zero business logic changes when switching gateways.

```typescript
// BACKEND/src/services/payments/payment.gateway.ts
interface IPaymentGateway {
  createPaymentIntent(amount: number, currency: string, metadata: object):
    Promise<{ id: string; clientSecret: string; status: string }>
  confirmPayment(paymentIntentId: string): Promise<{ status: string }>
  refund(paymentIntentId: string, amount?: number): Promise<{ status: string }>
}
```

To add a new gateway: create `new-gateway.ts` implementing `IPaymentGateway`,
update `payment.service.ts` to use it based on env config. ONE file change.

### 8.2 JWT Strategy (Dual Token)
- **Access token**: 15 minutes, stored in memory (Zustand)
- **Refresh token**: 7 days, stored in DB (`user.refreshToken`), HttpOnly cookie
- **Rotation**: Each refresh generates a new refresh token (old one invalidated)
- **Logout**: Clears `user.refreshToken` in DB

### 8.3 Axios Interceptors (Frontend)
Both store and admin have identical interceptor logic:
- **Request**: Auto-attach `Authorization: Bearer <accessToken>`
- **Response on 401**: Clear auth store → redirect to `/login`

### 8.4 Soft Delete for Products
Products are never hard-deleted. `isActive = false` hides them from public
listings while preserving order history integrity (OrderItems still reference them).

### 8.5 SaaS Multi-tenancy Architecture
```
BACKEND/          ← Shared by ALL clients (never duplicated)
FRONTEND/apps/
  ├── store/      ← Client A's storefront
  ├── admin/      ← Shared admin (or per-client if needed)
  └── client-b/   ← Client B's storefront (future)
```
To onboard a new client:
1. `cp -r FRONTEND/apps/store FRONTEND/apps/client-b`
2. Customize branding, colors, layout
3. Point to same BACKEND API URL
4. Deploy to Vercel as separate project

### 8.6 Monorepo with Turborepo
- Shared `@repo/types` package eliminates type drift between frontend and backend
- `turbo run dev` starts all apps in parallel with caching
- Each app has its own `.env` — no shared secrets between apps

---

## 9. ENVIRONMENT VARIABLES

### BACKEND (`BACKEND/.env`)
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_db"

# JWT — generate with: openssl rand -base64 64
JWT_SECRET="minimum-32-character-secret-here"
JWT_REFRESH_SECRET="different-minimum-32-character-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# Optional (stub works without these)
STRIPE_SECRET_KEY=""
CLOUDINARY_URL=""
```

### Store (`FRONTEND/apps/store/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=MyStore
```

### Admin (`FRONTEND/apps/admin/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=MyStore Admin
```

---

## 10. RUNNING THE PROJECT LOCALLY

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL running locally

### First time setup
```bash
# 1. Install all dependencies
cd ecommerce-platform
npm install

# 2. Setup backend env
cd BACKEND
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT secrets

# 3. Setup database
npx prisma generate
npx prisma db push
npx ts-node --project tsconfig.json prisma/seed.ts

# 4. Setup frontend envs
cd ../FRONTEND/apps/store
cp .env.local.example .env.local

cd ../admin
cp .env.local.example .env.local
```

### Daily development (3 terminals)
```bash
# Terminal 1 — Backend API
cd BACKEND && npm run dev
# Runs on http://localhost:5000
# Health check: curl http://localhost:5000/health

# Terminal 2 — Store
cd FRONTEND/apps/store && npm run dev
# Runs on http://localhost:3000

# Terminal 3 — Admin
cd FRONTEND/apps/admin && npm run dev -- --port 3001
# Runs on http://localhost:3001
```

### Or from root (all at once)
```bash
cd ecommerce-platform && npm run dev
```

### Seeded Test Accounts
| Role    | Email                     | Password      |
|---------|---------------------------|---------------|
| Admin   | admin@mystore.com         | admin123      |
| Customer| customer@mystore.com      | customer123   |

### Seeded Data
- 6 categories: Electronics, Clothing, Home & Garden, Sports, Books, Beauty
- 12 products across all categories (with realistic prices and descriptions)
- 1 sample delivered order for the test customer

### Useful Prisma commands
```bash
cd BACKEND
npx prisma studio          # Visual DB browser at localhost:5555
npx prisma migrate dev     # Create a new migration
npx prisma db push         # Push schema without migration file
npx prisma db seed         # Re-run seed
npx prisma generate        # Regenerate client after schema change
```

---

## 11. DEPLOYMENT GUIDE (Production)

### Step 1 — Deploy Backend to Railway
1. Push `BACKEND/` to a GitHub repo (or monorepo root)
2. Create new Railway project → Deploy from GitHub
3. Add PostgreSQL plugin in Railway
4. Set all environment variables (production values):
   - `DATABASE_URL` → from Railway PostgreSQL
   - `JWT_SECRET` → `openssl rand -base64 64`
   - `JWT_REFRESH_SECRET` → `openssl rand -base64 64`
   - `NODE_ENV` → `production`
   - `FRONTEND_URL` → your Vercel store URL
5. Set start command: `npm run build && npm start`
6. Note the Railway API URL (e.g. `https://api-production.railway.app`)

### Step 2 — Deploy Store to Vercel
1. Import `FRONTEND/apps/store` to Vercel
2. Set build settings:
   - Root directory: `FRONTEND/apps/store`
   - Build command: `npm run build`
3. Set env vars:
   - `NEXT_PUBLIC_API_URL` → Railway backend URL + `/api/v1`
4. Deploy → get your store URL

### Step 3 — Deploy Admin to Vercel
1. Same as store, but root directory: `FRONTEND/apps/admin`
2. Deploy on separate Vercel project
3. Consider password-protecting with Vercel authentication

### Step 4 — Configure Cloudinary (Images)
1. Create free Cloudinary account
2. Get `CLOUDINARY_URL` from dashboard
3. Add to Railway env vars
4. Update `BACKEND/src/middlewares/upload.middleware.ts` to use Cloudinary SDK

### Step 5 — Configure Real Payment Gateway
1. Get Stripe keys from stripe.com
2. Add `STRIPE_SECRET_KEY` to Railway env vars
3. Implement `BACKEND/src/services/payments/stripe.gateway.ts`
   (replace stub with real Stripe SDK calls)
4. Update `payment.service.ts` to use the real gateway

---

## 12. CURRENT STATUS & WHAT'S DONE

### ✅ Completed (April 2026)
- [x] Turborepo monorepo structure
- [x] Shared `@repo/types` package (all interfaces)
- [x] Full Express backend (43 endpoints)
- [x] Prisma schema with 8 models
- [x] JWT authentication (access + refresh tokens)
- [x] Payment gateway abstraction (IPaymentGateway)
- [x] Stripe stub implementation (ready for real keys)
- [x] All middleware (auth, error, validation, upload)
- [x] All services (auth, products, orders, payments)
- [x] Zod validation schemas
- [x] Response helpers (sendSuccess, sendError, sendPaginated)
- [x] Next.js store app (18 pages, App Router)
- [x] Zustand cart store with API sync
- [x] Zustand auth store with persist
- [x] Axios with request/response interceptors
- [x] Next.js admin app (12 dashboard pages)
- [x] TanStack Table for products, orders, customers
- [x] Recharts revenue chart
- [x] StatusBadge component (all order/payment statuses)
- [x] Admin route protection middleware
- [x] Seed data (2 users, 6 categories, 12 products, 1 order)
- [x] All environment files and examples
- [x] README with full setup guide

### 🔲 Not Yet Done (Next Priorities)
- [ ] Real Stripe/payment gateway integration
- [ ] Cloudinary image upload (currently local storage)
- [ ] Email notifications (order confirmation, shipping updates)
- [ ] Production deployment (Vercel + Railway)
- [ ] Redis cache for sessions and rate limiting
- [ ] Product reviews and ratings system
- [ ] Coupon/discount code system
- [ ] Inventory alerts (low stock notifications)
- [ ] Multi-language support (Arabic/English)
- [ ] React Native mobile app (iOS + Android)
- [ ] Analytics dashboard (real data from DB)
- [ ] Webhook support for payment providers
- [ ] Customer-facing order tracking page

---

## 13. CODING STANDARDS & RULES

### TypeScript
- **Always** import types from `@repo/types` for shared interfaces
- No `any` types — use proper TypeScript
- All async functions use `async/await` (never callbacks or raw .then())
- All API responses use the `ApiResponse<T>` wrapper

### Backend
- Controllers are thin — only parse request, call service, send response
- Services contain ALL business logic
- Never call Prisma directly from controllers
- Never call Stripe/payment SDKs directly from controllers or services
  — always go through `IPaymentGateway`
- Always validate request body with Zod schema via `validate.middleware.ts`
- Always use `sendSuccess()`, `sendError()`, `sendPaginated()` from `utils/response.ts`
- Never hardcode secrets — always use `config/env.ts`
- Throw `new AppError('message', statusCode)` for expected errors
- Let `error.middleware.ts` handle all error responses

### Frontend
- Pages fetch data — components render it
- All API calls go through `lib/api.ts` — never use fetch() directly
- Form validation always uses React Hook Form + Zod
- Global state in Zustand only — no prop drilling for auth/cart
- Use `cn()` from `lib/utils.ts` for conditional classNames

### Git
- Never commit `.env` files (only `.env.example`)
- Never commit `node_modules/`, `.next/`, `dist/`
- Branch naming: `feature/`, `fix/`, `chore/`

---

## 14. COMMON TASKS & HOW TO DO THEM

### Add a new API endpoint
1. Add Zod schema in `BACKEND/src/schemas/`
2. Add service method in relevant `services/` file
3. Add controller method in relevant `controllers/` file
4. Add route in relevant `routes/` file
5. Test with curl or Postman

### Add a new database model
1. Add model to `BACKEND/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add-model-name`
3. Add types to `FRONTEND/packages/types/src/index.ts`
4. Run `npx prisma generate`
5. Build service + controller + routes

### Add a new store page
1. Create file in `FRONTEND/apps/store/src/app/`
2. Add API function in `lib/api.ts` if needed
3. Use existing components from `components/`

### Add a new admin page
1. Create file in `FRONTEND/apps/admin/src/app/dashboard/`
2. Add to sidebar nav in `components/layout/Sidebar.tsx`
3. Use TanStack Table for data tables

### Onboard a new client (new store frontend)
```bash
cp -r FRONTEND/apps/store FRONTEND/apps/new-client
cd FRONTEND/apps/new-client
# Update package.json name
# Customize tailwind.config.js (colors, fonts)
# Update .env.local with API URL
# Customize components/layout/Header.tsx and Footer.tsx
# Deploy as new Vercel project
```

### Switch payment gateway
1. Create `BACKEND/src/services/payments/new-gateway.ts`
2. Implement `IPaymentGateway` interface
3. In `payment.service.ts`, change which gateway is instantiated
4. Add required env vars to `.env`

---

## 15. TROUBLESHOOTING

### "Cannot find module '@repo/types'"
```bash
cd ecommerce-platform && npm install
```
Turborepo workspace links are reset on fresh installs.

### Prisma Client not generated
```bash
cd BACKEND && npx prisma generate
```

### TypeScript errors after schema change
```bash
cd BACKEND
npx prisma generate   # Regenerate Prisma types
npx tsc --noEmit      # Check for errors
```

### Database connection refused
1. Ensure PostgreSQL is running: `pg_isready`
2. Check `DATABASE_URL` in `BACKEND/.env`
3. Ensure database exists: `createdb ecommerce_db`

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Admin redirecting to login loop
Check that `NEXT_PUBLIC_API_URL` in admin `.env.local` is correct and the
backend is running. The middleware checks for a valid token via the auth store.

---

## 16. FUTURE ROADMAP

### Phase 2 — Production Ready (Next)
- Real payment gateway (Stripe or Tap Payments for MENA)
- Cloudinary image hosting
- Email service (Resend or SendGrid) for order notifications
- Deploy to Vercel + Railway
- Domain and SSL setup

### Phase 3 — Feature Complete
- Product reviews and ratings
- Coupon and discount system
- Wishlist (currently UI exists, needs API)
- Advanced search with filters (price range, brand, rating)
- Inventory management with low-stock alerts
- Order tracking with status timeline

### Phase 4 — Scale
- Redis for caching (product listings, sessions)
- Background job queue (Bull/BullMQ) for emails, reports
- Analytics dashboard with real DB queries
- Multi-language (Arabic RTL support)
- Multi-currency (IQD, USD, SAR)

### Phase 5 — Mobile
- React Native app (Expo)
- Connects to same BACKEND API — zero changes needed
- iOS + Android deployment

### Phase 6 — SaaS Expansion
- Client #2 frontend (new Vercel project, same backend)
- Client #3 frontend
- Admin becomes multi-tenant (each admin sees only their data)
- Tenant isolation at DB level (schema per tenant or row-level security)

---

## 17. IMPORTANT NOTES FOR CLAUDE AI

1. **This is a monorepo** — always be aware of which workspace you're editing.
   Run commands from the correct directory.

2. **The payment gateway is intentionally a stub** — do not replace it with
   real Stripe code unless Ghaith explicitly asks. The stub is there so the
   project runs without real keys.

3. **Never hard-delete products** — always set `isActive = false`. Order history
   depends on product records existing.

4. **The `@repo/types` package is the source of truth for types** — if you
   add a new field to the Prisma schema, update `@repo/types` too.

5. **The admin and store are separate Next.js apps** — changes to one do not
   affect the other. They share types but nothing else.

6. **Always ask before making destructive database changes** — migrations that
   drop columns or tables need explicit confirmation.

7. **Ghaith works iteratively** — present findings before implementing fixes.
   Show what's wrong, explain the fix, then implement.

8. **The business context is Iraq/MENA** — keep payment providers, currency
   formatting (IQD), and RTL considerations in mind for future features.

9. **WhatsApp contact number must not be changed** — this applies to any
   SoftoDev company information in any frontend.

10. **Security first** — never log JWT secrets, passwords, or tokens.
    Never expose admin routes without `requireAdmin` middleware.

---

*End of CLAUDE.md — Version 1.0 — SoftoDev E-Commerce Platform*
*This file should be updated whenever major architectural changes are made.*
