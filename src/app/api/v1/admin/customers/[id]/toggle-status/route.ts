import { NextRequest } from 'next/server';
import { toggleCustomerStatus } from '@/services/admin/admin.service';
import { requireAdmin } from '@/lib/auth';
import { AppError, handleApiError } from '@/lib/errors';
import { sendSuccess } from '@/lib/api-response';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const updated = await toggleCustomerStatus(id);
    if (!updated) throw new AppError('Customer not found.', 404);
    return sendSuccess({ customer: updated }, 'Customer status updated');
  } catch (error) {
    return handleApiError(error);
  }
}
