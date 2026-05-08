import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    if (!user) throw new AppError('User not found.', 404);
    return sendSuccess({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
