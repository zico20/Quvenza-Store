import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import ProductGrid from '@/components/product/ProductGrid';
import { getServerLang, t, localizedName } from '@/lib/i18n';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, productListSchema } from '@/lib/schema';

const BASE = 'https://quvenzaiq.com';

export const revalidate = 3600;

async function getCategoryWithProducts(slug: string): Promise<{ name: string; nameAr: string | null; products: Product[] } | null> {
  try {
    const { getCategoryBySlug } = await import('@/services/categories/category.service');
    const { getProducts } = await import('@/services/products/product.service');
    const category = await getCategoryBySlug(slug);
    const result = await getProducts({ page: 1, limit: 50, skip: 0 }, { categoryId: category.id });
    const products = result.products.map((p: any) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice != null ? Number(p.comparePrice) : null,
      variants: (p.variants ?? []).map((v: any) => ({
        ...v,
        price: Number(v.price),
        comparePrice: v.comparePrice != null ? Number(v.comparePrice) : null,
      })),
    })) as Product[];
    return { name: category.name, nameAr: (category as any).nameAr ?? null, products };
  } catch {
    return null;
  }
}

// Dynamic: reads the language cookie via getServerLang() + DB-backed; a
// static render touching cookies() throws "static to dynamic" in Next.js 16.
export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategoryWithProducts(slug);
  if (!result) return { title: 'الفئة غير موجودة' };

  const display = result.nameAr ?? result.name;
  const title = `${display} — في العراق`;
  const description = `اشترِ أفضل ${display} في العراق بأسعار بالدينار العراقي — توصيل سريع، ضمان رسمي. ${result.products.length} منتج متاح.`;

  return {
    title,
    description,
    keywords: [`${display} العراق`, `${result.name} ${display}`, `${result.name} Iraq`, 'إلكترونيات العراق'],
    alternates: { canonical: `${BASE}/category/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE}/category/${slug}`,
      type: 'website',
      images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: result.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE}/og-image.svg`],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getServerLang();
  const result = await getCategoryWithProducts(slug);
  if (!result) notFound();

  const display = localizedName(result.name, result.nameAr, lang);
  const countLabel = lang === 'ar'
    ? `${result.products.length} منتج متاح في العراق`
    : `${result.products.length} ${t('shop.products', lang)} available in Iraq`;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'الرئيسية', url: BASE },
        { name: 'المنتجات', url: `${BASE}/products` },
        { name: result.name, url: `${BASE}/category/${slug}` },
      ])} />
      <JsonLd data={productListSchema(result.products, result.name, `${BASE}/category/${slug}`)} />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">{display}</h1>
        <p className="text-text-muted text-sm mb-8 ltr-nums">{countLabel}</p>
        <ProductGrid
          products={result.products}
          emptyTitle={t('shop.noProducts', lang)}
          emptySub={t('shop.checkBack', lang)}
        />
      </div>
    </>
  );
}
