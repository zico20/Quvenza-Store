import { NextRequest } from 'next/server';
import { getAdminOrders } from '@/services/orders/order.service';
import { requireAdmin } from '@/lib/auth';
import { sendPaginated } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const result = await getAdminOrders({
      page: Number(searchParams.get('page') ?? 1),
      limit: Number(searchParams.get('limit') ?? 10),
      status: searchParams.get('status') ?? undefined,
      paymentStatus: searchParams.get('paymentStatus') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      sortBy: searchParams.get('sortBy') ?? undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') ?? undefined,
      dateFrom: searchParams.get('dateFrom') ?? undefined,
      dateTo: searchParams.get('dateTo') ?? undefined,
    });
    return sendPaginated(result.orders, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.pages,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
