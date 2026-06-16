'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/hooks/useLang';
import { getCategoryName } from '@/lib/i18n';
import { categoryIcon } from './categoryIcons';
import type { NavCategory } from './types';

interface Props {
  categories: NavCategory[];
  open: boolean;
  onClose: () => void;
  /** id of the trigger button, for aria-labelledby */
  triggerId: string;
}

/**
 * Desktop Categories mega-menu. A responsive grid of neutral category cards.
 * Opens from the "Categories" trigger; closes on outside-click / Escape.
 * Keyboard: arrow keys move between cards, Escape closes & returns focus.
 */
export default function CategoriesMenu({ categories, open, onClose, triggerId }: Props) {
  const { t, lang } = useLang();
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus the first card when opened (keyboard users land inside the menu)
  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLAnchorElement>('a[data-cat-card]');
    first?.focus();
  }, [open]);

  // Arrow-key roving focus across the grid
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    const cards = Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>('a[data-cat-card]') ?? []);
    const idx = cards.findIndex((c) => c === document.activeElement);
    if (idx === -1) return;
    e.preventDefault();
    const cols = 3;
    let next = idx;
    if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = cards.length - 1;
    else if (e.key === 'ArrowDown') next = Math.min(idx + cols, cards.length - 1);
    else if (e.key === 'ArrowUp') next = Math.max(idx - cols, 0);
    else {
      // Right/Left are reading-direction aware
      const fwd = lang === 'ar' ? 'ArrowLeft' : 'ArrowRight';
      next = e.key === fwd ? Math.min(idx + 1, cards.length - 1) : Math.max(idx - 1, 0);
    }
    cards[next]?.focus();
  }

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-labelledby={triggerId}
      onKeyDown={onKeyDown}
      className="absolute top-full z-50 mt-2 w-[min(680px,calc(100vw-2rem))] animate-[slideIn_.18s_cubic-bezier(.16,1,.3,1)]"
      style={{ insetInlineStart: 0 }}
    >
      <div className="rounded-2xl border border-border bg-bg-surface p-4 shadow-[0_14px_36px_rgba(16,24,40,0.12)]">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{t('nav.categoriesMenu')}</span>
          <Link href="/products" onClick={onClose} className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
            {t('nav.browseAll')}
            <Icon name="arrow" size={14} className="rtl-flip" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              onClick={onClose}
              role="menuitem"
              data-cat-card
              className="group flex items-center gap-3 rounded-xl border border-border bg-bg-base p-3 transition-all hover:border-border-strong hover:bg-bg-surface focus-visible:border-accent focus-visible:bg-bg-surface"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-subtle text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <Icon name={categoryIcon(cat.slug)} size={20} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-text-primary">
                  {getCategoryName(cat.slug, cat.name, lang)}
                </span>
                {typeof cat.count === 'number' && (
                  <span className="block text-xs text-text-muted ltr-nums">
                    {cat.count} {t('nav.items')}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
