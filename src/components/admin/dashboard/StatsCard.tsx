import { type IconName } from '@/components/ui/Icon';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: IconName;
  trend?: { value: number; isPositive: boolean };
  iconColor?: string;
}

export default function StatsCard({ title, value, trend }: StatsCardProps) {
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 6, padding: 20,
    }}>
      <div className="mono" style={{ fontSize: 11, color: '#9097A1', marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
        {value}
      </div>
      {trend && (
        <div className="mono" style={{
          marginTop: 6, fontSize: 12,
          color: trend.isPositive ? '#16A34A' : '#EF4444',
        }}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%{' '}
          <span style={{ color: '#9097A1' }}>vs yesterday</span>
        </div>
      )}
    </div>
  );
}
