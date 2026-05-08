import { NextRequest } from 'next/server';
import { updateOrderStatus } from '@/services/orders/order.service';
import { updateOrderStatusSchema } from '@/schemas/order.schema';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

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
    return sendSuccess({ order }, 'Order status updated');
  } catch (error) {
    return handleApiError(error);
  }
}
