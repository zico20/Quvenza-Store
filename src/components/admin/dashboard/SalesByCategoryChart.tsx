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
    <div style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 6, padding: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 20 }}>
        {t('dashboard.topCategories')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rows.map(c => {
          const pct = Math.round((Number(c.total) / max) * 100);
          return (
            <div key={c.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#111827' }}>{c.name}</span>
                <span className="mono" style={{ fontSize: 11, color: '#9097A1' }}>
                  {data.length > 0 ? formatPrice(Number(c.total)) : `${pct}%`}
                </span>
              </div>
              <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: '#2563EB', borderRadius: 2,
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
