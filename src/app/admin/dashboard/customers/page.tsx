'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, Users, Download } from 'lucide-react';
import type { CustomerSummary } from '@/types';
import { adminCustomers } from '@/lib/admin/api';
import Topbar from '@/components/admin/layout/Topbar';
import { useLang } from '@/hooks/useLang';
import { formatPrice } from '@/lib/utils';

function formatDate(s: string) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(s));
}

// Level based on total spent
function getLevel(totalSpent: number): { label: string; color: string; bg: string } {
  if (totalSpent >= 1000) return { label: 'PLATINUM', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' };
  if (totalSpent >= 200)  return { label: 'GOLD',     color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' };
  return                          { label: 'SILVER',   color: '#a1a1a6', bg: 'rgba(161,161,166,0.12)' };
}

// Avatar color from name
const AVATAR_COLORS = ['#ff6a2b','#4ade80','#60a5fa','#a78bfa','#fbbf24','#f87171'];
function avatarColor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function CustomersPage() {
  const { t } = useLang();
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [all, setAll] = useState<CustomerSummary[]>([]); // for KPI calc
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
  }, [search]);

  // Load page data
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminCustomers.getAll({ page, limit, search: debouncedSearch || undefined });
      if (res.success) {
        setCustomers(res.data);
        setTotal(res.pagination.total);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, debouncedSearch]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  // Load ALL customers once for KPI calculation (no search, large limit)
  useEffect(() => {
    adminCustomers.getAll({ page: 1, limit: 500 })
      .then(r => { if (r.success) setAll(r.data); })
      .catch(console.error);
  }, []);

  // KPI calculations
  const totalCustomers = total;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const active30d = all.filter(c => c.lastOrderDate && new Date(c.lastOrderDate) > thirtyDaysAgo).length;
  const retention = all.length > 0 ? Math.round((all.filter(c => c.totalOrders > 1).length / all.length) * 100) : 0;
  const avgLifetimeValue = all.length > 0 ? all.reduce((s, c) => s + (c.totalSpent ?? 0), 0) / all.length : 0;

  const kpis = [
    { label: t('customers.columns.customer') + ' ' + t('orders.total'), value: totalCustomers.toLocaleString(), sub: `+${all.filter(c => new Date(c.createdAt) > thirtyDaysAgo).length} ${t('dashboard.revenueToday') === 'Revenue today' ? 'this week' : 'هذا الأسبوع'}`, subColor: '#4ade80' },
    { label: t('orders.delivered').replace('(Month)', '(30d)'), value: active30d.toLocaleString(), sub: all.length > 0 ? `${Math.round((active30d / Math.max(all.length, 1)) * 100)}%` : '—', subColor: '#a1a1a6' },
    { label: t('customers.columns.customer') + ' retention', value: `${retention}%`, sub: retention > 50 ? '+' + (retention - 50) + '%' : '—', subColor: '#4ade80' },
    { label: 'Lifetime Value', value: formatPrice(avgLifetimeValue), sub: all.length > 0 ? `${all.length} customers` : '—', subColor: '#a1a1a6' },
  ];

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col">
      <Topbar title={t('customers.title')} />

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {kpis.map(k => (
            <div key={k.label} style={{ background: '#17171a', border: '1px solid #2a2a30', borderRadius: 6, padding: 20 }}>
              <div className="mono" style={{ fontSize: 11, color: '#6b6b70', marginBottom: 10 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#f5f5f4', letterSpacing: '-0.01em' }}>{k.value}</div>
              <div className="mono" style={{ marginTop: 6, fontSize: 12, color: k.subColor }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#17171a', border: '1px solid #2a2a30', borderRadius: 4 }}>
            <Search size={15} style={{ color: '#6b6b70', flexShrink: 0 }} strokeWidth={1.6} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('customers.search')}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#f5f5f4', fontSize: 13, fontFamily: 'inherit' }}
            />
          </div>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: '#17171a', color: '#a1a1a6', border: '1px solid #2a2a30', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Download size={14} strokeWidth={1.6} />
            {t('orders.export').replace('Excel', '').trim()}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...Array(5)].map((_, i) => <div key={i} style={{ height: 60, background: '#17171a', border: '1px solid #2a2a30', borderRadius: 4 }} />)}
          </div>
        ) : customers.length === 0 ? (
          <div style={{ background: '#17171a', border: '1px solid #2a2a30', borderRadius: 6, padding: '64px 32px', textAlign: 'center' }}>
            <Users size={40} strokeWidth={1.2} style={{ color: '#6b6b70', marginBottom: 16 }} />
            <p style={{ color: '#f5f5f4', fontSize: 16, fontWeight: 600, margin: 0 }}>{t('customers.columns.customer')}</p>
          </div>
        ) : (
          <>
            <div style={{ background: '#17171a', border: '1px solid #2a2a30', borderRadius: 6, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 120px 80px 120px 120px 40px', padding: '10px 20px', background: '#1f1f23', borderBottom: '1px solid #2a2a30', gap: 12 }}>
                {[t('customers.columns.customer'), t('customers.columns.joined'), t('customers.columns.orders'), t('customers.columns.spent'), t('customers.columns.level'), ''].map((h, i) => (
                  <div key={i} className="mono" style={{ fontSize: 10, color: '#6b6b70' }}>{h}</div>
                ))}
              </div>
              {/* Rows */}
              {customers.map(c => {
                const level = getLevel(c.totalSpent ?? 0);
                const color = avatarColor(c.name);
                return (
                  <Link
                    key={c.id}
                    href={`/dashboard/customers/${c.id}`}
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr 120px 80px 120px 120px 40px',
                      padding: '14px 20px', borderBottom: '1px solid #1f1f23',
                      alignItems: 'center', gap: 12, textDecoration: 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = '#1f1f23')}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Customer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 18, flexShrink: 0,
                        background: color + '22', color,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
                      }}>{initials(c.name)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f4' }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: '#6b6b70' }}>{c.email}</div>
                      </div>
                    </div>
                    {/* Since */}
                    <div className="mono" style={{ fontSize: 11, color: '#a1a1a6' }}>
                      {formatDate(c.createdAt)}
                    </div>
                    {/* Orders */}
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f4' }}>{c.totalOrders}</div>
                    {/* Spending */}
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f4' }}>
                      {formatPrice(c.totalSpent ?? 0)}
                    </div>
                    {/* Level */}
                    <div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 3,
                        background: level.bg, color: level.color,
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                        fontWeight: 600, letterSpacing: '0.08em',
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: level.color, display: 'inline-block', flexShrink: 0 }} />
                        {level.label}
                      </span>
                    </div>
                    {/* Arrow */}
                    <div style={{ color: '#6b6b70', display: 'flex', justifyContent: 'center' }}>
                      <ChevronLeft size={14} strokeWidth={1.6} />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p className="mono" style={{ fontSize: 11, color: '#6b6b70' }}>
                {customers.length} / {total} {t('customers.columns.customer')}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                  style={{ padding: '6px 10px', background: '#17171a', border: '1px solid #2a2a30', borderRadius: 4, color: '#a1a1a6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', opacity: page <= 1 ? 0.4 : 1 }}>
                  <ChevronRight size={14} strokeWidth={1.6} />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                  style={{ padding: '6px 10px', background: '#17171a', border: '1px solid #2a2a30', borderRadius: 4, color: '#a1a1a6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', opacity: page >= totalPages ? 0.4 : 1 }}>
                  <ChevronLeft size={14} strokeWidth={1.6} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
