'use client';
import { formatPrice } from '@/lib/utils';
import type { DashboardStats } from '@/types';
import { useLang } from '@/hooks/admin/useLang';

type TopProduct = DashboardStats['topProducts'][number];

export default function TopProducts({ products }: { products: TopProduct[] }) {
  const { t } = useLang();
  const max = products[0]?.totalSold || 1;

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5 shadow-md">
      <h3 className="text-base font-semibold text-text-primary mb-4">{t('dashboard.topProducts')}</h3>
      {products.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-6">{t('dashboard.noSalesData')}</p>
      ) : (
        <div className="space-y-4">
          {products.map((p, index) => (
            <div key={p.id ?? index} className="flex items-center gap-3">
              <span className="text-text-muted text-xs w-4 text-right">{index + 1}</span>
              <div className="h-9 w-9 rounded-md bg-bg-elevated flex items-center justify-center overflow-hidden flex-shrink-0">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-text-muted">N/A</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text-primary truncate">{p.name}</span>
                  <span className="text-xs text-text-muted ml-2 flex-shrink-0">{p.totalSold} {t('dashboard.sold')}</span>
                </div>
                <div className="w-full bg-bg-elevated rounded-full h-1.5">
                  <div
                    className="bg-accent h-1.5 rounded-full transition-all"
                    style={{ width: `${(p.totalSold / max) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-text-secondary flex-shrink-0">{formatPrice(p.price)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
