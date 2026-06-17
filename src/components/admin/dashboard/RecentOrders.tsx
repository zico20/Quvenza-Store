'use client';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import type { DashboardStats, OrderStatus } from '@/types';
import { useLang } from '@/hooks/admin/useLang';

// Voltage semantic palette (matches StatusBadge: in-progress = plasma)
const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:    'bg-warning/10 text-warning border-warning/20',
  PROCESSING: 'bg-plasma/10 text-plasma border-plasma/20',
  SHIPPED:    'bg-plasma/10 text-plasma border-plasma/20',
  DELIVERED:  'bg-success/10 text-success border-success/20',
  CANCELLED:  'bg-error/10 text-error border-error/20',
  REFUNDED:   'bg-bg-elevated text-text-muted border-border',
};

type RecentOrder = DashboardStats['recentOrders'][number];

export default function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  const { t } = useLang();

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-primary">{t('dashboard.recentOrders')}</h3>
        <Link href="/admin/dashboard/orders" className="text-xs text-accent hover:underline">{t('common.viewAll')}</Link>
      </div>
      {orders.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-6">{t('dashboard.noOrders')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-2 text-xs text-text-muted font-medium uppercase tracking-wider">{t('orders.columns.order')}</th>
                <th className="text-left pb-2 text-xs text-text-muted font-medium uppercase tracking-wider">{t('orders.columns.customer')}</th>
                <th className="text-left pb-2 text-xs text-text-muted font-medium uppercase tracking-wider">{t('orders.columns.total')}</th>
                <th className="text-left pb-2 text-xs text-text-muted font-medium uppercase tracking-wider">{t('orders.columns.status')}</th>
                <th className="text-left pb-2 text-xs text-text-muted font-medium uppercase tracking-wider">{t('orders.columns.date')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-bg-elevated/40 transition-colors">
                  <td className="py-3 pr-3">
                    <span className="font-mono text-xs text-text-muted">#{order.id.slice(-8)}</span>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="text-text-primary">{order.user.name}</span>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="font-medium text-text-primary">{formatPrice(order.total)}</span>
                  </td>
                  <td className="py-3 pr-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[order.status as OrderStatus]}`}>
                      {t(`orders.statuses.${order.status}`)}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-text-muted text-xs">{formatDate(String(order.createdAt))}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
