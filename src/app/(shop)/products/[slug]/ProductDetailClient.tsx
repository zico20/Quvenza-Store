'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Product } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { showToast } from '@/lib/toast';
import { useCategoryName } from '@/hooks/useCategoryName';
import { useLang } from '@/hooks/useLang';
import { useCurrency } from '@/hooks/useCurrency';

interface Props { product: Product }

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-bg-base pt-4 sm:pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-4 w-48 bg-bg-elevated rounded animate-pulse mb-8" />
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-[4/3] lg:aspect-auto lg:h-[400px] bg-bg-elevated rounded-xl animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-6 w-24 bg-bg-elevated rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-bg-elevated rounded animate-pulse" />
            <div className="h-8 w-1/3 bg-bg-elevated rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductNotFound() {
  const router = useRouter();
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl text-text-muted mb-4">404</div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">{t('product.notFound')}</h2>
        <p className="text-text-muted mb-6">{t('product.notFoundSub')}</p>
        <button onClick={() => router.back()} className="btn-primary flex items-center gap-2 mx-auto">
          <Icon name="arrowLeft" size={16} className="rtl-flip" /> {t('product.goBack')}
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { t } = useLang();
  const { formatPrice } = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const categoryName = useCategoryName(product.category?.slug ?? '', product.category?.name ?? '');

  const inWishlist = isInWishlist(product.id);
  const savingsAmount = product.comparePrice
    ? Number(product.comparePrice) - Number(product.price)
    : null;

  function handleAddToCart() {
    setAdding(true);
    addItem({ productId: product.id, product, quantity });
    setTimeout(() => setAdding(false), 1500);
  }

  function handleToggleWishlist() {
    toggleItem(product);
    showToast(inWishlist ? t('wishlist.removed') : t('wishlist.added'));
  }

  return (
    <div className="min-h-screen bg-bg-base pt-4 sm:pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-text-muted mb-6">
          <button onClick={() => router.push('/')} className="hover:text-text-primary transition-colors">{t('product.home')}</button>
          <span>/</span>
          <button onClick={() => router.push('/products')} className="hover:text-text-primary transition-colors">{t('product.products')}</button>
          <span>/</span>
          <span className="text-text-secondary truncate max-w-[160px]">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col gap-3">
            <div className="aspect-[4/3] lg:aspect-auto lg:h-[400px] bg-bg-elevated rounded-xl overflow-hidden border border-border shadow-lg">
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={`${product.name} — صورة ${selectedImage + 1}`}
                  width={800}
                  height={800}
                  priority={selectedImage === 0}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  unoptimized={product.images[selectedImage].startsWith('http://localhost')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-text-muted">
                  {product.name[0]}
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`صورة ${i + 1}`}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-accent' : 'border-border hover:border-border-strong'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} — صورة ${i + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      unoptimized={img.startsWith('http://localhost')}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">
            <div>
              {product.category?.name && (
                <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.08em] text-plasma font-[family-name:var(--font-display)]">{categoryName}</span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-3 font-[family-name:var(--font-display)]">{product.name}</h1>
              <div className="flex flex-wrap items-baseline gap-3 ltr-nums">
                <span className="text-2xl sm:text-3xl font-bold text-text-primary font-[family-name:var(--font-display)]">{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <>
                    <span className="text-lg text-text-muted line-through">{formatPrice(product.comparePrice)}</span>
                    <span className="text-sm bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                      {t('product.saveN').replace('{n}', savingsAmount ? formatPrice(savingsAmount) : '')}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="divider" />
            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{product.description}</p>

            {product.stock <= 10 && product.stock > 0 && (
              <p className="text-warning text-sm font-medium">{t('product.lowStockN').replace('{n}', String(product.stock))}</p>
            )}
            {product.stock === 0 && (
              <p className="text-error text-sm font-medium">{t('common.outOfStock')}</p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-text-secondary text-sm">{t('product.quantity')}</span>
              <div className="flex items-center bg-bg-subtle border border-border rounded-md overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 sm:px-4 sm:py-2.5 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all text-lg">−</button>
                <span className="px-4 py-2 sm:px-5 sm:py-2.5 text-text-primary font-medium border-x border-border min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))} className="px-3 py-2 sm:px-4 sm:py-2.5 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all text-lg">+</button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                className="btn-accent flex-1 py-3 flex items-center justify-center gap-2"
              >
                {adding ? (
                  <><div className="w-4 h-4 border-2 border-bg-base/30 border-t-bg-base rounded-full animate-spin" />{t('product.addingToCart')}</>
                ) : (
                  <><Icon name="cart" size={18} />{t('common.addToCart')}</>
                )}
              </button>
              <button
                onClick={handleToggleWishlist}
                aria-label={inWishlist ? t('wishlist.remove') : t('wishlist.add')}
                className={`btn-secondary px-4 py-3 rounded-md border transition-all ${inWishlist ? 'border-error/40 text-error hover:bg-error/10' : 'border-border hover:border-border-strong'}`}
              >
                <Icon name={inWishlist ? 'heartFill' : 'heart'} size={20} className={inWishlist ? 'fill-error' : ''} />
              </button>
            </div>

            {/* Trust signals — the four conversion cues */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { icon: '⚡', text: 'تفعيل خلال 30 دقيقة' },
                { icon: '✅', text: 'اشتراك أصلي 100%' },
                { icon: '🛡️', text: 'ضمان كامل' },
                { icon: '💳', text: 'دفع بالدينار العراقي' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 rounded-lg border border-border bg-bg-surface px-3 py-2.5 text-xs text-text-secondary"
                >
                  <span className="text-sm">{item.icon}</span> {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer so the sticky bar never covers content on mobile */}
      <div className="h-24 lg:hidden" />

      {/* Mobile sticky add-to-cart bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-bg-surface/95 backdrop-blur px-4 py-3 flex items-center gap-3" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="ltr-nums shrink-0">
          <div className="text-lg font-bold text-text-primary font-[family-name:var(--font-display)]">{formatPrice(product.price)}</div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding}
          className="btn-accent flex-1 py-3 min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Icon name="cart" size={18} />
          {product.stock === 0 ? t('common.outOfStock') : t('common.addToCart')}
        </button>
      </div>
    </div>
  );
}
