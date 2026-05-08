import { NextRequest } from 'next/server';
import { addItemToCart } from '@/services/cart/cart.service';
import { addToCartSchema } from '@/schemas/cart.schema';
import { requireAuth } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const validated = addToCartSchema.parse(body);
    const cart = await addItemToCart(user.id, validated.productId, validated.quantity);
    return sendSuccess({ cart }, 'Item added to cart', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
