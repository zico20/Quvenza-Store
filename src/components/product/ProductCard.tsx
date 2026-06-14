'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { showToast } from '@/lib/toast';
import { useLang } from '@/hooks/useLang';
import { useCurrency } from '@/hooks/useCurrency';

function StarRow({ value }: { value: number }) {
  return (
    <div style={{ display: 'inline-flex', gap: 1, color: '#FF9357' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} strokeWidth={0} fill={i <= Math.round(value) ? '#FF9357' : 'rgba(255,147,87,0.2)'} />
      ))}
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { t } = useLang();
  const { formatPrice } = useCurrency();
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem({ productId: product.id, product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    const was = isInWishlist(product.id);
    toggleItem(product);
    showToast(was ? t('wishlist.removed') : t('wishlist.added'));
  }

  const inWishlist = mounted ? isInWishlist(product.id) : false;
  const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);
  const discountPct = hasDiscount ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100) : 0;

  // Tone hue for placeholder (cycle based on id chars)
  const hues = [18, 220, 280, 140, 40, 320];
  const hue = hues[(product.id?.charCodeAt(product.id.length - 1) ?? 0) % hues.length];
  const placeholderBg = `
    radial-gradient(circle at 30% 25%, oklch(0.45 0.12 ${hue} / 0.5), transparent 60%),
    linear-gradient(160deg, #16161b, #0a0a0c)
  `;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group hover-accent-border"
      style={{
        background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 16,
        overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column',
        textDecoration: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', aspectRatio: '1/1', background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized={product.images[0].startsWith('http://localhost') || product.images[0].includes('placehold.co')}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: placeholderBg }}>
            <span
              className="mono"
              style={{
                position: 'absolute', bottom: 12, insetInlineStart: 12,
                fontSize: 10, color: 'rgba(247,247,248,0.35)',
              }}
            >
              {(product as any).category?.name || 'product shot'}
            </span>
          </div>
        )}

        {/* Discount chip */}
        {hasDiscount && (
          <div style={{ position: 'absolute', top: 12, insetInlineStart: 12 }}>
            <span className="tag tag-sale">−{discountPct}%</span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute', top: 10, insetInlineEnd: 10,
            width: 36, height: 36, borderRadius: 18,
            background: 'rgba(10,10,12,0.85)', border: '1px solid var(--color-border)',
            color: inWishlist ? '#FB7185' : '#F7F7F8',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(6px)',
          }}
          aria-label={inWishlist ? t('wishlist.remove') : t('wishlist.add')}
        >
          <Heart size={15} strokeWidth={1.6} fill={inWishlist ? '#FB7185' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="px-3 py-3 sm:px-4 sm:py-4 flex flex-col flex-1" style={{ gap: 6 }}>
        <div
          style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--color-plasma)', fontFamily: 'var(--font-display)',
          }}
        >
          {(product as any).category?.name || 'softodeviq'}
        </div>

        <div
          style={{
            fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.35, minHeight: 36,
            fontFamily: 'var(--font-display)',
          }}
        >
          {product.name}
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-secondary)', fontSize: 10 }}>
          <StarRow value={4.5} />
          <span style={{ color: 'var(--color-text-muted)' }}>(—)</span>
        </div>

        {/* Price (USD + IQD), kept LTR */}
        <div className="ltr-nums" style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 'auto', paddingTop: 6 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
            {formatPrice(product.price)}
          </div>
          {hasDiscount && (
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{formatPrice(product.comparePrice)}</div>
          )}
        </div>

        {/* Stock status */}
        {product.stock === 0 ? (
          <div style={{ fontSize: 10, color: '#FB7185' }}>{t('common.outOfStock')}</div>
        ) : product.stock <= 10 ? (
          <div style={{ fontSize: 10, color: '#FBBF24' }}>{`${t('common.lowStock')} — ${product.stock}`}</div>
        ) : (
          <div style={{ fontSize: 10, color: '#34D399' }}>{t('common.inStock')}</div>
        )}

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{
            marginTop: 6, width: '100%', minHeight: 40,
            padding: '9px 8px', fontSize: 12, fontWeight: 700,
            background: product.stock === 0 ? 'var(--color-bg-elevated)' : 'linear-gradient(135deg,#FF7A33,#FF5C1A)',
            color: product.stock === 0 ? 'var(--color-text-muted)' : '#0A0A0C',
            border: 'none', borderRadius: 10, cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: product.stock === 0 ? 'none' : '0 6px 16px rgba(255,122,51,0.28)',
            transition: 'filter 0.15s, box-shadow 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e: any) => { if (product.stock > 0) e.currentTarget.style.filter = 'brightness(1.05)'; }}
          onMouseLeave={(e: any) => { e.currentTarget.style.filter = 'none'; }}
        >
          {added ? (
            <><Check size={13} /> {t('common.addedToCart')}</>
          ) : (
            <><ShoppingCart size={13} strokeWidth={1.8} /> {t('common.addToCart')}</>
          )}
        </button>
      </div>
    </Link>
  );
}
