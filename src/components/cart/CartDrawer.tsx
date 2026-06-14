'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import CartItem from './CartItem';
import { useCurrency } from '@/hooks/useCurrency';
import { useLang } from '@/hooks/useLang';
import { formatPrice as fmt } from '@/lib/utils';
import { storeConfig } from '@/config/store.config';

export default function CartDrawer() {
  const { items, isOpen, toggleDrawer } = useCartStore();
  const { t, isRTL } = useLang();
  const { currency, formatPrice } = useCurrency();
  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  // Secondary currency line (always show the other of USD/IQD as a trust cue)
  const secondary = fmt(total, currency === 'USD' ? 'IQD' : 'USD', storeConfig.exchangeRates.IQD_PER_USD);

  // Close on Escape for keyboard users
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') toggleDrawer(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, toggleDrawer]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" style={{ backdropFilter: 'blur(4px)' }} onClick={toggleDrawer} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
        className="fixed top-0 h-full w-full bg-bg-surface border-border z-50 flex flex-col animate-[slideIn_.26s_cubic-bezier(.16,1,.3,1)]"
        style={{
          maxWidth: 'min(448px, 100vw)',
          right: isRTL ? 'auto' : 0,
          left: isRTL ? 0 : 'auto',
          borderLeftWidth: isRTL ? 0 : 1,
          borderRightWidth: isRTL ? 1 : 0,
          borderStyle: 'solid',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-text-primary font-[family-name:var(--font-display)]">{t('cart.title')}</h2>
            {itemCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent/15 text-accent text-xs font-bold">{itemCount}</span>
            )}
          </div>
          <button onClick={toggleDrawer} className="btn-ghost p-1.5" aria-label={t('common.close') !== 'common.close' ? t('common.close') : 'Close'}>
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
              <div className="text-right ltr-nums">
                <div className="text-text-primary font-bold text-xl font-[family-name:var(--font-display)]">{formatPrice(total)}</div>
                <div className="text-text-muted text-xs">{secondary}</div>
              </div>
            </div>
            <Link href="/checkout" onClick={toggleDrawer} className="btn-accent w-full py-3 text-base">
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
