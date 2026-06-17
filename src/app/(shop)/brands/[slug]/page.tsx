import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Product, DeviceKind } from '@/types';
import { Icon, type IconName } from '@/components/ui/Icon';
import ProductGrid from '@/components/product/ProductGrid';
import { getServerLang, t, localizedName } from '@/lib/i18n';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, productListSchema } from '@/lib/schema';

const BASE = 'https://quvenzaiq.com';

// Maps a category's device kind to a Cobalt Icon glyph.
const KIND_ICON: Record<DeviceKind, IconName> = {
  PHONE: 'phone',
  LAPTOP: 'laptop',
  TABLET: 'tablet',
  HEADPHONE: 'headphones',
};

type BrandWithCategories = Awaited<
  ReturnType<typeof import('@/services/brands/brand.service').getBrandBySlug>
>;

async function getBrand(slug: string): Promise<BrandWithCategories | null> {
  try {
    const { getBrandBySlug } = await import('@/services/brands/brand.service');
    return await getBrandBySlug(slug);
  } catch {
    return null;
  }
}

async function getBrandProducts(slug: string): Promise<Product[]> {
  const { getProducts } = await import('@/services/products/product.service');
  const result = await getProducts({ page: 1, limit: 50, skip: 0 }, { brandSlug: slug });
  return result.products.map((p: any) => ({
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice != null ? Number(p.comparePrice) : null,
  })) as Product[];
}

// Dynamic: reads the language cookie via getServerLang() + DB-backed; a
// static render touching cookies() throws "static to dynamic" in Next.js 16.
export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getServerLang();
  const brand = await getBrand(slug);
  if (!brand) return { title: t('brand.notFound', lang) };

  const name = localizedName(brand.name, brand.nameAr, lang);
  const title = `${name} — Quvenza`;
  const description =
    lang === 'ar'
      ? `تسوّق أجهزة ${name} الأصلية في العراق — أسعار بالدينار العراقي، ضمان محلي، وتوصيل سريع.`
      : `Shop genuine ${name} devices in Iraq — local warranty and fast delivery.`;

  return {
    title,
    description,
    keywords: [`${name} العراق`, `أجهزة ${name}`, `${name} Iraq`, `${name} phones laptops Iraq`],
    alternates: { canonical: `${BASE}/brands/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE}/brands/${slug}`,
      type: 'website',
      images: [{ url: brand.logo ?? `${BASE}/og-image.svg`, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [brand.logo ?? `${BASE}/og-image.svg`],
    },
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getServerLang();
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const products = await getBrandProducts(slug);
  const name = localizedName(brand.name, brand.nameAr, lang);
  const productCount = brand.categories.reduce((sum, c) => sum + c._count.products, 0);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: lang === 'ar' ? 'الرئيسية' : 'Home', url: BASE },
        { name: t('brand.shopBy', lang), url: `${BASE}/brands` },
        { name, url: `${BASE}/brands/${slug}` },
      ])} />
      <JsonLd data={productListSchema(products, name, `${BASE}/brands/${slug}`)} />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Brand header */}
        <div className="flex items-center gap-4 sm:gap-5 mb-8">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center rounded-xl bg-bg-elevated border border-border overflow-hidden">
            {brand.logo ? (
              <Image
                src={brand.logo}
                alt={name}
                fill
                className="object-contain p-2"
                sizes="80px"
                unoptimized={brand.logo.startsWith('http://localhost') || brand.logo.includes('placehold.co')}
              />
            ) : (
              <span className="text-2xl font-bold text-text-muted">{name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">{name}</h1>
            <p className="text-text-muted text-sm mt-1">
              {productCount} {t('brand.products', lang)}
            </p>
          </div>
        </div>

        {/* Device types */}
        {brand.categories.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-bold text-text-primary mb-4">{t('brand.deviceTypes', lang)}</h2>
            <div className="flex flex-wrap gap-3">
              {brand.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="card card-hover group inline-flex items-center gap-3 px-4 py-3"
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent-subtle text-accent">
                    <Icon name={KIND_ICON[cat.kind as DeviceKind] ?? 'package'} size={18} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-text-primary">
                      {localizedName(cat.name, cat.nameAr, lang)}
                    </span>
                    <span className="text-xs text-text-muted">
                      {cat._count.products} {t('brand.products', lang)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-text-muted text-5xl mb-4">📦</div>
            <p className="text-text-primary font-semibold">{t('shop.noProducts', lang)}</p>
            <p className="text-text-muted text-sm mt-1">{t('shop.checkBack', lang)}</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </>
  );
}
