import { NextRequest } from 'next/server';
import { updateOwnAdminProfile } from '@/services/admin/admin-user.service';
import { updateAdminUserSchema } from '@/schemas/admin-user.schema';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const validated = updateAdminUserSchema.parse(body);
    const updated = await updateOwnAdminProfile(admin.id, validated);
    return sendSuccess({ admin: updated }, 'Profile updated');
  } catch (error) {
    return handleApiError(error);
  }
}
