import { NextRequest } from 'next/server';
import { login } from '@/services/auth/auth.service';
import { loginSchema } from '@/schemas/auth.schema';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    const result = await login(email, password);
    return sendSuccess(result, 'Logged in successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
