'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/hooks/useLang';
import { localizedName, deviceKindLabel } from '@/lib/i18n';
import { deviceKindIcon } from './categoryIcons';
import type { NavData } from './types';

interface MainLink { label: string; href: string }

interface Props {
  open: boolean;
  onClose: () => void;
  mainLinks: MainLink[];
  navData: NavData;
}

/** Mobile slide-out drawer: main links + account shortcuts + language switch.
 *  Focus-trapped, Escape-closable, mirrors to the leading edge under RTL. */
export default function MobileDrawer({ open, onClose, mainLinks, navData }: Props) {
  const { t, lang, isRTL, toggleLang } = useLang();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock scroll + focus first item + Escape + focus trap while open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const panel = panelRef.current;
    const focusables = () => Array.from(
      panel?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])') ?? [],
    );
    focusables()[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (f.length === 0) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-[9999]" role="dialog" aria-modal="true" aria-label={t('nav.menuLabel')}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={panelRef}
        className="absolute inset-y-0 w-[85%] max-w-[340px] bg-bg-surface flex flex-col animate-[slideIn_.22s_cubic-bezier(.16,1,.3,1)]"
        style={{
          insetInlineStart: 0,
          borderInlineEnd: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-[family-name:var(--font-display)] text-base font-bold text-text-primary">{t('nav.menuLabel')}</span>
          <button onClick={onClose} aria-label={t('nav.closeMenu')} className="grid h-9 w-9 place-items-center rounded-lg text-text-muted hover:bg-bg-elevated hover:text-text-primary">
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Account shortcuts */}
        <div className="flex gap-2 px-5 py-4 border-b border-border">
          <Link href="/account" onClick={onClose} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-bg-elevated px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary">
            <Icon name="user" size={16} /> {t('nav.account')}
          </Link>
          <Link href="/account/wishlist" onClick={onClose} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-bg-elevated px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary">
            <Icon name="heart" size={16} /> {t('nav.wishlist')}
          </Link>
        </div>

        {/* Main links + browse-by sections */}
        <nav className="flex-1 overflow-y-auto py-2">
          {mainLinks.map((item) => {
            const active = pathname === item.href.split('?')[0];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between px-5 py-3.5 text-[15px] font-medium border-b border-bg-elevated transition-colors"
                style={{
                  color: active ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  borderInlineStart: active ? '3px solid var(--color-accent)' : '3px solid transparent',
                }}
              >
                {item.label}
                <Icon name="chevron" size={16} className="rtl-flip -rotate-90 text-text-muted" />
              </Link>
            );
          })}

          {/* Browse by device type */}
          {navData.kinds.length > 0 && (
            <div className="px-5 pt-5 pb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5">{t('brand.deviceTypes')}</p>
              <div className="grid grid-cols-2 gap-2">
                {navData.kinds.map(({ kind }) => (
                  <Link
                    key={kind}
                    href={`/products?kind=${kind}`}
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-lg bg-bg-elevated px-3 py-2.5 text-sm font-medium text-text-secondary"
                  >
                    <Icon name={deviceKindIcon(kind)} size={16} className="text-accent" />
                    {deviceKindLabel(kind, lang)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Browse by brand */}
          {navData.brands.length > 0 && (
            <div className="px-5 pt-3 pb-4">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{t('brand.shopBy')}</p>
                <Link href="/brands" onClick={onClose} className="text-xs font-semibold text-accent">{t('brand.allBrands')}</Link>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {navData.brands.slice(0, 10).map((b) => (
                  <Link
                    key={b.id}
                    href={`/brands/${b.slug}`}
                    onClick={onClose}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-text-secondary"
                  >
                    {localizedName(b.name, b.nameAr, lang)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Language switch */}
        <div className="border-t border-border p-4">
          <button
            onClick={() => { toggleLang(); }}
            className="flex w-full items-center justify-between rounded-lg border border-border-strong px-4 py-3 text-sm font-semibold text-text-primary hover:bg-bg-elevated"
          >
            <span className="inline-flex items-center gap-2">
              <Icon name="info" size={16} className="text-text-muted" />
              {lang === 'ar' ? 'اللغة' : 'Language'}
            </span>
            <span className="rounded-md bg-accent-subtle px-2.5 py-1 text-xs font-bold text-accent">
              {lang === 'en' ? 'العربية' : 'English'}
            </span>
          </button>
          {isRTL ? null : null}
        </div>
      </div>
    </div>
  );
}
