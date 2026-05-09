import { NextRequest } from 'next/server';
import { createOrder, getUserOrders } from '@/services/orders/order.service';
import { createOrderSchema } from '@/schemas/order.schema';
import { requireAuth } from '@/lib/auth';
import { sendSuccess, sendPaginated } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';
import { parsePaginationParams } from '@/utils/pagination';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const validated = createOrderSchema.parse(body);
    const order = await createOrder({ ...validated, userId: user.id });
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
