import { NextRequest } from 'next/server';
import {
  getProductBySlug,
  updateProduct,
  softDeleteProduct,
} from '@/services/products/product.service';
import { updateProductSchema } from '@/schemas/product.schema';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

// CUID detection: starts with 'c' and is 20-30 alphanum chars
const isCuid = (s: string) => /^c[a-z0-9]{20,30}$/i.test(s);

async function resolveProductId(idOrSlug: string): Promise<string> {
  if (isCuid(idOrSlug)) return idOrSlug;
  const product = await getProductBySlug(idOrSlug);
  return product.id;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);
    return sendSuccess({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin(request);
    const { slug: idOrSlug } = await context.params;
    const productId = await resolveProductId(idOrSlug);
    const body = await request.json();
    const validated = updateProductSchema.parse(body);
    const updated = await updateProduct(productId, validated);
    return sendSuccess({ product: updated }, 'Product updated');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin(request);
    const { slug: idOrSlug } = await context.params;
    const productId = await resolveProductId(idOrSlug);
    await softDeleteProduct(productId);
    return sendSuccess(null, 'Product deleted');
  } catch (error) {
    return handleApiError(error);
  }
}
