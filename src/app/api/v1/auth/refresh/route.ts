import { NextRequest } from 'next/server';
import { refreshToken as refreshTokenService } from '@/services/auth/auth.service';
import { refreshTokenSchema } from '@/schemas/auth.schema';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = refreshTokenSchema.parse(body);
    const result = await refreshTokenService(refreshToken);
    return sendSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
