'use client';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import type { CartItem as CartItemType } from '@/types';
import { useCurrency } from '@/hooks/useCurrency';
import { useCartStore } from '@/store/cart.store';
import { useLang } from '@/hooks/useLang';

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { t } = useLang();
  const { formatPrice } = useCurrency();

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-b-0">
      <div className="relative h-[72px] w-[72px] flex-shrink-0 rounded-md overflow-hidden bg-bg-elevated">
        {item.product.images[0] ? (
          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-text-muted text-lg font-bold">
            {item.product.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm font-medium truncate">{item.product.name}</p>
        <p className="text-accent font-semibold text-sm mt-0.5 ltr-nums">{formatPrice(item.product.price)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="h-8 w-8 rounded border border-border bg-bg-elevated hover:bg-bg-subtle text-text-secondary flex items-center justify-center transition-colors"
          >
            <Icon name="minus" className="h-3.5 w-3.5" />
          </button>
          <span className="text-text-primary text-sm font-medium w-7 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="h-8 w-8 rounded border border-border bg-bg-elevated hover:bg-bg-subtle text-text-secondary flex items-center justify-center transition-colors"
          >
            <Icon name="plus" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <span className="text-text-primary text-sm font-semibold ltr-nums">
          {formatPrice(Number(item.product.price) * item.quantity)}
        </span>
        <button
          onClick={() => removeItem(item.productId)}
          className="text-text-muted hover:text-error transition-colors p-1"
          aria-label={t('common.removeItem')}
        >
          <Icon name="trash" className="h-4 w-4" size={16} />
        </button>
      </div>
    </div>
  );
}
