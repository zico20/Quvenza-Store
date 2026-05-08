import { NextRequest } from 'next/server';
import { notificationService } from '@/services/notifications/notification.service';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    await notificationService.delete(id);
    return sendSuccess(null, 'Notification deleted');
  } catch (error) {
    return handleApiError(error);
  }
}
