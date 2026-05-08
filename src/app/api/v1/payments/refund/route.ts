import { NextRequest } from 'next/server';
import { refundOrderPayment } from '@/services/payments/payment.service';
import { refundPaymentSchema } from '@/schemas/payment.schema';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const validated = refundPaymentSchema.parse(body);
    const result = await refundOrderPayment(validated.orderId);
    return sendSuccess(result, 'Payment refunded');
  } catch (error) {
    return handleApiError(error);
  }
}
