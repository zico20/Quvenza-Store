'use client';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import ProductGrid from '@/components/product/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { useLang } from '@/hooks/useLang';

export default function ProductsPage() {
  const { t } = useLang();
  const [filters, setFilters] = useState<{ categoryId?: string; sort?: string; search?: string }>({});
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const { data: products, pagination, loading, error } = useProducts({ ...filters, page, limit: 12 });

  function handleSort(val: string) {
    setSortBy(val);
    setFilters((f) => ({ ...f, sort: val || undefined }));
    setPage(1);
  }

  function clearFilters() {
    setFilters({});
    setSortBy('');
    setPage(1);
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">{t('shop.allProducts')}</h1>
        <div className="flex items-center gap-3">
          <span className="text-text-muted text-sm">{`${pagination.total} ${t('shop.products')}`}</span>
          <button className="md:hidden btn-secondary gap-2 px-3 py-2 text-sm" onClick={() => setSidebarOpen(true)}>
            <Icon name="filter" className="h-4 w-4" size={16} /> {t('shop.filters')}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-52 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-text-primary font-semibold text-sm">{t('shop.filters')}</span>
              {(filters.sort || filters.categoryId) && (
                <button onClick={clearFilters} className="text-accent text-xs hover:underline">{t('shop.clearAll')}</button>
              )}
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t('shop.sortBy')}</p>
              <select value={sortBy} onChange={(e) => handleSort(e.target.value)} className="input text-sm">
                <option value="">{t('shop.newest')}</option>
                <option value="price_asc">{t('shop.priceLowHigh')}</option>
                <option value="price_desc">{t('shop.priceHighLow')}</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="card rounded-lg overflow-hidden">
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
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
              >←</button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${p === page ? 'bg-accent text-white' : 'btn-ghost'}`}
                >{p}</button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
              >→</button>
            </div>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-bg-surface border-l border-border p-5">
            <div className="flex items-center justify-between mb-6">
              <span className="text-text-primary font-semibold">{t('shop.filters')}</span>
              <button onClick={() => setSidebarOpen(false)} className="btn-ghost p-1"><Icon name="x" className="h-5 w-5" size={20} /></button>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t('shop.sortBy')}</p>
              <select value={sortBy} onChange={(e) => { handleSort(e.target.value); setSidebarOpen(false); }} className="input text-sm">
                <option value="">{t('shop.newest')}</option>
                <option value="price_asc">{t('shop.priceLowHigh')}</option>
                <option value="price_desc">{t('shop.priceHighLow')}</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
