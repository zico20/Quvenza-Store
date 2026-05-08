import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  iconColor?: string;
}

export default function StatsCard({ title, value, trend }: StatsCardProps) {
  return (
    <div style={{
      background: '#17171a', border: '1px solid #2a2a30', borderRadius: 6, padding: 20,
    }}>
      <div className="mono" style={{ fontSize: 11, color: '#6b6b70', marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#f5f5f4', letterSpacing: '-0.01em' }}>
        {value}
      </div>
      {trend && (
        <div className="mono" style={{
          marginTop: 6, fontSize: 12,
          color: trend.isPositive ? '#4ade80' : '#f87171',
        }}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%{' '}
          <span style={{ color: '#6b6b70' }}>vs yesterday</span>
        </div>
      )}
    </div>
  );
}
