import { NextRequest } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/services/orders/order.service';
import { updateOrderStatusSchema } from '@/schemas/order.schema';
import { requireAdmin } from '@/lib/auth';
import { AppError, handleApiError } from '@/lib/errors';
import { sendSuccess } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const order = await getOrderById(id);
    if (!order) throw new AppError('Order not found.', 404);
    return sendSuccess(order);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await context.params;
    const body = await request.json();
    const validated = updateOrderStatusSchema.parse(body);
    const order = await updateOrderStatus(id, validated.status, admin.id, validated.note);
    return sendSuccess(order, 'Order status updated');
  } catch (error) {
    return handleApiError(error);
  }
}
