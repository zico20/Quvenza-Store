'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DashboardStats, OrderStatus } from '@/types';

type StatusData = DashboardStats['ordersByStatus'][number];

// Voltage semantic palette (matches StatusBadge: in-progress = plasma)
const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: '#F59E0B',     // warning
  PROCESSING: '#06B6D4',  // plasma
  SHIPPED: '#06B6D4',     // plasma
  DELIVERED: '#16A34A',   // success
  CANCELLED: '#EF4444',   // error
  REFUNDED: '#9097A1',    // muted
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
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status as OrderStatus] ?? '#9097A1'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#F3F4F6', border: '1px solid #EAECEF', borderRadius: '6px', fontSize: '12px', color: '#111827' }}
              formatter={(v, name) => [v, name]}
            />
            <Legend
              formatter={(value) => <span style={{ color: '#9097A1', fontSize: '11px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
