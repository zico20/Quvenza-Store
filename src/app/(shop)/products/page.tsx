'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import ProductGrid from '@/components/product/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { useLang } from '@/hooks/useLang';
import { localizedName, deviceKindLabel } from '@/lib/i18n';
import { brandsApi } from '@/lib/api';
import type { Brand, DeviceKind } from '@/types';

const KINDS: DeviceKind[] = ['PHONE', 'LAPTOP', 'TABLET', 'HEADPHONE'];
const KIND_ICON: Record<DeviceKind, 'phone' | 'laptop' | 'tablet' | 'headphones'> = {
  PHONE: 'phone', LAPTOP: 'laptop', TABLET: 'tablet', HEADPHONE: 'headphones',
};

function ProductsBrowser() {
  const { t, lang } = useLang();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // The URL is the source of truth for kind/brand/search so deep links and
  // navbar links land pre-filtered; sort/price/page are transient UI state.
  const kind = (searchParams.get('kind') as DeviceKind) || undefined;
  const brandSlug = searchParams.get('brand') || undefined;
  const search = searchParams.get('search') || undefined;

  const [sort, setSort] = useState('');
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    brandsApi.getAll().then((r) => { if (r.success) setBrands(r.data); }).catch(() => {});
  }, []);

  // Push kind/brand into the URL; resets page implicitly (derived params change).
  function setUrlFilter(next: { kind?: DeviceKind | null; brand?: string | null }) {
    const params = new URLSearchParams(searchParams.toString());
    if ('kind' in next) { if (next.kind) params.set('kind', next.kind); else params.delete('kind'); }
    if ('brand' in next) { if (next.brand) params.set('brand', next.brand); else params.delete('brand'); }
    setPage(1);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const { data: products, pagination, loading, error } = useProducts({
    kind, brandSlug, sort: sort || undefined, maxPrice: priceMax,
    search, page, limit: 12,
  });

  const hasFilters = Boolean(kind || brandSlug || sort || priceMax);

  function clearFilters() {
    setSort(''); setPriceMax(undefined); setPage(1);
    router.replace(pathname, { scroll: false });
  }

  const heading = kind ? deviceKindLabel(kind, lang) : t('shop.allProducts');

  const FiltersBody = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-text-primary font-semibold text-sm">{t('shop.filters')}</span>
        {hasFilters && (
          <button onClick={clearFilters} className="text-accent text-xs hover:underline">{t('shop.clearAll')}</button>
        )}
      </div>

      {/* Device type */}
      <div>
        <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t('brand.deviceTypes')}</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setUrlFilter({ kind: null })}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-start transition-colors ${!kind ? 'bg-accent-subtle text-accent font-medium' : 'text-text-secondary hover:bg-bg-elevated'}`}
          >
            <Icon name="grid" size={16} /> {t('shop.allProducts')}
          </button>
          {KINDS.map((k) => (
            <button
              key={k}
              onClick={() => setUrlFilter({ kind: k })}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-start transition-colors ${kind === k ? 'bg-accent-subtle text-accent font-medium' : 'text-text-secondary hover:bg-bg-elevated'}`}
            >
              <Icon name={KIND_ICON[k]} size={16} /> {deviceKindLabel(k, lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t('brand.title')}</p>
          <select
            value={brandSlug ?? ''}
            onChange={(e) => setUrlFilter({ brand: e.target.value || null })}
            className="input text-sm"
          >
            <option value="">{t('brand.allBrands')}</option>
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>{localizedName(b.name, b.nameAr, lang)}</option>
            ))}
          </select>
        </div>
      )}

      {/* Max price */}
      <div>
        <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t('compare.price')}</p>
        <select
          value={priceMax ?? ''}
          onChange={(e) => { setPriceMax(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
          className="input text-sm ltr-nums"
        >
          <option value="">—</option>
          <option value="200">≤ $200</option>
          <option value="500">≤ $500</option>
          <option value="1000">≤ $1000</option>
          <option value="2000">≤ $2000</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t('shop.sortBy')}</p>
        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="input text-sm">
          <option value="">{t('shop.newest')}</option>
          <option value="price_asc">{t('shop.priceLowHigh')}</option>
          <option value="price_desc">{t('shop.priceHighLow')}</option>
          <option value="rating">{t('compare.rating')}</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">{heading}</h1>
        <div className="flex items-center gap-3">
          <span className="text-text-muted text-sm">{`${pagination.total} ${t('shop.products')}`}</span>
          <button className="md:hidden btn-secondary gap-2 px-3 py-2 text-sm" onClick={() => setSidebarOpen(true)}>
            <Icon name="filter" className="h-4 w-4" size={16} /> {t('shop.filters')}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-24">{FiltersBody}</div>
        </aside>

        <div className="flex-1 min-w-0">
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="card rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-bg-elevated animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-bg-elevated rounded animate-pulse" />
                    <div className="h-3 bg-bg-elevated rounded animate-pulse w-2/3" />
                    <div className="h-8 bg-bg-elevated rounded animate-pulse mt-3" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-error font-semibold">{t('shop.failedLoad')}</p>
              <p className="text-text-muted text-sm mt-1">{error}</p>
            </div>
          )}
          {!loading && !error && <ProductGrid products={products} />}

          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-2 text-sm disabled:opacity-40 rtl-flip">←</button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ltr-nums ${p === page ? 'bg-accent text-white' : 'btn-ghost'}`}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary px-3 py-2 text-sm disabled:opacity-40 rtl-flip">→</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-inline-end-0 top-0 h-full w-[85vw] max-w-sm bg-bg-surface border-s border-border p-5 overflow-y-auto" style={{ insetInlineEnd: 0, insetInlineStart: 'auto' }}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-text-primary font-semibold">{t('shop.filters')}</span>
              <button onClick={() => setSidebarOpen(false)} className="btn-ghost p-1"><Icon name="x" className="h-5 w-5" size={20} /></button>
            </div>
            {FiltersBody}
            <button onClick={() => setSidebarOpen(false)} className="btn-accent w-full mt-6 py-2.5">{t('shop.filters')}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-[1280px] mx-auto px-4 py-10"><div className="h-8 w-40 bg-bg-elevated rounded animate-pulse" /></div>}>
      <ProductsBrowser />
    </Suspense>
  );
}
