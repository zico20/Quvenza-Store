import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';
import { slugify } from '../../utils/slugify';
import { sanitizeString } from '../../utils/sanitize';
import { PaginationQuery, buildPaginationMeta } from '../../utils/pagination';

type DeviceKind = 'PHONE' | 'LAPTOP' | 'TABLET' | 'HEADPHONE';

export interface ProductFilters {
  categoryId?: string;
  brandId?: string;
  brandSlug?: string;
  /** cross-brand "All Phones / Laptops / …" via category.kind */
  kind?: DeviceKind;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
  sort?: string;
}

export async function getProducts(pagination: PaginationQuery, filters: ProductFilters) {
  const where: any = { isActive: true };
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.brandId) where.brandId = filters.brandId;
  if (filters.brandSlug) where.brand = { slug: filters.brandSlug };
  if (filters.kind) where.category = { kind: filters.kind };
  if (filters.featured) where.isFeatured = true;
  if (filters.minPrice != null || filters.maxPrice != null) {
    where.price = {};
    if (filters.minPrice != null) where.price.gte = filters.minPrice;
    if (filters.maxPrice != null) where.price.lte = filters.maxPrice;
  }
  if (filters.search) where.OR = [
    { name: { contains: filters.search, mode: 'insensitive' } },
    { nameAr: { contains: filters.search, mode: 'insensitive' } },
    { description: { contains: filters.search, mode: 'insensitive' } },
  ];
  let orderBy: any = { createdAt: 'desc' };
  if (filters.sort === 'price_asc') orderBy = { price: 'asc' };
  if (filters.sort === 'price_desc') orderBy = { price: 'desc' };
  if (filters.sort === 'name') orderBy = { name: 'asc' };
  if (filters.sort === 'rating') orderBy = { rating: 'desc' };
  if (filters.sort === 'popular') orderBy = { salesCount: 'desc' };
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where, skip: pagination.skip, take: pagination.limit, orderBy,
      include: { category: true, brand: true, variants: { orderBy: { price: 'asc' } } },
    }),
    prisma.product.count({ where }),
  ]);
  return { products, pagination: buildPaginationMeta(total, pagination.page, pagination.limit) };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      variants: { orderBy: { price: 'asc' } },
      reviews: { where: { isApproved: true }, orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
  if (!product || !product.isActive) throw new AppError('Product not found.', 404);
  return product;
}

/** Related/alternative devices: same category, excluding the current product. */
export async function getRelatedProducts(productId: string, categoryId: string, take = 4) {
  return prisma.product.findMany({
    where: { isActive: true, categoryId, id: { not: productId } },
    include: { category: true, brand: true, variants: { orderBy: { price: 'asc' } } },
    orderBy: { rating: 'desc' },
    take,
  });
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  if (!product) throw new AppError('Product not found.', 404);
  return product;
}

export async function createProduct(data: { name: string; description: string; price: number; comparePrice?: number; stock: number; categoryId: string; images?: string[] }) {
  const name = sanitizeString(data.name);
  const description = sanitizeString(data.description);
  const slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
  return prisma.product.create({ data: { ...data, name, description, slug: finalSlug, images: data.images ?? [] }, include: { category: true } });
}

export async function updateProduct(id: string, data: Partial<{ name: string; description: string; price: number; comparePrice: number; stock: number; categoryId: string; images: string[]; isActive: boolean }>) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError('Product not found.', 404);
  const updateData: any = { ...data };
  if (data.name) { updateData.name = sanitizeString(data.name); updateData.slug = slugify(updateData.name); }
  if (data.description) updateData.description = sanitizeString(data.description);
  return prisma.product.update({ where: { id }, data: updateData, include: { category: true } });
}

export async function softDeleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError('Product not found.', 404);
  return prisma.product.update({ where: { id }, data: { isActive: false } });
}

export async function getLowStockProducts(threshold: number = 5) {
  return prisma.product.findMany({
    where: { isActive: true, stock: { lte: threshold } },
    include: { category: true },
    orderBy: { stock: 'asc' },
  });
}
