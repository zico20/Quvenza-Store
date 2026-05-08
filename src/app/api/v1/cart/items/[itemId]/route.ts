import { NextRequest } from 'next/server';
import { updateCartItemQuantity, removeCartItem } from '@/services/cart/cart.service';
import { updateCartItemSchema } from '@/schemas/cart.schema';
import { requireAuth } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { itemId } = await context.params;
    const body = await request.json();
    const validated = updateCartItemSchema.parse(body);
    const cart = await updateCartItemQuantity(user.id, itemId, validated.quantity);
    return sendSuccess({ cart }, 'Cart item updated');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { itemId } = await context.params;
    const cart = await removeCartItem(user.id, itemId);
    return sendSuccess({ cart }, 'Item removed from cart');
  } catch (error) {
    return handleApiError(error);
  }
}
