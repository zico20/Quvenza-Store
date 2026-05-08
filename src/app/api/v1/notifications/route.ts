import { NextRequest } from 'next/server';
import { notificationService } from '@/services/notifications/notification.service';
import { requireAdmin } from '@/lib/auth';
import { sendPaginated } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 20);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const result = await notificationService.getAll(page, limit, unreadOnly);
    return sendPaginated(result.notifications, {
      page,
      limit,
      total: result.total,
      totalPages: result.pages,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
