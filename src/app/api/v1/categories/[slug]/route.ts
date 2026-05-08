import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from '@/services/categories/category.service';
import { updateCategorySchema } from '@/schemas/category.schema';
import { requireAdmin } from '@/lib/auth';
import { AppError, handleApiError } from '@/lib/errors';
import { sendSuccess } from '@/lib/api-response';

const isCuid = (s: string) => /^c[a-z0-9]{20,30}$/i.test(s);

async function resolveId(idOrSlug: string): Promise<string> {
  if (isCuid(idOrSlug)) return idOrSlug;
  const category = await prisma.category.findUnique({ where: { slug: idOrSlug } });
  if (!category) throw new AppError('Category not found.', 404);
  return category.id;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const category = await getCategoryBySlug(slug);
    return sendSuccess({ category });
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
    const id = await resolveId(idOrSlug);
    const body = await request.json();
    const validated = updateCategorySchema.parse(body);
    const updated = await updateCategory(id, validated);
    return sendSuccess({ category: updated }, 'Category updated');
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
    const id = await resolveId(idOrSlug);
    await deleteCategory(id);
    return sendSuccess(null, 'Category deleted');
  } catch (error) {
    return handleApiError(error);
  }
}
