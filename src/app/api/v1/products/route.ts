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
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const kind = searchParams.get('kind');
    const result = await getProducts(pagination, {
      categoryId: searchParams.get('categoryId') ?? undefined,
      brandId: searchParams.get('brandId') ?? undefined,
      brandSlug: searchParams.get('brandSlug') ?? undefined,
      kind: kind === 'PHONE' || kind === 'LAPTOP' || kind === 'TABLET' || kind === 'HEADPHONE' ? kind : undefined,
      minPrice: minPrice != null ? Number(minPrice) : undefined,
      maxPrice: maxPrice != null ? Number(maxPrice) : undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
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
