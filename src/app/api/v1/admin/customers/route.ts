import { NextRequest } from 'next/server';
import { getCustomers } from '@/services/admin/admin.service';
import { requireAdmin } from '@/lib/auth';
import { sendPaginated } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const result = await getCustomers({
      page: Number(searchParams.get('page') ?? 1),
      limit: Number(searchParams.get('limit') ?? 10),
      search: searchParams.get('search') ?? undefined,
    });
    return sendPaginated(result.customers, result.pagination);
  } catch (error) {
    return handleApiError(error);
  }
}
