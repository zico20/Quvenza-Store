'use client';

import { useState, useEffect, useRef, useId } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { storeConfig } from '@/config/store.config';
import { useLang } from '@/hooks/useLang';
import { useCurrency } from '@/hooks/useCurrency';
import CategoriesMenu from './header/CategoriesMenu';
import CategoryChips from './header/CategoryChips';
import MobileDrawer from './header/MobileDrawer';
import SearchOverlay from './header/SearchOverlay';
import type { NavData } from './header/types';

interface HeaderProps {
  navData: NavData;
}

export default function Header({ navData }: HeaderProps) {
  const pathname = usePathname();
  const { items, toggleDrawer } = useCartStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { t, lang, toggleLang } = useLang();
  const { currency, toggleCurrency } = useCurrency();

  const [stuck, setStuck] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const catWrapRef = useRef<HTMLDivElement>(null);
  const catTriggerId = useId();
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const mainLinks = [
    { label: t('nav.store'),   href: '/products' },
    { label: t('brand.title'), href: '/brands' },
    { label: t('nav.offers'),  href: '/products?tag=sale' },
    { label: t('nav.support'), href: '/contact' },
  ];

  // Sticky compaction on scroll
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mega-menu on outside click / Escape / route change
  useEffect(() => {
    if (!catOpen) return;
    function onDoc(e: MouseEvent) {
      if (catWrapRef.current && !catWrapRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [catOpen]);
  useEffect(() => { setCatOpen(false); setMobileOpen(false); }, [pathname]);

  function openOnHover() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setCatOpen(true);
  }
  function closeOnLeave() {
    hoverTimer.current = setTimeout(() => setCatOpen(false), 120);
  }

  const Logo = ({ size = 34, font = 20 }: { size?: number; font?: number }) => (
    <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label={storeConfig.name}>
      <span
        className="grid shrink-0 place-items-center rounded-[10px] font-[family-name:var(--font-display)] font-bold text-white"
        style={{ width: size, height: size, fontSize: font * 0.8, background: 'linear-gradient(135deg,#2563EB,#3B82F6)', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
      >
        {storeConfig.name.charAt(0).toUpperCase()}
      </span>
      <span className="font-[family-name:var(--font-display)] font-bold tracking-tight text-text-primary" style={{ fontSize: font }}>
        {storeConfig.name}
      </span>
    </Link>
  );

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-bg-surface/90 backdrop-blur transition-shadow"
        style={{
          borderBottom: '1px solid var(--color-border)',
          boxShadow: stuck ? '0 1px 12px rgba(16,24,40,0.06)' : 'none',
        }}
      >
        {/* Announcement bar (hidden once stuck, to compact) */}
        {!stuck && (
          <div className="overflow-hidden border-b border-border bg-bg-base px-4 py-1.5 text-center">
            <p className="mono truncate text-[11px] tracking-wide text-text-secondary">{t('announce.bar')}</p>
          </div>
        )}

        {/* ════ DESKTOP TOP BAR (md+) ════ */}
        <div
          className="hidden md:flex mx-auto max-w-[1280px] items-center gap-6 px-6 lg:px-8 transition-[padding]"
          style={{ paddingBlock: stuck ? 10 : 14 }}
        >
          <Logo size={stuck ? 30 : 34} font={stuck ? 18 : 20} />

          {/* Categories trigger + mega-menu */}
          <div
            ref={catWrapRef}
            className="relative"
            onMouseEnter={openOnHover}
            onMouseLeave={closeOnLeave}
          >
            <button
              id={catTriggerId}
              onClick={() => setCatOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={catOpen}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary aria-expanded:bg-bg-elevated aria-expanded:text-text-primary"
            >
              <Icon name="grid" size={16} />
              {t('nav.categoriesMenu')}
              <Icon name="chevron" size={14} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            <CategoriesMenu data={navData} open={catOpen} onClose={() => setCatOpen(false)} triggerId={catTriggerId} />
          </div>

          {/* Main links */}
          <nav className="flex items-center gap-1" aria-label="Primary">
            {mainLinks.map((item) => {
              const active = pathname === item.href.split('?')[0] && !item.href.includes('?');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-bg-elevated"
                  style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Trailing actions */}
          <div className="flex items-center gap-1" style={{ marginInlineStart: 'auto' }}>
            <button onClick={() => setSearchOpen(true)} className="nav-icon-btn" aria-label={t('nav.openSearch')}>
              <Icon name="search" size={19} />
            </button>
            <Link href="/account/wishlist" className="nav-icon-btn relative" aria-label={t('nav.wishlist')}>
              <Icon name="heart" size={19} />
              {wishlistCount > 0 && <span className="badge-dot">{wishlistCount}</span>}
            </Link>
            <Link href="/account" className="nav-icon-btn" aria-label={t('nav.account')}>
              <Icon name="user" size={19} />
            </Link>
            <button onClick={toggleDrawer} className="nav-icon-btn relative" aria-label={t('nav.cart')}>
              <Icon name="cart" size={19} />
              {cartCount > 0 && <span className="badge-dot">{cartCount}</span>}
            </button>
            <span className="mx-1 h-5 w-px bg-border" />
            <button
              onClick={toggleCurrency}
              className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-bold text-accent transition-colors hover:bg-bg-elevated"
              aria-label="Toggle currency"
              title={currency === 'IQD' ? 'USD' : 'IQD'}
            >
              {currency === 'IQD' ? '$' : 'IQD'}
            </button>
            <button
              onClick={toggleLang}
              className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-bold text-text-primary transition-colors hover:bg-bg-elevated"
              aria-label="Toggle language"
            >
              {lang === 'en' ? 'ع' : 'EN'}
            </button>
          </div>
        </div>

        {/* ════ MOBILE TOP BAR (< md) ════ */}
        <div className="md:hidden flex items-center justify-between px-4 py-3">
          <button onClick={() => setMobileOpen(true)} className="nav-icon-btn" aria-label={t('nav.openMenu')}>
            <Icon name="menu" size={22} />
          </button>
          <Logo size={28} font={17} />
          <div className="flex items-center gap-0.5">
            <button onClick={() => setSearchOpen(true)} className="nav-icon-btn" aria-label={t('nav.openSearch')}>
              <Icon name="search" size={20} />
            </button>
            <button onClick={toggleDrawer} className="nav-icon-btn relative" aria-label={t('nav.cart')}>
              <Icon name="cart" size={20} />
              {cartCount > 0 && <span className="badge-dot">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Mobile device-type chips */}
        <CategoryChips data={navData} />
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} mainLinks={mainLinks} navData={navData} />
    </>
  );
}
