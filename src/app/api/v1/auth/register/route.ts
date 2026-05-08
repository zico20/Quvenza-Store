import { NextRequest } from 'next/server';
import { register } from '@/services/auth/auth.service';
import { registerSchema } from '@/schemas/auth.schema';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = registerSchema.parse(body);
    const result = await register(name, email, password);
    return sendSuccess(result, 'Registered successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
