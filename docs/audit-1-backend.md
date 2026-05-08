# 🔍 Backend Surface Audit Report

**Date:** 2026-05-08
**Scope:** BACKEND/ directory of softodev-store project
**Mode:** Read-only analysis
**Purpose:** Migration planning to Next.js full-stack

---

## 📊 Executive Summary

### Backend by Numbers

| Metric | Count |
|--------|-------|
| Total endpoints | **55** (CLAUDE.md says 43 — 12 admin-user-management endpoints added since last update) |
| Total controller files | 10 |
| Total service files | 11 |
| Total middleware files | 4 |
| Total Zod schema files | 7 |
| Total dependencies (prod) | 14 |
| Total dependencies (dev) | 14 |
| Controllers bypassing service layer | **6 / 10** |

### Migration Complexity Score: 6 / 10

**Justification:**
- The auth, order, product, payment, and notification flows are cleanly layered and will migrate with minimal friction.
- Six controllers (user, cart, category, admin, admin-user, auth `/me`) call Prisma directly — these require a service extraction pass before migration.
- Local filesystem uploads (`multer` → `./uploads/`) are the single biggest blocker for Vercel: they will silently break on deploy.
- The Express HTTP layer (express, cors, helmet, morgan, express-rate-limit) wraps everything but is entirely replaceable with Next.js API Routes — no business logic is in those layers.
- All Zod schemas are pure TypeScript with zero Express dependencies and can be copied 1:1.
- Prisma is fully Vercel-compatible.

### Critical Migration Risks

1. 🚨 **Local filesystem uploads** — `multer.diskStorage` writes to `BACKEND/uploads/`. Vercel's filesystem is ephemeral; files are lost between deployments. The `express.static('/uploads')` endpoint will 404 in production. **Must migrate to Cloudinary (already installed) before any Vercel deploy.**
2. 🚨 **Six controllers bypass the service layer** — Direct Prisma calls in `user`, `cart`, `category`, `admin`, `admin-user` controllers mean migrating those routes requires either lifting business logic to services first, or rewriting queries inline in Next.js route handlers.
3. 🚨 **Stripe is a stub** — `stripe.gateway.ts` returns fake payment IDs. All payment endpoints appear to work but process no real money. Must be replaced with live Stripe SDK before production.

### Quick Wins (easy to migrate)

1. ⚡ **Auth service** (`auth.service.ts`, `token.service.ts`) — no Express coupling, clean interface, pure async functions. Copy directly into Next.js `lib/`.
2. ⚡ **All 7 Zod schema files** — zero Express dependencies, copy 1:1 into new project.
3. ⚡ **Notification, order, product, payment services** — properly abstracted, no filesystem or Express coupling. Copy directly.

---

## 1. Endpoint Inventory

### Route Mounting (from `BACKEND/src/routes/index.ts`)

| Prefix | Route File |
|--------|-----------|
| `/api/v1/auth` | auth.routes.ts |
| `/api/v1/products` | product.routes.ts |
| `/api/v1/categories` | category.routes.ts |
| `/api/v1/cart` | cart.routes.ts |
| `/api/v1/orders` | order.routes.ts |
| `/api/v1/payments` | payment.routes.ts |
| `/api/v1/users` | user.routes.ts |
| `/api/v1/admin` | admin.routes.ts |
| `/api/v1/notifications` | notification.routes.ts |

### Complete Endpoint Table

| # | Method | Full Path | Auth | Middleware Chain | Controller Fn | Schema | File |
|---|--------|-----------|------|-----------------|---------------|--------|------|
| **AUTH** |
| 1 | POST | `/api/v1/auth/register` | Public | `rateLimit(10/15m)`, `validate(registerSchema)` | `registerController` | registerSchema | auth.routes.ts |
| 2 | POST | `/api/v1/auth/login` | Public | `rateLimit(10/15m)`, `validate(loginSchema)` | `loginController` | loginSchema | auth.routes.ts |
| 3 | POST | `/api/v1/auth/refresh` | Public | `validate(refreshTokenSchema)` | `refreshController` | refreshTokenSchema | auth.routes.ts |
| 4 | POST | `/api/v1/auth/logout` | Bearer | `verifyToken` | `logoutController` | — | auth.routes.ts |
| 5 | GET | `/api/v1/auth/me` | Bearer | `verifyToken` | `meController` | — | auth.routes.ts |
| **USERS** |
| 6 | GET | `/api/v1/users/profile` | Bearer | `verifyToken` | `getProfile` | — | user.routes.ts |
| 7 | PUT | `/api/v1/users/profile` | Bearer | `verifyToken`, `validate(updateProfileSchema)` | `updateProfile` | updateProfileSchema | user.routes.ts |
| 8 | POST | `/api/v1/users/change-password` | Bearer | `verifyToken` | `changePassword` | 🚨 **NO SCHEMA** | user.routes.ts |
| 9 | GET | `/api/v1/users/addresses` | Bearer | `verifyToken` | `getAddresses` | — | user.routes.ts |
| 10 | POST | `/api/v1/users/addresses` | Bearer | `verifyToken`, `validate(addAddressSchema)` | `addAddress` | addAddressSchema | user.routes.ts |
| 11 | DELETE | `/api/v1/users/addresses/:id` | Bearer | `verifyToken` | `deleteAddress` | — | user.routes.ts |
| **PRODUCTS** |
| 12 | GET | `/api/v1/products` | Public | — | `listProducts` | — | product.routes.ts |
| 13 | GET | `/api/v1/products/:slug` | Public | — | `getProduct` | — | product.routes.ts |
| 14 | POST | `/api/v1/products` | Admin | `verifyToken`, `requireAdmin`, `validate(createProductSchema)` | `createProduct` | createProductSchema | product.routes.ts |
| 15 | PUT | `/api/v1/products/:id` | Admin | `verifyToken`, `requireAdmin`, `validate(updateProductSchema)` | `updateProduct` | updateProductSchema | product.routes.ts |
| 16 | DELETE | `/api/v1/products/:id` | Admin | `verifyToken`, `requireAdmin` | `deleteProduct` | — | product.routes.ts |
| 17 | POST | `/api/v1/products/:id/images` | Admin | `verifyToken`, `requireAdmin`, `upload.array('images', 10)` | `uploadProductImages` | — **MULTER** | product.routes.ts |
| **CATEGORIES** |
| 18 | GET | `/api/v1/categories` | Public | — | `listCategories` | — | category.routes.ts |
| 19 | GET | `/api/v1/categories/:slug` | Public | — | `getCategory` | — | category.routes.ts |
| 20 | POST | `/api/v1/categories` | Admin | `verifyToken`, `requireAdmin`, `validate(createCategorySchema)` | `createCategory` | createCategorySchema | category.routes.ts |
| 21 | PUT | `/api/v1/categories/:id` | Admin | `verifyToken`, `requireAdmin`, `validate(updateCategorySchema)` | `updateCategory` | updateCategorySchema | category.routes.ts |
| 22 | DELETE | `/api/v1/categories/:id` | Admin | `verifyToken`, `requireAdmin` | `deleteCategory` | — | category.routes.ts |
| **CART** |
| 23 | GET | `/api/v1/cart` | Bearer | `verifyToken` | `getCart` | — | cart.routes.ts |
| 24 | POST | `/api/v1/cart/items` | Bearer | `verifyToken`, `validate(addToCartSchema)` | `addToCart` | addToCartSchema | cart.routes.ts |
| 25 | PATCH | `/api/v1/cart/items/:itemId` | Bearer | `verifyToken`, `validate(updateCartItemSchema)` | `updateCartItem` | updateCartItemSchema | cart.routes.ts |
| 26 | DELETE | `/api/v1/cart/items/:itemId` | Bearer | `verifyToken` | `removeFromCart` | — | cart.routes.ts |
| 27 | DELETE | `/api/v1/cart` | Bearer | `verifyToken` | `clearCart` | — | cart.routes.ts |
| **ORDERS** |
| 28 | POST | `/api/v1/orders` | Bearer | `verifyToken`, `validate(createOrderSchema)` | `createOrder` | createOrderSchema | order.routes.ts |
| 29 | GET | `/api/v1/orders` | Bearer | `verifyToken` | `getUserOrders` | — | order.routes.ts |
| 30 | GET | `/api/v1/orders/:id` | Bearer | `verifyToken` | `getOrder` | — | order.routes.ts |
| **PAYMENTS** |
| 31 | POST | `/api/v1/payments/initiate` | Bearer | `verifyToken` | `initiatePayment` | 🚨 **NO SCHEMA** | payment.routes.ts |
| 32 | POST | `/api/v1/payments/confirm` | Bearer | `verifyToken` | `confirmPayment` | 🚨 **NO SCHEMA** | payment.routes.ts |
| 33 | POST | `/api/v1/payments/refund` | Admin | `verifyToken`, `requireAdmin` | `refundPayment` | 🚨 **NO SCHEMA** | payment.routes.ts |
| **ADMIN — Orders** |
| 34 | GET | `/api/v1/admin/stats` | Admin | `verifyToken`, `requireAdmin` | `getAdminStats` | — | admin.routes.ts |
| 35 | GET | `/api/v1/admin/orders/export` | Admin | `verifyToken`, `requireAdmin` | `exportOrders` | — | admin.routes.ts |
| 36 | GET | `/api/v1/admin/orders` | Admin | `verifyToken`, `requireAdmin` | `getAdminOrders` | — | admin.routes.ts |
| 37 | GET | `/api/v1/admin/orders/:id` | Admin | `verifyToken`, `requireAdmin` | `getAdminOrderById` | — | admin.routes.ts |
| 38 | PATCH | `/api/v1/admin/orders/:id/status` | Admin | `verifyToken`, `requireAdmin`, `validate(updateOrderStatusSchema)` | `updateOrderStatus` | updateOrderStatusSchema | admin.routes.ts |
| 39 | GET | `/api/v1/admin/orders/:id/invoice` | Admin | `verifyToken`, `requireAdmin` | `downloadInvoice` | — | admin.routes.ts |
| **ADMIN — Products** |
| 40 | GET | `/api/v1/admin/products/low-stock` | Admin | `verifyToken`, `requireAdmin` | `getLowStock` | — | admin.routes.ts |
| **ADMIN — Customers** |
| 41 | GET | `/api/v1/admin/customers` | Admin | `verifyToken`, `requireAdmin` | `getCustomers` | — | admin.routes.ts |
| 42 | GET | `/api/v1/admin/customers/:id` | Admin | `verifyToken`, `requireAdmin` | `getCustomerDetail` | — | admin.routes.ts |
| 43 | PATCH | `/api/v1/admin/customers/:id/toggle-status` | Admin | `verifyToken`, `requireAdmin` | `toggleCustomerStatus` | — | admin.routes.ts |
| **ADMIN — User Management** |
| 44 | GET | `/api/v1/admin/users` | Admin | `verifyToken`, `requireAdmin` | `listAdminUsers` | — | admin.routes.ts |
| 45 | POST | `/api/v1/admin/users` | Admin | `verifyToken`, `requireAdmin`, `validate(createAdminUserSchema)` | `createAdminUser` | createAdminUserSchema | admin.routes.ts |
| 46 | PATCH | `/api/v1/admin/users/:id` | Admin | `verifyToken`, `requireAdmin`, `validate(updateAdminUserSchema)` | `updateAdminUser` | updateAdminUserSchema | admin.routes.ts |
| 47 | DELETE | `/api/v1/admin/users/:id` | Admin | `verifyToken`, `requireAdmin` | `deleteAdminUser` | — | admin.routes.ts |
| 48 | PATCH | `/api/v1/admin/users/:id/reset-password` | Admin | `verifyToken`, `requireAdmin`, `validate(resetAdminPasswordSchema)` | `resetAdminPassword` | resetAdminPasswordSchema | admin.routes.ts |
| 49 | PATCH | `/api/v1/admin/me/password` | Admin | `verifyToken`, `requireAdmin`, `validate(changeOwnPasswordSchema)` | `changeOwnPassword` | changeOwnPasswordSchema | admin.routes.ts |
| 50 | PATCH | `/api/v1/admin/me/profile` | Admin | `verifyToken`, `requireAdmin`, `validate(updateAdminUserSchema)` | `updateOwnProfile` | updateAdminUserSchema | admin.routes.ts |
| **NOTIFICATIONS** |
| 51 | GET | `/api/v1/notifications` | Admin | `verifyToken`, `requireAdmin` | `getNotifications` | — | notification.routes.ts |
| 52 | GET | `/api/v1/notifications/unread-count` | Admin | `verifyToken`, `requireAdmin` | `getUnreadCount` | — | notification.routes.ts |
| 53 | PATCH | `/api/v1/notifications/:id/read` | Admin | `verifyToken`, `requireAdmin` | `markAsRead` | — | notification.routes.ts |
| 54 | PATCH | `/api/v1/notifications/read-all` | Admin | `verifyToken`, `requireAdmin` | `markAllAsRead` | — | notification.routes.ts |
| 55 | DELETE | `/api/v1/notifications/:id` | Admin | `verifyToken`, `requireAdmin` | `deleteNotification` | — | notification.routes.ts |

> **Note:** CLAUDE.md documents 43 endpoints. The actual count is 55. The 12 extra are the admin user management endpoints (44–50) added in a recent session not yet reflected in CLAUDE.md.

### Endpoint Counts

| Category | Count |
|----------|-------|
| Total endpoints | 55 |
| Public (no auth) | 7 |
| Bearer token required | 26 |
| Admin only (verifyToken + requireAdmin) | 22 |
| With Zod body validation | 35 |
| Without body validation | 20 |
| File upload (multer) | 1 |
| File download (Buffer response) | 2 (export + invoice) |
| Paginated responses | 6 |

### Missing Validation Flags

| Endpoint | Missing |
|----------|---------|
| `POST /api/v1/users/change-password` | No body schema |
| `POST /api/v1/payments/initiate` | No body schema |
| `POST /api/v1/payments/confirm` | No body schema |
| `POST /api/v1/payments/refund` | No body schema (admin) |
| All `:id` / `:slug` path params | No path param validation anywhere |

---

## 2. Controller Functions

### Architecture Summary by Controller

| Controller | Functions | Uses Services | Direct Prisma | Direct bcrypt | Status |
|-----------|-----------|--------------|--------------|--------------|--------|
| auth.controller.ts | 5 | 4/5 | 1 (`/me`) | — | 🟡 Mostly OK |
| user.controller.ts | 7 | 0/7 | 7 | 1 (`changePassword`) | 🚨 Red |
| product.controller.ts | 7 | 6/7 | — | — | 🟢 Good |
| category.controller.ts | 5 | 0/5 | 5 | — | 🚨 Red |
| cart.controller.ts | 5 | 0/5 | 11+ | — | 🚨 Red |
| order.controller.ts | 9 | 7/9 | — | — | 🟡 OK (2 raw file responses) |
| payment.controller.ts | 3 | 3/3 | — | — | 🟢 Good |
| admin.controller.ts | 4 | 0/4 | 15+ | — | 🚨 Red (raw SQL) |
| admin-user.controller.ts | 7 | 0/7 | 13+ | 3 | 🚨 Red |
| notification.controller.ts | 5 | 5/5 | — | — | 🟢 Good |

### Critical Controller Flags

**🚨 `auth.controller.ts` — `meController` (line ~20)**
- Calls `prisma.user.findUnique()` directly instead of using a service
- Minor but inconsistent with the rest of the auth flow

**🚨 `user.controller.ts` — All 7 functions**
- All call Prisma directly: `findUnique`, `update`, `findMany`, `create`, `delete`
- `changePassword` contains bcrypt logic (`bcrypt.compare`, `bcrypt.hash`) — business logic in controller
- No `UserService` exists; entire profile/address layer is unabstracted

**🚨 `category.controller.ts` — All 5 functions**
- All call Prisma directly
- `createCategory` and `updateCategory` call `sanitizeString()` and `slugify()` inline — business logic in controller
- Uses `any` type in `updateCategory` (line ~28)

**🚨 `cart.controller.ts` — All 5 functions**
- All call Prisma directly with 11+ total calls scattered across the file
- Stock validation, duplicate item detection, cart total calculation all in controller
- Multiple sequential Prisma calls per request (N+1 pattern)
- `getOrCreateCart` is an unexported helper doing DB work in the controller layer

**🚨 `admin.controller.ts` — All 4 functions**
- `getAdminStats` contains a `prisma.$queryRaw()` (raw SQL) call — most complex query in the codebase
- `getCustomers` builds complex pagination with inline mapping and aggregation
- `getCustomerDetail` computes `totalSpent` inline in the controller
- `toggleCustomerStatus` has authorization logic (checks ADMIN role) inline

**🚨 `admin-user.controller.ts` — All 7 functions**
- All call Prisma directly with bcrypt mixed in
- `deleteAdminUser` checks last-admin guard inline (prevents deleting the last admin)
- `createAdminUser` hashes passwords inline with bcrypt

**🟡 `order.controller.ts` — `exportOrders` + `downloadInvoice`**
- Use raw `res.setHeader()` / `res.send(buffer)` instead of `sendSuccess`
- Acceptable for file downloads — these can't use the JSON response helper
- All other order functions properly use services

**🟡 `product.controller.ts` — `uploadProductImages`**
- Returns `res.status(400).json(...)` directly for missing-file error instead of using `sendError()`
- Minor inconsistency; all other functions use response helpers

---

## 3. Service Layer

### Service Files by Subdirectory

```
BACKEND/src/services/
├── auth/
│   ├── auth.service.ts      (4 exported functions)
│   └── token.service.ts     (3 exported functions)
├── products/
│   └── product.service.ts   (7 exported functions)
├── orders/
│   ├── order.service.ts     (6 exported functions)
│   ├── order-export.service.ts  (1 exported function)
│   └── invoice.service.ts   (1 exported function)
├── notifications/
│   ├── notification.service.ts  (6 exported functions)
│   └── notification.triggers.ts (4 exported functions)
└── payments/
    ├── payment.gateway.ts   (interface only)
    ├── stripe.gateway.ts    (3 STUB methods)
    └── payment.service.ts   (3 exported functions)
```

### Complete Service Inventory

| Service File | Exported Functions | Prisma Ops | External Libs | `$transaction`? | Buffer? | Node.js-Only? |
|-------------|-------------------|-----------|---------------|----------------|---------|--------------|
| auth.service.ts | `register`, `login`, `refreshToken`, `logout` | `findUnique`, `create`, `update` | bcryptjs, token.service | ❌ | ❌ | ❌ |
| token.service.ts | `generateTokens`, `verifyAccessToken`, `verifyRefreshToken` | — | jsonwebtoken | ❌ | ❌ | ❌ |
| product.service.ts | `getProducts`, `getProductBySlug`, `getProductById`, `createProduct`, `updateProduct`, `softDeleteProduct`, `getLowStockProducts` | `findMany`, `findUnique`, `count`, `create`, `update` (9 total) | — | ❌ | ❌ | ❌ |
| order.service.ts | `createOrder`, `getUserOrders`, `getOrderById`, `updateOrderStatus`, `getAdminOrders`, `getAllOrders` | 20+ across all functions | notification.triggers | ✅ **2 transactions** | ❌ | ❌ |
| order-export.service.ts | `exportToExcel(filters): Promise<Buffer>` | `findMany` | **ExcelJS** (Arabic RTL headers) | ❌ | ✅ Buffer | ❌ |
| invoice.service.ts | `generateInvoice(orderId): Promise<Buffer>` | `findUnique` (deep includes) | **PDFKit** | ❌ | ✅ Buffer | ❌ |
| notification.service.ts | `create`, `getAll`, `getUnreadCount`, `markAsRead`, `markAllAsRead`, `delete` | `create`, `findMany`, `count`, `update`, `updateMany`, `delete` | — | ❌ | ❌ | ❌ |
| notification.triggers.ts | `onNewOrder`, `onLowStock`, `onNewCustomer`, `onOrderStatusChanged` | — (delegates to notification.service) | — | ❌ | ❌ | ❌ |
| payment.service.ts | `initiatePayment`, `confirmOrderPayment`, `refundOrderPayment` | `findUnique`, `update` | payment.gateway (abstracted) | ❌ | ❌ | ❌ |
| payment.gateway.ts | — (interface only) | — | — | — | — | — |
| stripe.gateway.ts | `createPaymentIntent`, `confirmPayment`, `refund` | — | **STUB — no real Stripe** | ❌ | ❌ | ❌ |

### Transaction Details

**Transaction 1 — `createOrder` (order.service.ts:37–79)**
```
$transaction:
  for each item:
    tx.product.updateMany(WHERE stock >= quantity) → atomic stock decrement
    if updateMany.count === 0 → throw 409 (out of stock), rolls back all
  tx.order.create(with items + initial status history)
After transaction:
  notificationTriggers.onNewOrder().catch()
  for each low-stock product: notificationTriggers.onLowStock().catch()
```

**Transaction 2 — `updateOrderStatus` (order.service.ts:143–168)**
```
$transaction:
  tx.order.update(status)
  tx.orderStatusHistory.create(fromStatus, toStatus, note, changedBy)
After transaction:
  notificationTriggers.onOrderStatusChanged().catch()
  if CANCELLED: for each item, prisma.product.update(stock += quantity)  ← outside tx
```

### Critical Service Flags

**🚨 Stock Restoration Race Condition (order.service.ts:171–176)**
- When an order is CANCELLED, stock is restored via a loop of individual `prisma.product.update()` calls **outside the transaction**
- If two simultaneous cancellations of orders containing the same product occur, both stock increments race
- The creation path uses the safe atomic pattern (`updateMany WHERE stock >= qty`) but restoration does not
- Medium severity (cancellations are rare, but still a correctness issue)

**🚨 Stripe Stub (stripe.gateway.ts)**
- Returns `{ id: 'pi_stub_${Date.now()}', clientSecret: 'pi_stub_secret_*' }`
- All payment confirmation returns hardcoded `{ status: 'succeeded' }`
- Line 5: `console.warn('[PaymentGateway] Stripe not configured, using stub.')`
- No actual payment processing happens

**🚨 Payment Updates Without Transaction (payment.service.ts)**
- `confirmOrderPayment` calls `prisma.order.update(paymentStatus: PAID, status: PROCESSING)` without `$transaction`
- If the update succeeds but something downstream fails, order state may be inconsistent

**🟡 Buffer Memory Bounds (invoice.service.ts, order-export.service.ts)**
- No maximum page count or row count limits
- Very large order exports could exhaust Node.js heap
- Not a current issue (small data) but worth noting before scale

---

## 4. Middleware Analysis

### `auth.middleware.ts`

| Aspect | Detail |
|--------|--------|
| **Functions** | `verifyToken(req, res, next)`, `requireAdmin(req, res, next)` |
| **Token source** | `Authorization: Bearer <token>` header **only** — no cookie support |
| **Token verification** | `jwt.verify(token, config.JWT_SECRET)` |
| **Req mutation** | Attaches `req.user: { id, email, role }` (TypeScript global augmentation) |
| **Error pattern** | `next(new AppError('...', 401))` — delegated to error handler |
| **Admin check** | `req.user.role !== 'ADMIN'` → 403 |
| **Express coupling** | Uses `Request`, `Response`, `NextFunction` types |

**Next.js translation:** Extract `verifyToken` logic into `lib/auth.ts`. Use as inline call at top of each API route handler, or as a wrapper function `withAuth(handler)`. For global admin routes, `middleware.ts` can read the `Authorization` header.

---

### `error.middleware.ts`

| Error Type | HTTP Status | Handling |
|-----------|-------------|---------|
| `AppError` | Custom `.statusCode` | Returns `{ success: false, message }` |
| `ZodError` | 422 | Returns `{ success: false, errors: [{field, message}] }` |
| Prisma P2002 | 409 | Unique constraint message |
| Prisma P2025 | 404 | Record not found message |
| `TokenExpiredError` | 401 | JWT expired message |
| `JsonWebTokenError` | 401 | Invalid token message |
| Unknown | 500 | `console.error` + generic message |

**AppError class** (`error.middleware.ts:6–16`):
```typescript
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

**Next.js translation:** Copy `AppError` class 1:1. Replace the Express 4-param handler with a `handleError(err)` utility that returns a `NextResponse`. Each API route's `catch` block calls it.

---

### `validate.middleware.ts`

```typescript
export function validate(schema: ZodSchema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ success: false, message: 'Validation failed',
        errors: result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) });
    }
    req.body = result.data;   // ← replaces req.body with validated+typed data
    next();
  };
}
```

**Key:** Only validates `req.body`. **Does not validate `req.params` or `req.query`.**

**Next.js translation:** Replace with inline `schema.safeParse(await req.json())` in each handler. Or create a `withValidation(schema, handler)` HOF. Schema files copy 1:1.

---

### `upload.middleware.ts`

| Aspect | Detail |
|--------|--------|
| **Library** | `multer` with `diskStorage` |
| **Storage path** | `path.join(process.cwd(), 'uploads')` — **local filesystem** |
| **Directory creation** | `fs.mkdirSync(uploadDir, { recursive: true })` on module load |
| **File naming** | `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}` |
| **Max file size** | 5 MB (`5 * 1024 * 1024`) |
| **Allowed MIME types** | `image/jpeg`, `image/png`, `image/webp`, `image/gif` |
| **MIME validation** | Header-only check (client can spoof) |
| **Node.js APIs** | `fs.existsSync`, `fs.mkdirSync`, `path.join`, `path.extname`, `process.cwd` |
| **Express coupling** | Uses multer callback API with Express req/res |

**🚨 Vercel incompatible.** Disk writes fail silently in Vercel's read-only filesystem. Static serving from `/uploads` will 404.

**Next.js translation:** Replace with Cloudinary SDK (already installed). API route accepts `FormData`, pipes to `cloudinary.uploader.upload_stream()`. Remove multer entirely.

---

## 5. Configuration & Environment

### Environment Variables

| Env Var | Required? | Used In | Type | Vercel Equivalent |
|---------|-----------|---------|------|-------------------|
| `DATABASE_URL` | ✅ YES | Prisma | Secret | `DATABASE_URL` |
| `JWT_SECRET` | ✅ YES (min 32 chars) | auth.middleware, token.service | Secret | `JWT_SECRET` |
| `JWT_REFRESH_SECRET` | ✅ YES (min 32 chars) | token.service | Secret | `JWT_REFRESH_SECRET` |
| `JWT_EXPIRES_IN` | No | token.service | Public | Custom env var |
| `JWT_REFRESH_EXPIRES_IN` | No | token.service | Public | Custom env var |
| `FRONTEND_URL` | No | app.ts (CORS) | Public | `NEXT_PUBLIC_FRONTEND_URL` |
| `ADMIN_URL` | No | app.ts (CORS) | Public | `NEXT_PUBLIC_ADMIN_URL` |
| `BACKEND_URL` | No | product.controller (image URLs) | Public | `NEXT_PUBLIC_BACKEND_URL` |
| `PORT` | No | server.ts | Public | Not used on Vercel |
| `NODE_ENV` | No | app.ts, database.ts | Public | Standard `NODE_ENV` |
| `CLOUDINARY_URL` | No | Not actively used | Secret | `CLOUDINARY_URL` |
| `STRIPE_SECRET_KEY` | No | Not actively used | Secret | `STRIPE_SECRET_KEY` |

**Defaults in `config/env.ts`:**
- `FRONTEND_URL` defaults to `http://localhost:3000`
- `ADMIN_URL` defaults to `http://localhost:3001`
- `BACKEND_URL` defaults to `http://localhost:5000`

### Constants (`config/constants.ts`)

| Constant | Value | Note |
|----------|-------|------|
| `BCRYPT_ROUNDS` | 12 | OWASP-compliant |
| `JWT_EXPIRES_IN` | `'15m'` | Access token lifetime |
| `JWT_REFRESH_EXPIRES_IN` | `'7d'` | Refresh token lifetime |
| `UPLOAD_MAX_SIZE` | 5 MB | |
| `PAGINATION_DEFAULT_LIMIT` | 10 | |
| `PAGINATION_MAX_LIMIT` | 100 | |

### Rate Limiting (`app.ts`)

```
Global: /api/ — 2000 req/15min in dev, 200 in prod
Auth:   /auth/register + /auth/login — 10 req/15min (always)
Dev:    Global rate limiter skipped entirely (skip: () => isDev)
```

**🚨 In-process state** — `express-rate-limit` stores counters in memory. Resets on cold start. Ineffective in multi-instance deployments.

### CORS (`app.ts:12–23`)

```javascript
allowedOrigins = [config.FRONTEND_URL, config.ADMIN_URL]  // Dynamic from env
credentials: true
```

### Hardcoded URLs / Localhost References

| File | Reference | Impact |
|------|-----------|--------|
| `config/env.ts` | `http://localhost:3000` (FRONTEND_URL default) | CORS fails in prod if env not set |
| `config/env.ts` | `http://localhost:3001` (ADMIN_URL default) | CORS fails in prod if env not set |
| `config/env.ts` | `http://localhost:5000` (BACKEND_URL default) | Wrong image URLs in prod |

---

## 6. Validation Schemas

### Schema Files

| File | Schemas | Exported Types | Used In Routes | Complexity |
|------|---------|---------------|----------------|-----------|
| auth.schema.ts | `registerSchema`, `loginSchema`, `refreshTokenSchema` | `RegisterInput`, `LoginInput` | POST /auth/register, POST /auth/login, POST /auth/refresh | Simple + regex |
| product.schema.ts | `createProductSchema`, `updateProductSchema` (partial) | `CreateProductInput`, `UpdateProductInput` | POST/PUT /products | Simple numeric |
| order.schema.ts | `createOrderSchema`, `updateOrderStatusSchema` | `CreateOrderInput` | POST /orders, PATCH /orders/:id/status | Nested object + enum |
| cart.schema.ts | `addToCartSchema`, `updateCartItemSchema` | `AddToCartInput`, `UpdateCartItemInput` | POST/PATCH /cart/items | Simple range |
| category.schema.ts | `createCategorySchema`, `updateCategorySchema` | `CreateCategoryInput`, `UpdateCategoryInput` | POST/PUT /categories | `.or()` pattern for optional URL |
| user.schema.ts | `updateProfileSchema`, `addAddressSchema` | `UpdateProfileInput`, `AddAddressInput` | PUT /users/profile, POST /users/addresses | Iraq address fields |
| admin-user.schema.ts | `createAdminUserSchema`, `updateAdminUserSchema`, `changeOwnPasswordSchema`, `resetAdminPasswordSchema` + `passwordSchema` (sub) | — | POST/PATCH/DELETE /admin/users | Reusable `passwordSchema` with 3 regex validators |

### Cross-Schema Notes

- No cross-imports between schema files
- No Express type dependencies — all schemas are pure Zod
- ⚡ **All 7 files can be copied 1:1 to Next.js project**

### Schema Issues

| Issue | Detail |
|-------|--------|
| No path param validation | `/:id`, `/:slug`, `/:itemId` params are never validated |
| Inconsistent password strength | `registerSchema`: min 8 + uppercase + digit. `admin-user.schema.ts`: also requires special character |
| No cross-field refinements | `comparePrice` should be ≥ `price` — not enforced |
| Missing schemas | `changePassword` (users), all 3 payment endpoints, export query params |

---

## 7. Dependencies Analysis

### Production Dependencies

| Package | Version | Category | Next.js Compatible? | Replacement Needed? |
|---------|---------|----------|--------------------|--------------------|
| `express` | ^4.18.2 | Core HTTP | ❌ NO | YES → Next.js API Routes |
| `cors` | ^2.8.5 | Core HTTP | ❌ NO | YES → `next.config.js` headers / middleware.ts |
| `helmet` | ^7.1.0 | Core HTTP | ❌ NO | PARTIAL → `next.config.js` securityHeaders |
| `morgan` | ^1.10.0 | Core HTTP | ❌ NO | REMOVE → Vercel provides native HTTP logs |
| `express-rate-limit` | ^7.1.5 | Rate Limiting | ❌ NO | YES → Upstash Redis + Vercel Edge Middleware |
| `@prisma/client` | ^5.7.0 | Database | ✅ YES | KEEP |
| `zod` | ^3.22.4 | Validation | ✅ YES | KEEP |
| `jsonwebtoken` | ^9.0.2 | Auth | ✅ YES | KEEP |
| `bcryptjs` | ^2.4.3 | Auth | ✅ YES | KEEP |
| `multer` | ^1.4.5-lts.1 | File Upload | ❌ NO | YES → Cloudinary SDK (already installed) |
| `cloudinary` | ^1.41.3 | File Storage | ✅ YES | KEEP (migrate uploads to it) |
| `exceljs` | ^4.4.0 | Export | ✅ YES | KEEP (Buffer-based, works serverless) |
| `pdfkit` | ^0.18.0 | Export | ✅ YES | KEEP (Buffer-based, works serverless) |
| `dotenv` | ^16.3.1 | Config | ⚠️ N/A | REMOVE → Vercel auto-injects env vars |

### Dev Dependencies to Remove After Migration

| Package | Reason |
|---------|--------|
| `@types/express` | No more Express |
| `@types/cors` | No more cors |
| `@types/morgan` | No more Morgan |
| `@types/multer` | No more Multer |
| `ts-node` | Next.js handles TS compilation |
| `ts-node-dev` | Replaced by `next dev` |
| `prisma` | Keep for migrations; remove from `scripts` if using Prisma CLI directly |

### Packages to Keep

`@prisma/client`, `zod`, `jsonwebtoken`, `bcryptjs`, `cloudinary`, `exceljs`, `pdfkit`, `typescript`, `@types/node`, `@types/bcryptjs`, `@types/jsonwebtoken`, `@types/pdfkit`

---

## 8. External Integrations

### Integration Inventory

| Integration | Status | Serverless-Compatible? | Notes |
|------------|--------|----------------------|-------|
| **Stripe (payments)** | STUB | ✅ Yes (when real) | Returns fake payment IDs. No actual HTTP calls. |
| **Cloudinary (images)** | Installed, unused | ✅ Yes | Package installed, `CLOUDINARY_URL` env var exists, but multer/disk storage is active instead |
| **Local filesystem uploads** | Active | 🚨 NO | `multer.diskStorage` → `process.cwd()/uploads/`. Ephemeral on Vercel. |
| **Static file serving** | Active | 🚨 NO | `express.static('/uploads')` in app.ts. Will 404 in serverless. |
| **PDFKit** | Active | ✅ Yes | Buffer-based, no disk writes |
| **ExcelJS** | Active | ✅ Yes | Buffer-based, Arabic RTL headers |
| **Axios / Fetch** | Not used | — | No external HTTP calls in codebase |
| **Email / SMS** | Not implemented | — | Notifications are DB records only |
| **Redis / Cache** | Not implemented | — | All queries hit Prisma directly |
| **Background jobs** | Fire-and-forget only | ✅ Yes | `.catch(console.error)` pattern, no queues |

### Fire-and-Forget Notification Triggers

```
auth.service.ts:18     → onNewCustomer().catch(console.error)
order.service.ts:82    → onNewOrder().catch(console.error)
order.service.ts:84    → onLowStock().catch(console.error)
order.service.ts:180   → onOrderStatusChanged().catch(console.error)
```

These are Prisma writes (creating Notification records), not external API calls. They will work in Vercel serverless but are not retried on failure.

---

## 9. Authentication Flow

### 9.1 Registration

**Endpoint:** `POST /api/v1/auth/register`

**Body:**
```json
{ "name": "string", "email": "email", "password": "string (min 8, uppercase + digit required)" }
```

**Flow (auth.service.ts):**
1. `prisma.user.findUnique({ where: { email } })` → 409 if duplicate
2. `bcrypt.hash(password, 12)` — 12 rounds
3. `prisma.user.create({ data: { name, email, password: hashed, role: 'USER' } })`
4. `generateTokens({ id, email, role })` → `{ accessToken (15m), refreshToken (7d) }`
5. `prisma.user.update({ data: { refreshToken } })` — stored in DB
6. `notificationTriggers.onNewCustomer().catch(console.error)` — fire and forget

**Response:** `{ success: true, data: { user: { id, name, email, role, createdAt }, tokens: { accessToken, refreshToken } } }`

### 9.2 Login

**Endpoint:** `POST /api/v1/auth/login`

**Body:**
```json
{ "email": "email", "password": "string" }
```

**Flow (auth.service.ts):**
1. `prisma.user.findUnique({ where: { email } })` → 401 if not found
2. `bcrypt.compare(password, user.password)` → 401 if mismatch
3. `if (!user.isActive) throw AppError(403)` — disabled accounts blocked
4. `generateTokens({ id, email, role })`
5. `prisma.user.update({ data: { refreshToken } })` — old token replaced
6. Strips `password`, `refreshToken`, `updatedAt` from response

**Response:** Same shape as registration.

### 9.3 Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Body:** `{ "refreshToken": "string" }`

**Flow (auth.service.ts):**
1. `jwt.verify(token, JWT_REFRESH_SECRET)` → 401 if invalid/expired
2. `prisma.user.findUnique({ where: { id: payload.id } })`
3. `if (!user || user.refreshToken !== token) throw AppError(401)` — **exact match required**
4. `generateTokens(...)` — new pair generated
5. `prisma.user.update({ data: { refreshToken: newToken } })` — **token rotation**

### 9.4 Logout

**Endpoint:** `POST /api/v1/auth/logout` (requires Bearer token)

**Flow:** `prisma.user.update({ where: { id }, data: { refreshToken: null } })`

### 9.5 `verifyToken` Middleware

```typescript
// Token extraction
const authHeader = req.headers.authorization;  // Authorization: Bearer <token>
if (!authHeader?.startsWith('Bearer ')) return next(new AppError('No token provided.', 401));
const token = authHeader.split(' ')[1];

// Verification
req.user = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
next();
```

- Source: `Authorization` header **only** (no cookie fallback)
- Attaches `req.user: { id: string, email: string, role: string }`

### 9.6 `requireAdmin` Middleware

```typescript
if (!req.user) return next(new AppError('Authentication required.', 401));
if (req.user.role !== 'ADMIN') return next(new AppError('Admin access required.', 403));
next();
```

### 9.7 JWT Payload Shape

```typescript
// Access token payload (decoded):
{
  id: string,      // User CUID from DB
  email: string,   // User email
  role: 'USER' | 'ADMIN',
  iat: number,     // Issued at (Unix timestamp)
  exp: number      // Expiry (Unix timestamp)
}
// Refresh token: identical payload, different secret, 7d lifetime
```

### 9.8 Auth Security Notes

| Check | Status |
|-------|--------|
| Bcrypt rounds | ✅ 12 (OWASP compliant) |
| Token rotation on refresh | ✅ Yes |
| Refresh token stored in DB | ✅ Yes (null on logout) |
| Account active check on login | ✅ Yes (403 if disabled) |
| Password never returned | ✅ Explicit field stripping |
| Auth endpoints rate-limited | ✅ 10 req/15min |
| No cookie auth on backend | ✅ Header-only (stateless) |
| Access token blacklist | ❌ No (by design — 15m lifetime) |

---

## 10. Cross-Cutting Concerns

### 10.1 Logging

| Count | Type | Notes |
|-------|------|-------|
| 2 | `console.log` | Server startup only (server.ts) |
| 2 | `console.error` | Crash handler + unhandled errors |
| 1 | `console.warn` | Stripe stub warning |
| 4 | `.catch(console.error)` | Notification fire-and-forget catches |
| 1 | Morgan middleware | All HTTP requests in `dev` format |

**No structured logging** (no Winston, Pino, Bunyan). All logs are plain `console.*`. Works in Vercel but no log aggregation.

### 10.2 Error Handling

| Pattern | Count | Location |
|---------|-------|----------|
| `throw new AppError(msg, status)` | **40** | Business logic, service layer, controllers |
| `throw new Error(msg)` | 3 | `config/env.ts` startup validation only |
| `try { } catch (e) { next(e); }` | ~50 | Every async route handler |

Error handling is **consistent**: all operational errors use `AppError`, all unexpected errors surface via `next(err)` to the centralized `errorHandler` middleware.

### 10.3 Direct Prisma Calls per Controller

| File | Direct `prisma.*` Calls | Should Be |
|------|------------------------|-----------|
| admin-user.controller.ts | 13+ | In `AdminUserService` |
| admin.controller.ts | 15+ (incl. `$queryRaw`) | In `AdminService` |
| cart.controller.ts | 11+ | In `CartService` |
| user.controller.ts | 8 | In `UserService` |
| category.controller.ts | 5 | In `CategoryService` |
| auth.controller.ts | 1 (me endpoint) | In `AuthService.getProfile()` |

**Services that correctly own all Prisma calls:**
`auth.service.ts`, `product.service.ts`, `order.service.ts`, `payment.service.ts`, `notification.service.ts`, `invoice.service.ts`, `order-export.service.ts`

### 10.4 Async Patterns

- 100% `async/await` — zero callbacks found
- Fire-and-forget always uses `.catch(console.error)` (never unhandled promise rejections)
- All Prisma calls are properly awaited

### 10.5 Response Helper Consistency

| Helper | Usage |
|--------|-------|
| `sendSuccess(res, data, msg?, status?)` | Used by ~95% of JSON success responses |
| `sendPaginated(res, data[], pagination)` | All paginated endpoints |
| `sendError` | **Never used** — errors thrown instead and caught by middleware |
| Raw `res.status().json()` | 1 instance (product upload error — minor) |
| Raw `res.setHeader()` + `res.send()` | 2 instances (Excel export + PDF invoice — intentional for file downloads) |

---

## 🎯 Migration Strategy Recommendations

### Endpoints by Priority

**Tier 1 — Critical Path (migrate first):**
- Auth: `register`, `login`, `refresh`, `logout`, `me`
- Products: `listProducts`, `getProduct` (public — needed for store to work)
- Cart: all 5 endpoints (core shopping flow)
- Orders: `createOrder`, `getUserOrders`, `getOrder`

**Tier 2 — Standard Admin Features:**
- Admin: `stats`, `orders` (list + detail + status update)
- Products: `createProduct`, `updateProduct`, `deleteProduct`
- Categories: full CRUD
- Notifications: all 5 endpoints

**Tier 3 — Secondary:**
- User profile + addresses
- Admin customer management
- Excel export + PDF invoice
- Admin user management (44–50)
- Payment (stub — low priority until real gateway)

---

### Patterns to Preserve

| Pattern | Reason |
|---------|--------|
| `AppError` class | Clean, copy 1:1 |
| Zod schemas | Pure, no Express coupling, copy 1:1 |
| Service layer functions (where they exist) | Already clean interfaces |
| JWT dual-token flow | Excellent security design |
| `$transaction` with atomic stock decrement | Critical for data integrity |
| Fire-and-forget notification pattern | Correct approach, keep `.catch()` |
| `Number()` wrapping on Decimal fields | Required by Prisma serialization |
| UPPERCASE enum values | Consistent throughout — never change |
| `VALID_TRANSITIONS` state machine | Correct order management |
| Notification triggers outside `$transaction` | Architecturally correct |

---

### Files That Can Be Copied 1:1

These files have zero Express dependencies and work in any Node.js environment:

```
BACKEND/src/services/auth/auth.service.ts
BACKEND/src/services/auth/token.service.ts
BACKEND/src/services/products/product.service.ts
BACKEND/src/services/orders/order.service.ts
BACKEND/src/services/orders/invoice.service.ts
BACKEND/src/services/orders/order-export.service.ts
BACKEND/src/services/notifications/notification.service.ts
BACKEND/src/services/notifications/notification.triggers.ts
BACKEND/src/services/payments/payment.service.ts
BACKEND/src/services/payments/payment.gateway.ts
BACKEND/src/services/payments/stripe.gateway.ts
BACKEND/src/schemas/auth.schema.ts
BACKEND/src/schemas/product.schema.ts
BACKEND/src/schemas/order.schema.ts
BACKEND/src/schemas/cart.schema.ts
BACKEND/src/schemas/category.schema.ts
BACKEND/src/schemas/user.schema.ts
BACKEND/src/schemas/admin-user.schema.ts
BACKEND/src/config/constants.ts
BACKEND/src/config/database.ts
BACKEND/src/utils/response.ts
BACKEND/src/utils/pagination.ts
BACKEND/src/utils/slugify.ts
BACKEND/prisma/schema.prisma
```

---

### Files That Need Rewrite or Heavy Adaptation

| File | Reason |
|------|--------|
| `src/middlewares/auth.middleware.ts` | Express `Request` augmentation → Next.js header-based helper |
| `src/middlewares/error.middleware.ts` | 4-param Express handler → `handleError(err): NextResponse` utility |
| `src/middlewares/validate.middleware.ts` | Express middleware → inline `schema.safeParse()` per route |
| `src/middlewares/upload.middleware.ts` | Multer + diskStorage → Cloudinary SDK + formData parsing |
| `src/app.ts` | Entire Express setup → replace with `next.config.js` + `middleware.ts` |
| `src/server.ts` | Not needed in Next.js |
| `src/routes/index.ts` + all route files | Replace with `app/api/*/route.ts` files |
| `src/controllers/user.controller.ts` | Extract Prisma calls to `UserService` first |
| `src/controllers/cart.controller.ts` | Extract to `CartService` first (heaviest refactor) |
| `src/controllers/category.controller.ts` | Extract to `CategoryService` first |
| `src/controllers/admin.controller.ts` | Extract to `AdminService` + `DashboardService` |
| `src/controllers/admin-user.controller.ts` | Extract to `AdminUserService` |
| `src/config/env.ts` | Adapt to Next.js env loading (remove dotenv, add NEXT_PUBLIC_ prefix where needed) |

---

## 🚨 Migration Blockers

1. **Local filesystem uploads** — `multer.diskStorage` + `express.static('/uploads')` must both be replaced with Cloudinary **before** any Vercel deployment. Product images and category images currently stored on disk will be lost. Need a one-time migration script to push existing `uploads/` files to Cloudinary.

2. **Six controllers bypassing service layer** — The cart, user, category, admin, and admin-user controllers call Prisma and bcrypt directly. Before migrating these routes to Next.js API handlers, services need to be extracted, otherwise the migration becomes a refactor + migration combined (high risk).

3. **Stripe stub** — Payment endpoints technically work (stub returns success) but no real money flows. Not a migration blocker per se, but must be addressed before going live.

---

## 📋 Next Steps Checklist

- [x] Review this audit
- [ ] Extract missing services: `UserService`, `CartService`, `CategoryService`, `AdminService`, `AdminUserService`
- [ ] Migrate `upload.middleware.ts` to Cloudinary (unblock image persistence)
- [ ] Create `lib/auth.ts` helper for Next.js JWT verification
- [ ] Create `lib/errors.ts` with `AppError` class + `handleError()` utility
- [ ] Set up Next.js project structure with `app/api/` routes
- [ ] Migrate Tier 1 endpoints first (auth + products + cart + orders)
- [ ] Run audit-2 (database & data flow analysis)
- [ ] Run audit-3 (frontend coupling analysis)
- [ ] Plan Cloudinary migration for existing uploaded images
- [ ] Replace Stripe stub with live Stripe SDK
- [ ] Add `FRONTEND_URL`, `ADMIN_URL`, `BACKEND_URL` to Vercel env vars dashboard
