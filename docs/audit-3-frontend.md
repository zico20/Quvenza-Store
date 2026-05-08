# 🌐 Frontend Coupling Audit Report
**Date:** 2026-05-08
**Scope:** `FRONTEND/apps/store/` and `FRONTEND/apps/admin/`
**Mode:** Read-only static analysis
**Purpose:** Ensure no frontend feature breaks during Next.js full-stack migration

> **Note on CLAUDE.md accuracy:** The file states Next.js 14 — both apps actually run **Next.js 16.2.2** with React 19.2.4. CLAUDE.md needs updating.

---

## 📊 Executive Summary

### Frontend by Numbers
| Metric | Value |
|--------|-------|
| Total routes (store + admin) | 40 (27 store + 13 admin) |
| API functions defined | 43 (14 store + 29 admin) |
| API functions actually called | ~34 (8 unused — see Pillar 2) |
| Server Components | ~16 (15 store + 1 admin) |
| Client Components ("use client") | ~62 (36 store + 26 admin) |
| Forms | 7 (3 store auth/checkout, 4 admin) |
| Unique npm dependencies | 14 packages (perfectly version-matched) |
| Extra stores discovered (not in CLAUDE.md) | 3 (currency, lang, wishlist) |
| Extra pages discovered (not in CLAUDE.md) | 8 (contact, about, privacy, terms, faq, glossary, how-it-works, payment-methods) |

### Coupling Score: 7/10
Both apps are fully HTTP-coupled to the Express backend. All 12 admin dashboard pages are Client Components making live API calls on mount. Three store Server Components call the backend over HTTP (migration opportunity). No direct DB access anywhere in the frontend.

### Migration Confidence: 7/10
Auth architecture is sound and preservable. Dependencies are perfectly aligned. The main risks are a /login URL collision between apps, the cart API path mismatch bug, and the incomplete payment/address integrations that need fixing before or during migration.

### Critical Findings
1. 🚨 **Cart API path mismatch** — frontend calls `/cart/items` but backend expects `/cart/:productId`
2. 🚨 **Cart operations never wired** — add/update/remove/clear defined but not called anywhere
3. 🚨 **Payment integration missing** — checkout creates order without calling `/payments/intent` or `/payments/confirm`
4. 🚨 **User addresses not persisted to API** — stored in `localStorage` only, never sent to `/users/addresses`
5. 🚨 **Admin API client has no SSR guard** — accessing `useAdminAuthStore.getState()` on server will crash
6. 🚨 **Address type/DB mismatch** — `governorate` and `nearestLandmark` fields in `@repo/types` don't exist in Prisma `Address` model
7. ⚠️ **Cart lost on refresh** — Zustand cart store has no persist middleware
8. ⚠️ **Refresh token defined but never stored or used** — `AuthTokens.refreshToken` is received but discarded

---

## 1. API Client Architecture

### Store — `FRONTEND/apps/store/src/lib/api.ts`

| Aspect | Detail |
|--------|--------|
| HTTP Client | Axios 1.14.0 |
| Base URL | `process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'` |
| Default headers | `Content-Type: application/json` |
| Request interceptor | Reads `localStorage.getItem('auth-storage')`, extracts `state.accessToken`, attaches `Authorization: Bearer <token>`. Has SSR guard: `typeof window !== 'undefined'`. |
| Response interceptor | On 401: `localStorage.removeItem('auth-storage')` → `window.location.href = '/login'`. **No retry, no refresh.** |
| Timeout | None configured |
| withCredentials | Not set |

**Exported functions (14):**

| Function | Method | Endpoint |
|----------|--------|----------|
| `auth.login` | POST | `/auth/login` |
| `auth.register` | POST | `/auth/register` |
| `auth.logout` | POST | `/auth/logout` |
| `auth.me` | GET | `/auth/me` |
| `products.getAll` | GET | `/products` |
| `products.getBySlug` | GET | `/products/{slug}` |
| `cartApi.get` | GET | `/cart` |
| `cartApi.add` | POST | `/cart/items` ← 🚨 wrong path |
| `cartApi.update` | PATCH | `/cart/items/{itemId}` ← 🚨 wrong path |
| `cartApi.remove` | DELETE | `/cart/items/{itemId}` ← 🚨 wrong path |
| `cartApi.clear` | DELETE | `/cart` |
| `orders.create` | POST | `/orders` |
| `orders.getAll` | GET | `/orders` |
| `orders.getById` | GET | `/orders/{id}` |

### Admin — `FRONTEND/apps/admin/src/lib/api.ts`

| Aspect | Detail |
|--------|--------|
| HTTP Client | Axios 1.14.0 (named `adminApiClient`) |
| Base URL | `process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'` |
| Default headers | `Content-Type: application/json` |
| Request interceptor | `useAdminAuthStore.getState().accessToken` — **🚨 no SSR guard**, will throw on server-side render |
| Response interceptor | On 401: if URL doesn't include `/auth/login` or `/auth/refresh` → `logout()` + `window.location.href = '/login'`. Better than store (prevents redirect loops). References `/auth/refresh` that doesn't exist yet. |
| Timeout | None configured |
| withCredentials | Not set |

**Exported functions (29):**

| Function | Method | Endpoint |
|----------|--------|----------|
| `adminAuth.login` | POST | `/auth/login` |
| `adminAuth.logout` | POST | `/auth/logout` |
| `adminStats.getDashboard` | GET | `/admin/stats` |
| `adminProducts.getAll` | GET | `/products` |
| `adminProducts.create` | POST | `/products` |
| `adminProducts.update` | PUT | `/products/{id}` |
| `adminProducts.uploadImages` | POST | `/products/{id}/images` |
| `adminProducts.delete` | DELETE | `/products/{id}` |
| `adminProducts.getLowStock` | GET | `/admin/products/low-stock` |
| `adminOrders.getAll` | GET | `/admin/orders` |
| `adminOrders.getById` | GET | `/admin/orders/{id}` |
| `adminOrders.updateStatus` | PATCH | `/admin/orders/{id}/status` |
| `adminOrders.exportOrders` | GET | `/admin/orders/export` (blob) |
| `adminOrders.downloadInvoice` | GET | `/admin/orders/{orderId}/invoice` (blob) |
| `adminCustomers.getAll` | GET | `/admin/customers` |
| `adminCustomers.getById` | GET | `/admin/customers/{id}` |
| `adminCustomers.toggleStatus` | PATCH | `/admin/customers/{id}/toggle-status` |
| `adminNotifications.getAll` | GET | `/notifications` |
| `adminNotifications.getUnreadCount` | GET | `/notifications/unread-count` |
| `adminNotifications.markAsRead` | PATCH | `/notifications/{id}/read` |
| `adminNotifications.markAllAsRead` | PATCH | `/notifications/read-all` |
| `adminNotifications.delete` | DELETE | `/notifications/{id}` |
| `adminUsers.list` | GET | `/admin/users` |
| `adminUsers.create` | POST | `/admin/users` |
| `adminUsers.update` | PATCH | `/admin/users/{id}` |
| `adminUsers.delete` | DELETE | `/admin/users/{id}` |
| `adminUsers.resetPassword` | PATCH | `/admin/users/{id}/reset-password` |
| `adminUsers.changeOwnPassword` | PATCH | `/admin/me/password` |
| `adminUsers.updateOwnProfile` | PATCH | `/admin/me/profile` |

### Comparison: Store vs Admin API Client

| Aspect | Store | Admin |
|--------|-------|-------|
| Token source | `localStorage` read directly | Zustand `getState()` |
| SSR safety | ✅ Has `typeof window` guard | 🚨 No guard — will crash in RSC |
| 401 handling | Simple redirect | Conditional (prevents loops) |
| Token refresh | None | None (code path stubs it) |
| Request timeout | None | None |
| File upload | Not used | `multipart/form-data` for images |

**Key insight for migration:** The two clients cannot be trivially merged because they read auth tokens from different sources. They can coexist in the same app using their current patterns.

---

## 2. API Call Inventory

### Store API Calls — Usage vs. Definition

| Function | Defined In | Called From | Status |
|----------|-----------|-------------|--------|
| `auth.login` | `api.ts:35` | `hooks/useAuth.ts:9` | ✅ Used |
| `auth.register` | `api.ts:36` | `app/(auth)/register/page.tsx:26` | ✅ Used |
| `auth.logout` | `api.ts:37` | `hooks/useAuth.ts:13` | ✅ Used |
| `auth.me` | `api.ts:38` | **Nowhere** | ⚠️ Defined, never called |
| `products.getAll` | `api.ts:41` | `hooks/useProducts.ts:15` | ✅ Used |
| `products.getBySlug` | `api.ts:42` | **Nowhere** | ⚠️ Defined, never called |
| `cartApi.get` | `api.ts:45` | `hooks/useCart.ts:13` | ✅ Used |
| `cartApi.add` | `api.ts:46` | **Nowhere** | 🚨 Defined, never called + wrong path |
| `cartApi.update` | `api.ts:47` | **Nowhere** | 🚨 Defined, never called + wrong path |
| `cartApi.remove` | `api.ts:48` | **Nowhere** | 🚨 Defined, never called + wrong path |
| `cartApi.clear` | `api.ts:49` | **Nowhere** | ⚠️ Defined, never called |
| `orders.create` | `api.ts:52` | `app/checkout/payment/page.tsx:33` | ✅ Used |
| `orders.getAll` | `api.ts:53` | `app/account/page.tsx:74`, `app/account/orders/page.tsx:19` | ✅ Used |
| `orders.getById` | `api.ts:54` | `app/account/orders/[id]/page.tsx:18` | ✅ Used |

**Cart API coverage: 20% (1/5 functions called)** — All cart mutations are client-side Zustand only.

### Admin API Calls — Usage vs. Definition

| Function | Defined In | Called From | Status |
|----------|-----------|-------------|--------|
| `adminAuth.login` | `api.ts:22` | `app/login/page.tsx:26` | ✅ Used |
| `adminAuth.logout` | `api.ts:23` | `components/layout/Sidebar.tsx:26` | ✅ Used |
| `adminStats.getDashboard` | `api.ts:26` | `app/dashboard/page.tsx:26` | ✅ Used |
| `adminProducts.getAll` | `api.ts:29` | `app/dashboard/products/page.tsx:19`, `[id]/page.tsx:56` | ✅ Used |
| `adminProducts.create` | `api.ts:30` | `app/dashboard/products/new/page.tsx:9` | ✅ Used |
| `adminProducts.update` | `api.ts:31` | `app/dashboard/products/[id]/page.tsx:127` | ✅ Used |
| `adminProducts.uploadImages` | `api.ts:32` | `app/dashboard/products/[id]/page.tsx:109` | ✅ Used |
| `adminProducts.delete` | `api.ts:33` | `app/dashboard/products/page.tsx:31`, `[id]/page.tsx:143` | ✅ Used |
| `adminProducts.getLowStock` | `api.ts:34` | `components/dashboard/LowStockAlert.tsx:13` | ✅ Used |
| `adminOrders.getAll` | `api.ts:37` | `app/dashboard/orders/page.tsx:43` | ✅ Used |
| `adminOrders.getById` | `api.ts:38` | `app/dashboard/orders/[id]/page.tsx:46` | ✅ Used |
| `adminOrders.updateStatus` | `api.ts:39` | `components/orders/StatusChangeModal.tsx:42` | ✅ Used |
| `adminOrders.exportOrders` | `api.ts:40` | `app/dashboard/orders/page.tsx:58` | ✅ Used |
| `adminOrders.downloadInvoice` | `api.ts:41` | `app/dashboard/orders/[id]/page.tsx:60` | ✅ Used |
| `adminCustomers.getAll` | `api.ts:44` | `app/dashboard/customers/page.tsx:54,68` | ✅ Used |
| `adminCustomers.getById` | `api.ts:45` | `app/dashboard/customers/[id]/page.tsx:29` | ✅ Used |
| `adminCustomers.toggleStatus` | `api.ts:46` | `app/dashboard/customers/[id]/page.tsx:39` | ✅ Used |
| `adminNotifications.getAll` | `api.ts:49` | `app/dashboard/notifications/page.tsx:36` | ✅ Used |
| `adminNotifications.getUnreadCount` | `api.ts:50` | **Nowhere** | ⚠️ Defined, never called |
| `adminNotifications.markAsRead` | `api.ts:51` | `app/dashboard/notifications/page.tsx:55` | ✅ Used |
| `adminNotifications.markAllAsRead` | `api.ts:52` | `app/dashboard/notifications/page.tsx:45` | ✅ Used |
| `adminNotifications.delete` | `api.ts:53` | `app/dashboard/notifications/page.tsx:50` | ✅ Used |
| `adminUsers.list` | `api.ts:56` | `app/dashboard/settings/page.tsx:171` | ✅ Used |
| `adminUsers.create` | `api.ts:57` | `app/dashboard/settings/page.tsx:224` | ✅ Used |
| `adminUsers.update` | `api.ts:58` | **Nowhere** | ⚠️ Defined, never called |
| `adminUsers.delete` | `api.ts:59` | `app/dashboard/settings/page.tsx:251` | ✅ Used |
| `adminUsers.resetPassword` | `api.ts:60` | `app/dashboard/settings/page.tsx:240` | ✅ Used |
| `adminUsers.changeOwnPassword` | `api.ts:61` | `app/dashboard/settings/page.tsx:205` | ✅ Used |
| `adminUsers.updateOwnProfile` | `api.ts:62` | `app/dashboard/settings/page.tsx:185` | ✅ Used |

**Categories called directly** (not abstracted): `app/dashboard/categories/page.tsx:55,88,95,113` calls `adminApiClient.get/post/put/delete` on `/categories` directly — not wrapped in an `adminCategories` object.

### Backend Endpoint vs. Frontend Coverage

| Endpoint | Backend Has | Frontend Calls | Status |
|----------|------------|----------------|--------|
| POST /auth/register | ✅ | ✅ store | ✅ |
| POST /auth/login | ✅ | ✅ store + admin | ✅ |
| POST /auth/refresh | ✅ | ❌ nowhere | ⚠️ Unused |
| POST /auth/logout | ✅ | ✅ both | ✅ |
| GET /auth/me | ✅ | ❌ nowhere | ⚠️ Unused |
| GET /products | ✅ | ✅ store + admin | ✅ |
| GET /products/:slug | ✅ | ❌ (Server fetch) | ✅ via fetch() |
| POST /products | ✅ | ✅ admin | ✅ |
| PUT /products/:id | ✅ | ✅ admin | ✅ |
| DELETE /products/:id | ✅ | ✅ admin | ✅ |
| POST /products/:id/images | ✅ | ✅ admin | ✅ |
| GET /categories | ✅ | ✅ both | ✅ |
| GET /categories/:slug | ✅ | ✅ via fetch() | ✅ |
| POST /categories | ✅ | ✅ admin | ✅ |
| PUT /categories/:id | ✅ | ✅ admin | ✅ |
| DELETE /categories/:id | ✅ | ✅ admin | ✅ |
| GET /cart | ✅ | ✅ store | ✅ |
| POST /cart | ✅ | ❌ (client-side only) | 🚨 BUG |
| PUT /cart/:productId | ✅ | ❌ (client-side only) | 🚨 BUG |
| DELETE /cart/:productId | ✅ | ❌ (client-side only) | 🚨 BUG |
| DELETE /cart | ✅ | ❌ (client-side only) | 🚨 BUG |
| GET /orders | ✅ | ✅ store | ✅ |
| GET /orders/:id | ✅ | ✅ store | ✅ |
| POST /orders | ✅ | ✅ store | ✅ |
| PATCH /orders/:id/status | ✅ | ✅ admin | ✅ |
| POST /payments/intent | ✅ | ❌ nowhere | 🚨 Not integrated |
| POST /payments/confirm | ✅ | ❌ nowhere | 🚨 Not integrated |
| POST /payments/refund/:orderId | ✅ | ❌ nowhere | 🚨 Not integrated |
| GET /users/profile | ✅ | ❌ nowhere | 🚨 Not integrated |
| PUT /users/profile | ✅ | ❌ nowhere | 🚨 Not integrated |
| GET /users/addresses | ✅ | ❌ nowhere | 🚨 Not integrated |
| POST /users/addresses | ✅ | ❌ nowhere | 🚨 Not integrated |
| PUT /users/addresses/:id | ✅ | ❌ nowhere | 🚨 Not integrated |
| DELETE /users/addresses/:id | ✅ | ❌ nowhere | 🚨 Not integrated |
| GET /admin/stats | ✅ | ✅ admin | ✅ |
| GET /admin/orders | ✅ | ✅ admin | ✅ |
| GET /admin/orders/export | ✅ | ✅ admin | ✅ |
| GET /admin/orders/:id | ✅ | ✅ admin | ✅ |
| PATCH /admin/orders/:id/status | ✅ | ✅ admin | ✅ |
| GET /admin/orders/:id/invoice | ✅ | ✅ admin | ✅ |
| GET /admin/products/low-stock | ✅ | ✅ admin | ✅ |
| GET /admin/customers | ✅ | ✅ admin | ✅ |
| GET /admin/customers/:id | ✅ | ✅ admin | ✅ |
| PATCH /admin/customers/:id/toggle-status | ✅ | ✅ admin | ✅ |
| GET /notifications | ✅ | ✅ admin | ✅ |
| GET /notifications/unread-count | ✅ | ❌ nowhere | ⚠️ Unused |
| PATCH /notifications/read-all | ✅ | ✅ admin | ✅ |
| PATCH /notifications/:id/read | ✅ | ✅ admin | ✅ |
| DELETE /notifications/:id | ✅ | ✅ admin | ✅ |
| GET /admin/users | ✅ (recent) | ✅ admin | ✅ |
| POST /admin/users | ✅ (recent) | ✅ admin | ✅ |
| PATCH /admin/users/:id | ✅ (recent) | ❌ nowhere | ⚠️ Defined, not called |
| DELETE /admin/users/:id | ✅ (recent) | ✅ admin | ✅ |
| PATCH /admin/users/:id/reset-password | ✅ (recent) | ✅ admin | ✅ |
| PATCH /admin/me/password | ✅ (recent) | ✅ admin | ✅ |
| PATCH /admin/me/profile | ✅ (recent) | ✅ admin | ✅ |

### Cart Path Mismatch Detail
🚨 **This is a concrete bug.** Backend routes (`BACKEND/src/routes/cart.routes.ts`) expose:
- `POST /cart` — add item
- `PUT /cart/:productId` — update quantity
- `DELETE /cart/:productId` — remove item

Frontend `api.ts` defines:
- `POST /cart/items` — wrong
- `PATCH /cart/items/{itemId}` — wrong path + wrong method (PATCH vs PUT)
- `DELETE /cart/items/{itemId}` — wrong path

None of these functions are called, so the bug is currently hidden. It will surface the moment cart sync to backend is implemented.

---

## 3. Server vs. Client Components

### Distribution

| App | Server Components | Client Components | Total |
|----|-------------------|-------------------|-------|
| Store | ~15 | ~36 | ~51 |
| Admin | ~1 (redirect only) | ~26 | ~27 |

**Store Client Components (36 files with "use client"):**

Pages: `(auth)/login`, `(auth)/register`, `(shop)/products`, `(shop)/search`, `account`, `account/orders`, `account/orders/[id]`, `account/addresses`, `account/wishlist`, `cart`, `checkout`, `checkout/payment`, `contact`

Components: `ProductCard`, `ProductFilters`, `Header`, `MobileMenu`, `CartDrawer`, `CartItem`, `CheckoutSteps`, `AddressForm`, `HeroSlider`, `ProductDetailClient`, `AddToCartButton`, `LangInitializer`, `StatusBadge` (and more)

Stores/Hooks (all "use client"): `auth.store`, `cart.store`, `wishlist.store`, `lang.store`, `currency.store`, `useAuth`, `useCart`, `useProducts`, `useLang`, `useCurrency`

**Admin Client Components (26 files with "use client"):**

Pages (all 12 dashboard pages): `login`, `dashboard`, `products`, `products/[id]`, `products/new`, `orders`, `orders/[id]`, `customers`, `customers/[id]`, `categories`, `settings`, `notifications`

Components: `Topbar`, `Sidebar`, `LangInitializer`, `RecentOrders`, `RevenueChart`, `SalesByCategoryChart`, `OrderStatusChart`, `LowStockAlert`, `StatusChangeModal`, `ImageUpload`, `ProductForm`

### Server Components Currently Fetching via HTTP (Migration Candidates)

These are the highest-value targets post-migration — they can call Prisma directly:

| File | API Calls | Cache TTL | Migration Benefit |
|------|-----------|-----------|-------------------|
| `store/src/app/layout.tsx` | `fetch(/categories)` | 300s | → direct categories query |
| `store/src/app/page.tsx` | `fetch(/categories)`, `fetch(/products?limit=4)`, `fetch(/products?limit=8&sort=sales)` | 60s | → direct product queries |
| `store/src/app/(shop)/products/[slug]/page.tsx` | `fetch(/products/:slug)` | 3600s + generateStaticParams | → Prisma + ISR, no HTTP |

These 3 files make 5 HTTP calls to the backend. Post-migration they can all become direct service calls, eliminating the network hop entirely.

⚡ **Quick win:** The store Server Components already use native `fetch()` with `next: { revalidate }` — the migration path is clean (replace `fetch(NEXT_PUBLIC_API_URL + '/products')` with `productService.getAll()`).

---

## 4. Authentication State

### Complete Store Auth Flow

```
1. User submits login form (app/(auth)/login/page.tsx:25)
   → auth.login({ email, password }) → POST /auth/login
   
2. On success: response.data = { user: User, tokens: { accessToken, refreshToken } }
   → setUser(response.data.user)         ← stored in Zustand state
   → setTokens(response.data.tokens)     ← accessToken stored, refreshToken DISCARDED
   → Zustand persist writes to localStorage('auth-storage')
   → redirect('/account')

3. Subsequent requests:
   → Interceptor reads localStorage('auth-storage')
   → Extracts state.accessToken
   → Attaches: Authorization: Bearer <token>

4. Token expires → server returns 401:
   → Response interceptor: localStorage.removeItem('auth-storage')
   → window.location.href = '/login'
   ← NO refresh attempt

5. Logout (account/page.tsx):
   → POST /auth/logout (backend clears refreshToken in DB)
   → store.logout() → user=null, accessToken=null, isAuthenticated=false
   → Zustand persist updates localStorage
   → window.location.href = '/'
```

**Store State Shape:**
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
// Persisted to: localStorage key 'auth-storage'
// Format: { state: { user, accessToken, isAuthenticated }, version: 0 }
```

### Complete Admin Auth Flow

```
1. Admin submits login form (app/login/page.tsx:26)
   → adminAuth.login({ email, password }) → POST /auth/login
   
2. On success: Client checks role BEFORE storing:
   if (r.data.user.role !== 'ADMIN') { setError('Access denied'); return; }
   → setUser(r.data.user)
   → setTokens(r.data.tokens)    ← refreshToken DISCARDED (same as store)
   → Zustand persist writes to document.cookie('admin-auth-storage')
   → Cookie: { name, max-age: 604800, path: '/', SameSite: Lax, HttpOnly: NO }
   → redirect('/dashboard')

3. On every route under /dashboard:
   → middleware.ts reads cookie('admin-auth-storage')
   → JSON.parse(decodeURIComponent(value)).state
   → Checks: !!state.accessToken && state.user.role === 'ADMIN'
   → If false: redirect('/login')

4. Subsequent API requests:
   → Interceptor: useAdminAuthStore.getState().accessToken
   → Attaches: Authorization: Bearer <token>

5. Token expires → server returns 401:
   → Response interceptor: if (!url.includes('/auth/login') && !url.includes('/auth/refresh'))
   → store.logout() → clears Zustand state → cookie deleted
   → window.location.href = '/login'
   ← NO refresh attempt

6. Logout (Sidebar component):
   → POST /auth/logout
   → store.logout() → cookie deleted
   → router.push('/login')
```

**Admin State Shape:**
```typescript
interface AdminAuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
// Persisted to: cookie 'admin-auth-storage' (non-HttpOnly, SameSite=Lax, 7 days)
// Format: URL-encoded { state: { user, accessToken, isAuthenticated }, version: 0 }
```

### Middleware Analysis — `FRONTEND/apps/admin/src/middleware.ts`

```typescript
// Full middleware (12 lines):
export function middleware(request: NextRequest): NextResponse {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const authStorage = request.cookies.get('admin-auth-storage')?.value;
    let isAuthenticated = false;
    if (authStorage) {
      try {
        const s = JSON.parse(decodeURIComponent(authStorage))?.state;
        isAuthenticated = !!s?.accessToken && s?.user?.role === 'ADMIN';
      } catch {}
    }
    if (!isAuthenticated) return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*'] };
```

**Three conditions that must ALL pass:** ①cookie exists, ②`accessToken` truthy, ③`user.role === 'ADMIN'`

**Store has NO middleware.ts** — all auth checks are client-side `if (!user) return <SignInPrompt/>`.

### All Zustand Stores

| Store | App | Key | Storage | Persisted? | Notes |
|-------|-----|-----|---------|-----------|-------|
| `auth.store.ts` | Store | `auth-storage` | localStorage | ✅ user, accessToken, isAuthenticated | |
| `cart.store.ts` | Store | N/A | None | ❌ in-memory only | 🚨 Lost on refresh |
| `wishlist.store.ts` | Store | `wishlist-storage` | localStorage | ✅ all items | |
| `lang.store.ts` | Store | (unknown) | localStorage | ✅ | Bilingual support |
| `currency.store.ts` | Store | (unknown) | localStorage | ✅ | Multi-currency |
| `auth.store.ts` | Admin | `admin-auth-storage` | cookie | ✅ all state | 7-day, non-HttpOnly |
| `lang.store.ts` | Admin | (unknown) | localStorage | ✅ | Bilingual support |

### Security Notes

| Issue | Severity | Detail |
|-------|----------|--------|
| Access token in localStorage | High | XSS can steal user tokens (`store/auth.store.ts:27`) |
| Admin token in non-HttpOnly cookie | High | XSS can steal admin tokens — acknowledged in code comment (`admin/store/auth.store.ts:10-15`) |
| Refresh token never stored | Medium | `AuthTokens.refreshToken` received but discarded; no rotation |
| Hardcoded dev credentials | Medium | `admin@softodeviqstore.com` / `Admin@2026!` visible in `admin/app/login/page.tsx:55-61` in non-production |
| Cart not persisted | Medium | `cart.store.ts` has no persist — user loses cart on page refresh |
| No CSRF tokens | Low | SameSite=Lax on admin cookie is partial mitigation |

---

## 5. Environment Variables

### Current Mapping

| Variable | App | File:Line | Public? | Value | Notes |
|----------|-----|-----------|---------|-------|-------|
| `NEXT_PUBLIC_API_URL` | Store | `lib/api.ts:5`, `app/page.tsx:25,33,41`, `app/layout.tsx:119`, `app/(shop)/products/[slug]/page.tsx:8`, `app/(shop)/category/[slug]/page.tsx:9`, `app/sitemap.ts:4`, `app/llms.txt/route.ts:3` | ✅ | `http://localhost:5000/api/v1` | Used in 11 locations including **server-side fetch()** |
| `NEXT_PUBLIC_API_URL` | Admin | `lib/api.ts:5` | ✅ | `http://localhost:5000/api/v1` | Only Axios client |
| `NEXT_PUBLIC_APP_NAME` | Store | `app/(auth)/login/page.tsx:38`, `register/page.tsx:43` | ✅ | `SoftoDev` | Branding |
| `NEXT_PUBLIC_APP_NAME` | Admin | `app/login/page.tsx` | ✅ | `MyStore Admin` | Branding |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Store | `app/layout.tsx:103` | ✅ | (empty) | SEO meta tag |
| `NEXT_PUBLIC_FB_VERIFICATION` | Store | `app/layout.tsx:104,105` | ✅ | (empty) | SEO meta tag |
| `NODE_ENV` | Admin | `app/login/page.tsx:55` | — | system | Dev credentials toggle |

### After-Migration Variable Plan

| Old (Store) | Old (Admin) | Old (Backend) | New (Unified) | Notes |
|-------------|-------------|---------------|---------------|-------|
| `NEXT_PUBLIC_API_URL` | `NEXT_PUBLIC_API_URL` | — | `NEXT_PUBLIC_API_URL=/api/v1` | Becomes relative — no port needed |
| `NEXT_PUBLIC_APP_NAME=SoftoDev` | `NEXT_PUBLIC_APP_NAME=MyStore Admin` | — | `NEXT_PUBLIC_STORE_NAME` + `NEXT_PUBLIC_ADMIN_NAME` | Split into two vars |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | — | — | Keep or hardcode in metadata | Low value as env var |
| `NEXT_PUBLIC_FB_VERIFICATION` | — | — | Keep or hardcode in metadata | Low value as env var |
| — | — | `DATABASE_URL` | `DATABASE_URL` | Move to unified .env |
| — | — | `JWT_SECRET` | `JWT_SECRET` | Move to unified .env |
| — | — | `JWT_REFRESH_SECRET` | `JWT_REFRESH_SECRET` | Move to unified .env |
| — | — | `PORT=5000` | Remove | Next.js handles port |
| — | — | `FRONTEND_URL` | Remove | No cross-origin CORS needed |
| — | — | `STRIPE_SECRET_KEY` | `STRIPE_SECRET_KEY` | Server-only (no NEXT_PUBLIC_) |
| — | — | `CLOUDINARY_URL` | `CLOUDINARY_URL` | Server-only |

⚡ **Key insight:** The `NEXT_PUBLIC_API_URL` used inside server-side `fetch()` calls in store page.tsx, layout.tsx etc. — after migration these Server Components call Prisma directly, so the env var disappears from those files. Only the Axios client (for Client Components) still uses it, and it becomes a relative path.

---

## 6. Shared Types

### Complete `@repo/types` Inventory (`FRONTEND/packages/types/src/index.ts`)

All 21 exported types: `User`, `AuthTokens`, `Product`, `Category`, `CartItem`, `Cart`, `OrderStatus`, `PaymentStatus`, `OrderItem`, `OrderStatusHistory`, `OrderExportRow`, `Order`, `Address`, `ApiResponse<T>`, `PaginatedResponse<T>`, `PaymentIntent`, `NotificationType`, `Notification`, `CustomerSummary`, `CustomerDetail`, `DashboardStats`

Backend does **not** import from `@repo/types` ✅ (correct separation)

### Type vs. Prisma Schema Discrepancies

| Field | Frontend Type | Prisma Schema | Status |
|-------|--------------|---------------|--------|
| **User** | | | |
| `isActive` | ❌ Missing | ✅ exists | 🚨 Frontend can't read active status |
| `updatedAt` | ❌ Missing | ✅ exists | ⚠️ No update tracking |
| **Product** | | | |
| `updatedAt` | ❌ Missing | ✅ exists | ⚠️ No update tracking |
| `isFeatured` | ❌ Missing | ✅ exists (likely) | ⚠️ |
| SEO fields (`metaTitle`, `metaDescription`, etc.) | ❌ Missing | May exist in schema.prisma | ⚠️ Schema has additional fields |
| **Category** | | | |
| `isActive` | ❌ Missing | ✅ exists | ⚠️ Can't filter inactive categories |
| `createdAt` | ❌ Missing | ✅ exists | ⚠️ |
| **Order** | | | |
| `updatedAt` | ❌ Missing | ✅ exists | ⚠️ |
| **Address** | | | |
| `governorate` | ✅ In type | ❌ NOT in Prisma | 🚨 **CRITICAL: field stored in JSON only or lost** |
| `nearestLandmark` | ✅ In type | ❌ NOT in Prisma | 🚨 **CRITICAL: field stored in JSON only or lost** |
| `userId` | ❌ In type | ✅ In Prisma | ⚠️ Missing foreign key reference |
| `createdAt` | ❌ In type | ✅ In Prisma | ⚠️ |

**Address governorate/nearestLandmark analysis:** These Iraq-specific fields exist in `@repo/types` `Address` interface (lines 107-108, 110) but are NOT columns in the Prisma `Address` model. They are stored only as part of `Order.shippingAddress` (type `Json`), which is a JSON blob — meaning they're preserved for order history but not queryable. The `/users/addresses` endpoint stores addresses as Prisma `Address` rows, which would lose these fields. This is a significant architectural inconsistency.

### Type Coverage Summary

| Type | Coverage | Issues |
|------|----------|--------|
| User | 60% | Missing: isActive, updatedAt |
| Product | 70% | Missing: updatedAt, SEO fields |
| Category | 60% | Missing: isActive, createdAt |
| Order | 80% | Missing: updatedAt |
| Address | 40% | 🚨 Extra fields (governorate, nearestLandmark) not in DB; Missing: userId, createdAt |
| OrderItem | 100% | ✅ |
| Cart/CartItem | 100% | ✅ |
| Notification | 100% | ✅ |
| CustomerSummary/Detail | 100% | ✅ |
| DashboardStats | 100% | ✅ |
| AuthTokens | 100% | ✅ (refreshToken unused but defined) |

---

## 7. Forms & Mutations

### Store Forms

| Form | File | Fields | Validator | API Call | Success | Optimistic? |
|------|------|--------|-----------|----------|---------|-------------|
| Login | `app/(auth)/login/page.tsx` | email, password | `loginSchema` (auth.validator.ts) | POST /auth/login | redirect /account | No |
| Register | `app/(auth)/register/page.tsx` | name, email, password, confirmPassword | `registerSchema` (auth.validator.ts) | POST /auth/register | redirect /account | No |
| Checkout Address | `components/checkout/AddressForm.tsx` | fullName, phone, governorate, city, address, nearestLandmark, isDefault | Dynamic Zod schema with Iraq locale | None — saves to sessionStorage | Toast + step advance | No |
| Saved Addresses | `app/account/addresses/page.tsx` | (reuses AddressForm) | Same | None — saves to **localStorage** | Toast | No |

⚡ `AddressForm` has sophisticated logic: cascading governorate→city dropdowns from `lib/iraq-locations.ts`, Iraq-specific phone regex, dynamic schema with translations. This component is migration-safe (no API call).

🚨 The checkout flow saves address to `sessionStorage`, not to `/users/addresses`. The order creation step reads from `sessionStorage`. Addresses page saves to `localStorage`. Neither route calls the backend addresses API.

### Admin Forms

| Form | File | Fields | Validator | API Call | Success | Optimistic? |
|------|------|--------|-----------|----------|---------|-------------|
| Admin Login | `app/login/page.tsx` | email, password | Inline Zod | POST /auth/login + role check | redirect /dashboard | No |
| New Product | `components/products/ProductForm.tsx` + `products/new/page.tsx` | name, description, price, comparePrice, stock, categoryId | Inline Zod in ProductForm | POST /products | redirect /dashboard/products | No |
| Edit Product | `app/dashboard/products/[id]/page.tsx` | name, slug, description, price, comparePrice, stock, categoryId, isActive | Inline Zod (line 15-24) | PUT /products/:id | Toast | No |
| Category CRUD | `app/dashboard/categories/page.tsx` | name, slug (auto-generated), isActive | Inline Zod (line 13-17) | POST/PUT/DELETE /categories | Toast | No |
| Order Status | `components/orders/StatusChangeModal.tsx` | status, note | (implied) | PATCH /admin/orders/:id/status | State update | No |
| Settings (Profile) | `app/dashboard/settings/page.tsx` | (profile fields) | (inline) | PATCH /admin/me/profile | Toast | No |
| Settings (Password) | `app/dashboard/settings/page.tsx` | currentPassword, newPassword | (inline) | PATCH /admin/me/password | Toast | No |
| Admin User Mgmt | `app/dashboard/settings/page.tsx` | name, email, password | (inline) | POST/DELETE/PATCH /admin/users | Toast | No |

**Pattern consistency:** All forms use React Hook Form + Zod + @hookform/resolvers. Admin schemas are defined inline (not in a validators folder). No optimistic UI anywhere.

---

## 8. Routes & Navigation

### Complete Store Route Tree

| URL Path | File | Type | Auth | Data Fetch | Static/ISR |
|----------|------|------|------|------------|------------|
| `/` | `app/page.tsx` | Server | Public | fetch 3 endpoints | ISR 60s |
| `/products` | `app/(shop)/products/page.tsx` | Client | Public | useProducts hook | None |
| `/products/:slug` | `app/(shop)/products/[slug]/page.tsx` | Server | Public | fetch product | ISR 3600s + generateStaticParams |
| `/category/:slug` | `app/(shop)/category/[slug]/page.tsx` | Server | Public | None explicit | — |
| `/search` | `app/(shop)/search/page.tsx` | Client | Public | useProducts + URL params | None |
| `/login` | `app/(auth)/login/page.tsx` | Client | Public | POST on submit | None |
| `/register` | `app/(auth)/register/page.tsx` | Client | Public | POST on submit | None |
| `/cart` | `app/cart/page.tsx` | Client | Public | Zustand store | None |
| `/checkout` | `app/checkout/page.tsx` | Client | ⚠️ Soft | Zustand + sessionStorage | None |
| `/checkout/payment` | `app/checkout/payment/page.tsx` | Client | ⚠️ Soft | sessionStorage | None |
| `/checkout/success` | `app/checkout/success/page.tsx` | Server | Public | None | Static |
| `/account` | `app/account/page.tsx` | Client | ⚠️ Soft | GET /orders | None |
| `/account/orders` | `app/account/orders/page.tsx` | Client | ⚠️ Soft | GET /orders | None |
| `/account/orders/:id` | `app/account/orders/[id]/page.tsx` | Client | ⚠️ Soft | GET /orders/:id | None |
| `/account/addresses` | `app/account/addresses/page.tsx` | Client | ⚠️ Soft | localStorage only | None |
| `/account/wishlist` | `app/account/wishlist/page.tsx` | Client | ⚠️ Soft | Zustand wishlist | None |
| `/contact` | `app/contact/page.tsx` | Client | Public | POST on submit | None |
| `/about` | `app/about/page.tsx` | Server | Public | None | Static |
| `/privacy` | `app/privacy/page.tsx` | Server | Public | None | Static |
| `/terms` | `app/terms/page.tsx` | Server | Public | None | Static |
| `/faq` | `app/faq/page.tsx` | Server | Public | None | Static |
| `/glossary` | `app/glossary/page.tsx` | Server | Public | None | Static |
| `/how-it-works` | `app/how-it-works/page.tsx` | Server | Public | None | Static |
| `/payment-methods` | `app/payment-methods/page.tsx` | Server | Public | None | Static |
| `/robots.txt` | `app/robots.ts` | Route | Public | None | Static |
| `/sitemap.xml` | `app/sitemap.ts` | Route | Public | None | Static |
| `/llms.txt` | `app/llms.txt/route.ts` | Route | Public | None | Static |

⚠️ "Soft" auth = client-side check only, no middleware protection. Route loads, then shows a prompt if unauthenticated.

### Complete Admin Route Tree

| URL Path | File | Type | Auth | Data Fetch |
|----------|------|------|------|------------|
| `/` | `app/page.tsx` | Server | None | Redirect to /login or /dashboard |
| `/login` | `app/login/page.tsx` | Client | Public | POST on submit |
| `/dashboard` | `app/dashboard/page.tsx` | Client | Middleware | GET /admin/stats |
| `/dashboard/products` | `app/dashboard/products/page.tsx` | Client | Middleware | GET /products |
| `/dashboard/products/new` | `app/dashboard/products/new/page.tsx` | Client | Middleware | POST on submit |
| `/dashboard/products/:id` | `app/dashboard/products/[id]/page.tsx` | Client | Middleware | GET /products/:id |
| `/dashboard/orders` | `app/dashboard/orders/page.tsx` | Client | Middleware | GET /admin/orders |
| `/dashboard/orders/:id` | `app/dashboard/orders/[id]/page.tsx` | Client | Middleware | GET /admin/orders/:id |
| `/dashboard/customers` | `app/dashboard/customers/page.tsx` | Client | Middleware | GET /admin/customers |
| `/dashboard/customers/:id` | `app/dashboard/customers/[id]/page.tsx` | Client | Middleware | GET /admin/customers/:id |
| `/dashboard/categories` | `app/dashboard/categories/page.tsx` | Client | Middleware | GET /categories |
| `/dashboard/settings` | `app/dashboard/settings/page.tsx` | Client | Middleware | Multiple |
| `/dashboard/notifications` | `app/dashboard/notifications/page.tsx` | Client | Middleware | GET /notifications |

### URL Mapping Plan Post-Migration

| Current (Store) | Current (Admin) | New (Unified) | Change? |
|-----------------|-----------------|---------------|---------|
| `/` | — | `/` | None |
| `/products` | — | `/products` | None |
| `/products/:slug` | — | `/products/:slug` | None |
| `/category/:slug` | — | `/category/:slug` | None |
| `/search` | — | `/search` | None |
| `/cart` | — | `/cart` | None |
| `/checkout` | — | `/checkout` | None |
| `/account/**` | — | `/account/**` | None |
| `/login` | **COLLISION** | `/login` (store) | 🚨 Need to decide |
| `/register` | — | `/register` | None |
| — | `/login` | `/admin/login` | ⚠️ URL changes |
| — | `/dashboard/**` | `/dashboard/**` | None (keep same) |
| Static pages | — | Same paths | None |

🚨 **`/login` URL collision** — both apps currently host a `/login` page. In the merged app, store login stays at `/login`, admin login moves to `/admin/login`. The admin middleware redirect must also change from `/login` → `/admin/login`.

---

## 9. External Dependencies

### Dependency Comparison Table

| Package | Store Version | Admin Version | Match | Category | Migrate? |
|---------|--------------|--------------|-------|----------|----------|
| `next` | 16.2.2 | 16.2.2 | ✅ | Framework | YES |
| `react` | 19.2.4 | 19.2.4 | ✅ | Framework | YES |
| `react-dom` | 19.2.4 | 19.2.4 | ✅ | Framework | YES |
| `axios` | ^1.14.0 | ^1.14.0 | ✅ | HTTP | YES |
| `zustand` | ^5.0.12 | ^5.0.12 | ✅ | State | YES |
| `react-hook-form` | ^7.72.0 | ^7.72.0 | ✅ | Forms | YES |
| `zod` | ^4.3.6 | ^4.3.6 | ✅ | Validation | YES |
| `@hookform/resolvers` | ^5.2.2 | ^5.2.2 | ✅ | Forms | YES |
| `lucide-react` | ^1.7.0 | ^1.7.0 | ✅ | Icons | YES |
| `clsx` | ^2.1.1 | ^2.1.1 | ✅ | Utils | YES |
| `tailwind-merge` | ^3.5.0 | ^3.5.0 | ✅ | Utils | YES |
| `@tanstack/react-table` | — | ^8.21.3 | N/A | Tables | YES (admin-only) |
| `recharts` | — | ^3.8.1 | N/A | Charts | YES (admin-only) |
| `@repo/types` | * | * | ✅ | Internal | YES |

⚡ **Zero version mismatches** — perfect alignment across both apps. Merging `package.json` is trivial.

**DevDependencies** (identical in both):
`@tailwindcss/postcss@4`, `@types/node@^20`, `@types/react@^19`, `@types/react-dom@^19`, `eslint@^9`, `eslint-config-next@16.2.2`, `tailwindcss@^4`, `typescript@^5`

**Admin-only heavy packages:**
- `recharts@^3.8.1` (~250KB gzipped) — used in 4 dashboard chart components
- `@tanstack/react-table@^8.21.3` — used in orders, customers, notifications tables

Both are justified for admin use. After migration, code-splitting via route groups means store pages don't load them.

---

## 10. Build & Deploy Configuration

### Store — `FRONTEND/apps/store/next.config.ts` (62 lines)

```
Next.js: 16.2.2
Image remotePatterns: placehold.co, **.cloudinary.com, **.softodeviqstore.com, localhost:5000/uploads/**
Security headers: HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
Cache: Static assets 1 year (immutable), Images 30 days
Experimental: optimizePackageImports: ['lucide-react']
Output: Default
```

### Admin — `FRONTEND/apps/admin/next.config.ts` (13 lines)

```
Next.js: 16.2.2
Image remotePatterns: placehold.co, **.cloudinary.com, localhost (any port)
Security headers: NONE
Cache: Default browser behavior
Experimental: NONE
Output: Default
```

⚠️ Admin config is significantly under-configured. It lacks all security headers that the store has.

### Turborepo — `/turbo.json`

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "type-check": {}
  }
}
```

Minimal pipeline. No env variable cache keys, no selective task runners.

### Build Configuration Consolidation Plan

**Unified next.config.ts required changes:**
1. Merge image `remotePatterns` (union of both: 5 patterns)
2. Apply store's security headers to ALL routes
3. Carry over `optimizePackageImports: ['lucide-react']`
4. Add admin route group to headers config

**Unified turbo.json additions:**
- Add `"env": ["NEXT_PUBLIC_API_URL", "NODE_ENV"]` to build and dev tasks
- Consider selective runners (`dev:store`, `dev:admin`) for developer convenience

---

## 🎯 Migration Strategy

### Files That Move 1:1 (No Adaptation Needed)
- All `components/` in both apps (pure UI, no backend coupling)
- All Zustand stores (auth, cart, wishlist, lang, currency)
- `lib/utils.ts` (both apps — `cn()`, `formatPrice()`)
- `lib/iraq-locations.ts` (store)
- `lib/validators/` (store) — move to shared location
- `config/store.config.ts` and `config/admin.config.ts`
- All static pages (about, privacy, terms, faq, etc.)
- `packages/types/src/index.ts` — unchanged

### Files That Need Adaptation

| File | Required Change |
|------|----------------|
| `store/src/lib/api.ts` | Change `baseURL` fallback to `/api/v1` |
| `admin/src/lib/api.ts` | Change `baseURL` fallback to `/api/v1` + add SSR guard to request interceptor |
| `admin/src/middleware.ts` | Update matcher + redirect URL to `/admin/login` |
| `store/src/app/layout.tsx` | Replace `fetch(NEXT_PUBLIC_API_URL + '/categories')` with service call |
| `store/src/app/page.tsx` | Replace 3x `fetch()` calls with service calls |
| `store/src/app/(shop)/products/[slug]/page.tsx` | Replace `fetch()` with service call |
| `admin/src/app/login/page.tsx` | Update redirect from `/dashboard` → `/dashboard` (fine); URL update only |
| Both `next.config.*` | Merge into single file |

### Routes Reorganization

| Current | Type | New Location | New URL |
|---------|------|-------------|---------|
| `store/src/app/*` | Store pages | `app/(shop)/*` or `app/*` | Same URLs |
| `store/src/app/(auth)/*` | Auth | `app/(auth)/*` | `/login`, `/register` — same |
| `admin/src/app/login/` | Admin auth | `app/admin/(auth)/login/` | `/admin/login` ← changes |
| `admin/src/app/dashboard/` | Admin pages | `app/admin/dashboard/` | `/admin/dashboard/**` ← prefix |
| `BACKEND/src/routes/` | API handlers | `app/api/v1/` | `/api/v1/**` — same paths |

### Environment Variables Consolidation

| Old (Store) | Old (Admin) | Old (Backend) | New (Unified) |
|-------------|-------------|---------------|---------------|
| `NEXT_PUBLIC_API_URL` | `NEXT_PUBLIC_API_URL` | — | `NEXT_PUBLIC_API_URL=/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | `NEXT_PUBLIC_APP_NAME` | — | Split: `NEXT_PUBLIC_STORE_NAME` + `NEXT_PUBLIC_ADMIN_NAME` |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | — | — | Keep |
| `NEXT_PUBLIC_FB_VERIFICATION` | — | — | Keep |
| — | — | `DATABASE_URL` | `DATABASE_URL` |
| — | — | `JWT_SECRET` | `JWT_SECRET` |
| — | — | `JWT_REFRESH_SECRET` | `JWT_REFRESH_SECRET` |
| — | — | `JWT_EXPIRES_IN` | `JWT_EXPIRES_IN` |
| — | — | `JWT_REFRESH_EXPIRES_IN` | `JWT_REFRESH_EXPIRES_IN` |
| — | — | `PORT=5000` | Remove (Next.js default 3000) |
| — | — | `FRONTEND_URL` | Remove (same-origin, no CORS needed) |
| — | — | `STRIPE_SECRET_KEY` | `STRIPE_SECRET_KEY` (server-only) |
| — | — | `CLOUDINARY_URL` | `CLOUDINARY_URL` (server-only) |

### Dependencies to Merge
All 14 packages — no conflicts. Add to root `package.json` dependencies.

### Dependencies to Drop (from Express backend)
`express`, `cors`, `helmet`, `morgan`, `express-rate-limit`, `multer`, `jsonwebtoken`, `bcryptjs` (as HTTP server deps — some like `bcryptjs`, `jsonwebtoken` move to Next.js API routes or edge middleware).

### Dependencies to Add (for unified Next.js)
- `jose` (for edge-compatible JWT verification in Next.js middleware)
- Possibly `next-auth` or similar for session management (optional refactor)

---

## 🚨 Migration Risks & Mitigation

### Risk 1: Cart is purely client-side and will remain broken post-migration
**Detail:** The cart store is in-memory (not persisted). Cart operations (add/update/remove/clear) call endpoints with wrong paths and are not wired up anywhere. Cart state is lost on page refresh.
**Mitigation:** Fix before migration — update `cartApi` paths to match backend (`/cart/:productId`), wire up cart operations, add persist to cart store.

### Risk 2: `/login` URL collision between store and admin
**Detail:** Both apps expose `/login`. In the merged app these two pages must be separated.
**Mitigation:** Admin login moves to `/admin/login`. Update middleware redirect, update admin sidebar logout redirect. No store URLs change.

### Risk 3: Admin SSR crash from Zustand store access
**Detail:** `adminApiClient` request interceptor calls `useAdminAuthStore.getState()` without checking `typeof window`. This runs at module load time on the server and will crash.
**Mitigation:** Wrap in `if (typeof window !== 'undefined')` or use the same localStorage-read pattern as the store interceptor.

### Risk 4: Address data loss for Iraq-specific fields
**Detail:** `governorate` and `nearestLandmark` exist in the `@repo/types` `Address` interface but NOT in Prisma's `Address` model. If the backend's `/users/addresses` API stores these via Prisma rows, those fields are silently dropped.
**Mitigation:** Audit `BACKEND/src/controllers/user.controller.ts` address handlers. Either add columns to Prisma `Address` (migration required) or accept that only `shippingAddress` (JSON on Order) preserves these fields.

### Risk 5: Payment flow is entirely absent from frontend
**Detail:** Checkout creates an order without calling `/payments/intent` or `/payments/confirm`. The payment step page (`checkout/payment/page.tsx`) does nothing but navigate.
**Mitigation:** Implement payment integration before or during migration. The backend stubs are ready. This is not a migration risk per se but a feature completeness issue.

### Risk 6: Server Components use NEXT_PUBLIC_API_URL in fetch() — 11 call sites
**Detail:** `store/src/app/page.tsx`, `layout.tsx`, `sitemap.ts`, `llms.txt/route.ts`, category and product pages all use `process.env.NEXT_PUBLIC_API_URL` in server-side `fetch()` calls. After migration these should switch to direct service calls, but if not migrated they still work (they just make a self-request over localhost).
**Mitigation:** Migrate these Server Components to direct Prisma/service calls. This is the highest-value optimization of the migration.

### Risk 7: Admin middleware redirect hardcoded to `/login`
**Detail:** `middleware.ts` redirects unauthenticated admin requests to `/login` — which in the merged app would go to the store login page, not the admin login page.
**Mitigation:** Update redirect to `/admin/login` before merge.

---

## ✅ Migration-Friendly Aspects

1. **Zero dependency version mismatches** — Both apps are perfectly aligned. Package.json merge is trivial.
2. **All API endpoints use relative paths** — No `http://localhost:5000` in endpoint strings. Only `baseURL` changes.
3. **Auth stores use different persistence keys** — `auth-storage` (localStorage) and `admin-auth-storage` (cookie) can coexist in the same app without conflict.
4. **All types centralized in `@repo/types`** — No type drift between apps. Migration doesn't need to re-define types.
5. **Same validation libraries and versions** — React Hook Form + Zod patterns are identical, schemas portable.
6. **Admin middleware is simple and portable** — 12 lines, reads one cookie, easily moved to a root middleware.
7. **Bilingual infrastructure already in place** — `lang.store.ts` and `LangInitializer` in both apps suggests i18n is being prepared; the feature branch name `feature/bilingual-i18n` confirms this.
8. **Store has proper ISR on product pages** — `generateStaticParams` + `revalidate: 3600` already set up; this pattern survives migration unchanged.
9. **Image upload uses `multipart/form-data`** — `ImageUpload.tsx` and `uploadImages` in `api.ts` will work the same whether backend is Express or Next.js API route.

---

## 📋 Final Pre-Migration Checklist

### Bugs to Fix Before Migration
- [ ] Fix cart API paths in `store/src/lib/api.ts` (lines 46-48): `/cart/items` → `/cart`, method corrections
- [ ] Wire cart mutations to API (add, update, remove, clear in cart store or `useCart` hook)
- [ ] Add persist middleware to cart store
- [ ] Investigate address `governorate`/`nearestLandmark` Prisma storage gap
- [ ] Add SSR guard to admin API client request interceptor (`admin/src/lib/api.ts:6-10`)

### Before Migration
- [ ] Audit 1 reviewed: backend surface mapped _(no audit-1 file exists — create it)_
- [ ] Audit 2 reviewed: data flow understood _(no audit-2 file exists — create it)_
- [ ] Audit 3 reviewed: this document ✅
- [ ] All 3 audits cross-referenced
- [ ] Migration plan created from audit findings
- [ ] Backup of current code (`git tag v1.0-pre-migration`)
- [ ] Backup of database (`pg_dump ecommerce_db > backup-pre-migration.sql`)
- [ ] New Next.js project scaffolded (or route groups planned in existing monorepo)

### During Migration
- [ ] Update `NEXT_PUBLIC_API_URL` fallback in both `api.ts` files to `/api/v1`
- [ ] Add SSR guard to admin `api.ts` request interceptor
- [ ] Update admin `middleware.ts` redirect to `/admin/login`
- [ ] Move admin login to `/admin/login`
- [ ] Merge `next.config.ts` files (adopt store's security headers)
- [ ] Convert 3 store Server Components (`layout.tsx`, `page.tsx`, product slug page) to direct service calls
- [ ] Update `package.json` and `turbo.json` for unified project

### After Migration
- [ ] Verify admin `admin-auth-storage` cookie still works in middleware (same domain)
- [ ] Verify store `auth-storage` localStorage still works (unchanged)
- [ ] Verify ISR on `/products/:slug` still generates static params
- [ ] Verify image uploads still reach the right endpoint
- [ ] Verify Excel export and PDF invoice download (blob responses)
- [ ] Test notification polling in Topbar (30s interval)
- [ ] Update CLAUDE.md: Next.js version is 16.2.2, not 14

---

*Audit complete. No source files were modified.*
*Generated: 2026-05-08 | Branch: feature/bilingual-i18n*
