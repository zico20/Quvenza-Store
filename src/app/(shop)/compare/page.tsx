'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { useCompareStore } from '@/store/compare.store';
import { useCartStore } from '@/store/cart.store';
import { useLang } from '@/hooks/useLang';
import { useCurrency } from '@/hooks/useCurrency';
import { localizedName } from '@/lib/i18n';
import { showToast } from '@/lib/toast';
import type { Product } from '@/types';

// Ordered spec keys per device kind (mirrors product detail).
const SPEC_ORDER: Record<string, string[]> = {
  PHONE: ['screen', 'chip', 'camera', 'battery', 'os'],
  LAPTOP: ['cpu', 'ram', 'storage', 'gpu', 'screen', 'battery'],
  TABLET: ['screen', 'chip', 'storage', 'battery', 'os'],
  HEADPHONE: ['type', 'anc', 'batteryLife', 'connectivity'],
};

export default function ComparePage() {
  const { t, lang } = useLang();
  const { formatPrice } = useCurrency();
  const items = useCompareStore((s) => s.items);
  const removeItem = useCompareStore((s) => s.removeItem);
  const clear = useCompareStore((s) => s.clear);
  const addToCart = useCartStore((s) => s.addItem);

  // Union of spec keys across all compared products, ordered by the kind of the first item.
  const specKeys = useMemo(() => {
    const keys: string[] = [];
    const seen = new Set<string>();
    const firstKind = items[0]?.category?.kind;
    const ordered = firstKind && SPEC_ORDER[firstKind] ? SPEC_ORDER[firstKind] : [];
    for (const k of ordered) { keys.push(k); seen.add(k); }
    for (const p of items) {
      for (const k of Object.keys(p.specs ?? {})) {
        if (!seen.has(k) && p.specs?.[k]) { keys.push(k); seen.add(k); }
      }
    }
    return keys;
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="text-text-muted mb-4"><Icon name="scale" size={48} stroke={1.4} /></div>
          <h1 className="text-xl font-bold text-text-primary mb-2">{t('compare.empty')}</h1>
          <p className="text-text-muted text-sm mb-6 max-w-sm">{t('compare.emptySub')}</p>
          <Link href="/products" className="btn-accent px-5 py-2.5">{t('compare.browse')}</Link>
        </div>
      </div>
    );
  }

  function handleAdd(p: Product) {
    const v = p.variants?.find((x) => x.isDefault) ?? p.variants?.[0];
    addToCart({ productId: p.id, product: p, quantity: 1, variantId: v?.id, variant: v });
    showToast(t('common.addedToCart'));
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">{t('compare.compareTitle')}</h1>
        <button onClick={clear} className="text-error text-sm hover:underline flex items-center gap-1.5">
          <Icon name="trash" size={15} /> {t('compare.clearAll')}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="w-36 bg-bg-elevated p-3 text-start text-text-muted text-xs uppercase tracking-wider align-bottom sticky inset-inline-start-0">{/* corner */}</th>
              {items.map((p) => {
                const name = localizedName(p.name, p.nameAr, lang);
                return (
                  <th key={p.id} className="p-4 bg-bg-surface border-s border-border align-top min-w-[180px]">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <button onClick={() => removeItem(p.id)} aria-label={t('compare.remove')} className="self-end text-text-muted hover:text-error -mt-1">
                        <Icon name="x" size={16} />
                      </button>
                      <Link href={`/products/${p.slug}`} className="block">
                        <div className="w-24 h-24 bg-bg-elevated rounded-xl overflow-hidden flex items-center justify-center mb-2">
                          {p.images?.[0] ? (
                            <Image src={p.images[0]} alt={name} width={96} height={96} className="w-full h-full object-contain p-2"
                              unoptimized={p.images[0].includes('placehold.co') || p.images[0].startsWith('http://localhost')} />
                          ) : <span className="text-2xl text-text-muted">{name[0]}</span>}
                        </div>
                        <span className="font-semibold text-text-primary leading-tight block hover:text-accent transition-colors">{name}</span>
                      </Link>
                      {p.brand && <span className="text-[11px] text-text-muted uppercase tracking-wide">{localizedName(p.brand.name, p.brand.nameAr, lang)}</span>}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* Price */}
            <CompareRow label={t('compare.price')} items={items}
              render={(p) => <span className="ltr-nums font-bold text-text-primary">{formatPrice(p.price)}</span>} />
            {/* Rating */}
            <CompareRow label={t('compare.rating')} items={items}
              render={(p) => (p.rating ? (
                <span className="inline-flex items-center gap-1 ltr-nums">
                  <Icon name="star" size={13} stroke={0} color="#F59E0B" /> {p.rating.toFixed(1)}
                </span>
              ) : <span className="text-text-muted">—</span>)} />
            {/* Specs */}
            {specKeys.map((key) => (
              <CompareRow
                key={key}
                label={t(`specs.${key}`) !== `specs.${key}` ? t(`specs.${key}`) : key}
                items={items}
                render={(p) => p.specs?.[key]
                  ? <span className="text-text-primary">{p.specs[key]}</span>
                  : <span className="text-text-muted">—</span>}
              />
            ))}
            {/* Add to cart */}
            <tr>
              <th scope="row" className="bg-bg-elevated p-3 text-start font-medium text-text-secondary align-middle">{/* action */}</th>
              {items.map((p) => (
                <td key={p.id} className="p-3 border-s border-border text-center bg-bg-surface">
                  <button onClick={() => handleAdd(p)} className="btn-accent w-full py-2 text-xs flex items-center justify-center gap-1.5">
                    <Icon name="cart" size={14} /> {t('compare.addToCart')}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Link href="/products" className="btn-secondary px-4 py-2 text-sm inline-flex items-center gap-2">
          <Icon name="plus" size={15} /> {t('compare.addMore')}
        </Link>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  items,
  render,
}: {
  label: string;
  items: Product[];
  render: (p: Product) => React.ReactNode;
}) {
  return (
    <tr className="border-t border-border">
      <th scope="row" className="bg-bg-elevated p-3 text-start font-medium text-text-secondary align-middle">{label}</th>
      {items.map((p) => (
        <td key={p.id} className="p-3 border-s border-border text-center align-middle bg-bg-surface">{render(p)}</td>
      ))}
    </tr>
  );
}
