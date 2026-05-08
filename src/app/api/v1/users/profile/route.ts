import { NextRequest } from 'next/server';
import { getUserProfile, updateUserProfile } from '@/services/users/user.service';
import { updateProfileSchema } from '@/schemas/user.schema';
import { requireAuth } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const profile = await getUserProfile(user.id);
    return sendSuccess({ user: profile });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const validated = updateProfileSchema.parse(body);
    const updated = await updateUserProfile(user.id, validated);
    return sendSuccess({ user: updated }, 'Profile updated');
  } catch (error) {
    return handleApiError(error);
  }
}
