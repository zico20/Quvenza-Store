'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/product/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { useLang } from '@/hooks/useLang';

function SearchResults() {
  const { t } = useLang();
  const q = useSearchParams().get('q') ?? '';
  const { data, loading, error } = useProducts({ search: q });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {q ? `${t('shop.resultsFor')} "${q}"` : t('shop.searchTitle')}
      </h1>
      {loading && <p>{t('shop.searching')}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <ProductGrid products={data} />}
    </div>
  );
}

export default function SearchPage() {
  const { t } = useLang();
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>{t('common.loading')}</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
