import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServerLang, t, localizedName } from '@/lib/i18n';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

const BASE = 'https://quvenzaiq.com';

// Dynamic: reads the language cookie via getServerLang() + DB-backed; a
// static render touching cookies() throws "static to dynamic" in Next.js 16.
export const dynamic = 'force-dynamic';

async function getAllBrands() {
  const { getBrands } = await import('@/services/brands/brand.service');
  return getBrands();
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang();
  const title = `${t('brand.shopBy', lang)} — Quvenza`;
  const description =
    lang === 'ar'
      ? 'تسوّق أفضل ماركات الأجهزة الإلكترونية في العراق — هواتف، لابتوبات، أجهزة لوحية، وسماعات من أبرز العلامات العالمية.'
      : 'Shop the best electronics brands in Iraq — phones, laptops, tablets, and headphones from the world’s leading names.';

  return {
    title,
    description,
    keywords: ['الماركات', 'ماركات الأجهزة', 'electronics brands Iraq', 'phones laptops Iraq'],
    alternates: { canonical: `${BASE}/brands` },
    openGraph: {
      title,
      description,
      url: `${BASE}/brands`,
      type: 'website',
      images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE}/og-image.svg`],
    },
  };
}

export default async function BrandsPage() {
  const lang = await getServerLang();
  const brands = await getAllBrands();

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: lang === 'ar' ? 'الرئيسية' : 'Home', url: BASE },
        { name: t('brand.shopBy', lang), url: `${BASE}/brands` },
      ])} />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">{t('brand.shopBy', lang)}</h1>
        <p className="text-text-muted text-sm mb-8">{brands.length} {t('brand.allBrands', lang)}</p>

        {brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-text-muted text-5xl mb-4">🏷️</div>
            <p className="text-text-primary font-semibold">{t('brand.notFound', lang)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="card card-hover group flex flex-col items-center text-center p-5 sm:p-6"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 flex items-center justify-center rounded-xl bg-white border border-border overflow-hidden">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={localizedName(brand.name, brand.nameAr, lang)}
                      fill
                      className="object-contain p-3.5 transition-transform duration-300 group-hover:scale-[1.05]"
                      sizes="96px"
                      unoptimized={brand.logo.endsWith('.svg') || brand.logo.startsWith('http://localhost') || brand.logo.includes('placehold.co')}
                    />
                  ) : (
                    <span className="text-2xl font-bold text-text-muted">
                      {localizedName(brand.name, brand.nameAr, lang).charAt(0)}
                    </span>
                  )}
                </div>
                <div className="text-sm sm:text-base font-semibold text-text-primary">
                  {localizedName(brand.name, brand.nameAr, lang)}
                </div>
                <div className="text-xs text-text-muted mt-1">
                  {brand._count.products} {t('brand.products', lang)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
