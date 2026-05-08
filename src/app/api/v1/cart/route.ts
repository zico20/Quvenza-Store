import { NextRequest } from 'next/server';
import { getCart, clearCart } from '@/services/cart/cart.service';
import { requireAuth } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const cart = await getCart(user.id);
    return sendSuccess({ cart });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const cart = await clearCart(user.id);
    return sendSuccess({ cart }, 'Cart cleared');
  } catch (error) {
    return handleApiError(error);
  }
}
