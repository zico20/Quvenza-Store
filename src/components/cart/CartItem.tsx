'use client';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import type { CartItem as CartItemType } from '@/types';
import { useCurrency } from '@/hooks/useCurrency';
import { useCartStore } from '@/store/cart.store';
import { useLang } from '@/hooks/useLang';
import { localizedName } from '@/lib/i18n';

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { t, lang } = useLang();
  const { formatPrice } = useCurrency();

  // Variant-aware: price, image and label fall back to the product when no variant.
  const unitPrice = Number(item.variant?.price ?? item.product.price);
  const image = item.variant?.image || item.product.images[0];
  const name = localizedName(item.product.name, item.product.nameAr, lang);
  const variantLabel = item.variant
    ? [item.variant.storage, item.variant.color].filter(Boolean).join(' · ') ||
      localizedName(item.variant.name, item.variant.nameAr, lang)
    : null;
  const vId = item.variantId;

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-b-0">
      <div className="relative h-[72px] w-[72px] flex-shrink-0 rounded-md overflow-hidden bg-bg-elevated">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-1"
            unoptimized={image.includes('placehold.co') || image.startsWith('http://localhost')}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-text-muted text-lg font-bold">
            {name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm font-medium truncate">{name}</p>
        {variantLabel && <p className="text-text-muted text-xs mt-0.5 truncate">{variantLabel}</p>}
        <p className="text-accent font-semibold text-sm mt-0.5 ltr-nums">{formatPrice(unitPrice)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1, vId)}
            className="h-8 w-8 rounded border border-border bg-bg-elevated hover:bg-bg-subtle text-text-secondary flex items-center justify-center transition-colors"
            aria-label="−"
          >
            <Icon name="minus" className="h-3.5 w-3.5" />
          </button>
          <span className="text-text-primary text-sm font-medium w-7 text-center ltr-nums">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1, vId)}
            className="h-8 w-8 rounded border border-border bg-bg-elevated hover:bg-bg-subtle text-text-secondary flex items-center justify-center transition-colors"
            aria-label="+"
          >
            <Icon name="plus" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <span className="text-text-primary text-sm font-semibold ltr-nums">
          {formatPrice(unitPrice * item.quantity)}
        </span>
        <button
          onClick={() => removeItem(item.productId, vId)}
          className="text-text-muted hover:text-error transition-colors p-1"
          aria-label={t('common.removeItem')}
        >
          <Icon name="trash" className="h-4 w-4" size={16} />
        </button>
      </div>
    </div>
  );
}
