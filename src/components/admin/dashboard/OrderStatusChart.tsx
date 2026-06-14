'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DashboardStats, OrderStatus } from '@/types';

type StatusData = DashboardStats['ordersByStatus'][number];

// Voltage semantic palette (matches StatusBadge: in-progress = plasma)
const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: '#FBBF24',     // warning
  PROCESSING: '#19D4E8',  // plasma
  SHIPPED: '#19D4E8',     // plasma
  DELIVERED: '#34D399',   // success
  CANCELLED: '#FB7185',   // error
  REFUNDED: '#6C6C76',    // muted
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
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status as OrderStatus] ?? '#6C6C76'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1A1A20', border: '1px solid #26262E', borderRadius: '6px', fontSize: '12px', color: '#F7F7F8' }}
              formatter={(v, name) => [v, name]}
            />
            <Legend
              formatter={(value) => <span style={{ color: '#6C6C76', fontSize: '11px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
