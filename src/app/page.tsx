import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Product, Brand, DeviceKind } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { getServerLang, t, localizedName, deviceKindLabel } from '@/lib/i18n';
import { storeConfig } from '@/config/store.config';
import JsonLd from '@/components/seo/JsonLd';
import { organizationSchema, websiteSchema, localBusinessSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Quvenza | هواتف · لابتوبات · سماعات في العراق',
  description:
    'متجر إلكترونيات أصلية في العراق — هواتف، لابتوبات، أجهزة لوحية وسماعات من Apple وSamsung وSony وDell وLenovo وBose والمزيد. أسعار بالدينار العراقي، توصيل سريع، ضمان رسمي.',
  alternates: { canonical: 'https://quvenzaiq.com' },
  openGraph: {
    title: 'Quvenza — إلكترونيات أصلية في العراق',
    description:
      'هواتف، لابتوبات وسماعات من أشهر الماركات العالمية — أسعار بالدينار العراقي، توصيل سريع وضمان رسمي.',
    url: 'https://quvenzaiq.com',
  },
};

/** Mirrors the variant-aware serialization used by category pages so ProductCard
 *  variant logic (needsChoice, single variant) works on the home page too. */
function serializeProduct(p: any): Product {
  return {
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice != null ? Number(p.comparePrice) : null,
    variants: (p.variants ?? []).map((v: any) => ({
      ...v,
      price: Number(v.price),
      comparePrice: v.comparePrice != null ? Number(v.comparePrice) : null,
    })),
  } as Product;
}

async function getFeaturedBrandsList(): Promise<(Brand & { _count?: { products: number } })[]> {
  try {
    const { getFeaturedBrands } = await import('@/services/brands/brand.service');
    return (await getFeaturedBrands()) as unknown as (Brand & { _count?: { products: number } })[];
  } catch { return []; }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { getProducts } = await import('@/services/products/product.service');
    const result = await getProducts({ page: 1, limit: 4, skip: 0 }, { featured: true });
    return result.products.map(serializeProduct);
  } catch { return []; }
}

async function getBestsellers(): Promise<Product[]> {
  try {
    const { getProducts } = await import('@/services/products/product.service');
    const result = await getProducts({ page: 1, limit: 8, skip: 0 }, { sort: 'rating' });
    return result.products.map(serializeProduct);
  } catch { return []; }
}

// Device-type tiles — these Icon names exist in Icon.tsx.
const DEVICE_TILES: { kind: DeviceKind; icon: IconName }[] = [
  { kind: 'PHONE',     icon: 'phone' },
  { kind: 'LAPTOP',    icon: 'laptop' },
  { kind: 'TABLET',    icon: 'tablet' },
  { kind: 'HEADPHONE', icon: 'headphones' },
];

const TONE_HUES = [18, 220, 280, 140, 40, 320, 180, 60];

export default async function HomePage() {
  const lang = await getServerLang();

  const [brands, featured, bestsellers] = await Promise.all([
    getFeaturedBrandsList(),
    getFeaturedProducts(),
    getBestsellers(),
  ]);

  const VALUE_PROPS: { icon: IconName; title: string; sub: string }[] = [
    { icon: 'truck',   title: t('home.valueProps.fastShipping.title', lang),  sub: t('home.valueProps.fastShipping.sub', lang) },
    { icon: 'shield',  title: t('home.valueProps.localWarranty.title', lang), sub: t('home.valueProps.localWarranty.sub', lang) },
    { icon: 'refresh', title: t('home.valueProps.easyReturns.title', lang),  sub: t('home.valueProps.easyReturns.sub', lang) },
    { icon: 'bolt',    title: t('home.valueProps.expertSupport.title', lang), sub: t('home.valueProps.expertSupport.sub', lang) },
  ];

  return (
    <div>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={localBusinessSchema()} />

      {/* ── HERO (Cobalt, image-free) ── */}
      <section className="relative overflow-hidden border-b border-border bg-bg-surface">
        {/* soft cobalt wash, no imagery */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 75% 10%, rgba(37,99,235,0.10), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(6,182,212,0.08), transparent 55%)' }} />
        <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Copy */}
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-base px-3 py-1 text-xs font-semibold text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-success" style={{ boxShadow: '0 0 0 3px rgba(22,163,74,0.18)' }} />
              {t('hero.slides.0.kicker', lang)}
            </span>
            <h1 className="mt-5 font-[family-name:var(--font-cairo)] font-extrabold leading-[1.16] tracking-tight text-[clamp(28px,5vw,48px)] text-balance" style={{ color: '#0B1220' }}>
              {storeConfig.tagline}
              <br />
              <span className="text-accent">{t('hero.slides.0.cta', lang)} · {storeConfig.name}</span>
            </h1>
            <p className="mt-4 w-full max-w-[34rem] text-text-secondary leading-relaxed text-[15px] sm:text-base text-pretty">
              {t('hero.slides.0.body', lang)}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/products" className="btn-accent text-base px-6 py-3.5">
                {t('hero.slides.0.cta', lang)}
                <Icon name="arrow" size={18} className="rtl-flip" />
              </Link>
              <Link href="/products" className="btn-secondary text-base px-6 py-3.5">
                {t('hero.slides.0.ctaAll', lang)}
              </Link>
            </div>
            {/* Trust stars */}
            <div className="mt-6 flex items-center gap-2">
              <span className="inline-flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => <Icon key={i} name="star" size={15} stroke={0} color="#F59E0B" />)}
              </span>
              <span className="text-xs text-text-muted">{t('home.valueProps.localWarranty.title', lang)} · {t('home.valueProps.fastShipping.title', lang)}</span>
            </div>
          </div>

          {/* Device-type spotlight — image-free, links to /products?kind=… */}
          <div className="hidden lg:block min-w-0">
            <div className="relative rounded-2xl border border-border bg-white p-6 shadow-[0_14px_36px_rgba(16,24,40,0.12)]">
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] font-bold tracking-wider text-text-muted">
                  {lang === 'ar' ? 'تصفّح حسب الجهاز' : 'SHOP BY DEVICE'}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-subtle px-2.5 py-1 text-[10px] font-bold text-accent">
                  <Icon name="sparkle" size={12} /> {lang === 'ar' ? 'أصلي ١٠٠٪' : '100% Original'}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {DEVICE_TILES.map(({ kind, icon }) => (
                  <Link
                    key={kind}
                    href={`/products?kind=${kind}`}
                    className="hover-accent-border group rounded-xl border border-border bg-bg-base p-4 flex items-center gap-3"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-subtle text-accent flex-shrink-0">
                      <Icon name={icon} size={22} stroke={1.8} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-text-primary leading-tight">{deviceKindLabel(kind, lang)}</div>
                      <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-accent">
                        {t('common.browse', lang)} <Icon name="arrow" size={12} className="rtl-flip" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-text-muted">{t('home.valueProps.localWarranty.title', lang)} · {t('home.valueProps.easyReturns.title', lang)}</span>
                <Link href="/products" className="btn-accent text-sm px-4 py-2">
                  {t('hero.slides.0.cta', lang)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">

        {/* ── VALUE PROPS ── */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12 md:mb-16"
          style={{ gap: 1, background: '#EAECEF', border: '1px solid #EAECEF', borderRadius: 6, overflow: 'hidden' }}
        >
          {VALUE_PROPS.map(({ icon, title, sub }) => (
            <div key={title} style={{ background: '#F7F8FA', padding: '20px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: 'rgba(37,99,235,0.12)', color: '#1D4ED8',
                boxShadow: '0 0 18px rgba(37,99,235,0.18)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={icon} size={18} stroke={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#111827', fontFamily: 'var(--font-display)' }}>{title}</div>
                <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>{sub}</div>
              </div>
            </div>
          ))}
        </section>

        {/* ── SHOP BY BRAND ── */}
        {brands.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid #EAECEF', paddingBottom: 14 }}>
              <div>
                <div className="mono" style={{ fontSize: 11, color: '#4B5563', marginBottom: 6 }}>{t('brand.featured', lang)}</div>
                <h2 style={{ margin: 0, fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>{t('brand.shopBy', lang)}</h2>
              </div>
              <Link href="/brands" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', border: '1px solid #EAECEF', borderRadius: 4,
                color: '#111827', fontSize: 12, fontWeight: 600,
                textDecoration: 'none', background: 'transparent', flexShrink: 0,
              }}>
                {t('brand.allBrands', lang)} <Icon name="arrow" size={14} className="rtl-flip" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="hover-accent-border"
                  style={{
                    background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 12,
                    padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 6,
                    alignItems: 'center', textAlign: 'center', textDecoration: 'none', minHeight: 92,
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
                    {localizedName(brand.name, brand.nameAr, lang)}
                  </div>
                  <div className="ltr-nums" style={{ fontSize: 11, color: '#4B5563' }}>
                    {brand._count?.products ?? 0} {t('brand.products', lang)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── BROWSE BY DEVICE TYPE ── */}
        <section className="mb-12 md:mb-16">
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid #EAECEF', paddingBottom: 14 }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: '#4B5563', marginBottom: 6 }}>{t('home.categories.sectionNum', lang)}</div>
              <h2 style={{ margin: 0, fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>{t('home.categories.title', lang)}</h2>
            </div>
            <Link href="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', border: '1px solid #EAECEF', borderRadius: 4,
              color: '#111827', fontSize: 12, fontWeight: 600,
              textDecoration: 'none', background: 'transparent', flexShrink: 0,
            }}>
              {t('common.viewAll', lang)} <Icon name="arrow" size={14} className="rtl-flip" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {DEVICE_TILES.map(({ kind, icon }, i) => (
              <Link
                key={kind}
                href={`/products?kind=${kind}`}
                className="hover-accent-border group"
                style={{
                  background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 6,
                  padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 16,
                  minHeight: 160, textDecoration: 'none', position: 'relative', overflow: 'hidden',
                }}
              >
                {/* soft cobalt corner wash */}
                <div aria-hidden style={{
                  position: 'absolute', insetInlineEnd: -20, top: -20, width: 120, height: 120, borderRadius: '50%',
                  background: `radial-gradient(circle, oklch(0.5 0.13 ${TONE_HUES[i % TONE_HUES.length]} / 0.18), transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{
                  width: 44, height: 44, borderRadius: 12, position: 'relative',
                  background: 'rgba(37,99,235,0.12)', color: '#1D4ED8',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={icon} size={22} stroke={1.8} />
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>{deviceKindLabel(kind, lang)}</div>
                  <div style={{ fontSize: 12, color: '#4B5563', marginTop: 4 }}>{t('home.categories.explore', lang)}</div>
                </div>
                <div style={{ marginTop: 'auto', position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, color: '#2563EB', fontSize: 12, fontWeight: 600 }}>
                  {t('common.browse', lang)} <Icon name="arrow" size={14} className="rtl-flip" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ── */}
        <section className="mb-12 md:mb-16">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid #EAECEF', paddingBottom: 14 }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: '#4B5563', marginBottom: 6 }}>{t('home.featured.sectionNum', lang)}</div>
              <h2 style={{ margin: 0, fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>{t('home.featured.title', lang)}</h2>
            </div>
            <Link href="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', border: '1px solid #EAECEF', borderRadius: 4,
              color: '#111827', fontSize: 12, fontWeight: 600, textDecoration: 'none', flexShrink: 0,
            }}>
              {t('common.viewAll', lang)} <Icon name="arrow" size={14} className="rtl-flip" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '1/1', background: '#F3F4F6' }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ height: 10, background: '#F3F4F6', borderRadius: 3 }} />
                    <div style={{ height: 10, background: '#F3F4F6', borderRadius: 3, width: '60%' }} />
                    <div style={{ height: 32, background: '#F3F4F6', borderRadius: 4, marginTop: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── EDITORIAL BANNER ── */}
        <section
          className="flex flex-col lg:grid lg:grid-cols-2 mb-12 md:mb-16 p-6 sm:p-8 md:p-12"
          style={{
            background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8,
            gap: 32, alignItems: 'flex-start',
          }}
        >
          <div>
            <div className="mono" style={{ fontSize: 11, color: '#2563EB', letterSpacing: '0.15em', marginBottom: 14 }}>
              {t('home.editorial.kicker', lang)}
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 600, color: '#111827', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {lang === 'ar'
                ? 'أحدث الأجهزة من أشهر الماركات — ضمان رسمي وتوصيل سريع بالدينار العراقي'
                : 'The latest devices from the biggest brands — official warranty, fast delivery, priced in IQD'}
            </h2>
            <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, marginTop: 16 }}>
              {t('home.editorial.body', lang)}
            </p>
            <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/products" className="btn-accent" style={{ textDecoration: 'none' }}>{t('home.editorial.cta1', lang)}</Link>
              <Link href="/brands" className="btn-secondary" style={{ textDecoration: 'none' }}>{t('home.editorial.cta2', lang)}</Link>
            </div>
          </div>

          {/* Device-type quick links — hidden on mobile */}
          <div className="hidden sm:grid grid-cols-2 gap-3 w-full">
            {DEVICE_TILES.map(({ kind, icon }, i) => {
              const h = TONE_HUES[i % TONE_HUES.length];
              return (
                <Link
                  key={kind}
                  href={`/products?kind=${kind}`}
                  className="hover-accent-border"
                  style={{
                    borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3', border: '1px solid #EAECEF',
                    position: 'relative', textDecoration: 'none', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', padding: 16,
                    background: `
                      radial-gradient(circle at 30% 25%, oklch(0.5 0.13 ${h} / 0.22), transparent 60%),
                      linear-gradient(160deg, #FFFFFF, #F7F8FA)
                    `,
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 11,
                    background: 'rgba(37,99,235,0.12)', color: '#1D4ED8',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={icon} size={20} stroke={1.8} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>{deviceKindLabel(kind, lang)}</div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── BESTSELLERS ── */}
        <section className="mb-16 md:mb-20">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid #EAECEF', paddingBottom: 14 }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: '#4B5563', marginBottom: 6 }}>{t('home.bestsellers.sectionNum', lang)}</div>
              <h2 style={{ margin: 0, fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>{t('home.bestsellers.title', lang)}</h2>
            </div>
          </div>

          {bestsellers.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '1/1', background: '#F3F4F6' }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ height: 10, background: '#F3F4F6', borderRadius: 3 }} />
                    <div style={{ height: 10, background: '#F3F4F6', borderRadius: 3, width: '60%' }} />
                    <div style={{ height: 32, background: '#F3F4F6', borderRadius: 4, marginTop: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
