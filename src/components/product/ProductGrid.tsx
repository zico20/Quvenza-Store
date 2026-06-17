import type { Product } from '@/types';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  emptyTitle = 'No products found',
  emptySub = 'Try adjusting your filters',
}: {
  products: Product[];
  emptyTitle?: string;
  emptySub?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-text-muted mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 3 L20 7 V16 L12 21 L4 16 V7 Z" /><path d="M4 7 L12 11.5 L20 7" /><path d="M12 11.5 V21" />
          </svg>
        </div>
        <p className="text-text-primary font-semibold">{emptyTitle}</p>
        <p className="text-text-muted text-sm mt-1">{emptySub}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
