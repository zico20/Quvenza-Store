import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';
import { slugify } from '@/utils/slugify';
import { sanitizeString } from '@/utils/sanitize';
import type { Prisma } from '@prisma/client';

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category || !category.isActive) throw new AppError('Category not found.', 404);
  return category;
}

export async function createCategory(data: { name: string; image?: string }) {
  const cleanName = sanitizeString(data.name);
  let slug = slugify(cleanName);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;
  return prisma.category.create({
    data: { name: cleanName, slug, image: data.image ?? null },
  });
}

export async function updateCategory(
  id: string,
  data: { name?: string; image?: string; isActive?: boolean }
) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new AppError('Category not found.', 404);

  const updateData: Prisma.CategoryUpdateInput = {};
  if (data.name !== undefined) {
    updateData.name = sanitizeString(data.name);
    if (!data.name || data.name !== existing.name) {
      let newSlug = slugify(updateData.name as string);
      const slugConflict = await prisma.category.findFirst({
        where: { slug: newSlug, NOT: { id } },
      });
      if (slugConflict) newSlug = `${newSlug}-${Date.now()}`;
      updateData.slug = newSlug;
    }
  }
  if (data.image !== undefined) updateData.image = data.image || null;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return prisma.category.update({ where: { id }, data: updateData });
}

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new AppError('Category not found.', 404);
  await prisma.category.update({ where: { id }, data: { isActive: false } });
}
