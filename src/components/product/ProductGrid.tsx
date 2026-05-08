import type { Product } from '@/types';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-text-muted text-5xl mb-4">📦</div>
        <p className="text-text-primary font-semibold">No products found</p>
        <p className="text-text-muted text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
