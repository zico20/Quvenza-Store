import { NextRequest } from 'next/server';
import { resetAdminPassword } from '@/services/admin/admin-user.service';
import { resetAdminPasswordSchema } from '@/schemas/admin-user.schema';
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
    const validated = resetAdminPasswordSchema.parse(body);
    await resetAdminPassword(id, validated.newPassword);
    return sendSuccess(null, 'Password reset');
  } catch (error) {
    return handleApiError(error);
  }
}
