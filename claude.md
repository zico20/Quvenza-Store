# CLAUDE.md — Complete Project Intelligence File
# E-Commerce Platform by SoftoDev (softodeviqstore.com)
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
| Domain           | softodeviqstore.com                             |
| Location         | Baghdad, Iraq                              |
| Primary market   | Iraq → regional → international            |
| Business model   | Template product: per-client full deployment |
| Project root     | `ecommerce-platform/`                      |
| Status           | Scaffold 100% complete, locally runnable   |
| Started          | April 2026                                 |

---

## 2. FINAL VISION & BUSINESS GOAL

This is a **template product**, not a SaaS platform:

- SoftoDev builds one polished template (this codebase).
- Each client purchases and receives their own full deployment.
- There is no shared backend between clients.
- Each client has their own server, database, and domain.
- Customization per client is branding-focused (colors, logo, name).
- Backend logic stays identical across all deployments.

### Target client types:
1. General merchandise stores (clothing, electronics, etc.)
2. Food & restaurant ordering
3. Digital product stores (software, courses)
4. Any B2C business in Iraq/MENA region

### Revenue model for SoftoDev:
- One-time template deployment fee
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
│           │   │       ├── page.tsx         ← Enhanced: stats, charts, recent orders, top products
│           │   │       ├── products/
│           │   │       │   ├── page.tsx     ← TanStack Table, all products
│           │   │       │   ├── new/page.tsx ← Create product form
│           │   │       │   └── [id]/page.tsx← Edit form + image manager + delete
│           │   │       ├── orders/
│           │   │       │   ├── page.tsx     ← Orders table, status filter, search, export
│           │   │       │   └── [id]/page.tsx← Detail: items, info, status update, timeline
│           │   │       ├── categories/
│           │   │       │   └── page.tsx     ← CRUD with modal dialog
│           │   │       ├── customers/
│           │   │       │   ├── page.tsx     ← Server-side search/pagination, toggle status
│           │   │       │   └── [id]/page.tsx← Detail: stats, order history, addresses
│           │   │       └── notifications/
│           │   │           └── page.tsx     ← TanStack Table, filter tabs, mark-all-read
│           │   ├── components/
│           │   │   ├── ui/                  ← shadcn/ui components
│           │   │   ├── layout/
│           │   │   │   ├── Sidebar.tsx      ← Nav links with active state (+ Notifications)
│           │   │   │   └── Topbar.tsx       ← Page title + bell dropdown + user menu
│           │   │   ├── dashboard/
│           │   │   │   ├── StatsCard.tsx    ← Revenue, orders, products, users
│           │   │   │   ├── RevenueChart.tsx ← Recharts AreaChart, 30-day data
│           │   │   │   ├── RecentOrders.tsx ← Last 5 orders with status badges
│           │   │   │   ├── TopProducts.tsx  ← Top 5 by units sold with progress bars
│           │   │   │   ├── OrderStatusChart.tsx ← Recharts PieChart donut by status
│           │   │   │   ├── SalesByCategoryChart.tsx ← Recharts BarChart by category
│           │   │   │   └── LowStockAlert.tsx← Fetches + lists products at/near 0 stock
│           │   │   ├── orders/
│           │   │   │   ├── StatusBadge.tsx  ← Color-coded status pill
│           │   │   │   ├── OrderTimeline.tsx← Status history timeline (Agent B)
│           │   │   │   └── StatusChangeModal.tsx ← Confirm status update (Agent B)
│           │   │   └── products/
│           │   │       ├── ProductForm.tsx  ← Shared create/edit form
│           │   │       └── ImageUpload.tsx  ← Drag-drop image upload
│           │   ├── middleware.ts            ← Protects /dashboard/* → /login
│           │   ├── lib/
│           │   │   ├── api.ts               ← Admin Axios instance (+ adminStats, adminNotifications, adminCustomers)
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
    │   │   ├── admin.routes.ts
    │   │   └── notification.routes.ts       ← Admin-only notification endpoints
    │   ├── controllers/
    │   │   ├── auth.controller.ts
    │   │   ├── product.controller.ts        ← + getLowStock handler
    │   │   ├── category.controller.ts
    │   │   ├── cart.controller.ts
    │   │   ├── order.controller.ts          ← + getAdminOrders, exportOrders, downloadInvoice
    │   │   ├── payment.controller.ts
    │   │   ├── user.controller.ts
    │   │   ├── admin.controller.ts          ← getAdminStats, getCustomers, getCustomerDetail, toggleCustomerStatus
    │   │   └── notification.controller.ts   ← getNotifications, getUnreadCount, markAsRead, markAllAsRead, delete
    │   ├── services/
    │   │   ├── auth/
    │   │   │   ├── auth.service.ts          ← register (+ onNewCustomer trigger), login (+ isActive check), refresh, logout
    │   │   │   └── token.service.ts         ← generateTokens, verifyToken
    │   │   ├── products/
    │   │   │   └── product.service.ts       ← CRUD, search, filter, pagination, + getLowStockProducts
    │   │   ├── orders/
    │   │   │   ├── order.service.ts         ← createOrder (+ notifications), updateStatus (+ history + notifications), getAdminOrders
    │   │   │   ├── order-export.service.ts  ← ExcelJS export (Agent B)
    │   │   │   └── invoice.service.ts       ← PDFKit invoice (Agent B)
    │   │   ├── notifications/
    │   │   │   ├── notification.service.ts  ← create, getAll, getUnreadCount, markAsRead, markAllAsRead, delete
    │   │   │   └── notification.triggers.ts ← onNewOrder, onLowStock, onNewCustomer, onOrderStatusChanged
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
    │   ├── schema.prisma                    ← Full DB schema (10 models + NotificationType enum)
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

Order ─────────────┬── OrderItem (1:many)
                   └── OrderStatusHistory (1:many)

Notification ─── (standalone admin notifications log)
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
  isActive     Boolean   @default(true)      // ← added: disabled accounts cannot login
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
  price        Decimal     @db.Decimal(10, 2)   // ← was Float, changed for precision
  comparePrice Decimal?    @db.Decimal(10, 2)   // ← was Float?
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
  id              String               @id @default(cuid())
  userId          String
  user            User                 @relation(...)
  status          OrderStatus          @default(PENDING)
  total           Decimal              @db.Decimal(10, 2)   // ← was Float
  paymentMethod   String
  paymentStatus   PaymentStatus        @default(PENDING)
  shippingAddress Json
  items           OrderItem[]
  statusHistory   OrderStatusHistory[]  // ← added: audit trail
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
}

model OrderStatusHistory {
  id         String      @id @default(cuid())
  orderId    String
  order      Order       @relation(...)
  fromStatus OrderStatus?
  toStatus   OrderStatus
  note       String?
  changedBy  String?     // adminId who made the change
  createdAt  DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(...)
  productId String
  product   Product @relation(...)
  quantity  Int
  price     Decimal @db.Decimal(10, 2)   // ← was Float
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

model Notification {
  id        String           @id @default(cuid())
  type      NotificationType
  title     String
  message   String
  data      Json?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())
}

enum Role             { USER ADMIN }
enum OrderStatus      { PENDING PROCESSING SHIPPED DELIVERED CANCELLED REFUNDED }
enum PaymentStatus    { PENDING PAID FAILED REFUNDED }
enum NotificationType { NEW_ORDER LOW_STOCK NEW_CUSTOMER ORDER_STATUS_CHANGED }
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
| Method | Path                              | Auth  | Description                                       |
|--------|-----------------------------------|-------|---------------------------------------------------|
| GET    | /admin/stats                      | Admin | Enhanced dashboard: today/yesterday, charts data  |
| GET    | /admin/orders                     | Admin | All orders (search, status, date, sort, paginate) |
| GET    | /admin/orders/export              | Admin | Export orders to Excel (.xlsx)                    |
| GET    | /admin/orders/:id                 | Admin | Single order with status history                  |
| PATCH  | /admin/orders/:id/status          | Admin | Update status (validated transitions)             |
| GET    | /admin/orders/:id/invoice         | Admin | Download PDF invoice                              |
| GET    | /admin/products/low-stock         | Admin | Products at/near 0 stock (threshold query param)  |
| GET    | /admin/customers                  | Admin | Customer list (search, pagination)                |
| GET    | /admin/customers/:id              | Admin | Customer detail: stats, orders, addresses         |
| PATCH  | /admin/customers/:id/toggle-status| Admin | Activate / deactivate customer account            |

### Notification Routes (`/notifications`) — Admin only
| Method | Path                    | Auth  | Description                        |
|--------|-------------------------|-------|------------------------------------|
| GET    | /notifications          | Admin | List notifications (paginated, unreadOnly param) |
| GET    | /notifications/unread-count | Admin | Count of unread notifications   |
| PATCH  | /notifications/read-all | Admin | Mark all as read                   |
| PATCH  | /notifications/:id/read | Admin | Mark single notification as read   |
| DELETE | /notifications/:id      | Admin | Delete notification                |

---

## 7. SHARED TYPES (`@repo/types`)

```typescript
// User & Auth
interface User {
  id: string; name: string; email: string;
  role: 'USER' | 'ADMIN'; createdAt: string;   // UPPERCASE — matches Prisma Role enum
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

// Orders — all statuses UPPERCASE, matching Prisma enums exactly
type OrderStatus = 'PENDING'|'PROCESSING'|'SHIPPED'|'DELIVERED'|'CANCELLED'|'REFUNDED';
type PaymentStatus = 'PENDING'|'PAID'|'FAILED'|'REFUNDED';
interface OrderItem { id: string; productId: string; product: Product; quantity: number; price: number; }
interface Order {
  id: string; userId: string; items: OrderItem[]; status: OrderStatus;
  paymentStatus: PaymentStatus;   // added — was missing from original type
  total: number; shippingAddress: Address; paymentMethod: string; createdAt: string;
}

// Address — Iraq-specific fields added
interface Address {
  id?: string; fullName: string; phone: string;
  governorate: string; city: string; address: string;
  nearestLandmark?: string; country: string; isDefault?: boolean;
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

// Order Status History (Agent B)
interface OrderStatusHistory {
  id: string; orderId: string;
  fromStatus: OrderStatus | null; toStatus: OrderStatus;
  note?: string; changedBy?: string; createdAt: string;
}

// Notifications (Admin only)
type NotificationType = 'NEW_ORDER' | 'LOW_STOCK' | 'NEW_CUSTOMER' | 'ORDER_STATUS_CHANGED';
interface Notification {
  id: string; type: NotificationType; title: string; message: string;
  data?: Record<string, unknown>; isRead: boolean; createdAt: string;
}

// Customer Management
interface CustomerSummary {
  id: string; name: string; email: string; isActive: boolean; createdAt: string;
  totalOrders: number; lastOrderDate: string | null; lastOrderTotal: number | null;
}
interface CustomerDetail extends CustomerSummary {
  role: string;
  orders: Order[];
  addresses: Address[];
  totalSpent: number;
}

// Dashboard Stats
interface DashboardStats {
  overview: { totalOrders: number; totalRevenue: number; totalProducts: number; totalUsers: number; lowStockCount: number; };
  today: { orders: number; revenue: number; };
  yesterday: { orders: number; revenue: number; };
  recentOrders: Array<{ id: string; total: number; status: OrderStatus; createdAt: string; user: { name: string; email: string; }; }>;
  topProducts: Array<{ productId: string; name: string; price: number; images: string[]; totalSold: number; }>;
  ordersByStatus: Array<{ status: OrderStatus; count: number; }>;
  salesByCategory: Array<{ name: string; total: number; }>;
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

### 8.5 Template Deployment Architecture
```
Template Repo (this project)
  ├── BACKEND/
  └── FRONTEND/apps/{store, admin}

Client A deployment
  ├── backend-a
  ├── store-a
  └── admin-a

Client B deployment
  ├── backend-b
  ├── store-b
  └── admin-b
```
To onboard a new client:
1. Clone template repo into a new client project
2. Set up a dedicated backend and database for that client
3. Customize branding (name, colors, logo, content)
4. Deploy client frontend/admin/backend on client-specific infrastructure

### 8.6 Monorepo with Turborepo
- Shared `@repo/types` package eliminates type drift between frontend and backend
- `turbo run dev` starts all apps in parallel with caching
- Each app has its own `.env` — no shared secrets between apps

### 8.7 Branding Config Layer
Each app has a single config file as the source of truth for all
client-specific strings. To customize for a new client, edit ONE file:
- Store: `FRONTEND/apps/store/src/config/store.config.ts`
- Admin: `FRONTEND/apps/admin/src/config/admin.config.ts`

Fields: name, tagline, support email/hours, legal URLs, currency, locale, copyright.
`formatPrice()` in both apps reads `currency` and `locale` from config.
Never hardcode brand strings in components — always reference the config.

### 8.8 Admin Auth Strategy (Cookie-Based Persist)
Admin route protection uses Next.js middleware (`middleware.ts`) reading a
cookie set by Zustand persist. The store writes to `document.cookie` via a
custom `cookieStorage` adapter (not `localStorage`) so the middleware
(which runs server-side/edge) can read the value.

The middleware checks:
1. Cookie `admin-auth-storage` exists
2. `state.accessToken` is present
3. `state.user.role === 'ADMIN'`

All three must pass to enter `/dashboard`. This eliminates the former
redirect-loop bug where a non-admin token granted dashboard access.

Auth store: `FRONTEND/apps/admin/src/store/auth.store.ts`
Middleware: `FRONTEND/apps/admin/src/middleware.ts`

### 8.9 Atomic Stock Protection
Order creation uses a conditional atomic decrement inside a Prisma transaction
to prevent overselling under concurrent load:

```typescript
const updated = await tx.product.updateMany({
  where: { id: productId, stock: { gte: quantity }, isActive: true },
  data: { stock: { decrement: quantity } },
});
if (updated.count === 0) throw new AppError('"Product" is out of stock.', 409);
```

If stock drops below the required quantity between the pre-fetch and the
transaction (concurrent request), `updateMany` matches 0 rows → the whole
transaction rolls back automatically → 409 returned to client.
Pre-transaction stock checks were removed (redundant and race-prone).

### 8.10 Money Precision
All financial fields use `Decimal @db.Decimal(10,2)` in Prisma (was `Float`).
Prisma serializes `Decimal` as a **string** in JSON responses.
- Backend: wrap in `Number()` before any arithmetic (e.g. `Number(order.total) * 100`)
- Frontend: `formatPrice(value: number | string)` passes through `Number(value)`
- Never use raw float arithmetic on price/total fields.

### 8.11 Enum Casing Convention
All enums are **UPPERCASE** everywhere — Prisma schema, `@repo/types`, and
all frontend comparisons. Never use lowercase enum values.

```
OrderStatus:   PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED
PaymentStatus: PENDING | PAID | FAILED | REFUNDED
User.role:     USER | ADMIN
```

If you see a lowercase comparison like `status === 'pending'` or
`role === 'admin'`, it is a bug — fix it to uppercase immediately.

### 8.12 Notification System Architecture
Notifications are a **fire-and-forget** admin logging mechanism — never block main operations.

Four trigger points:
- `createOrder` → `onNewOrder(orderId, total)` — fires after transaction commits
- `createOrder` → `onLowStock(productId, name, stock)` — collected during tx, fired after commit
- `auth.register` → `onNewCustomer(userId, name)` — fires after token storage
- `updateOrderStatus` → `onOrderStatusChanged(orderId, oldStatus, newStatus)` — fires after tx

**Critical rule**: notification triggers MUST be called OUTSIDE Prisma `$transaction` callbacks.
If fired inside a transaction that rolls back, the notification would be created but the business
operation would be reverted — a false alert. The low-stock pattern collects `lowStockProducts[]`
inside the tx (read only), then fires triggers after the tx resolves.

All triggers use `.catch(console.error)` — a failure to create a notification must never
prevent an order from being placed or a user from registering.

### 8.13 Order Status Transition Validation
Status changes are constrained by a `VALID_TRANSITIONS` map in `order.service.ts`:
```
PENDING    → PROCESSING | CANCELLED
PROCESSING → SHIPPED    | CANCELLED
SHIPPED    → DELIVERED  | CANCELLED
DELIVERED  → REFUNDED
CANCELLED  → (terminal)
REFUNDED   → (terminal)
```
Attempting an invalid transition throws `AppError(..., 400)`.
When status changes to `CANCELLED`, stock is restored for all order items (outside the transaction).
Status changes are logged to `OrderStatusHistory` with `fromStatus`, `toStatus`, `note`, and `changedBy` (adminId).

### 8.14 Order Export and Invoice
Two separate services handle bulk export and per-order PDF:
- `order-export.service.ts` (Agent B): Uses **ExcelJS** to generate `.xlsx` from filtered orders.
  Returns a `Buffer`; controller sets `Content-Disposition: attachment; filename=orders-{ts}.xlsx`.
- `invoice.service.ts` (Agent B): Uses **PDFKit** to generate a per-order PDF invoice.
  Returns a `Buffer`; controller sets `Content-Disposition: attachment; filename=invoice-{id8}.pdf`.

The export route (`GET /admin/orders/export`) must be registered BEFORE `GET /admin/orders/:id`
in `admin.routes.ts` — Express path matching is first-match, and `/export` would otherwise be
treated as an `:id` parameter.

### 8.15 Customer Management
Admin customer management is separate from the general user system:
- `getCustomers`: filters `role: 'USER'` only; includes computed `totalOrders`, `lastOrderDate`,
  `lastOrderTotal` via aggregation; supports `search` (name/email) and pagination.
- `getCustomerDetail`: returns full order history with items+products; computes `totalSpent`.
- `toggleCustomerStatus`: checks that the target user is not an ADMIN before toggling `isActive`.
  A disabled customer receives a 403 on login (`Account is disabled. Contact support.`).
- ADMIN accounts can never be toggled via this endpoint (returns 403 if attempted).

---

## 9. ENVIRONMENT VARIABLES

### BACKEND (`BACKEND/.env`)
```env
# Database
# Note: local dev on this machine uses sami:sami123 — change before production
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
- [x] Admin auth fixed (cookie-based Zustand persist + role guard in middleware)
- [x] Payment/refund authorization (ownership check on initiate/confirm + requireAdmin on refund)
- [x] Admin order detail endpoint (GET /admin/orders/:id — admin-scoped, no userId filter)
- [x] Enum casing normalized (UPPERCASE throughout Prisma, @repo/types, and all frontend comparisons)
- [x] Money precision (Float → Decimal @db.Decimal(10,2) for price, comparePrice, total, OrderItem.price)
- [x] Stock race condition fixed (atomic updateMany with stock: { gte: quantity } guard inside transaction)
- [x] Branding config layer (store.config.ts + admin.config.ts — single file per-client customization)
- [x] Category page working (fetches real products by categoryId, renders ProductGrid)
- [x] Privacy and Terms pages created (dark-styled, use storeConfig values)
- [x] Dead links and placeholder interactions removed (forgot password link, customer row console.log)
- [x] UI consistency pass (store StatusBadge component, account orders page, dark tokens unified)
- [x] Iraq address system (18 governorates + cities, AddressForm component with proper fields)
- [x] Wishlist system (heart button on ProductCard, Zustand wishlist store, wishlist page)
- [x] Product detail page fixed (correct slug-based navigation, no more 404)
- [x] Notification system (Prisma model, service, triggers, controller, routes — admin-only)
- [x] Notification triggers wired into order creation, status changes, new customer registration, low-stock detection
- [x] Enhanced dashboard stats (today/yesterday comparison, topProducts, ordersByStatus, salesByCategory)
- [x] Dashboard rebuilt with 4-row layout: StatsCards, RevenueChart+OrderStatusChart, RecentOrders+TopProducts, SalesByCategoryChart+LowStockAlert
- [x] Topbar bell: real-time unread count badge (30s polling), dropdown with last 5 notifications, mark-as-read on click
- [x] Notifications page: TanStack Table, filter tabs (ALL/UNREAD/by type), mark-all-read, delete
- [x] Order export to Excel (.xlsx via ExcelJS) and PDF invoice generation (PDFKit) — Agent B
- [x] Order status history audit trail (OrderStatusHistory model + OrderTimeline component) — Agent B
- [x] Advanced order management: server-side search, date range, payment status filter, sort — Agent B
- [x] Customer management: server-side search/pagination, toggle isActive, detail page with stats+orders+addresses
- [x] Low-stock alert widget on dashboard + GET /admin/products/low-stock endpoint
- [x] User.isActive field (disabled accounts receive 403 on login)

### 🔲 Not Yet Done (Next Priorities)
- [ ] Cloudinary image hosting (currently local disk — won't persist on Vercel/Railway)
- [ ] Real payment gateway (Stripe stub ready, needs live keys)
- [ ] Email notifications (order confirmation, shipping updates)
- [ ] Production deployment (Vercel + Railway)
- [ ] Prisma migration history (currently using db push — needs proper migrate dev before production)
- [ ] Redis cache for sessions and rate limiting
- [ ] Product reviews and ratings system
- [ ] Coupon/discount code system
- [ ] Multi-language support (Arabic RTL)
- [ ] React Native mobile app (iOS + Android)
- [ ] Search page completion

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

### Customize for a new client
1. Edit `FRONTEND/apps/store/src/config/store.config.ts`
   - Change `name`, `tagline`, `support.email`, `currency`, `legal.privacyUrl`, `legal.termsUrl`
2. Edit `FRONTEND/apps/admin/src/config/admin.config.ts`
   - Change `storeName`, `adminTitle`, `support.email`
3. Update Tailwind theme colors in both `tailwind.config.ts` files if needed
4. Replace logo/brand mark in `Header.tsx` if the client has one
5. Deploy as a new Vercel project pointing to the client's dedicated backend

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
- Connects to the same client BACKEND API — zero logic changes needed
- iOS + Android deployment

### Phase 6 — Template Business Expansion
- Package vertical starter variants (fashion, electronics, food)
- Build guided branding/config onboarding for faster client launches
- Standardize deployment playbooks per client infrastructure
- Add optional premium modules without changing core backend logic

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

11. **Enum values are UPPERCASE everywhere** — never write lowercase comparisons
    like `status === 'pending'`. Always `status === 'PENDING'`. Same for
    `role === 'ADMIN'` (not `'admin'`). See section 8.11.

12. **Price/total fields are Decimal in Prisma** — always wrap in `Number()`
    before arithmetic. `formatPrice()` accepts `number | string` and handles
    Prisma's JSON string serialization transparently. See section 8.10.

13. **Admin auth uses cookie-based Zustand persist + Next.js middleware** —
    the middleware reads the `admin-auth-storage` cookie and checks both token
    presence AND `user.role === 'ADMIN'`. Do not revert to localStorage for
    admin auth — the middleware cannot read it. See section 8.8.

14. **To customize for a new client, edit config files only** —
    `FRONTEND/apps/store/src/config/store.config.ts` and
    `FRONTEND/apps/admin/src/config/admin.config.ts`.
    Never hardcode brand strings (store name, email, tagline) in components.

15. **The Iraq address system must not be replaced with a generic form** —
    it uses 18 Iraqi governorates with dependent city dropdowns.
    Key files:
    - `FRONTEND/apps/store/src/lib/iraq-locations.ts`
    - `FRONTEND/apps/store/src/components/checkout/AddressForm.tsx`

16. **Notification triggers must never fire inside a Prisma `$transaction` callback** —
    the callback may be retried or rolled back. Collect data during the transaction,
    then fire triggers after it resolves. All triggers use `.catch(console.error)` to
    remain non-blocking. See section 8.12.

17. **Order status changes are validated against VALID_TRANSITIONS** — arbitrary status
    updates are rejected with 400. Do not bypass this map. When an order is CANCELLED,
    stock is restored automatically outside the transaction. See section 8.13.

18. **The export route must stay BEFORE the `:id` route in admin.routes.ts** —
    `GET /admin/orders/export` must be declared before `GET /admin/orders/:id`.
    Express does first-match routing; reversing the order makes `/export` match as an
    order ID and returns 404. Same applies to any future fixed sub-routes on orders.

19. **Never toggle ADMIN account status via the customer toggle endpoint** —
    `toggleCustomerStatus` explicitly checks `user.role !== 'ADMIN'` and returns 403.
    Admin accounts can only be managed directly in the database.

20. **Recharts Tooltip `formatter` receives `ValueType | undefined`** — when writing
    custom formatter callbacks for Recharts charts, do not annotate `v` as `number`.
    Use `Number(v ?? 0)` to safely convert to number. Explicit type annotations that
    conflict with `Formatter<ValueType, NameType>` cause TypeScript compilation errors
    in the admin app. See `SalesByCategoryChart.tsx` and `OrderStatusChart.tsx`.

---

*End of CLAUDE.md — Version 1.4 — SoftoDev E-Commerce Platform*
*Last updated: April 2026 — Post Agent A+B parallel development session: notifications, enhanced dashboard, order export/invoice/timeline, customer management*
*This file should be updated whenever major architectural changes are made.*

<!-- SPECKIT START -->
## Active Spec-Kit Feature

- **Feature**: Voltage Storefront & Admin Redesign
- **Branch**: `001-voltage-storefront-redesign`
- **Plan**: `specs/001-voltage-storefront-redesign/plan.md`
- **Note**: Live project is a single Next.js 16 / React 19 / Tailwind v4 app under `src/` (not the legacy monorepo described above). Treat `src/` as ground truth. Redesign is presentation-layer only — no routes/API/data-model/enum changes.
<!-- SPECKIT END -->

