'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DashboardStats, OrderStatus } from '@/types';

type StatusData = DashboardStats['ordersByStatus'][number];

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: '#EAB308',
  PROCESSING: '#3B82F6',
  SHIPPED: '#8B5CF6',
  DELIVERED: '#22C55E',
  CANCELLED: '#EF4444',
  REFUNDED: '#F97316',
};

export default function OrderStatusChart({ data }: { data: StatusData[] }) {
  const filtered = data.filter((d) => d.count > 0);

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5 shadow-md">
      <h3 className="text-base font-semibold text-text-primary mb-4">Orders by Status</h3>
      {filtered.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-6">No order data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={filtered} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
              {filtered.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status as OrderStatus] ?? '#6B7280'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1f1f23', border: '1px solid #2a2a30', borderRadius: '6px', fontSize: '12px', color: '#f5f5f4' }}
              formatter={(v, name) => [v, name]}
            />
            <Legend
              formatter={(value) => <span style={{ color: '#6b6b70', fontSize: '11px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
