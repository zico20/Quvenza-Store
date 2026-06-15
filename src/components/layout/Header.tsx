'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { storeConfig } from '@/config/store.config';
import { useLang } from '@/hooks/useLang';
import { useCurrency } from '@/hooks/useCurrency';
import { getCategoryName } from '@/lib/i18n';

interface NavCategory {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  navCategories: NavCategory[];
}

export default function Header({ navCategories }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { items, toggleDrawer } = useCartStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, lang, isRTL, toggleLang } = useLang();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);
  const { currency, toggleCurrency } = useCurrency();

  const STATIC_NAV = [
    { label: t('nav.shop'),    href: '/products' },
    { label: t('nav.deals'),   href: '/products?tag=sale' },
    { label: t('nav.support'), href: '/account' },
  ];

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  }

  const visibleCats = navCategories.slice(0, 6);

  const langBtn = (
    <button
      onClick={toggleLang}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '5px 9px', borderRadius: 4,
        border: '1px solid #26262E', background: 'transparent',
        color: '#F7F7F8', cursor: 'pointer',
        fontSize: 12, fontWeight: 700,
        fontFamily: lang === 'ar' ? 'Cairo, sans-serif' : 'JetBrains Mono, monospace',
        letterSpacing: lang === 'ar' ? 0 : '0.05em',
      }}
      aria-label="Toggle language"
    >
      {lang === 'en' ? 'ع' : 'EN'}
    </button>
  );

  const currencyBtn = (
    <button
      onClick={toggleCurrency}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '5px 9px', borderRadius: 4,
        border: '1px solid #26262E', background: 'transparent',
        color: '#FF7A33', cursor: 'pointer',
        fontSize: 11, fontWeight: 700,
        fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '0.05em',
      }}
      aria-label="Toggle currency"
      title={currency === 'IQD' ? 'Switch to USD' : 'التحويل إلى دينار'}
    >
      {currency === 'IQD' ? '$' : 'IQD'}
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-50" style={{ background: '#0A0A0Cf0', backdropFilter: 'blur(12px)', borderBottom: '1px solid #26262E' }}>

        {/* Announcement bar — overflow hidden to prevent horizontal scroll */}
        <div className="overflow-hidden" style={{ borderBottom: '1px solid #26262E', padding: '7px 16px', textAlign: 'center' }}>
          <p className="mono text-[11px] truncate" style={{ color: '#A6A6AE', letterSpacing: '0.06em' }}>
            {t('announce.bar')}
          </p>
        </div>

        {/* ── MOBILE HEADER (< md): 2 rows ── */}
        <div className="md:hidden px-4 pt-3 pb-2.5">
          {/* Row 1: Brand + Cart + Lang + Menu */}
          <div className="flex items-center justify-between mb-2.5">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <span style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                background: 'linear-gradient(135deg,#FF7A33,#FF5C1A)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#0A0A0C',
                boxShadow: '0 0 16px rgba(255,122,51,0.45)',
              }}>{storeConfig.name.charAt(0).toUpperCase()}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: '#F7F7F8' }}>
                {storeConfig.name}
              </span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={toggleDrawer}
                className="nav-icon-btn"
                style={{ border: 'none', cursor: 'pointer', position: 'relative' }}
                aria-label="Cart"
              >
                <Icon name="cart" size={18} stroke={1.6} />
                {cartCount > 0 && <span className="badge-dot">{cartCount}</span>}
              </button>
              {currencyBtn}
              {langBtn}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 4, color: '#F7F7F8', background: 'transparent', border: 'none', cursor: 'pointer' }}
                aria-label="Menu"
              >
                {mobileOpen ? <Icon name="x" size={20} /> : <Icon name="menu" size={20} />}
              </button>
            </div>
          </div>
          {/* Row 2: Search — full width */}
          <form
            onSubmit={handleSearch}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: '#121216', border: '1px solid #26262E', borderRadius: 4 }}
          >
            <Icon name="search" size={15} stroke={1.6} style={{ color: '#6C6C76', flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('common.search')}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F7F7F8', fontSize: 13, fontFamily: 'inherit', minWidth: 0 }}
            />
          </form>
        </div>

        {/* ── DESKTOP HEADER (md+): single 3-column row ── */}
        <div
          className="hidden md:grid max-w-[1440px] mx-auto items-center px-8 py-4 gap-8"
          style={{ gridTemplateColumns: 'auto 1fr auto' }}
        >
          {/* Brand */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg,#FF7A33,#FF5C1A)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#0A0A0C',
              boxShadow: '0 0 18px rgba(255,122,51,0.45)',
            }}>{storeConfig.name.charAt(0).toUpperCase()}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: '#F7F7F8' }}>
              {storeConfig.name}
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#121216', border: '1px solid #26262E', borderRadius: 4, color: '#A6A6AE' }}>
            <Icon name="search" size={16} stroke={1.6} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('common.search')}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F7F7F8', fontSize: 13, fontFamily: 'inherit' }}
            />
            <kbd className="mono" style={{ fontSize: 10, padding: '2px 6px', border: '1px solid #26262E', borderRadius: 3, color: '#6C6C76' }}>⌘ K</kbd>
          </form>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href="/account" className="nav-icon-btn" aria-label="Wishlist" style={{ position: 'relative' }}>
              <Icon name="heart" size={18} stroke={1.6} />
              {wishlistCount > 0 && <span className="badge-dot">{wishlistCount}</span>}
            </Link>
            <Link href="/account" className="nav-icon-btn" aria-label="Account">
              <Icon name="user" size={18} stroke={1.6} />
            </Link>
            <button onClick={toggleDrawer} className="nav-icon-btn" style={{ border: 'none', cursor: 'pointer', position: 'relative' }}>
              <Icon name="cart" size={18} stroke={1.6} />
              {cartCount > 0 && <span className="badge-dot">{cartCount}</span>}
            </button>
            {currencyBtn}
            {langBtn}
          </div>
        </div>

        {/* Category nav — desktop only */}
        <div className="hidden md:flex max-w-[1440px] mx-auto px-8 pb-3 gap-6 items-center" style={{ fontSize: 13 }}>
          {STATIC_NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-cat-link"
              style={{ color: pathname === item.href ? '#F7F7F8' : '#A6A6AE', fontWeight: pathname === item.href ? 600 : 400 }}
            >
              {item.label}
            </Link>
          ))}
          {visibleCats.length > 0 && (
            <span style={{ width: 1, height: 12, background: '#26262E', flexShrink: 0 }} />
          )}
          {visibleCats.map(cat => {
            const href = `/category/${cat.slug}`;
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={cat.id}
                href={href}
                className="nav-cat-link"
                style={{ color: active ? '#F7F7F8' : '#A6A6AE', fontWeight: active ? 600 : 400 }}
              >
                {getCategoryName(cat.slug, cat.name, lang)}
              </Link>
            );
          })}
          {visibleCats.length > 0 && (
            <Link href="/products" className="nav-cat-link mono" style={{ color: '#6C6C76', fontSize: 11, letterSpacing: '0.1em', marginLeft: 4 }}>
              {isRTL ? '← الكل' : 'All →'}
            </Link>
          )}
        </div>

      </header>

      {/* ── MOBILE DRAWER — fixed full-screen overlay ── */}
      {mobileOpen && (
        <div className="md:hidden" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          {/* Backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)' }}
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, right: 0,
            width: '100%', maxWidth: 340,
            background: '#121216',
            borderLeft: '1px solid #26262E',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
            zIndex: 10000,
          }}>
            {/* Drawer header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #26262E', flexShrink: 0 }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'baseline', gap: 5, textDecoration: 'none' }}>
                <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: '#F7F7F8' }}>{storeConfig.name}</span>
                <span className="mono" style={{ fontSize: 9, color: '#FF7A33', letterSpacing: '0.15em' }}>store</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ padding: 6, color: '#6C6C76', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4 }}
                aria-label="Close menu"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            {/* Account shortcuts */}
            <div style={{ display: 'flex', gap: 8, padding: '16px 20px', borderBottom: '1px solid #26262E' }}>
              <Link href="/account" onClick={() => setMobileOpen(false)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '10px 12px', background: '#1A1A20', borderRadius: 6,
                color: '#A6A6AE', textDecoration: 'none', fontSize: 13, fontWeight: 500,
              }}>
                <Icon name="user" size={14} stroke={1.6} /> {t('nav.account')}
              </Link>
              <Link href="/account" onClick={() => setMobileOpen(false)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '10px 12px', background: '#1A1A20', borderRadius: 6,
                color: '#A6A6AE', textDecoration: 'none', fontSize: 13, fontWeight: 500, position: 'relative',
              }}>
                <Icon name="heart" size={14} stroke={1.6} /> {t('nav.wishlist')}
                {wishlistCount > 0 && (
                  <span style={{ position: 'absolute', top: 6, right: 8, background: '#FF7A33', color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 5px', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.4 }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Main nav links */}
            <div style={{ padding: '8px 0', borderBottom: '1px solid #26262E' }}>
              {STATIC_NAV.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
                  display: 'flex', alignItems: 'center',
                  padding: '14px 20px',
                  color: pathname === item.href ? '#F7F7F8' : '#A6A6AE',
                  textDecoration: 'none', fontSize: 16, fontWeight: pathname === item.href ? 600 : 400,
                  borderBottom: '1px solid #1A1A20',
                  transition: 'color 0.15s',
                  borderRight: pathname === item.href ? '3px solid #FF7A33' : '3px solid transparent',
                }}>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Categories */}
            {visibleCats.length > 0 && (
              <div style={{ padding: '8px 0', flex: 1 }}>
                <div className="mono" style={{ fontSize: 10, color: '#6C6C76', padding: '12px 20px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {t('nav.categories')}
                </div>
                {visibleCats.map(cat => {
                  const href = `/category/${cat.slug}`;
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link key={cat.id} href={href} onClick={() => setMobileOpen(false)} style={{
                      display: 'flex', alignItems: 'center',
                      padding: '12px 20px',
                      color: active ? '#F7F7F8' : '#A6A6AE',
                      textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 400,
                      borderBottom: '1px solid #1A1A20',
                      borderRight: active ? '3px solid #FF7A33' : '3px solid transparent',
                      transition: 'color 0.15s',
                    }}>
                      {getCategoryName(cat.slug, cat.name, lang)}
                    </Link>
                  );
                })}
                <Link href="/products" onClick={() => setMobileOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '13px 20px',
                  color: '#FF7A33', textDecoration: 'none', fontSize: 13, fontWeight: 600,
                }}>
                  {isRTL ? '← جميع المنتجات' : 'All Products →'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
