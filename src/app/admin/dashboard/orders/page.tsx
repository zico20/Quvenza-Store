'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Download, Filter, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import type { Order } from '@/types';
import { adminOrders } from '@/lib/admin/api';
import StatusBadge from '@/components/admin/orders/StatusBadge';
import Topbar from '@/components/admin/layout/Topbar';
import { useLang } from '@/hooks/admin/useLang';
import { formatPrice } from '@/lib/utils';

const ORDER_STATUSES = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'] as const;

function formatDate(s: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(s));
}

export default function OrdersPage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page: pagination.page, limit: 10 };
      if (activeStatus !== 'ALL') params.status = activeStatus;
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await adminOrders.getAll(params);
      if (res.success) {
        setOrders(res.data);
        setPagination(p => ({ ...p, total: res.pagination.total, pages: res.pagination.pages }));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [pagination.page, activeStatus, debouncedSearch]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setPagination(p => ({ ...p, page: 1 })); }, [activeStatus, debouncedSearch]);

  async function handleExport() {
    try {
      setExporting(true);
      const res = await adminOrders.exportOrders({ status: activeStatus !== 'ALL' ? activeStatus : undefined });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `orders-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } finally { setExporting(false); }
  }

  // Compute status counts from current loaded orders
  const statusCounts = ORDER_STATUSES.reduce((acc, s) => {
    acc[s] = s === 'ALL' ? pagination.total : orders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  // KPI stats derived from orders
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const todayRevenue = todayOrders.reduce((s, o) => s + Number(o.total), 0);
  const processingOrders = orders.filter(o => o.status === 'PROCESSING');
  const deliveredMonth = orders.filter(o => o.status === 'DELIVERED' && new Date(o.createdAt).getMonth() === new Date().getMonth());
  const avgOrder = pagination.total > 0 ? orders.reduce((s, o) => s + Number(o.total), 0) / orders.length : 0;

  const kpis = [
    {
      label: t('orders.today'),
      value: todayOrders.length,
      sub: todayRevenue > 0 ? formatPrice(todayRevenue) : '—',
      subColor: '#34D399',
    },
    {
      label: t('orders.processing'),
      value: processingOrders.length,
      sub: processingOrders.length > 0 ? t('orders.needsFollowup') : '—',
      subColor: '#fbbf24',
    },
    {
      label: t('orders.delivered'),
      value: deliveredMonth.length,
      sub: deliveredMonth.length > 0 ? '+' + deliveredMonth.length : '—',
      subColor: '#34D399',
    },
    {
      label: t('orders.avgValue'),
      value: avgOrder > 0 ? formatPrice(avgOrder) : '—',
      sub: pagination.total > 0 ? `${pagination.total} ${t('orders.ordersFound')}` : '—',
      subColor: '#6C6C76',
    },
  ];

  return (
    <div className="flex flex-col">
      <Topbar title={t('orders.title')} />

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map(k => (
            <div key={k.label} style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, padding: 20 }}>
              <div className="mono" style={{ fontSize: 11, color: '#6C6C76', marginBottom: 10 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#F7F7F8', letterSpacing: '-0.01em' }}>{k.value}</div>
              <div className="mono" style={{ marginTop: 6, fontSize: 12, color: k.subColor }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Search + actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#121216', border: '1px solid #26262E', borderRadius: 4 }}>
            <Search size={15} style={{ color: '#6C6C76', flexShrink: 0 }} strokeWidth={1.6} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('orders.search')}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F7F7F8', fontSize: 13, fontFamily: 'inherit' }}
            />
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 16px', background: '#121216', color: '#A6A6AE',
              border: '1px solid #26262E', borderRadius: 4, fontSize: 13, fontWeight: 600,
              cursor: exporting ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              opacity: exporting ? 0.6 : 1,
            }}
          >
            <Download size={14} strokeWidth={1.6} />
            {exporting ? '…' : t('orders.export')}
          </button>
        </div>

        {/* Status pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ORDER_STATUSES.map(s => {
            const active = activeStatus === s;
            const label = t(`orders.statuses.${s}`);
            const count = statusCounts[s] ?? 0;
            return (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                style={{
                  padding: '6px 14px', borderRadius: 4, fontSize: 13, fontWeight: active ? 600 : 500,
                  background: active ? '#FF7A33' : '#121216',
                  color: active ? '#fff' : '#A6A6AE',
                  border: `1px solid ${active ? '#FF7A33' : '#26262E'}`,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s',
                }}
              >
                {label}
                {count > 0 && (
                  <span className="mono" style={{
                    fontSize: 10, minWidth: 18, height: 18, borderRadius: 9,
                    background: active ? 'rgba(255,255,255,0.25)' : '#1A1A20',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 5px',
                  }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ height: 52, background: '#121216', border: '1px solid #26262E', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, padding: '64px 32px', textAlign: 'center' }}>
            <ShoppingBag size={40} strokeWidth={1.2} style={{ color: '#6C6C76', marginBottom: 16 }} />
            <p style={{ color: '#F7F7F8', fontSize: 16, fontWeight: 600, margin: 0 }}>{t('orders.noOrders')}</p>
            <p style={{ color: '#6C6C76', fontSize: 13, marginTop: 6 }}>{t('orders.adjustFilters')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto" style={{ borderRadius: 6 }}>
          <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, overflow: 'hidden', minWidth: 880 }}>
              {/* Table header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '160px 1.2fr 1.2fr 80px 100px 130px 40px',
                padding: '10px 20px', gap: 12, background: '#1A1A20', borderBottom: '1px solid #26262E',
              }}>
                {[
                  t('orders.columns.order'), t('orders.columns.customer'),
                  t('orders.columns.date'), t('orders.columns.items'),
                  t('orders.columns.total'), t('orders.columns.status'), '',
                ].map((h, i) => (
                  <div key={i} className="mono" style={{ fontSize: 10, color: '#6C6C76' }}>{h}</div>
                ))}
              </div>

              {/* Table rows */}
              {orders.map(o => (
                <div
                  key={o.id}
                  onClick={() => router.push(`/admin/dashboard/orders/${o.id}`)}
                  style={{
                    display: 'grid', gridTemplateColumns: '160px 1.2fr 1.2fr 80px 100px 130px 40px',
                    padding: '14px 20px', gap: 12, alignItems: 'center',
                    borderBottom: '1px solid #1A1A20', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1A1A20')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div className="mono" style={{ fontSize: 12, color: '#F7F7F8', fontWeight: 600 }}>
                      #{o.id.slice(-8).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#F7F7F8', fontWeight: 500 }}>{(o as any).user?.name ?? '—'}</div>
                    <div style={{ fontSize: 11, color: '#6C6C76' }}>{(o as any).user?.email ?? ''}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#A6A6AE' }}>{formatDate(o.createdAt)}</div>
                  <div style={{ fontSize: 13, color: '#A6A6AE' }}>×{o.items?.length ?? 0}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#F7F7F8' }}>{formatPrice(o.total)}</div>
                  <div><StatusBadge status={o.status} /></div>
                  <div style={{ color: '#6C6C76', display: 'flex', justifyContent: 'center' }}>
                    <ChevronLeft size={14} strokeWidth={1.6} />
                  </div>
                </div>
              ))}
            </div>
          </div>{/* /overflow-x-auto */}

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p className="mono" style={{ fontSize: 11, color: '#6C6C76' }}>
                {t('orders.page')} {pagination.page} {t('orders.of')} {pagination.pages} · {pagination.total} {t('orders.ordersFound')}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                  disabled={pagination.page <= 1}
                  style={{ padding: '6px 10px', background: '#121216', border: '1px solid #26262E', borderRadius: 4, color: '#A6A6AE', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                >
                  <ChevronRight size={14} strokeWidth={1.6} />
                </button>
                <button
                  onClick={() => setPagination(p => ({ ...p, page: Math.min(p.pages, p.page + 1) }))}
                  disabled={pagination.page >= pagination.pages}
                  style={{ padding: '6px 10px', background: '#121216', border: '1px solid #26262E', borderRadius: 4, color: '#A6A6AE', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                >
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
