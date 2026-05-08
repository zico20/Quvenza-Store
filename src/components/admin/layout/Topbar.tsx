'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useAdminAuthStore } from '@/store/admin/auth.store';
import { adminNotifications } from '@/lib/admin/api';
import { formatDate } from '@/lib/utils';
import type { Notification } from '@/types';
import { useLang } from '@/hooks/useLang';

export default function Topbar({ title = '' }: { title?: string }) {
  const { user } = useAdminAuthStore();
  const { t, lang, isRTL, toggleLang } = useLang();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recent, setRecent] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function fetchUnreadCount() {
    try {
      const res = await adminNotifications.getUnreadCount();
      if (res.success) setUnreadCount(res.data.count);
    } catch {}
  }

  async function loadRecent() {
    try {
      const res = await adminNotifications.getAll({ limit: 5 });
      if (res.success) setRecent(res.data);
    } catch {}
  }

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open) loadRecent();
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleMarkRead(id: string) {
    await adminNotifications.markAsRead(id);
    setRecent((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  }

  const TYPE_ICONS: Record<string, string> = {
    NEW_ORDER: '🛒',
    LOW_STOCK: '⚠️',
    NEW_CUSTOMER: '👤',
    ORDER_STATUS_CHANGED: '📦',
  };

  return (
    <header className="h-16 bg-bg-surface border-b border-border flex items-center justify-between px-6 shrink-0">
      <div>
        <div className="mono" style={{ fontSize: 10, color: '#6b6b70', marginBottom: 4 }}>
          DASHBOARD / {title.toUpperCase()}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#f5f5f4', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLang}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '6px 10px', borderRadius: 4,
            border: '1px solid #2a2a30', background: 'transparent',
            color: '#f5f5f4', cursor: 'pointer',
            fontSize: 12, fontWeight: 700,
            fontFamily: lang === 'ar' ? 'Cairo, sans-serif' : 'JetBrains Mono, monospace',
          }}
          aria-label="Toggle language"
        >
          {lang === 'en' ? 'ع' : 'EN'}
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            className="btn-ghost p-2 relative"
            aria-label="Notifications"
            onClick={() => setOpen((o) => !o)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center" style={{ background: '#ff6a2b', fontFamily: 'JetBrains Mono, monospace' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div
              className="absolute top-full mt-2 w-80 bg-bg-surface border border-border rounded-lg shadow-xl z-50"
              style={{ [isRTL ? 'left' : 'right']: 0 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-text-primary">{t('topbar.notifications')}</span>
                {unreadCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,106,43,0.12)', color: '#ff6a2b', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>{unreadCount} {t('topbar.unread')}</span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {recent.length === 0 ? (
                  <p className="text-text-muted text-sm text-center py-8">{t('topbar.noNotifications')}</p>
                ) : (
                  recent.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.isRead && handleMarkRead(n.id)}
                      className={`flex gap-3 px-4 py-3 border-b border-border/50 cursor-pointer hover:bg-bg-elevated/50 transition-colors ${!n.isRead ? 'bg-accent/5' : ''}`}
                    >
                      <span className="text-base flex-shrink-0 mt-0.5">{TYPE_ICONS[n.type] ?? '🔔'}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${n.isRead ? 'text-text-secondary' : 'text-text-primary'}`}>{n.title}</p>
                        <p className="text-xs text-text-muted truncate">{n.message}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{formatDate(n.createdAt)}</p>
                      </div>
                      {!n.isRead && <div className="h-2 w-2 bg-accent rounded-full flex-shrink-0 mt-1" />}
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <Link
                  href="/admin/dashboard/notifications"
                  className="text-xs text-accent hover:underline"
                  onClick={() => setOpen(false)}
                >
                  {t('topbar.viewAll')}
                </Link>
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="h-8 w-8 rounded-full bg-accent-subtle text-accent-text flex items-center justify-center text-sm font-semibold ml-1">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
