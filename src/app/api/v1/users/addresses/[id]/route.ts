import { NextRequest } from 'next/server';
import { deleteUserAddress } from '@/services/users/user.service';
import { requireAuth } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { id } = await context.params;
    await deleteUserAddress(user.id, id);
    return sendSuccess(null, 'Address deleted');
  } catch (error) {
    return handleApiError(error);
  }
}
