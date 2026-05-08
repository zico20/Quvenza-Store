import { NextRequest } from 'next/server';
import { getDashboardStats } from '@/services/admin/admin.service';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const stats = await getDashboardStats();
    return sendSuccess(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
