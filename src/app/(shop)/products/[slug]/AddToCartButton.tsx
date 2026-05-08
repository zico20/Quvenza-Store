'use client';
import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import type { Product } from '@/types';
import { useLang } from '@/hooks/useLang';

export default function AddToCartButton({ product, disabled }: { product: Product; disabled?: boolean }) {
  const { addItem, toggleDrawer } = useCartStore();
  const { t } = useLang();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ productId: product.id, product, quantity: 1 });
    setAdded(true);
    setTimeout(() => { setAdded(false); toggleDrawer(); }, 1000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || added}
      className="btn-primary w-full py-3 text-base"
    >
      {added ? (
        <><Check className="h-5 w-5" /> {t('common.addedToCart')}</>
      ) : disabled ? (
        t('common.outOfStock')
      ) : (
        <><ShoppingCart className="h-5 w-5" /> {t('common.addToCart')}</>
      )}
    </button>
  );
}
