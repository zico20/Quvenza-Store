import { NextRequest } from 'next/server';
import { getOrderById } from '@/services/orders/order.service';
import { requireAuth } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { id } = await context.params;
    // Non-admins can only see their own orders (userId filter); admins see all
    const order = await getOrderById(id, user.role === 'ADMIN' ? undefined : user.id);
    return sendSuccess(order);
  } catch (error) {
    return handleApiError(error);
  }
}
