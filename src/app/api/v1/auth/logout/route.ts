import { NextRequest } from 'next/server';
import { logout } from '@/services/auth/auth.service';
import { requireAuth } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    await logout(user.id);
    return sendSuccess(null, 'Logged out successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
