import { NextRequest } from 'next/server';
import { changeOwnAdminPassword } from '@/services/admin/admin-user.service';
import { changeOwnPasswordSchema } from '@/schemas/admin-user.schema';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const validated = changeOwnPasswordSchema.parse(body);
    await changeOwnAdminPassword(admin.id, validated.currentPassword, validated.newPassword);
    return sendSuccess(null, 'Password changed');
  } catch (error) {
    return handleApiError(error);
  }
}
