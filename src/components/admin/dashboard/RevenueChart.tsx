'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLang } from '@/hooks/admin/useLang';

export default function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const { t } = useLang();
  return (
    <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#F7F7F8' }}>{t('dashboard.revenueChart')}</div>
          {data.length > 0 && (
            <div className="mono" style={{ fontSize: 11, color: '#6C6C76', marginTop: 4 }}>
              ${data.reduce((s, d) => s + d.revenue, 0).toLocaleString()} {t('dashboard.totalLabel')}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 2, padding: 2, background: '#0A0A0C', border: '1px solid #26262E', borderRadius: 4 }}>
          {['7D', '30D', '90D'].map((p, i) => (
            <button key={p} style={{
              padding: '4px 10px', fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
              background: i === 1 ? '#121216' : 'transparent',
              color: i === 1 ? '#F7F7F8' : '#6C6C76',
              border: 'none', borderRadius: 3, cursor: 'pointer',
            }}>{p}</button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#26262E" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#6C6C76', fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false} axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#6C6C76', fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false} axisLine={false}
            tickFormatter={v => `$${v}`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1A20', border: '1px solid #26262E', borderRadius: 6, fontSize: 12, color: '#F7F7F8' }}
            formatter={v => [`$${Number(v).toFixed(0)}`, 'Revenue']}
            cursor={{ fill: 'rgba(255,106,43,0.06)' }}
          />
          <Bar
            dataKey="revenue"
            fill="#1A1A20"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Fallback when no real data: show demo bars */}
      {data.length === 0 && (
        <DemoBars />
      )}
    </div>
  );
}

function DemoBars() {
  const bars = [42, 55, 38, 62, 48, 71, 58, 66, 82, 73, 59, 68, 77, 85, 69, 74, 88, 79, 92, 81, 76, 84, 95, 87, 91, 98, 86, 93, 88, 96];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: 180, gap: 3, marginTop: -180 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          flex: 1, height: `${h}%`,
          background: i === bars.length - 1 ? '#FF7A33' : '#1A1A20',
          borderRadius: '2px 2px 0 0',
          transition: 'background 0.2s',
        }} />
      ))}
    </div>
  );
}
