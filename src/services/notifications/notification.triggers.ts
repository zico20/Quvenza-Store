import { notificationService } from './notification.service';

export const notificationTriggers = {
  async onNewOrder(orderId: string, total: number) {
    await notificationService.create({
      type: 'NEW_ORDER',
      title: 'طلب جديد',
      message: `تم استلام طلب جديد بقيمة ${total}`,
      data: { orderId },
    });
  },

  async onLowStock(productId: string, productName: string, currentStock: number) {
    await notificationService.create({
      type: 'LOW_STOCK',
      title: 'مخزون منخفض',
      message: `المنتج "${productName}" وصل إلى ${currentStock} قطعة فقط`,
      data: { productId, currentStock },
    });
  },

  async onNewCustomer(userId: string, userName: string) {
    await notificationService.create({
      type: 'NEW_CUSTOMER',
      title: 'عميل جديد',
      message: `تم تسجيل عميل جديد: ${userName}`,
      data: { userId },
    });
  },

  async onOrderStatusChanged(orderId: string, oldStatus: string, newStatus: string) {
    await notificationService.create({
      type: 'ORDER_STATUS_CHANGED',
      title: 'تغيير حالة طلب',
      message: `تم تغيير حالة الطلب من ${oldStatus} إلى ${newStatus}`,
      data: { orderId, oldStatus, newStatus },
    });
  },
};
