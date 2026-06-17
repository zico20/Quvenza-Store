import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';
import { PaginationQuery, buildPaginationMeta } from '../../utils/pagination';
import { notificationTriggers } from '../notifications/notification.triggers';

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING:    ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED:    ['DELIVERED', 'CANCELLED'],
  DELIVERED:  ['REFUNDED'],
  CANCELLED:  [],
  REFUNDED:   [],
};

export async function createOrder(data: {
  userId: string;
  items: { productId: string; quantity: number; variantId?: string }[];
  shippingAddress: object;
  paymentMethod: string;
}) {
  // Fetch products to validate existence and get prices.
  // Stock is NOT checked here — the atomic guard inside the transaction is the real protection.
  const products = await prisma.product.findMany({
    where: { id: { in: data.items.map((i) => i.productId) }, isActive: true },
  });
  if (products.length !== data.items.length) throw new AppError('One or more products unavailable.', 400);

  // Fetch any referenced variants for price + name snapshot + stock decrement.
  const variantIds = data.items.map((i) => i.variantId).filter((v): v is string => !!v);
  const variants = variantIds.length
    ? await prisma.variant.findMany({ where: { id: { in: variantIds } } })
    : [];
  if (variants.length !== variantIds.length) throw new AppError('One or more variants unavailable.', 400);

  const orderItems = data.items.map((item) => {
    const variant = item.variantId ? variants.find((v) => v.id === item.variantId)! : undefined;
    return {
      productId: item.productId,
      variantId: item.variantId ?? null,
      variantName: variant?.name ?? null,
      quantity: item.quantity,
      // Variant price takes precedence; fall back to the product base price.
      price: variant ? variant.price : products.find((pr) => pr.id === item.productId)!.price,
    };
  });
  const total = orderItems.reduce((s, i) => s + Number(i.price) * i.quantity, 0);

  const lowStockProducts: Array<{ id: string; name: string; stock: number }> = [];

  const order = await prisma.$transaction(async (tx) => {
    // Atomic stock decrement: the WHERE clause acts as an optimistic lock.
    // Decrement variant stock when a variant is chosen, else product stock.
    for (const item of data.items) {
      if (item.variantId) {
        const updated = await tx.variant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          const prod = products.find((p) => p.id === item.productId)!;
          throw new AppError(`"${prod.name}" is out of stock or has insufficient quantity.`, 409);
        }
      } else {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity }, isActive: true },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          const prod = products.find((p) => p.id === item.productId)!;
          throw new AppError(`"${prod.name}" is out of stock or has insufficient quantity.`, 409);
        }
      }
      const updatedProduct = await tx.product.findUnique({ where: { id: item.productId } });
      if (updatedProduct && updatedProduct.stock <= 5) {
        lowStockProducts.push({ id: updatedProduct.id, name: updatedProduct.name, stock: updatedProduct.stock });
      }
    }

    const created = await tx.order.create({
      data: {
        userId: data.userId,
        total,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: created.id,
        fromStatus: null,
        toStatus: 'PENDING',
        note: 'تم إنشاء الطلب',
      },
    });

    // RISK-05 fix: Clear user's cart inside the same transaction
    await tx.cartItem.deleteMany({
      where: { cart: { userId: data.userId } },
    });

    return created;
  });

  // Fire notifications after successful transaction (non-blocking)
  notificationTriggers.onNewOrder(order.id, total).catch(console.error);
  for (const p of lowStockProducts) {
    notificationTriggers.onLowStock(p.id, p.name, p.stock).catch(console.error);
  }
  return order;
}

export async function getUserOrders(userId: string, pagination: PaginationQuery) {
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    }),
    prisma.order.count({ where: { userId } }),
  ]);
  return { orders, pagination: buildPaginationMeta(total, pagination.page, pagination.limit) };
}

export async function getOrderById(id: string, userId?: string) {
  const where: any = { id };
  if (userId) where.userId = userId;
  const order = await prisma.order.findFirst({
    where,
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, slug: true, images: true, price: true } },
        },
      },
      user: { select: { id: true, name: true, email: true } },
      statusHistory: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!order) throw new AppError('Order not found.', 404);
  return {
    ...order,
    total: Number(order.total),
    items: order.items.map((i) => ({ ...i, price: Number(i.price) })),
  };
}

export async function updateOrderStatus(
  id: string,
  newStatus: string,
  adminId: string,
  note?: string,
) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError('Order not found.', 404);

  const oldStatus = order.status as string;
  if (oldStatus === newStatus) throw new AppError('Order already has this status', 400);

  const allowed = VALID_TRANSITIONS[oldStatus] ?? [];
  if (!allowed.includes(newStatus)) {
    throw new AppError(`Cannot change status from ${oldStatus} to ${newStatus}`, 400);
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id },
      data: {
        status: newStatus as any,
        ...(newStatus === 'CANCELLED' && order.paymentStatus === 'PENDING'
          ? { paymentStatus: 'FAILED' as any }
          : {}),
      },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });
    await tx.orderStatusHistory.create({
      data: {
        orderId: id,
        fromStatus: oldStatus as any,
        toStatus: newStatus as any,
        note: note || `تم تغيير الحالة من ${oldStatus} إلى ${newStatus}`,
        changedBy: adminId,
      },
    });

    // RISK-01 fix: Atomic stock restoration if CANCELLED (inside same transaction)
    if (newStatus === 'CANCELLED') {
      const orderWithItems = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (orderWithItems) {
        for (const item of orderWithItems.items) {
          // Restore to the variant when the line was variant-specific, else the product.
          if (item.variantId) {
            await tx.variant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      }
    }

    return updated;
  });

  // Fire notification (non-blocking)
  notificationTriggers.onOrderStatusChanged(id, oldStatus as any, newStatus as any).catch(console.error);

  return {
    ...updatedOrder,
    total: Number(updatedOrder.total),
    items: updatedOrder.items.map((i) => ({ ...i, price: Number(i.price) })),
  };
}

export async function getAdminOrders(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    paymentStatus,
    dateFrom,
    dateTo,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  const where: any = {};

  if (status && status !== 'ALL') where.status = status;
  if (paymentStatus && paymentStatus !== 'ALL') where.paymentStatus = paymentStatus;

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = endDate;
    }
  }

  if (search) {
    where.OR = [
      { id: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const allowedSortFields = ['createdAt', 'total', 'status'];
  const orderBy: any = {};
  orderBy[allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'] = sortOrder;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map((o) => ({
      ...o,
      total: Number(o.total),
      items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
    })),
    total,
    pages: Math.ceil(total / limit),
    page,
    limit,
  };
}

// Legacy function kept for compatibility
export async function getAllOrders(pagination: PaginationQuery, statusFilter?: string) {
  const where: any = {};
  if (statusFilter) where.status = statusFilter;
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);
  return { orders, pagination: buildPaginationMeta(total, pagination.page, pagination.limit) };
}
