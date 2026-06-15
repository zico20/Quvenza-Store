'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useAdminAuthStore } from '@/store/admin/auth.store';
import { adminAuth } from '@/lib/admin/api';
import { adminConfig } from '@/config/admin.config';
import { useLang } from '@/hooks/admin/useLang';

interface SidebarProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export default function Sidebar({ onClose, showCloseButton = false }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout, user } = useAdminAuthStore();
  const { t, isRTL } = useLang();

  const navItems: { href: string; label: string; icon: IconName }[] = [
    { href: '/admin/dashboard',               label: t('nav.overview'),      icon: 'dashboard' },
    { href: '/admin/dashboard/orders',        label: t('nav.orders'),        icon: 'cart' },
    { href: '/admin/dashboard/products',      label: t('nav.products'),      icon: 'package' },
    { href: '/admin/dashboard/categories',    label: t('nav.categories'),    icon: 'tag' },
    { href: '/admin/dashboard/customers',     label: t('nav.customers'),     icon: 'user' },
    { href: '/admin/dashboard/notifications', label: t('nav.notifications'), icon: 'bell' },
    { href: '/admin/dashboard/settings',      label: t('nav.settings'),      icon: 'settings' },
  ];

  async function handleLogout() {
    try { await adminAuth.logout(); } finally { logout(); router.push('/admin/login'); }
  }

  return (
    <aside className={`
      h-full w-60 bg-bg-surface flex flex-col relative
      ${isRTL ? 'border-l border-border' : 'border-r border-border'}
    `}>
      {/* Mobile close button */}
      {showCloseButton && (
        <button
          onClick={onClose}
          className={`absolute top-4 p-1 text-text-muted hover:text-text-primary ${isRTL ? 'left-4' : 'right-4'}`}
          aria-label="Close menu"
        >
          <Icon name="x" className="h-5 w-5" />
        </button>
      )}

      {/* Brand header */}
      <div className="px-5 py-6 border-b border-border">
        <div className="mono" style={{ fontSize: 10, color: '#9097A1', marginBottom: 10 }}>
          ADMIN PANEL
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 30, height: 30, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#F7F8FA',
            boxShadow: '0 0 16px rgba(37,99,235,0.45)',
          }}>{adminConfig.storeName.charAt(0).toUpperCase()}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
            {adminConfig.storeName}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 5,
                background: active ? '#F3F4F6' : 'transparent',
                color: active ? '#111827' : '#4B5563',
                borderInlineStart: `2px solid ${active ? '#2563EB' : 'transparent'}`,
                textDecoration: 'none', fontSize: 13,
                fontWeight: active ? 600 : 500,
                transition: 'all 0.15s',
              }}
              className={active ? '' : 'hover:text-text-primary hover:bg-bg-elevated'}
            >
              <Icon name={icon} size={16} stroke={1.6} style={{ flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer: user + logout */}
      <div className="p-3 border-t border-border">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-0.5">
            <div style={{
              width: 28, height: 28, borderRadius: 14, flexShrink: 0,
              background: 'rgba(37,99,235,0.14)', color: '#2563EB',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
            }}>
              {(user.name || '?').charAt(0).toUpperCase()}
            </div>
            <span className="text-text-muted text-xs truncate">{user.name}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-error hover:bg-bg-elevated w-full transition-colors duration-150"
          style={{ fontFamily: 'inherit' }}
        >
          <Icon name="logout" size={16} stroke={1.6} style={{ flexShrink: 0 }} />
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}
