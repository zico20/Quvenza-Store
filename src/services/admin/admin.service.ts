import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';

export async function getDashboardStats() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [
    todayOrdersCount,
    todayRevenueAgg,
    yesterdayOrdersCount,
    yesterdayRevenueAgg,
    totalProducts,
    totalUsers,
    totalOrdersCount,
    totalRevenueAgg,
    recentOrders,
    topProductsRaw,
    ordersByStatus,
    lowStockCount,
    salesByCategoryRaw,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: today }, paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: yesterday, lt: today } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: yesterday, lt: today }, paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.count(),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
    prisma.order.groupBy({ by: ['status'], _count: true }),
    prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, price: true },
    }),
  ]);

  // Hydrate top products
  const topProductIds = topProductsRaw.map((p) => p.productId);
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, slug: true, images: true, price: true },
  });
  const topProducts = topProductsRaw.map((p) => ({
    ...topProductDetails.find((d) => d.id === p.productId),
    totalSold: p._sum.quantity ?? 0,
  }));

  // Sales by category (Prisma-only, no raw SQL — RISK-07 fix)
  const productIdsWithSales = salesByCategoryRaw.map((s) => s.productId);
  const productsWithCategory = await prisma.product.findMany({
    where: { id: { in: productIdsWithSales } },
    select: { id: true, categoryId: true, category: { select: { name: true } } },
  });
  const categoryTotals = new Map<string, { name: string; total: number }>();
  for (const sale of salesByCategoryRaw) {
    const product = productsWithCategory.find((p) => p.id === sale.productId);
    if (!product?.category) continue;
    const rev = Number(sale._sum.price ?? 0) * (sale._sum.quantity ?? 0);
    const existing = categoryTotals.get(product.categoryId);
    if (existing) existing.total += rev;
    else categoryTotals.set(product.categoryId, { name: product.category.name, total: rev });
  }
  const salesByCategory = Array.from(categoryTotals.values()).sort((a, b) => b.total - a.total);

  return {
    today: {
      orders: todayOrdersCount,
      revenue: Number(todayRevenueAgg._sum.total ?? 0),
    },
    yesterday: {
      orders: yesterdayOrdersCount,
      revenue: Number(yesterdayRevenueAgg._sum.total ?? 0),
    },
    totals: {
      products: totalProducts,
      users: totalUsers,
      orders: totalOrdersCount,
      revenue: Number(totalRevenueAgg._sum.total ?? 0),
    },
    recentOrders,
    topProducts,
    ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count })),
    lowStockCount,
    salesByCategory,
  };
}

export async function getCustomers(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const page = params.page ?? 1;
  const limit = Math.min(params.limit ?? 10, 100);
  const skip = (page - 1) * limit;
  const where: any = { role: 'USER' };
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
    ];
  }
  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: { where: { paymentStatus: 'PAID' }, select: { total: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);
  return {
    customers: customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      isActive: c.isActive,
      createdAt: c.createdAt,
      orderCount: c._count.orders,
      totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getCustomerDetail(id: string) {
  const customer = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      createdAt: true,
      addresses: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, slug: true, images: true } },
            },
          },
        },
      },
    },
  });
  if (!customer) return null;
  const totalSpent = customer.orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + Number(o.total), 0);
  return { ...customer, totalSpent };
}

export async function toggleCustomerStatus(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  if (user.role === 'ADMIN') throw new AppError('Cannot toggle admin status from this endpoint.', 400);
  return prisma.user.update({ where: { id }, data: { isActive: !user.isActive } });
}
