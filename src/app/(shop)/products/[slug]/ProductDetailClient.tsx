'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Product, Variant } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useCompareStore } from '@/store/compare.store';
import { showToast } from '@/lib/toast';
import { useLang } from '@/hooks/useLang';
import { useCurrency } from '@/hooks/useCurrency';
import { localizedName } from '@/lib/i18n';
import ProductCard from '@/components/product/ProductCard';

interface ReviewLite {
  id: string;
  rating: number;
  comment?: string | null;
  authorName?: string | null;
  createdAt?: string | Date;
}

interface Props {
  product: Product & { reviews?: ReviewLite[] };
  related?: Product[];
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

// Star row helper
function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={size} stroke={0} color={i <= Math.round(value) ? '#F59E0B' : 'rgba(245,158,11,0.25)'} />
      ))}
    </span>
  );
}

export default function ProductDetailClient({ product, related = [] }: Props) {
  const router = useRouter();
  const { t, lang } = useLang();
  const { formatPrice } = useCurrency();

  const variants = useMemo<Variant[]>(() => product.variants ?? [], [product.variants]);
  const defaultVariant = useMemo(
    () => variants.find((v) => v.isDefault) ?? variants[0],
    [variants]
  );
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addItem } = useCartStore();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();

  // Active price/stock come from the selected variant if any, else the product.
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeCompare = selectedVariant?.comparePrice ?? product.comparePrice;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;

  const name = localizedName(product.name, product.nameAr, lang);
  const description = localizedName(product.description, product.descriptionAr, lang);
  const brandName = product.brand ? localizedName(product.brand.name, product.brand.nameAr, lang) : null;

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const savingsAmount = activeCompare ? Number(activeCompare) - Number(activePrice) : null;

  // Group variant options so we can render distinct selector rows (storage / color / ram).
  const storageOptions = useMemo(
    () => Array.from(new Set(variants.map((v) => v.storage).filter(Boolean))) as string[],
    [variants]
  );
  const colorOptions = useMemo(
    () => variants.filter((v) => v.color).map((v) => ({ color: v.color!, colorHex: v.colorHex, id: v.id })),
    [variants]
  );

  const reviews = product.reviews ?? [];
  const avgRating = product.rating ?? 0;

  function handleAddToCart() {
    if (activeStock === 0) return;
    if (variants.length > 0 && !selectedVariant) {
      showToast(t('product.selectVariant'));
      return;
    }
    setAdding(true);
    addItem({
      productId: product.id,
      product,
      quantity,
      variantId: selectedVariant?.id,
      variant: selectedVariant,
    });
    setTimeout(() => setAdding(false), 1500);
  }

  function handleToggleWishlist() {
    toggleWishlist(product);
    showToast(inWishlist ? t('wishlist.removed') : t('wishlist.added'));
  }

  function handleToggleCompare() {
    const result = toggleCompare(product);
    if (result === 'full') showToast(t('compare.full'));
    else showToast(result === 'added' ? t('compare.added') : t('compare.removed'));
  }

  // Build a typed-ordered spec list from product.specs based on device kind.
  const specEntries = useMemo(() => buildSpecEntries(product, t), [product, t]);

  return (
    <div className="min-h-screen bg-bg-base pt-4 sm:pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-2 text-sm text-text-muted mb-6">
          <button onClick={() => router.push('/')} className="hover:text-text-primary transition-colors">{t('product.home')}</button>
          <span>/</span>
          {product.brand && (
            <>
              <Link href={`/brands/${product.brand.slug}`} className="hover:text-text-primary transition-colors">{brandName}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-text-secondary truncate max-w-[200px]">{name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col gap-3 lg:sticky lg:top-24">
            <div className="aspect-square bg-bg-surface rounded-2xl overflow-hidden border border-border shadow-sm flex items-center justify-center">
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={`${name} — ${selectedImage + 1}`}
                  width={800}
                  height={800}
                  priority={selectedImage === 0}
                  className="w-full h-full object-contain p-6 hover:scale-[1.03] transition-transform duration-500"
                  unoptimized={product.images[selectedImage].startsWith('http://localhost') || product.images[selectedImage].includes('placehold.co')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-text-muted">{name[0]}</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`${name} ${i + 1}`}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 bg-bg-surface transition-all ${i === selectedImage ? 'border-accent' : 'border-border hover:border-border-strong'}`}
                  >
                    <Image
                      src={img}
                      alt={`${name} ${i + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-1"
                      unoptimized={img.startsWith('http://localhost') || img.includes('placehold.co')}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">
            <div>
              {brandName && (
                <Link href={`/brands/${product.brand!.slug}`} className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.08em] text-accent font-[family-name:var(--font-display)] hover:underline">
                  {brandName}
                </Link>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-3 font-[family-name:var(--font-display)]">{name}</h1>

              {/* Rating summary */}
              {avgRating > 0 && (
                <button
                  onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 mb-3 text-sm"
                >
                  <Stars value={avgRating} size={15} />
                  <span className="ltr-nums font-semibold text-text-primary">{avgRating.toFixed(1)}</span>
                  {reviews.length > 0 && <span className="text-text-muted">· {reviews.length} {t('product.reviews')}</span>}
                </button>
              )}

              <div className="flex flex-wrap items-baseline gap-3 ltr-nums">
                <span className="text-2xl sm:text-3xl font-bold text-text-primary font-[family-name:var(--font-display)]">{formatPrice(activePrice)}</span>
                {activeCompare && Number(activeCompare) > Number(activePrice) && (
                  <>
                    <span className="text-lg text-text-muted line-through">{formatPrice(activeCompare)}</span>
                    {savingsAmount && savingsAmount > 0 && (
                      <span className="text-sm bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                        {t('product.saveN').replace('{n}', formatPrice(savingsAmount))}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="divider" />

            {/* Storage selector */}
            {storageOptions.length > 1 && (
              <div>
                <p className="text-sm font-semibold text-text-primary mb-2">{t('product.storage')}</p>
                <div className="flex flex-wrap gap-2">
                  {storageOptions.map((s) => {
                    const v = variants.find((x) => x.storage === s && (!selectedVariant?.color || x.color === selectedVariant.color)) ?? variants.find((x) => x.storage === s)!;
                    const isSel = selectedVariant?.storage === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ltr-nums ${isSel ? 'border-accent bg-accent-subtle text-accent' : 'border-border text-text-secondary hover:border-border-strong'}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color selector */}
            {colorOptions.length > 1 && (
              <div>
                <p className="text-sm font-semibold text-text-primary mb-2">
                  {t('product.color')}{selectedVariant?.color ? <span className="text-text-muted font-normal"> — {selectedVariant.color}</span> : null}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {colorOptions.map((c) => {
                    const isSel = selectedVariant?.id === c.id;
                    const v = variants.find((x) => x.id === c.id)!;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedVariant(v)}
                        aria-label={c.color}
                        title={c.color}
                        className={`h-9 w-9 rounded-full border-2 transition-all ${isSel ? 'border-accent ring-2 ring-accent/30' : 'border-border hover:border-border-strong'}`}
                        style={{ background: c.colorHex || '#888' }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Generic variant fallback (e.g. RAM/config) when no storage/color split */}
            {storageOptions.length <= 1 && colorOptions.length <= 1 && variants.length > 1 && (
              <div>
                <p className="text-sm font-semibold text-text-primary mb-2">{t('product.configuration')}</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const isSel = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isSel ? 'border-accent bg-accent-subtle text-accent' : 'border-border text-text-secondary hover:border-border-strong'}`}
                      >
                        {localizedName(v.name, v.nameAr, lang)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock + SKU */}
            <div className="flex items-center gap-3 text-sm">
              {activeStock === 0 ? (
                <span className="text-error font-medium">{t('common.outOfStock')}</span>
              ) : activeStock <= 10 ? (
                <span className="text-warning font-medium">{t('product.lowStockN').replace('{n}', String(activeStock))}</span>
              ) : (
                <span className="text-success font-medium">{t('common.inStock')}</span>
              )}
              {selectedVariant?.sku && (
                <span className="text-text-muted mono text-xs">{t('product.sku')}: {selectedVariant.sku}</span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-text-secondary text-sm">{t('product.quantity')}</span>
              <div className="flex items-center bg-bg-surface border border-border rounded-md overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 sm:px-4 sm:py-2.5 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all text-lg" aria-label="−">−</button>
                <span className="px-4 py-2 sm:px-5 sm:py-2.5 text-text-primary font-medium border-x border-border min-w-[40px] text-center ltr-nums">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(activeStock || 1, quantity + 1))} className="px-3 py-2 sm:px-4 sm:py-2.5 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all text-lg" aria-label="+">+</button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={activeStock === 0 || adding}
                className="btn-accent flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {adding ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('product.addingToCart')}</>
                ) : (
                  <><Icon name="cart" size={18} />{activeStock === 0 ? t('common.outOfStock') : t('common.addToCart')}</>
                )}
              </button>
              <button
                onClick={handleToggleWishlist}
                aria-label={inWishlist ? t('wishlist.remove') : t('wishlist.add')}
                className={`btn-secondary px-4 py-3 rounded-md border transition-all ${inWishlist ? 'border-error/40 text-error hover:bg-error/10' : 'border-border hover:border-border-strong'}`}
              >
                <Icon name={inWishlist ? 'heartFill' : 'heart'} size={20} />
              </button>
              <button
                onClick={handleToggleCompare}
                aria-label={t('product.addToCompare')}
                className={`btn-secondary px-4 py-3 rounded-md border transition-all ${inCompare ? 'border-accent text-accent bg-accent-subtle' : 'border-border hover:border-border-strong'}`}
                title={inCompare ? t('product.inCompare') : t('product.addToCompare')}
              >
                <Icon name="scale" size={20} />
              </button>
            </div>

            {/* Trust signals — physical commerce */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {([
                { icon: 'truck', text: lang === 'ar' ? 'توصيل سريع لكل العراق' : 'Fast delivery across Iraq' },
                { icon: 'shield', text: lang === 'ar' ? 'ضمان رسمي للجهاز' : 'Official device warranty' },
                { icon: 'checkCircle', text: lang === 'ar' ? 'منتج أصلي 100%' : '100% authentic product' },
                { icon: 'bank', text: lang === 'ar' ? 'دفع بالدينار العراقي' : 'Pay in Iraqi dinar' },
              ] as const).map((item) => (
                <div key={item.text} className="flex items-center gap-2 rounded-lg border border-border bg-bg-surface px-3 py-2.5 text-xs text-text-secondary">
                  <Icon name={item.icon} size={16} className="text-accent shrink-0" /> {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs: Description / Specs / Reviews ── */}
        <ProductTabs
          product={product}
          description={description}
          specEntries={specEntries}
          reviews={reviews}
          avgRating={avgRating}
          t={t}
          lang={lang}
        />

        {/* Related / alternatives */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-5 font-[family-name:var(--font-display)]">{t('product.relatedProducts')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      {/* Spacer so the sticky bar never covers content on mobile */}
      <div className="h-24 lg:hidden" />

      {/* Mobile sticky add-to-cart bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-bg-surface/95 backdrop-blur px-4 py-3 flex items-center gap-3" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="ltr-nums shrink-0">
          <div className="text-lg font-bold text-text-primary font-[family-name:var(--font-display)]">{formatPrice(activePrice)}</div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={activeStock === 0 || adding}
          className="btn-accent flex-1 py-3 min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Icon name="cart" size={18} />
          {activeStock === 0 ? t('common.outOfStock') : t('common.addToCart')}
        </button>
      </div>
    </div>
  );
}

// Ordered spec list driven by device kind. Returns [{ label, value }].
function buildSpecEntries(product: Product, t: (k: string) => string): Array<{ label: string; value: string }> {
  const specs = product.specs;
  if (!specs) return [];
  const kind = product.category?.kind;
  const order: Record<string, string[]> = {
    PHONE: ['screen', 'chip', 'camera', 'battery', 'os'],
    LAPTOP: ['cpu', 'ram', 'storage', 'gpu', 'screen', 'battery'],
    TABLET: ['screen', 'chip', 'storage', 'battery', 'os'],
    HEADPHONE: ['type', 'anc', 'batteryLife', 'connectivity'],
  };
  const keys = kind && order[kind] ? order[kind] : Object.keys(specs);
  const seen = new Set(keys);
  // append any extra spec keys not in the canonical order
  const allKeys = [...keys, ...Object.keys(specs).filter((k) => !seen.has(k))];
  return allKeys
    .map((k) => {
      const value = specs[k];
      if (!value) return null;
      const label = t(`specs.${k}`) !== `specs.${k}` ? t(`specs.${k}`) : k;
      return { label, value };
    })
    .filter((x): x is { label: string; value: string } => x !== null);
}

// ── Tabs (Description / Specifications / Reviews) ──
function ProductTabs({
  product,
  description,
  specEntries,
  reviews,
  avgRating,
  t,
  lang,
}: {
  product: Product;
  description: string;
  specEntries: Array<{ label: string; value: string }>;
  reviews: ReviewLite[];
  avgRating: number;
  t: (k: string) => string;
  lang: string;
}) {
  const tabs = [
    { id: 'description' as const, label: t('product.description') },
    { id: 'specs' as const, label: t('product.specs') },
    { id: 'reviews' as const, label: t('product.reviews') },
  ];
  const [active, setActive] = useState<'description' | 'specs' | 'reviews'>('description');

  return (
    <div id="reviews" className="mt-12 border-t border-border pt-6">
      <div className="flex gap-1 border-b border-border mb-5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${active === tab.id ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
          >
            {tab.label}{tab.id === 'reviews' && reviews.length > 0 ? ` (${reviews.length})` : ''}
          </button>
        ))}
      </div>

      {active === 'description' && (
        <p className="text-text-secondary leading-relaxed text-sm sm:text-base max-w-3xl whitespace-pre-line">{description}</p>
      )}

      {active === 'specs' && (
        specEntries.length > 0 ? (
          <div className="max-w-3xl overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {specEntries.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-elevated'}>
                    <th scope="row" className="text-start font-medium text-text-secondary px-4 py-3 w-2/5 align-top">{row.label}</th>
                    <td className="text-text-primary px-4 py-3">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-muted text-sm">{product.description}</p>
        )
      )}

      {active === 'reviews' && (
        <div className="max-w-3xl">
          {avgRating > 0 && (
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl font-bold text-text-primary ltr-nums">{avgRating.toFixed(1)}</span>
              <div>
                <Stars value={avgRating} size={16} />
                {reviews.length > 0 && (
                  <p className="text-text-muted text-xs mt-0.5">{t('product.basedOnN').replace('{n}', String(reviews.length))}</p>
                )}
              </div>
            </div>
          )}
          {reviews.length === 0 ? (
            <p className="text-text-muted text-sm">{t('product.noReviews')}</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-xl border border-border bg-bg-surface p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-text-primary text-sm">{r.authorName || (lang === 'ar' ? 'عميل' : 'Customer')}</span>
                    <Stars value={r.rating} size={13} />
                  </div>
                  <p className="text-[11px] text-accent mb-2">{t('product.verifiedBuyer')}</p>
                  {r.comment && <p className="text-text-secondary text-sm leading-relaxed">{r.comment}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
