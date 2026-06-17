import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';

/** All active brands (with product counts) — for the navbar mega-menu + brand listings. */
export async function getBrands() {
  return prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
}

/** Featured brands for the home page. */
export async function getFeaturedBrands() {
  return prisma.brand.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
}

/** A single brand with its device-type categories (each with product counts). */
export async function getBrandBySlug(slug: string) {
  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { kind: 'asc' },
        include: { _count: { select: { products: { where: { isActive: true } } } } },
      },
    },
  });
  if (!brand || !brand.isActive) throw new AppError('Brand not found.', 404);
  return brand;
}
