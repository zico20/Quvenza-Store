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
    <div style={{ display: 'inline-flex', gap: 1, color: '#ff6a2b' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} strokeWidth={0} fill={i <= Math.round(value) ? '#ff6a2b' : 'rgba(255,106,43,0.2)'} />
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
    repeating-linear-gradient(135deg, oklch(0.78 0.04 ${hue}) 0 2px, transparent 2px 14px),
    linear-gradient(160deg, oklch(0.88 0.03 ${hue}), oklch(0.72 0.05 ${hue}))
  `;

  return (
    <Link
      href={`/products/${product.slug}`}
      style={{
        background: '#17171a', border: '1px solid #2a2a30', borderRadius: 6,
        overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column',
        textDecoration: 'none', transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e: any) => e.currentTarget.style.borderColor = '#ff6a2b'}
      onMouseLeave={(e: any) => e.currentTarget.style.borderColor = '#2a2a30'}
    >
      {/* Image area */}
      <div style={{ position: 'relative', aspectRatio: '1/1', background: '#1f1f23', overflow: 'hidden' }}>
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized={product.images[0].startsWith('http://localhost') || product.images[0].includes('placehold.co')}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: placeholderBg }}>
            <span
              className="mono"
              style={{
                position: 'absolute', bottom: 12, left: 12,
                fontSize: 10, color: 'rgba(23,22,26,0.4)',
              }}
            >
              {(product as any).category?.name || 'product shot'}
            </span>
          </div>
        )}

        {/* Tag chip */}
        {hasDiscount && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span className="tag tag-sale">−{discountPct}%</span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 34, height: 34, borderRadius: 17,
            background: 'rgba(14,14,16,0.85)', border: '1px solid #2a2a30',
            color: inWishlist ? '#f87171' : '#f5f5f4',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(6px)',
          }}
          aria-label={inWishlist ? t('wishlist.remove') : t('wishlist.add')}
        >
          <Heart size={15} strokeWidth={1.6} fill={inWishlist ? '#f87171' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="px-3 py-3 sm:px-4 sm:py-4 flex flex-col flex-1" style={{ gap: 6 }}>
        <div className="mono" style={{ fontSize: 10, color: '#6b6b70' }}>
          {(product as any).category?.name || 'softodeviq'} · {product.id?.slice(-6).toUpperCase()}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f4', lineHeight: 1.35, minHeight: 34 }}>
          {product.name}
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#a1a1a6', fontSize: 10 }}>
          <StarRow value={4.5} />
          <span style={{ color: '#6b6b70' }}>(—)</span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 'auto', paddingTop: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f5f5f4' }}>{formatPrice(product.price)}</div>
          {hasDiscount && (
            <div style={{ fontSize: 11, color: '#6b6b70', textDecoration: 'line-through' }}>{formatPrice(product.comparePrice)}</div>
          )}
        </div>

        {/* Stock status */}
        {product.stock === 0 ? (
          <div style={{ fontSize: 10, color: '#f87171' }}>{t('common.outOfStock')}</div>
        ) : product.stock <= 10 ? (
          <div style={{ fontSize: 10, color: '#fbbf24' }}>{`${t('common.lowStock')} — ${product.stock}`}</div>
        ) : (
          <div style={{ fontSize: 10, color: '#4ade80' }}>{t('common.inStock')}</div>
        )}

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{
            marginTop: 4, width: '100%',
            padding: '8px 8px', fontSize: 11, fontWeight: 600,
            background: '#ff6a2b', color: '#ffffff',
            border: 'none', borderRadius: 4, cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            opacity: product.stock === 0 ? 0.5 : 1,
            transition: 'background 0.15s, opacity 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e: any) => { if (product.stock > 0) e.currentTarget.style.opacity = '0.88'; }}
          onMouseLeave={(e: any) => { e.currentTarget.style.opacity = product.stock === 0 ? '0.5' : '1'; }}
        >
          {added ? (
            <><Check size={12} /> {t('common.addedToCart')}</>
          ) : (
            <><ShoppingCart size={12} strokeWidth={1.6} /> {t('common.addToCart')}</>
          )}
        </button>
      </div>
    </Link>
  );
}
