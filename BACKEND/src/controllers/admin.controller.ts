import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AppError } from '../middlewares/error.middleware';
import { parsePaginationQuery, buildPaginationMeta } from '../utils/pagination';

export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [
      todayOrders,
      todayRevenue,
      yesterdayOrders,
      yesterdayRevenue,
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      ordersByStatus,
      lowStockCount,
    ] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: today }, paymentStatus: 'PAID' } }),
      prisma.order.count({ where: { createdAt: { gte: yesterday, lt: today } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: yesterday, lt: today }, paymentStatus: 'PAID' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      prisma.order.groupBy({ by: ['status'], _count: true }),
      prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
    ]);

    const salesByCategory = await prisma.$queryRaw<{ name: string; total: string }[]>`
      SELECT c.name, CAST(SUM(oi.price * oi.quantity) AS DECIMAL(10,2)) as total
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      JOIN "Category" c ON p."categoryId" = c.id
      GROUP BY c.name
      ORDER BY total DESC
    `;

    const topProductIds = topProducts.map((p) => p.productId);
    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, price: true, images: true },
    });

    sendSuccess(res, {
      overview: {
        totalOrders,
        totalRevenue: Number(totalRevenue._sum.total || 0),
        totalProducts,
        totalUsers,
        lowStockCount,
      },
      today: {
        orders: todayOrders,
        revenue: Number(todayRevenue._sum.total || 0),
      },
      yesterday: {
        orders: yesterdayOrders,
        revenue: Number(yesterdayRevenue._sum.total || 0),
      },
      recentOrders: recentOrders.map((o) => ({ ...o, total: Number(o.total) })),
      topProducts: topProducts.map((tp) => {
        const detail = topProductDetails.find((d) => d.id === tp.productId);
        return {
          productId: tp.productId,
          name: detail?.name || 'Unknown',
          price: detail ? Number(detail.price) : 0,
          image: detail?.images?.[0] || null,
          totalSold: tp._sum.quantity || 0,
        };
      }),
      ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count })),
      salesByCategory: salesByCategory.map((s) => ({ name: s.name, total: Number(s.total) })),
    });
  } catch (error) { next(error); }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const p = parsePaginationQuery(req);
    const search = req.query.search as string | undefined;
    const where: any = { role: 'USER' };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true } },
          orders: {
            select: { total: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            // Remove take: 1 — get all orders
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: p.skip,
        take: p.limit,
      }),
      prisma.user.count({ where }),
    ]);
    const mapped = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isActive: u.isActive,
      createdAt: u.createdAt,
      totalOrders: u._count.orders,
      lastOrderDate: u.orders[0]?.createdAt || null,
      lastOrderTotal: u.orders[0] ? Number(u.orders[0].total) : null,
      totalSpent: u.orders.reduce((sum, o) => sum + Number(o.total), 0),
    }));
    sendPaginated(res, mapped, buildPaginationMeta(total, p.page, p.limit));
  } catch (error) { next(error); }
};

export const getCustomerDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { items: { include: { product: true } } },
        },
        addresses: true,
      },
    });
    if (!user) throw new AppError('User not found', 404);
    const totalSpent = user.orders.reduce((sum, o) => sum + Number(o.total), 0);
    const lastOrder = user.orders[0] || null;
    sendSuccess(res, {
      ...user,
      orders: user.orders.map((o) => ({ ...o, total: Number(o.total) })),
      totalSpent,
      totalOrders: user.orders.length,
      lastOrderDate: lastOrder?.createdAt || null,
    });
  } catch (error) { next(error); }
};

export const toggleCustomerStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) throw new AppError('User not found', 404);
    if (user.role === 'ADMIN') throw new AppError('Cannot disable admin accounts', 403);
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: !user.isActive },
      select: { id: true, name: true, email: true, isActive: true },
    });
    sendSuccess(res, updated, updated.isActive ? 'تم تفعيل الحساب' : 'تم تعطيل الحساب');
  } catch (error) { next(error); }
};
