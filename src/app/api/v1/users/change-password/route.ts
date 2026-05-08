import { NextRequest } from 'next/server';
import { changeUserPassword } from '@/services/users/user.service';
import { changePasswordSchema } from '@/schemas/user.schema';
import { requireAuth } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const validated = changePasswordSchema.parse(body);
    await changeUserPassword(user.id, validated.currentPassword, validated.newPassword);
    return sendSuccess(null, 'Password changed successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
