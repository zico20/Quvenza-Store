# Database & Data Flow Audit
## E-Commerce Platform — SoftoDev
**Audit date:** 2026-05-08 | **Auditor:** Static analysis (Claude Code) | **Branch:** feature/bilingual-i18n

---

## PILLAR 1 — Schema Documentation

### Enums

| Enum | Values |
|------|--------|
| `Role` | `USER` \| `ADMIN` |
| `OrderStatus` | `PENDING` \| `PROCESSING` \| `SHIPPED` \| `DELIVERED` \| `CANCELLED` \| `REFUNDED` |
| `PaymentStatus` | `PENDING` \| `PAID` \| `FAILED` \| `REFUNDED` |
| `NotificationType` | `NEW_ORDER` \| `LOW_STOCK` \| `NEW_CUSTOMER` \| `ORDER_STATUS_CHANGED` |

---

### Model: `User` → table `User`

| Field | Type | Modifiers | Notes |
|-------|------|-----------|-------|
| `id` | `String` | `@id @default(cuid())` | |
| `name` | `String` | | |
| `email` | `String` | `@unique` | |
| `password` | `String` | | bcrypt hash, 12 rounds |
| `role` | `Role` | `@default(USER)` | |
| `refreshToken` | `String?` | optional | stored in DB, rotated on each use |
| `isActive` | `Boolean` | `@default(true)` | soft-disable gate |
| `createdAt` | `DateTime` | `@default(now())` | |
| `updatedAt` | `DateTime` | `@updatedAt` | |

**Relations:**

| Field | Type | Relation | Cascade |
|-------|------|----------|---------|
| `orders` | `Order[]` | User → Order (1:many) | none on User delete (Restrict) |
| `addresses` | `Address[]` | User → Address (1:many) | `onDelete: Cascade` on Address side |
| `cart` | `Cart?` | User → Cart (1:1, optional) | `onDelete: Cascade` on Cart side |

**Indexes:** `@unique(email)` (implicit)
**Soft-delete:** `isActive = false` via `toggleCustomerStatus`. Admin accounts use hard delete.

---

### Model: `Category` → table `Category`

| Field | Type | Modifiers |
|-------|------|-----------|
| `id` | `String` | `@id @default(cuid())` |
| `name` | `String` | |
| `slug` | `String` | `@unique` |
| `image` | `String?` | optional |
| `isActive` | `Boolean` | `@default(true)` |
| `createdAt` | `DateTime` | `@default(now())` |

**Relations:**

| Field | Type | Relation | Cascade |
|-------|------|----------|---------|
| `products` | `Product[]` | Category → Product (1:many) | none (Restrict) |

**Indexes:** `@unique(slug)` (implicit)
**Soft-delete:** `isActive = false` via `deleteCategory`. No hard delete exposed.

---

### Model: `Product` → table `Product`

| Field | Type | Modifiers | Notes |
|-------|------|-----------|-------|
| `id` | `String` | `@id @default(cuid())` | |
| `name` | `String` | | sanitized on write |
| `slug` | `String` | `@unique` | auto-generated; collision appends `-${Date.now()}` |
| `description` | `String` | `@db.Text` | sanitized on write |
| `price` | `Decimal` | `@db.Decimal(10, 2)` | money precision field |
| `comparePrice` | `Decimal?` | `@db.Decimal(10, 2)` | optional MSRP |
| `stock` | `Int` | `@default(0)` | atomic decrement on order |
| `images` | `String[]` | | array of URLs |
| `imageAlts` | `String[]` | `@default([])` | SEO alt texts |
| `isActive` | `Boolean` | `@default(true)` | soft-delete flag |
| `isFeatured` | `Boolean` | `@default(false)` | |
| `categoryId` | `String` | FK | |
| `createdAt` | `DateTime` | `@default(now())` | |
| `updatedAt` | `DateTime` | `@updatedAt` | |
| `metaTitle` | `String?` | `@db.VarChar(70)` | SEO |
| `metaDescription` | `String?` | `@db.VarChar(170)` | SEO |
| `metaKeywords` | `String?` | | SEO |
| `longDescription` | `String?` | `@db.Text` | rich product copy |
| `faqs` | `Json?` | | `[{question, answer}]` |
| `features` | `Json?` | | `[{title, description, icon?}]` |
| `viewCount` | `Int` | `@default(0)` | not yet incremented by API |
| `salesCount` | `Int` | `@default(0)` | not yet incremented by API |

**Relations:**

| Field | Type | Relation | Cascade |
|-------|------|----------|---------|
| `category` | `Category` | Product → Category (many:1) | none on category delete (Restrict) |
| `orderItems` | `OrderItem[]` | Product → OrderItem (1:many) | none (Restrict) |
| `cartItems` | `CartItem[]` | Product → CartItem (1:many) | none (Restrict) |
| `reviews` | `Review[]` | Product → Review (1:many) | `onDelete: Cascade` on Review side |

**Indexes:**
```
@@index([slug])
@@index([categoryId, isActive])
@@index([isActive, isFeatured])
```
**Soft-delete:** `isActive = false` via `softDeleteProduct`. NEVER hard-deleted via API.

---

### Model: `Review` → table `Review`

| Field | Type | Modifiers |
|-------|------|-----------|
| `id` | `String` | `@id @default(cuid())` |
| `productId` | `String` | FK |
| `customerName` | `String` | |
| `rating` | `Int` | |
| `comment` | `String` | `@db.Text` |
| `isVerified` | `Boolean` | `@default(false)` |
| `isApproved` | `Boolean` | `@default(false)` |
| `createdAt` | `DateTime` | `@default(now())` |

**Relations:**

| Field | Type | Relation | Cascade |
|-------|------|----------|---------|
| `product` | `Product` | Review → Product (many:1) | `onDelete: Cascade` — product deleted → reviews deleted |

**Indexes:** `@@index([productId, isApproved])`
**⚠ No API routes or services exist for this model** — schema-only, unused.

---

### Model: `BlogCategory` → table `BlogCategory`

| Field | Type | Modifiers |
|-------|------|-----------|
| `id` | `String` | `@id @default(cuid())` |
| `name` | `String` | |
| `slug` | `String` | `@unique` |
| `description` | `String?` | |

**Relations:** `posts BlogPost[]` (1:many, no cascade on Blog side)
**⚠ No API routes or services exist for this model** — schema-only, unused.

---

### Model: `BlogPost` → table `BlogPost`

| Field | Type | Modifiers |
|-------|------|-----------|
| `id` | `String` | `@id @default(cuid())` |
| `title` | `String` | |
| `slug` | `String` | `@unique` |
| `excerpt` | `String` | `@db.Text` |
| `content` | `String` | `@db.Text` |
| `coverImage` | `String` | |
| `coverImageAlt` | `String` | `@default("")` |
| `categoryId` | `String` | FK |
| `tags` | `String[]` | `@default([])` |
| `authorName` | `String` | `@default("SoftoDev")` |
| `metaTitle` | `String?` | `@db.VarChar(70)` |
| `metaDescription` | `String?` | `@db.VarChar(170)` |
| `isPublished` | `Boolean` | `@default(false)` |
| `publishedAt` | `DateTime?` | |
| `viewCount` | `Int` | `@default(0)` |
| `createdAt` | `DateTime` | `@default(now())` |
| `updatedAt` | `DateTime` | `@updatedAt` |

**Indexes:** `@@index([slug])`, `@@index([isPublished, publishedAt])`
**⚠ No API routes or services exist for this model** — schema-only, unused.

---

### Model: `Cart` → table `Cart`

| Field | Type | Modifiers |
|-------|------|-----------|
| `id` | `String` | `@id @default(cuid())` |
| `userId` | `String` | `@unique` |
| `createdAt` | `DateTime` | `@default(now())` |
| `updatedAt` | `DateTime` | `@updatedAt` |

**Relations:**

| Field | Type | Relation | Cascade |
|-------|------|----------|---------|
| `user` | `User` | Cart → User (many:1) | `onDelete: Cascade` — user deleted → cart deleted |
| `items` | `CartItem[]` | Cart → CartItem (1:many) | `onDelete: Cascade` on CartItem side |

---

### Model: `CartItem` → table `CartItem`

| Field | Type | Modifiers |
|-------|------|-----------|
| `id` | `String` | `@id @default(cuid())` |
| `cartId` | `String` | FK |
| `productId` | `String` | FK |
| `quantity` | `Int` | |

**Relations:**

| Field | Type | Relation | Cascade |
|-------|------|----------|---------|
| `cart` | `Cart` | CartItem → Cart (many:1) | `onDelete: Cascade` — cart deleted → items deleted |
| `product` | `Product` | CartItem → Product (many:1) | **no cascade** — product soft-delete doesn't affect cart |

**Indexes:** `@@unique([cartId, productId])` — prevents duplicate product in same cart
**No `updatedAt` field.**

---

### Model: `Order` → table `Order`

| Field | Type | Modifiers | Notes |
|-------|------|-----------|-------|
| `id` | `String` | `@id @default(cuid())` | |
| `userId` | `String` | FK | |
| `status` | `OrderStatus` | `@default(PENDING)` | validated transitions |
| `total` | `Decimal` | `@db.Decimal(10, 2)` | computed at creation |
| `paymentMethod` | `String` | | e.g. `"zaincash"` |
| `paymentStatus` | `PaymentStatus` | `@default(PENDING)` | |
| `shippingAddress` | `Json` | | **snapshot** of address at order time |
| `createdAt` | `DateTime` | `@default(now())` | |
| `updatedAt` | `DateTime` | `@updatedAt` | |

**Relations:**

| Field | Type | Relation | Cascade |
|-------|------|----------|---------|
| `user` | `User` | Order → User (many:1) | **no cascade** — user delete blocked if they have orders |
| `items` | `OrderItem[]` | Order → OrderItem (1:many) | `onDelete: Cascade` on OrderItem side |
| `statusHistory` | `OrderStatusHistory[]` | Order → History (1:many) | `onDelete: Cascade` on History side |

---

### Model: `OrderItem` → table `OrderItem`

| Field | Type | Modifiers | Notes |
|-------|------|-----------|-------|
| `id` | `String` | `@id @default(cuid())` | |
| `orderId` | `String` | FK | |
| `productId` | `String` | FK | |
| `quantity` | `Int` | | |
| `price` | `Decimal` | `@db.Decimal(10, 2)` | **snapshot** of price at order time |

**Relations:**

| Field | Type | Relation | Cascade |
|-------|------|----------|---------|
| `order` | `Order` | OrderItem → Order (many:1) | `onDelete: Cascade` — order deleted → items deleted |
| `product` | `Product` | OrderItem → Product (many:1) | **no cascade** — product must not be hard-deleted |

**No `updatedAt` field** (append-only by design).

---

### Model: `OrderStatusHistory` → table `OrderStatusHistory`

| Field | Type | Modifiers | Notes |
|-------|------|-----------|-------|
| `id` | `String` | `@id @default(cuid())` | |
| `orderId` | `String` | FK | |
| `fromStatus` | `OrderStatus?` | optional | null on order creation |
| `toStatus` | `OrderStatus` | | |
| `note` | `String?` | optional | Arabic text |
| `changedBy` | `String?` | optional | adminId (String, not FK) |
| `createdAt` | `DateTime` | `@default(now())` | |

**Relations:**

| Field | Type | Relation | Cascade |
|-------|------|----------|---------|
| `order` | `Order` | History → Order (many:1) | `onDelete: Cascade` — order deleted → history deleted |

**Note:** `changedBy` is a plain `String?`, not a FK to `User`. Deleting an admin user leaves a dangling text reference (no FK violation, no referential integrity).

---

### Model: `Notification` → table `Notification`

| Field | Type | Modifiers |
|-------|------|-----------|
| `id` | `String` | `@id @default(cuid())` |
| `type` | `NotificationType` | |
| `title` | `String` | |
| `message` | `String` | |
| `data` | `Json?` | structured payload |
| `isRead` | `Boolean` | `@default(false)` |
| `createdAt` | `DateTime` | `@default(now())` |

**Standalone model** — no FK relations. Hard-deleted via API (`DELETE /notifications/:id`).

---

### Model: `Address` → table `Address`

| Field | Type | Modifiers |
|-------|------|-----------|
| `id` | `String` | `@id @default(cuid())` |
| `userId` | `String` | FK |
| `fullName` | `String` | |
| `phone` | `String` | |
| `city` | `String` | |
| `address` | `String` | |
| `country` | `String` | |
| `isDefault` | `Boolean` | `@default(false)` |
| `createdAt` | `DateTime` | `@default(now())` |

**Relations:**

| Field | Type | Relation | Cascade |
|-------|------|----------|---------|
| `user` | `User` | Address → User (many:1) | `onDelete: Cascade` — user deleted → addresses deleted |

**No `updatedAt` field.** Hard-deleted via `DELETE /users/addresses/:id`.
**Safe to delete:** `Order.shippingAddress` is a JSON snapshot, not a FK — address deletion does not affect order history.

---

### Schema Visualization

```
User ─────────────────────────────────────────────────────────
  │  1:1 (cascade)           1:many (cascade)
  ├──► Cart ──► CartItem ──► Product (no cascade)
  │                  ↑ @@unique([cartId,productId])
  │
  │  1:many (cascade on Address)
  ├──► Address
  │
  │  1:many (NO cascade — Restrict prevents user delete if orders exist)
  └──► Order ──────────────────────────────────────────────────
         │  1:many (cascade)        1:many (cascade)
         ├──► OrderItem ──► Product (no cascade — must stay)
         └──► OrderStatusHistory (changedBy = String, not FK)

Category ──► Product (no cascade — category soft-deletes only)
Product  ──► Review (cascade — product delete cascades to reviews)

BlogCategory ──► BlogPost (no cascade defined)

Notification (standalone, no FK relations)
```

---

## PILLAR 2 — Cascade Behavior Matrix

| Parent delete | Child table | Behavior | Risk |
|--------------|-------------|----------|------|
| `User` | `Cart` | CASCADE | Cart auto-deleted |
| `User` | `Address` | CASCADE | Addresses auto-deleted (safe: orders use JSON snapshot) |
| `User` | `Order` | **RESTRICT** | Cannot delete user with orders — FK violation |
| `Cart` | `CartItem` | CASCADE | All items auto-deleted |
| `Product` | `Review` | CASCADE | Reviews auto-deleted |
| `Product` | `CartItem` | **RESTRICT** | Cannot hard-delete a product that's in someone's cart |
| `Product` | `OrderItem` | **RESTRICT** | Cannot hard-delete a product that's in any order |
| `Order` | `OrderItem` | CASCADE | Items auto-deleted |
| `Order` | `OrderStatusHistory` | CASCADE | History auto-deleted |
| `BlogCategory` | `BlogPost` | **RESTRICT** (default) | Cannot delete blog category with posts |

**Critical finding:** `Product` has no hard-delete path in the API (soft-delete only), which is correct. But the Prisma default (Restrict) means any attempt to hard-delete a product in a cart or order will throw a FK error. This is the intended safety net.

---

## PILLAR 3 — Complete Prisma Operation Map

### `auth.service.ts`

| Operation | Method | Table | Where clause |
|-----------|--------|-------|-------------|
| Register: check duplicate | `findUnique` | User | `{ email }` |
| Register: create user | `create` | User | — |
| Register: store refresh token | `update` | User | `{ id }` |
| Login: lookup user | `findUnique` | User | `{ email }` |
| Login: store refresh token | `update` | User | `{ id }` |
| Refresh: validate token | `findUnique` | User | `{ id }` |
| Refresh: rotate token | `update` | User | `{ id }` |
| Logout: clear token | `update` | User | `{ id }` → `{ refreshToken: null }` |

### `product.service.ts`

| Operation | Method | Table | Notes |
|-----------|--------|-------|-------|
| List products | `findMany` + `count` | Product | `where: { isActive: true }`, supports search/sort/pagination |
| Get by slug | `findUnique` | Product | throws 404 if inactive |
| Get by id | `findUnique` | Product | no isActive check |
| Create: check slug | `findUnique` | Product | collision → append `-${Date.now()}` |
| Create product | `create` | Product | sanitized name/description |
| Update: pre-check | `findUnique` | Product | |
| Update product | `update` | Product | slug regenerated if name changes |
| Soft delete: pre-check | `findUnique` | Product | |
| Soft delete | `update` | Product | `{ isActive: false }` |
| Low stock list | `findMany` | Product | `{ isActive: true, stock: { lte: threshold } }` |

### `category.controller.ts` (Prisma called directly — no service layer)

| Operation | Method | Table | Notes |
|-----------|--------|-------|-------|
| List categories | `findMany` | Category | `{ isActive: true }` only |
| Get category | `findUnique` | Category | by slug |
| Create category | `create` | Category | slug auto-generated |
| Update category | `update` | Category | slug regenerated if name changes |
| Delete category | `update` | Category | `{ isActive: false }` (soft) |

### `cart.controller.ts` (Prisma called directly — no service layer)

| Operation | Method | Table | Notes |
|-----------|--------|-------|-------|
| Get/create cart | `upsert` | Cart | `where: { userId }`, idempotent |
| Validate product | `findUnique` | Product | checks `isActive` + stock |
| Find existing item | `findUnique` | CartItem | `@@unique([cartId, productId])` |
| Add to cart: update qty | `update` | CartItem | `quantity: existing.quantity + quantity` (TOCTOU — see risks) |
| Add to cart: new item | `create` | CartItem | |
| Update item: find | `findFirst` | CartItem | `{ id: req.params.itemId, cartId }` |
| Update item: set qty | `update` | CartItem | |
| Update item: qty ≤ 0 | `delete` | CartItem | removes item if qty drops to zero |
| Remove item: find | `findFirst` | CartItem | ownership check |
| Remove item | `delete` | CartItem | |
| Clear cart | `deleteMany` | CartItem | `{ cartId }` |

### `order.service.ts`

| Operation | Method | Table | Notes |
|-----------|--------|-------|-------|
| Pre-tx: validate products | `findMany` | Product | `{ id: { in: [...] }, isActive: true }` |
| **[IN TX]** Atomic stock decrement | `updateMany` | Product | `{ stock: { gte: qty }, isActive: true }` → `{ stock: { decrement: qty } }` |
| **[IN TX]** Check post-decrement stock | `findUnique` | Product | collects low-stock products |
| **[IN TX]** Create order + items | `create` | Order + OrderItem | nested create |
| **[IN TX]** Create initial history | `create` | OrderStatusHistory | `fromStatus: null, toStatus: PENDING` |
| Get user orders | `findMany` + `count` | Order | `{ userId }`, paginated |
| Get order by id | `findFirst` | Order | optional `userId` scoping |
| Admin order list | `findMany` + `count` | Order | full filter/sort/paginate |
| Pre-tx status: find order | `findUnique` | Order | validates existence + current status |
| **[IN TX]** Update order status | `update` | Order | `{ status }` + conditional `paymentStatus: FAILED` |
| **[IN TX]** Create history entry | `create` | OrderStatusHistory | `fromStatus, toStatus, note, changedBy` |
| Post-tx CANCELLED: restore stock | `update` (loop) | Product | `{ stock: { increment: qty } }` — **NOT in transaction** |

### `payment.service.ts`

| Operation | Method | Table | Notes |
|-----------|--------|-------|-------|
| Initiate: find order | `findUnique` | Order | validates ownership |
| Confirm: find order | `findUnique` | Order | validates ownership |
| Confirm: mark paid | `update` | Order | `{ paymentStatus: PAID, status: PROCESSING }` |
| Refund: mark refunded | `update` | Order | `{ paymentStatus: REFUNDED, status: REFUNDED }` |

### `admin.controller.ts`

| Operation | Method | Table | Notes |
|-----------|--------|-------|-------|
| Stats: today orders | `count` | Order | date filter |
| Stats: today revenue | `aggregate(_sum.total)` | Order | `paymentStatus: PAID` |
| Stats: yesterday orders/revenue | `count` + `aggregate` | Order | date range |
| Stats: total products | `count` | Product | `isActive: true` |
| Stats: total users | `count` | User | `role: USER` |
| Stats: total orders/revenue | `count` + `aggregate` | Order | |
| Stats: recent orders | `findMany` | Order | `take: 5`, includes user |
| Stats: top products | `groupBy` | OrderItem | `by: [productId], _sum.quantity, take: 5` |
| Stats: orders by status | `groupBy` | Order | `by: [status], _count` |
| Stats: low stock count | `count` | Product | `{ isActive: true, stock: { lte: 5 } }` |
| Stats: sales by category | `$queryRaw` | OrderItem+Product+Category | PostgreSQL-specific raw SQL |
| Stats: top product details | `findMany` | Product | by id list |
| Customer list | `findMany` + `count` | User | `role: USER`, includes orders + `_count` |
| Customer detail | `findUnique` | User | includes orders+items+products, addresses |
| Toggle status: find | `findUnique` | User | |
| Toggle status: update | `update` | User | `{ isActive: !user.isActive }` |

### `admin-user.controller.ts`

| Operation | Method | Table | Notes |
|-----------|--------|-------|-------|
| List admins | `findMany` | User | `role: ADMIN` |
| Create admin: check email | `findUnique` | User | |
| Create admin | `create` | User | `role: ADMIN`, bcrypt 12 rounds |
| Update admin: find + validate | `findUnique` | User | confirms `role === ADMIN` |
| Update admin: email check | `findUnique` | User | |
| Update admin | `update` | User | name/email only |
| Delete admin: validate | `findUnique` | User | |
| Delete admin: last-admin guard | `count` | User | `{ role: ADMIN, isActive: true }` |
| **Delete admin** | **`delete`** | **User** | **HARD DELETE** |
| Reset password: validate | `findUnique` | User | |
| Reset password | `update` | User | `{ password: hash, refreshToken: null }` |
| Change own password | `findUnique` + `update` | User | |
| Update own profile: email check | `findFirst` | User | `NOT: { id: self }` |
| Update own profile | `update` | User | |

### `user.controller.ts`

| Operation | Method | Table | Notes |
|-----------|--------|-------|-------|
| Get profile | `findUnique` | User | safe select (no password/token) |
| Update profile | `update` | User | name/email |
| Change password | `findUnique` + `update` | User | bcrypt compare then hash |
| Get addresses | `findMany` | Address | `{ userId }` |
| Add address | `create` | Address | |
| Delete address: validate | `findFirst` | Address | `{ id, userId }` ownership check |
| **Delete address** | **`delete`** | **Address** | **HARD DELETE** |
| List all users (admin) | `findMany` + `count` | User | paginated |

### `notification.service.ts`

| Operation | Method | Table | Notes |
|-----------|--------|-------|-------|
| Create | `create` | Notification | triggered post-transaction |
| List all | `findMany` + `count` | Notification | paginated, optional `isRead: false` filter |
| Unread count | `count` | Notification | `{ isRead: false }` |
| Mark one read | `update` | Notification | `{ isRead: true }` |
| Mark all read | `updateMany` | Notification | `{ isRead: false }` → `{ isRead: true }` |
| **Delete** | **`delete`** | **Notification** | **HARD DELETE** |

### Export / Invoice Services (read-only)

| Operation | Method | Table | Notes |
|-----------|--------|-------|-------|
| Export to Excel | `findMany` | Order | includes user + items + products |
| Generate invoice | `findUnique` | Order | includes user + items + products |

---

## PILLAR 4 — Transaction Patterns

### Transaction 1: `createOrder` (critical path)

```
prisma.$transaction(async (tx) => {
  for each item:
    tx.product.updateMany(  ← atomic stock decrement (optimistic lock)
      where: { id, stock: { gte: qty }, isActive: true }
      data:  { stock: { decrement: qty } }
    )
    ↑ if count === 0 → throw AppError(409) → ROLLBACK ALL DECREMENTS

    tx.product.findUnique( ← low-stock collection (read only)
      where: { id }
    )

  tx.order.create(         ← creates Order + OrderItems (nested)
    data: { userId, total, shippingAddress, paymentMethod,
            items: { create: orderItems } }
  )

  tx.orderStatusHistory.create(  ← initial audit entry
    data: { orderId, fromStatus: null, toStatus: PENDING }
  )
})
```

**Post-transaction (outside):**
- `notificationTriggers.onNewOrder(orderId, total).catch(console.error)` — fire-and-forget
- `notificationTriggers.onLowStock(...).catch(console.error)` — fire-and-forget, per low-stock product

**Isolation guarantee:** All stock decrements for a single order are atomic. If any product's stock is insufficient, the entire transaction rolls back — no partial stock decrement is committed.

**Cart is NOT cleared** after order creation. This must be done explicitly by the client or a follow-up API call.

---

### Transaction 2: `updateOrderStatus`

```
prisma.$transaction(async (tx) => {
  tx.order.update(          ← status change + conditional paymentStatus
    where: { id }
    data:  { status: newStatus,
             ...(CANCELLED && paymentStatus===PENDING ? { paymentStatus: FAILED } : {}) }
  )

  tx.orderStatusHistory.create(  ← audit trail entry
    data: { orderId, fromStatus, toStatus, note, changedBy }
  )
})
```

**Post-transaction (outside):**
```javascript
if (newStatus === 'CANCELLED') {
  for (const item of updatedOrder.items) {
    await prisma.product.update({   ← stock restore, NOT in transaction
      where: { id: item.productId },
      data:  { stock: { increment: item.quantity } }
    })
  }
}
notificationTriggers.onOrderStatusChanged(...).catch(console.error)
```

**⚠ Risk:** Stock restoration on CANCELLED is a sequential loop of individual `UPDATE` statements outside the transaction. If the process crashes or one update fails mid-loop, stock will be partially restored (some items refunded, some not). See Pillar 5.

---

### Raw SQL Query (`$queryRaw`)

Located in `admin.controller.ts`:
```sql
SELECT c.name, CAST(SUM(oi.price * oi.quantity) AS DECIMAL(10,2)) as total
FROM "OrderItem" oi
JOIN "Product" p ON oi."productId" = p.id
JOIN "Category" c ON p."categoryId" = c.id
GROUP BY c.name
ORDER BY total DESC
```

**Notes:**
- Uses PostgreSQL double-quoted table names (`"OrderItem"`, `"Product"`, `"Category"`) — **not portable** to other databases
- No parameterization needed (no user input)
- Returns `{ name: string, total: string }[]` — `total` is a string (Prisma serializes `DECIMAL` as string in `$queryRaw`)
- `Number(s.total)` applied in controller before response

---

## PILLAR 5 — Data Integrity Risks

### RISK-01: Stock Restoration Not Atomic (CANCELLED orders)
**Severity: HIGH**
**Location:** `order.service.ts:170–177`

When an order is cancelled, stock is restored in a sequential loop **outside** the transaction:
```typescript
for (const item of updatedOrder.items) {
  await prisma.product.update({   // ← separate statement per item, no transaction
    where: { id: item.productId },
    data: { stock: { increment: item.quantity } },
  });
}
```
If the process crashes between iterations, or one `update` throws (e.g., product deleted), earlier items will have their stock restored but later items will not. There is no retry or rollback mechanism.

**Fix for Next.js migration:** Wrap stock restoration in the same transaction as the status update, or use `updateMany` with an `id: { in: [...] }` filter where each product's increment is applied atomically.

---

### RISK-02: Cart Quantity Update Has TOCTOU Window
**Severity: LOW** (per-user cart; concurrent same-user requests are rare)
**Location:** `cart.controller.ts:29–31`

```typescript
const existing = await prisma.cartItem.findUnique(...)  // read
if (existing)
  await prisma.cartItem.update({ data: { quantity: existing.quantity + quantity } })  // write
```

Between the `findUnique` and the `update`, a concurrent request from the same user could modify `existing.quantity`. The result is the second write overwrites the first addition rather than stacking.

**Fix:** Use Prisma's `quantity: { increment: quantity }` instead of `existing.quantity + quantity`.

---

### RISK-03: Payment Confirmation Bypasses Status Transition Validation
**Severity: MEDIUM**
**Location:** `payment.service.ts:21`

```typescript
await prisma.order.update({
  where: { id: orderId },
  data: { paymentStatus: 'PAID', status: 'PROCESSING' }
})
```

This directly sets `status: 'PROCESSING'` without going through `VALID_TRANSITIONS`. If the order is already `SHIPPED` or `DELIVERED` and a stale payment confirmation arrives, it would revert the order status to `PROCESSING`, corrupting the status history. The `OrderStatusHistory` is also not updated here.

**Fix for Next.js migration:** Route payment confirmation through `updateOrderStatus()` for status changes, or add a guard: only update status if current status is `PENDING`.

---

### RISK-04: Admin User Hard Delete Leaves Dangling `changedBy` References
**Severity: LOW** (data quality, not integrity)
**Location:** `admin-user.controller.ts:67`

`prisma.user.delete({ where: { id } })` hard-deletes an admin account. `OrderStatusHistory.changedBy` is a `String?` (not a FK), so the delete succeeds, but every history row that referenced that admin now has a `changedBy` pointing to a non-existent user ID. The text is preserved but unresolvable.

**Acceptable risk:** It's an audit log — the ID is a historical record of who changed it, not a live relationship. Document this behavior.

---

### RISK-05: No Cart Clearing After Order Creation
**Severity: MEDIUM** (UX and data hygiene)
**Location:** `order.service.ts` — absent

After `createOrder` commits successfully, the user's cart is not cleared. The frontend is expected to call `DELETE /cart` separately. If the client fails to do so (network error, tab close), the cart remains stale with items that have already been ordered and whose stock has been decremented.

**Fix for Next.js migration:** Add `tx.cartItem.deleteMany({ where: { cart: { userId } } })` inside the `createOrder` transaction.

---

### RISK-06: `viewCount` / `salesCount` Never Incremented
**Severity: LOW** (feature gap, not integrity)
**Location:** `schema.prisma:88–89`

`Product.viewCount` and `Product.salesCount` are defined in the schema and initialized to random values in seed, but no service or controller increments them. These fields are dead weight in the current codebase.

---

### RISK-07: `$queryRaw` Is PostgreSQL-Specific
**Severity: LOW** (portability only)
**Location:** `admin.controller.ts:51–58`

The raw SQL uses double-quoted identifiers and PostgreSQL `CAST`. Any database change would require rewriting this query. For the Next.js migration (if using a different ORM or database), this must be replaced.

---

### RISK-08: Seed Data Price Inconsistency
**Severity: LOW** (seed-only, not production)
**Location:** `seed.ts:955`

The sample order uses `price: 95000` for an `OrderItem` referencing the `chatgpt-plus-4months` product, whose `price` is `65`. The product prices are in USD (or represent some unit), while the order item price appears to be in IQD. The two values are inconsistent within the same schema. In production, `orderItems` price should come from `product.price` at creation time (which `createOrder` does correctly via `products.find(...).price`).

---

## PILLAR 6 — Seed Data Analysis

**File:** `BACKEND/prisma/seed.ts`

### Cleanup Order
```
OrderStatusHistory → OrderItem → Order → CartItem → Cart → Review → Product → Category → User
```
This correctly respects FK dependency order (children before parents). `BlogPost` and `BlogCategory` are NOT cleaned up in seed (they have no seed data).

### Seeded Records
| Entity | Count | Notes |
|--------|-------|-------|
| Users | 2 | admin + customer |
| Categories | 8 | Arabic names, digital goods focused |
| Products | 19 | Digital subscriptions + gaming accounts |
| Orders | 1 | DELIVERED status, PAID payment |
| OrderStatusHistory | 0 | ⚠ Seed order has no history entries |
| Carts | 0 | No cart created for any user |
| Addresses | 0 | No addresses seeded |
| Notifications | 0 | |

### Issues in Seed
1. **No `OrderStatusHistory` for the seed order** — the sample DELIVERED order has no audit trail. The admin timeline UI will render empty for this order.
2. **`viewCount` and `salesCount` use `Math.random()`** — seed is non-deterministic. Running seed twice produces different values.
3. **Sample order price mismatch** — `OrderItem.price: 95000` vs `Product.price: 65`. See RISK-08.
4. **Products created with sequential `for...await`** — could be parallelized with `Promise.all` for faster seeding (19 separate round trips to DB).
5. **Category CLAUDE.md says 6 categories; seed creates 8** — documentation in CLAUDE.md is stale. The actual count is 8 (digital goods categories, not the physical goods from the original schema description).

---

## PILLAR 7 — Models Without API Coverage

These models exist in `schema.prisma` but have **zero** routes, controllers, or services:

| Model | Status | Impact |
|-------|--------|--------|
| `Review` | Schema only | Reviews cannot be created, read, or approved via API |
| `BlogCategory` | Schema only | Blog categories cannot be managed |
| `BlogPost` | Schema only | No blog CRUD, no published-post listing |

**These models will migrate to Next.js cleanly** (no live data, no routes to convert), but they need API implementation before any frontend blog/review features can be built.

---

## PILLAR 8 — Data Flow: Order Lifecycle

```
POST /orders
  ├── products = prisma.product.findMany (validate all products active)
  ├── compute total = sum(price * quantity)
  ├── prisma.$transaction:
  │     ├── product.updateMany (atomic stock decrement × N items)
  │     ├── product.findUnique (post-decrement stock check × N items)
  │     ├── order.create (with nested items.create)
  │     └── orderStatusHistory.create (PENDING entry)
  ├── [post-tx] notification: NEW_ORDER
  └── [post-tx] notification: LOW_STOCK (if any product.stock ≤ 5)

PATCH /admin/orders/:id/status
  ├── order.findUnique (validate + get current status)
  ├── VALID_TRANSITIONS check
  ├── prisma.$transaction:
  │     ├── order.update (new status + conditional paymentStatus)
  │     └── orderStatusHistory.create
  ├── [post-tx, if CANCELLED]:
  │     └── product.update (stock += qty) × N items  ← NOT atomic
  └── [post-tx] notification: ORDER_STATUS_CHANGED

POST /payments/confirm
  ├── order.findUnique (ownership check)
  ├── gateway.confirmPayment (stub)
  └── order.update (paymentStatus: PAID, status: PROCESSING)  ← bypasses VALID_TRANSITIONS
```

---

## PILLAR 9 — Key Design Decisions for Next.js Migration

| Decision | Where | Impact on migration |
|----------|-------|---------------------|
| `Order.shippingAddress` is JSON snapshot | schema.prisma | Next.js Server Actions / API Routes can read directly — no join needed |
| `OrderItem.price` is snapshot | schema.prisma | Price display on order history is always correct even if product price changes |
| `Product` is never hard-deleted | All services | `OrderItem.productId` FK is always resolvable; safe to include product in queries |
| `changedBy` is String, not FK | schema.prisma | No cascade issues when admins are deleted; but admin name cannot be joined |
| `refreshToken` stored in DB | User model | Server-side session invalidation works; requires DB read on every token refresh |
| Notifications are fire-and-forget | notification.triggers.ts | Notifications must NEVER be awaited inside a transaction |
| Stock decrement is atomic via `updateMany` | order.service.ts | The WHERE clause acts as an optimistic lock — safe under concurrent orders |
| `$queryRaw` for sales by category | admin.controller.ts | Must be rewritten if changing ORM or database engine |
| Decimal fields serialize as string | Prisma behavior | Always wrap in `Number()` before arithmetic — applies identically in Next.js |
| Cart uses `upsert` | cart.controller.ts | Idempotent — no risk of duplicate carts |

---

## SUMMARY: Issues Requiring Action Before Next.js Migration

| ID | Issue | Severity | File | Fix |
|----|-------|----------|------|-----|
| RISK-01 | Stock restore on cancel not atomic | HIGH | `order.service.ts:170` | Wrap in `$transaction` or use `updateMany` |
| RISK-02 | Cart qty TOCTOU | LOW | `cart.controller.ts:30` | Use `{ increment: qty }` |
| RISK-03 | Payment confirm bypasses status transitions | MEDIUM | `payment.service.ts:21` | Add guard or route through `updateOrderStatus` |
| RISK-04 | Admin hard delete leaves dangling `changedBy` | LOW | `admin-user.controller.ts:67` | Document; optionally nullify before delete |
| RISK-05 | Cart not cleared on order creation | MEDIUM | `order.service.ts` | Add `cartItem.deleteMany` inside transaction |
| RISK-06 | `viewCount`/`salesCount` never incremented | LOW | `product.service.ts` | Implement increment or remove fields |
| RISK-07 | Raw SQL is PostgreSQL-specific | LOW | `admin.controller.ts:51` | Replace with Prisma ORM query |
| RISK-08 | Seed order price mismatch | LOW | `seed.ts:955` | Fix to match product.price |
| RISK-09 | Seed order has no status history | LOW | `seed.ts` | Add `orderStatusHistory` entries |
| RISK-10 | Review/Blog models unimplemented | INFO | schema.prisma | No action needed before migration |

---

*Generated by static analysis — no database queries executed, no files modified.*
*Scope: `BACKEND/prisma/schema.prisma`, `seed.ts`, all `src/services/**`, `src/controllers/**`, `src/config/database.ts`*
