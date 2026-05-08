import { NextRequest } from 'next/server';
import { getCategories, createCategory } from '@/services/categories/category.service';
import { createCategorySchema } from '@/schemas/category.schema';
import { requireAdmin } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET() {
  try {
    const categories = await getCategories();
    return sendSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const validated = createCategorySchema.parse(body);
    const category = await createCategory(validated);
    return sendSuccess({ category }, 'Category created', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
