import { NextRequest } from 'next/server';
import { notificationService } from '@/services/notifications/notification.service';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const count = await notificationService.getUnreadCount();
    return sendSuccess({ count });
  } catch (error) {
    return handleApiError(error);
  }
}
