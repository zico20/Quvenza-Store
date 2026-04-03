import { prisma } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';
import { PaginationQuery, buildPaginationMeta } from '../../utils/pagination';

export async function createOrder(data: { userId: string; items: { productId: string; quantity: number }[]; shippingAddress: object; paymentMethod: string }) {
  const products = await prisma.product.findMany({ where: { id: { in: data.items.map((i) => i.productId) }, isActive: true } });
  if (products.length !== data.items.length) throw new AppError('One or more products unavailable.', 400);
  for (const item of data.items) {
    const prod = products.find((pr) => pr.id === item.productId)!;
    if (prod.stock < item.quantity) throw new AppError(`Insufficient stock for: ${prod.name}`, 400);
  }
  const orderItems = data.items.map((item) => ({ productId: item.productId, quantity: item.quantity, price: products.find((pr) => pr.id === item.productId)!.price }));
  const total = orderItems.reduce((s: number, i) => s + i.price * i.quantity, 0);
  return prisma.$transaction(async (tx) => {
    for (const item of data.items) await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
    return tx.order.create({
      data: { userId: data.userId, total, shippingAddress: data.shippingAddress, paymentMethod: data.paymentMethod, items: { create: orderItems } },
      include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
    });
  });
}

export async function getUserOrders(userId: string, pagination: PaginationQuery) {
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where: { userId }, skip: pagination.skip, take: pagination.limit, orderBy: { createdAt: 'desc' }, include: { items: { include: { product: true } } } }),
    prisma.order.count({ where: { userId } }),
  ]);
  return { orders, pagination: buildPaginationMeta(total, pagination.page, pagination.limit) };
}

export async function getOrderById(id: string, userId?: string) {
  const where: any = { id };
  if (userId) where.userId = userId;
  const order = await prisma.order.findFirst({ where, include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } } });
  if (!order) throw new AppError('Order not found.', 404);
  return order;
}

export async function updateOrderStatus(id: string, status: string) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError('Order not found.', 404);
  return prisma.order.update({ where: { id }, data: { status: status as any }, include: { items: { include: { product: true } } } });
}

export async function getAllOrders(pagination: PaginationQuery, statusFilter?: string) {
  const where: any = {};
  if (statusFilter) where.status = statusFilter;
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, skip: pagination.skip, take: pagination.limit, orderBy: { createdAt: 'desc' }, include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } } }),
    prisma.order.count({ where }),
  ]);
  return { orders, pagination: buildPaginationMeta(total, pagination.page, pagination.limit) };
}
