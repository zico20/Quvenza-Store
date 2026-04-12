import { prisma } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';
import { PaginationQuery, buildPaginationMeta } from '../../utils/pagination';

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
  items: { productId: string; quantity: number }[];
  shippingAddress: object;
  paymentMethod: string;
}) {
  const products = await prisma.product.findMany({
    where: { id: { in: data.items.map((i) => i.productId) }, isActive: true },
  });
  if (products.length !== data.items.length) throw new AppError('One or more products unavailable.', 400);
  for (const item of data.items) {
    const prod = products.find((pr) => pr.id === item.productId)!;
    if (prod.stock < item.quantity) throw new AppError(`Insufficient stock for: ${prod.name}`, 400);
  }
  const orderItems = data.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: products.find((pr) => pr.id === item.productId)!.price,
  }));
  const total = orderItems.reduce((s, i) => s + Number(i.price) * i.quantity, 0);

  return prisma.$transaction(async (tx) => {
    for (const item of data.items) {
      await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
    }
    const order = await tx.order.create({
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
        orderId: order.id,
        fromStatus: null,
        toStatus: 'PENDING',
        note: 'تم إنشاء الطلب',
      },
    });
    return order;
  });
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
    return updated;
  });

  if (newStatus === 'CANCELLED') {
    for (const item of updatedOrder.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
  }

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

// Keep legacy function for user-facing routes
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
