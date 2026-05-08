'use client';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import CartItem from './CartItem';
import { useCurrency } from '@/hooks/useCurrency';
import { useLang } from '@/hooks/useLang';

export default function CartDrawer() {
  const { items, isOpen, toggleDrawer } = useCartStore();
  const { t, isRTL } = useLang();
  const { formatPrice } = useCurrency();
  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" style={{ backdropFilter: 'blur(4px)' }} onClick={toggleDrawer} />
      <div
        className="fixed top-0 h-full w-full bg-bg-surface border-border shadow-lg z-50 flex flex-col"
        style={{
          maxWidth: 'min(448px, 100vw)',
          right: isRTL ? 'auto' : 0,
          left: isRTL ? 0 : 'auto',
          borderLeftWidth: isRTL ? 0 : 1,
          borderRightWidth: isRTL ? 1 : 0,
          borderStyle: 'solid',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-text-primary">{t('cart.title')}</h2>
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </div>
          <button onClick={toggleDrawer} className="btn-ghost p-1.5" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="h-12 w-12 text-text-muted mb-4" />
              <p className="text-text-primary font-semibold">{t('cart.empty')}</p>
              <p className="text-text-muted text-sm mt-1 mb-6">{t('cart.emptyBody')}</p>
              <Link href="/products" onClick={toggleDrawer} className="btn-primary">
                {t('cart.browseProducts')}
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => <CartItem key={item.productId} item={item} />)}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">{t('cart.subtotal')}</span>
              <span className="text-text-primary font-bold text-xl">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" onClick={toggleDrawer} className="btn-primary w-full py-3 text-base">
              {t('common.checkout')}
            </Link>
            <button onClick={toggleDrawer} className="btn-ghost w-full py-2 text-sm">
              {t('common.continueShopping')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
