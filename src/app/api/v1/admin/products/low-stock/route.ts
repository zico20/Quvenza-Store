import { NextRequest } from 'next/server';
import { getLowStockProducts } from '@/services/products/product.service';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const threshold = Number(searchParams.get('threshold') ?? 5);
    const products = await getLowStockProducts(threshold);
    return sendSuccess(products);
  } catch (error) {
    return handleApiError(error);
  }
}
