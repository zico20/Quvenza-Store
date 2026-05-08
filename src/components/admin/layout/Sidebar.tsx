'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Tag, Users, Bell, LogOut, Settings2 } from 'lucide-react';
import { useAdminAuthStore } from '@/store/admin/auth.store';
import { adminAuth } from '@/lib/admin/api';
import { adminConfig } from '@/config/admin.config';
import { useLang } from '@/hooks/useLang';

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout, user } = useAdminAuthStore();
  const { t } = useLang();

  const navItems = [
    { href: '/admin/dashboard',               label: t('nav.overview'),      icon: LayoutDashboard },
    { href: '/admin/dashboard/orders',        label: t('nav.orders'),        icon: ShoppingBag },
    { href: '/admin/dashboard/products',      label: t('nav.products'),      icon: Package },
    { href: '/admin/dashboard/categories',    label: t('nav.categories'),    icon: Tag },
    { href: '/admin/dashboard/customers',     label: t('nav.customers'),     icon: Users },
    { href: '/admin/dashboard/notifications', label: t('nav.notifications'), icon: Bell },
    { href: '/admin/dashboard/settings', label: t('nav.settings'), icon: Settings2 },
  ];

  async function handleLogout() {
    try { await adminAuth.logout(); } finally { logout(); router.push('/admin/login'); }
  }

  return (
    <aside className="w-60 bg-bg-surface border-r border-border min-h-screen flex flex-col shrink-0">
      {/* Brand header */}
      <div className="px-5 py-6 border-b border-border">
        <div className="mono" style={{ fontSize: 10, color: '#6b6b70', marginBottom: 6 }}>
          ADMIN PANEL
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#f5f5f4', letterSpacing: '-0.01em' }}>
          {adminConfig.storeName}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 5,
                background: active ? '#1f1f23' : 'transparent',
                color: active ? '#f5f5f4' : '#a1a1a6',
                borderLeft: `2px solid ${active ? '#ff6a2b' : 'transparent'}`,
                textDecoration: 'none', fontSize: 13,
                fontWeight: active ? 600 : 500,
                transition: 'all 0.15s',
              }}
              className={active ? '' : 'hover:text-text-primary hover:bg-bg-elevated'}
            >
              <Icon size={16} strokeWidth={1.6} style={{ flexShrink: 0 }} />
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
              background: 'rgba(255,106,43,0.14)', color: '#ff6a2b',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-text-muted text-xs truncate">{user.name}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-error hover:bg-bg-elevated w-full transition-colors duration-150"
          style={{ fontFamily: 'inherit' }}
        >
          <LogOut size={16} strokeWidth={1.6} style={{ flexShrink: 0 }} />
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}
