'use client';

import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useWishlistStore } from '@/store/wishlist.store';
import { useLang } from '@/hooks/useLang';

export default function WishlistPage() {
  const { t } = useLang();
  const { items, clearWishlist } = useWishlistStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{t('account.tabs.wishlist')}</h1>
        {items.length > 0 && (
          <button onClick={clearWishlist} className="btn-ghost px-3 py-2 text-sm">
            <Trash2 className="h-4 w-4" />
            {t('account.wishlist.clear')}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-bg-surface border border-border rounded-lg py-16 px-6 text-center">
          <Heart className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h2 className="text-text-primary text-lg font-semibold mb-2">{t('account.wishlist.empty')}</h2>
          <p className="text-text-muted text-sm mb-6">{t('account.wishlist.emptySub')}</p>
          <Link href="/products" className="btn-primary">
            {t('account.wishlist.browse')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
