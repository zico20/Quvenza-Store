import { NextRequest } from 'next/server';
import { getProducts, createProduct } from '@/services/products/product.service';
import { createProductSchema } from '@/schemas/product.schema';
import { requireAdmin } from '@/lib/auth';
import { sendPaginated, sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';
import { parsePaginationParams } from '@/utils/pagination';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pagination = parsePaginationParams(searchParams);
    const result = await getProducts(pagination, {
      categoryId: searchParams.get('categoryId') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
    });
    return sendPaginated(result.products, result.pagination);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const validated = createProductSchema.parse(body);
    const product = await createProduct(validated);
    return sendSuccess({ product }, 'Product created', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
