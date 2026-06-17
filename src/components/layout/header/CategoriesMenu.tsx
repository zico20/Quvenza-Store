'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/hooks/useLang';
import { localizedName, deviceKindLabel } from '@/lib/i18n';
import { deviceKindIcon } from './categoryIcons';
import type { NavData } from './types';

interface Props {
  data: NavData;
  open: boolean;
  onClose: () => void;
  /** id of the trigger button, for aria-labelledby */
  triggerId: string;
}

/**
 * Desktop mega-menu with TWO browse modes side by side:
 *  - Left: by device type (cross-brand "All Phones / Laptops / …")
 *  - Right: by brand (Apple, Samsung, …)
 * Opens from the "Categories" trigger; closes on outside-click / Escape.
 */
export default function CategoriesMenu({ data, open, onClose, triggerId }: Props) {
  const { t, lang } = useLang();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLAnchorElement>('a[data-nav-item]');
    first?.focus();
  }, [open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
  }

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-labelledby={triggerId}
      onKeyDown={onKeyDown}
      className="absolute top-full z-50 mt-2 w-[min(760px,calc(100vw-2rem))] animate-[slideIn_.18s_cubic-bezier(.16,1,.3,1)]"
      style={{ insetInlineStart: 0 }}
    >
      <div className="rounded-2xl border border-border bg-bg-surface p-5 shadow-[0_14px_36px_rgba(16,24,40,0.12)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* ── Browse by device type ── */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('brand.deviceTypes')}</span>
              <Link href="/products" onClick={onClose} className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
                {t('nav.browseAll')}<Icon name="arrow" size={13} className="rtl-flip" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {data.kinds.map(({ kind, count }) => (
                <Link
                  key={kind}
                  href={`/products?kind=${kind}`}
                  onClick={onClose}
                  role="menuitem"
                  data-nav-item
                  className="group flex items-center gap-3 rounded-xl border border-border bg-bg-base p-3 transition-all hover:border-border-strong hover:bg-bg-surface focus-visible:border-accent"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-subtle text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    <Icon name={deviceKindIcon(kind)} size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-text-primary">{deviceKindLabel(kind, lang)}</span>
                    <span className="block text-xs text-text-muted ltr-nums">{count} {t('nav.items')}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Browse by brand ── */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('brand.shopBy')}</span>
              <Link href="/brands" onClick={onClose} className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
                {t('brand.allBrands')}<Icon name="arrow" size={13} className="rtl-flip" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {data.brands.slice(0, 10).map((b) => (
                <Link
                  key={b.id}
                  href={`/brands/${b.slug}`}
                  onClick={onClose}
                  role="menuitem"
                  data-nav-item
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary focus-visible:bg-bg-elevated"
                >
                  <span className="truncate">{localizedName(b.name, b.nameAr, lang)}</span>
                  {typeof b.count === 'number' && <span className="text-xs text-text-muted ltr-nums">{b.count}</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
