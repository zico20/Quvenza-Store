import { NextRequest } from 'next/server';
import { getBrands, getFeaturedBrands } from '@/services/brands/brand.service';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brands = searchParams.get('featured') === 'true'
      ? await getFeaturedBrands()
      : await getBrands();
    return sendSuccess(brands);
  } catch (error) {
    return handleApiError(error);
  }
}
