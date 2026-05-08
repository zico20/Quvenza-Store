import { NextRequest } from 'next/server';
import { notificationService } from '@/services/notifications/notification.service';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin(request);
    const result = await notificationService.markAllAsRead();
    return sendSuccess({ updated: result.count }, 'All notifications marked as read');
  } catch (error) {
    return handleApiError(error);
  }
}
