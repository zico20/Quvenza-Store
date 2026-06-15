import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import HeroSlider from '@/components/home/HeroSlider';
import { getServerLang, t, getCategoryName } from '@/lib/i18n';
import JsonLd from '@/components/seo/JsonLd';
import { organizationSchema, websiteSchema, localBusinessSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'SoftoDev | اشترِ ChatGPT Plus · Canva Pro · CapCut · Coursera في العراق',
  description:
    'أكبر متجر اشتراكات رقمية في العراق — ChatGPT Plus، Canva Pro، CapCut Pro، Coursera Plus. تفعيل فوري خلال 30 دقيقة، دفع بالدينار العراقي، ضمان كامل.',
  alternates: { canonical: 'https://softodeviqstore.com' },
  openGraph: {
    title: 'SoftoDev — اشتراكات ChatGPT Plus · Canva Pro في العراق',
    description: 'اشترِ ChatGPT Plus، Canva Pro، CapCut Pro بالدينار العراقي — تفعيل فوري وضمان كامل.',
    url: 'https://softodeviqstore.com',
  },
};

async function getCategories(): Promise<Category[]> {
  try {
    const { getCategories: fetchCategories } = await import('@/services/categories/category.service');
    return (await fetchCategories()) as unknown as Category[];
  } catch { return []; }
}

function serializeProduct(p: any): Product {
  return {
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice != null ? Number(p.comparePrice) : null,
  } as Product;
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { getProducts } = await import('@/services/products/product.service');
    const result = await getProducts({ page: 1, limit: 4, skip: 0 }, {});
    return result.products.map(serializeProduct);
  } catch { return []; }
}

async function getBestsellers(): Promise<Product[]> {
  try {
    const { getProducts } = await import('@/services/products/product.service');
    const result = await getProducts({ page: 1, limit: 8, skip: 0 }, { sort: 'name' });
    return result.products.map(serializeProduct);
  } catch { return []; }
}

const TONE_HUES = [18, 220, 280, 140, 40, 320, 180, 60];

function CategoryPlaceholder({ index }: { index: number }) {
  const h = TONE_HUES[index % TONE_HUES.length];
  return (
    <div style={{
      flex: 1, minHeight: 60,
      background: `
        radial-gradient(circle at 30% 25%, oklch(0.5 0.13 ${h} / 0.45), transparent 60%),
        linear-gradient(160deg, #FFFFFF, #F7F8FA)
      `,
      borderRadius: 12,
    }} />
  );
}

export default async function HomePage() {
  const lang = await getServerLang();

  const [categories, featured, bestsellers] = await Promise.all([
    getCategories(),
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

      {/* ── HERO ── */}
      <HeroSlider lang={lang} />

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

        {/* ── CATEGORIES ── */}
        {categories.length > 0 && (
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
              {categories.slice(0, 4).map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="hover-accent-border"
                  style={{
                    background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 6,
                    padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 16,
                    minHeight: 160, textDecoration: 'none',
                  }}
                >
                  <div className="mono" style={{ fontSize: 10, color: '#9097A1' }}>0{i + 1}</div>
                  <div>
                    <div style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>{getCategoryName(cat.slug, cat.name, lang)}</div>
                    <div style={{ fontSize: 12, color: '#4B5563', marginTop: 4 }}>{t('home.categories.explore', lang)}</div>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, color: '#2563EB', fontSize: 12, fontWeight: 600 }}>
                    {t('common.browse', lang)} <Icon name="arrow" size={14} className="rtl-flip" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

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
            <h1 style={{ fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 600, color: '#111827', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              اشتراكات ChatGPT Plus وCanva Pro في العراق — دفع بالدينار، تفعيل فوري
            </h1>
            <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, marginTop: 16 }}>
              {t('home.editorial.body', lang)}
            </p>
            <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/account" className="btn-accent" style={{ textDecoration: 'none' }}>{t('home.editorial.cta1', lang)}</Link>
              <Link href="/products" className="btn-secondary" style={{ textDecoration: 'none' }}>{t('home.editorial.cta2', lang)}</Link>
            </div>
          </div>

          {/* Mini product grid — hidden on mobile */}
          <div className="hidden sm:grid grid-cols-3 gap-3 w-full">
            {[2, 5, 3, 8, 1, 4].map((tone, i) => {
              const h = TONE_HUES[(tone - 1) % TONE_HUES.length];
              return (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1/1', border: '1px solid #EAECEF' }}>
                  <div style={{
                    width: '100%', height: '100%',
                    background: `
                      radial-gradient(circle at 30% 25%, oklch(0.5 0.13 ${h} / 0.45), transparent 60%),
                      linear-gradient(160deg, #FFFFFF, #F7F8FA)
                    `,
                  }} />
                </div>
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
