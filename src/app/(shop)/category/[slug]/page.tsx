import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import ProductGrid from '@/components/product/ProductGrid';
import { getServerLang, t, getCategoryName } from '@/lib/i18n';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, productListSchema } from '@/lib/schema';

const BASE = 'https://softodeviqstore.com';

export const revalidate = 3600;

async function getCategoryWithProducts(slug: string): Promise<{ name: string; products: Product[] } | null> {
  try {
    const { getCategoryBySlug } = await import('@/services/categories/category.service');
    const { getProducts } = await import('@/services/products/product.service');
    const category = await getCategoryBySlug(slug);
    const result = await getProducts({ page: 1, limit: 50, skip: 0 }, { categoryId: category.id });
    return { name: category.name, products: result.products as unknown as Product[] };
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const { getCategories } = await import('@/services/categories/category.service');
    const cats = await getCategories();
    return cats.map((c) => ({ slug: c.slug }));
  } catch { return []; }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategoryWithProducts(slug);
  if (!result) return { title: 'الفئة غير موجودة' };

  const title = `${result.name} — اشتراكات في العراق`;
  const description = `اشترِ أفضل ${result.name} في العراق بأسعار بالدينار العراقي — تفعيل فوري، ضمان كامل. ${result.products.length} منتج متاح.`;

  return {
    title,
    description,
    keywords: [`${result.name} العراق`, `اشتراكات ${result.name}`, `${result.name} Iraq`, 'اشتراكات رقمية عراق'],
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

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'الرئيسية', url: BASE },
        { name: 'المنتجات', url: `${BASE}/products` },
        { name: result.name, url: `${BASE}/category/${slug}` },
      ])} />
      <JsonLd data={productListSchema(result.products, result.name, `${BASE}/category/${slug}`)} />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">{getCategoryName(slug, result.name, lang)}</h1>
        <p className="text-text-muted text-sm mb-8">{result.products.length} منتج متاح في العراق</p>
        {result.products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-text-muted text-5xl mb-4">📦</div>
            <p className="text-text-primary font-semibold">{t('shop.noProducts', lang)}</p>
            <p className="text-text-muted text-sm mt-1">{t('shop.checkBack', lang)}</p>
          </div>
        ) : (
          <ProductGrid products={result.products} />
        )}
      </div>
    </>
  );
}
