import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { getServerLang, t, getCategoryName } from '@/lib/i18n';
import { storeConfig } from '@/config/store.config';
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
              <Link href="/how-it-works" className="btn-secondary text-base px-6 py-3.5">
                {t('home.editorial.cta2', lang) !== 'home.editorial.cta2' ? t('home.editorial.cta2', lang) : t('hero.slides.0.ctaAll', lang)}
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

          {/* Drawn "active subscription" card — no image */}
          <div className="hidden lg:block min-w-0">
            <div className="relative rounded-2xl border border-border bg-white p-6 shadow-[0_14px_36px_rgba(16,24,40,0.12)]">
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] font-bold tracking-wider text-text-muted">SUBSCRIPTION</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> {t('common.inStock', lang) !== 'common.inStock' ? t('common.inStock', lang) : 'فعّال'}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent-subtle text-accent">
                  <Icon name="sparkle" size={24} />
                </div>
                <div>
                  <div className="font-[family-name:var(--font-display)] text-lg font-bold text-text-primary">ChatGPT Plus</div>
                  <div className="text-xs text-text-muted">{t('hero.slides.0.kicker', lang)}</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {([
                  { icon: 'bolt', label: t('home.valueProps.fastShipping.title', lang) },
                  { icon: 'shield', label: t('home.valueProps.localWarranty.title', lang) },
                  { icon: 'bank', label: t('home.valueProps.expertSupport.title', lang) },
                ] as const).map((f) => (
                  <div key={f.label} className="rounded-xl border border-border bg-bg-base p-3 text-center">
                    <Icon name={f.icon} size={18} className="mx-auto text-accent" />
                    <div className="mt-1.5 text-[10px] font-medium text-text-secondary leading-tight">{f.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
                <div className="ltr-nums">
                  <span className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-text-primary">$25</span>
                  <span className="text-text-muted line-through text-sm ms-2">$40</span>
                </div>
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
