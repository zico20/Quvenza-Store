import { NextRequest } from 'next/server';
import { getCustomerDetail } from '@/services/admin/admin.service';
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
    const customer = await getCustomerDetail(id);
    if (!customer) throw new AppError('Customer not found.', 404);
    return sendSuccess({ customer });
  } catch (error) {
    return handleApiError(error);
  }
}
