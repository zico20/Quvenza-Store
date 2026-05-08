import { NextRequest } from 'next/server';
import { listAdminUsers, createAdminUser } from '@/services/admin/admin-user.service';
import { createAdminUserSchema } from '@/schemas/admin-user.schema';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const admins = await listAdminUsers();
    return sendSuccess({ admins });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const validated = createAdminUserSchema.parse(body);
    const admin = await createAdminUser(validated);
    return sendSuccess({ admin }, 'Admin created', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
