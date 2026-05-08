'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import CartItem from '@/components/cart/CartItem';
import { useCurrency } from '@/hooks/useCurrency';
import { useLang } from '@/hooks/useLang';

export default function CartPage() {
  const { items } = useCartStore();
  const { t } = useLang();
  const { formatPrice } = useCurrency();
  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/products" className="btn-ghost p-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">{t('cart.title')}</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted mb-4">{t('cart.empty')}</p>
          <Link href="/products" className="btn-primary px-6 py-3">
            {t('common.continueShopping')}
          </Link>
        </div>
      ) : (
        <div>
          <div className="bg-bg-surface rounded-lg border border-border p-4 mb-6">
            {items.map((i) => <CartItem key={i.productId} item={i} />)}
          </div>
          <div className="bg-bg-surface rounded-lg border border-border p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-text-primary">{t('common.total')}</span>
              <span className="text-2xl font-bold text-text-primary">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn-primary w-full py-3 font-semibold">
              {t('common.checkout')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
