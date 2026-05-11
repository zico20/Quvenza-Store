import { NextRequest } from 'next/server';
import { createOrder, getUserOrders } from '@/services/orders/order.service';
import { createOrderSchema } from '@/schemas/order.schema';
import { requireAuth } from '@/lib/auth';
import { sendSuccess, sendPaginated } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';
import { parsePaginationParams } from '@/utils/pagination';
import { notifyNewOrder } from '@/lib/notifications/telegram';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const validated = createOrderSchema.parse(body);
    const order = await createOrder({ ...validated, userId: user.id });

    // Fire-and-forget — never blocks the response, never fails the order
    notifyNewOrder({
      id: order.id,
      total: Number(order.total),
      paymentMethod: order.paymentMethod || undefined,
      itemsCount: order.items?.length || 0,
      items: order.items?.map((item: any) => ({
        name: item.product?.name || 'منتج',
        quantity: item.quantity,
        price: Number(item.price),
      })),
      customerName: order.user?.name || validated.shippingAddress.fullName,
      customerPhone: validated.shippingAddress.phone,
      customerEmail: order.user?.email || undefined,
      address: `${validated.shippingAddress.city}، ${validated.shippingAddress.address}`,
      governorate: validated.shippingAddress.governorate,
      createdAt: order.createdAt,
    }).catch((err) => {
      console.error('[Telegram] Notification failed (non-fatal):', err);
    });

    return sendSuccess(order, 'Order created', 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const pagination = parsePaginationParams(searchParams);
    const result = await getUserOrders(user.id, pagination);
    return sendPaginated(result.orders, result.pagination);
  } catch (error) {
    return handleApiError(error);
  }
}
