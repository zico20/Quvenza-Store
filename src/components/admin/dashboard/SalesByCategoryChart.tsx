'use client';
import { formatPrice } from '@/lib/utils';
import type { DashboardStats } from '@/types';
import { useLang } from '@/hooks/admin/useLang';

type CategoryData = DashboardStats['salesByCategory'][number];

const DEMO: CategoryData[] = [
  { name: 'Phones',  total: 34 },
  { name: 'Laptops', total: 28 },
  { name: 'Audio',   total: 18 },
  { name: 'Gaming',  total: 12 },
  { name: 'Other',   total: 8 },
];

export default function SalesByCategoryChart({ data }: { data: CategoryData[] }) {
  const { t } = useLang();
  const rows = data.length > 0 ? data : DEMO;
  const max = Math.max(...rows.map(r => Number(r.total)), 1);

  return (
    <div style={{ background: '#17171a', border: '1px solid #2a2a30', borderRadius: 6, padding: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f4', marginBottom: 20 }}>
        {t('dashboard.topCategories')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rows.map(c => {
          const pct = Math.round((Number(c.total) / max) * 100);
          return (
            <div key={c.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#f5f5f4' }}>{c.name}</span>
                <span className="mono" style={{ fontSize: 11, color: '#6b6b70' }}>
                  {data.length > 0 ? formatPrice(Number(c.total)) : `${pct}%`}
                </span>
              </div>
              <div style={{ height: 4, background: '#1f1f23', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: '#ff6a2b', borderRadius: 2,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
