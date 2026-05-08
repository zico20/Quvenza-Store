import { NextRequest } from 'next/server';
import { confirmOrderPayment } from '@/services/payments/payment.service';
import { confirmPaymentSchema } from '@/schemas/payment.schema';
import { requireAuth } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const validated = confirmPaymentSchema.parse(body);
    const result = await confirmOrderPayment(
      validated.orderId,
      user.id,
      validated.paymentIntentId ?? ''
    );
    return sendSuccess(result, 'Payment confirmed');
  } catch (error) {
    return handleApiError(error);
  }
}
