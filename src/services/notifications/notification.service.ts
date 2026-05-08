import { prisma } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';

export const notificationService = {
  async create(data: {
    type: NotificationType;
    title: string;
    message: string;
    data?: object;
  }) {
    return prisma.notification.create({ data });
  },

  async getAll(page: number = 1, limit: number = 20, unreadOnly: boolean = false) {
    const where = unreadOnly ? { isRead: false } : {};
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);
    return {
      notifications,
      total,
      pages: Math.ceil(total / limit),
    };
  },

  async getUnreadCount() {
    return prisma.notification.count({ where: { isRead: false } });
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },

  async markAllAsRead() {
    return prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  },

  async delete(id: string) {
    return prisma.notification.delete({ where: { id } });
  },
};
