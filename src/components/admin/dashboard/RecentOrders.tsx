'use client';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import type { DashboardStats, OrderStatus } from '@/types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  PROCESSING: 'bg-[rgba(255,106,43,0.1)] text-[#ff6a2b] border-[rgba(255,106,43,0.2)]',
  SHIPPED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  DELIVERED: 'bg-green-500/10 text-green-400 border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  REFUNDED: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

type RecentOrder = DashboardStats['recentOrders'][number];

export default function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-primary">Recent Orders</h3>
        <Link href="/admin/dashboard/orders" className="text-xs text-accent hover:underline">View all</Link>
      </div>
      {orders.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-6">No orders yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-2 text-xs text-text-muted font-medium uppercase tracking-wider">Order ID</th>
                <th className="text-left pb-2 text-xs text-text-muted font-medium uppercase tracking-wider">Customer</th>
                <th className="text-left pb-2 text-xs text-text-muted font-medium uppercase tracking-wider">Total</th>
                <th className="text-left pb-2 text-xs text-text-muted font-medium uppercase tracking-wider">Status</th>
                <th className="text-left pb-2 text-xs text-text-muted font-medium uppercase tracking-wider">Date</th>
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
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-text-muted text-xs">{formatDate(order.createdAt)}</span>
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
