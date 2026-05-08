import { NextRequest } from 'next/server';
import { updateAdminUser, deleteAdminUser } from '@/services/admin/admin-user.service';
import { updateAdminUserSchema } from '@/schemas/admin-user.schema';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const body = await request.json();
    const validated = updateAdminUserSchema.parse(body);
    const admin = await updateAdminUser(id, validated);
    return sendSuccess({ admin }, 'Admin updated');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const requestingAdmin = await requireAdmin(request);
    const { id } = await context.params;
    await deleteAdminUser(id, requestingAdmin.id);
    return sendSuccess(null, 'Admin deleted');
  } catch (error) {
    return handleApiError(error);
  }
}
