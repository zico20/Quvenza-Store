import { prisma } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';
import { slugify } from '../../utils/slugify';
import { PaginationQuery, buildPaginationMeta } from '../../utils/pagination';

export async function getProducts(pagination: PaginationQuery, filters: { categoryId?: string; search?: string; sort?: string }) {
  const where: any = { isActive: true };
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.search) where.OR = [
    { name: { contains: filters.search, mode: 'insensitive' } },
    { description: { contains: filters.search, mode: 'insensitive' } },
  ];
  let orderBy: any = { createdAt: 'desc' };
  if (filters.sort === 'price_asc') orderBy = { price: 'asc' };
  if (filters.sort === 'price_desc') orderBy = { price: 'desc' };
  if (filters.sort === 'name') orderBy = { name: 'asc' };
  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip: pagination.skip, take: pagination.limit, orderBy, include: { category: true } }),
    prisma.product.count({ where }),
  ]);
  return { products, pagination: buildPaginationMeta(total, pagination.page, pagination.limit) };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  if (!product || !product.isActive) throw new AppError('Product not found.', 404);
  return product;
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  if (!product) throw new AppError('Product not found.', 404);
  return product;
}

export async function createProduct(data: { name: string; description: string; price: number; comparePrice?: number; stock: number; categoryId: string; images?: string[] }) {
  const slug = slugify(data.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
  return prisma.product.create({ data: { ...data, slug: finalSlug, images: data.images ?? [] }, include: { category: true } });
}

export async function updateProduct(id: string, data: Partial<{ name: string; description: string; price: number; comparePrice: number; stock: number; categoryId: string; images: string[]; isActive: boolean }>) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError('Product not found.', 404);
  const updateData: any = { ...data };
  if (data.name) updateData.slug = slugify(data.name);
  return prisma.product.update({ where: { id }, data: updateData, include: { category: true } });
}

export async function softDeleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError('Product not found.', 404);
  return prisma.product.update({ where: { id }, data: { isActive: false } });
}
