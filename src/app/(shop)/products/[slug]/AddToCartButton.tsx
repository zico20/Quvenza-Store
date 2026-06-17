'use client';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
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
      className="btn-accent w-full py-3 text-base"
    >
      {added ? (
        <><Icon name="check" className="h-5 w-5" size={20} /> {t('common.addedToCart')}</>
      ) : disabled ? (
        t('common.outOfStock')
      ) : (
        <><Icon name="cart" className="h-5 w-5" size={20} /> {t('common.addToCart')}</>
      )}
    </button>
  );
}
