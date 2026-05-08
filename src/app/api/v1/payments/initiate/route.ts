import { NextRequest } from 'next/server';
import { initiatePayment } from '@/services/payments/payment.service';
import { initiatePaymentSchema } from '@/schemas/payment.schema';
import { requireAuth } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const validated = initiatePaymentSchema.parse(body);
    const result = await initiatePayment(validated.orderId, user.id);
    return sendSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
