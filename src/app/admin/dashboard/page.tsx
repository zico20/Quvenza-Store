'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Package, Users, AlertTriangle } from 'lucide-react';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import RecentOrders from '@/components/admin/dashboard/RecentOrders';
import TopProducts from '@/components/admin/dashboard/TopProducts';
import OrderStatusChart from '@/components/admin/dashboard/OrderStatusChart';
import SalesByCategoryChart from '@/components/admin/dashboard/SalesByCategoryChart';
import LowStockAlert from '@/components/admin/dashboard/LowStockAlert';
import Topbar from '@/components/admin/layout/Topbar';
import { adminStats } from '@/lib/admin/api';
import { formatPrice } from '@/lib/utils';
import type { DashboardStats } from '@/types';

function calcTrend(today: number, yesterday: number) {
  if (yesterday === 0) return undefined;
  const pct = Math.round(((today - yesterday) / yesterday) * 100);
  return { value: Math.abs(pct), isPositive: pct >= 0 };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminStats.getDashboard()
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error);
  }, []);

  const chartData = (() => {
    if (!data) return [];
    const byDay: Record<string, number> = {};
    data.recentOrders.forEach((ord) => {
      const d = new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      byDay[d] = (byDay[d] ?? 0) + ord.total;
    });
    return Object.entries(byDay).map(([date, revenue]) => ({ date, revenue }));
  })();

  const STATS = [
    {
      title: 'Revenue today',
      value: formatPrice(data?.today.revenue ?? 0),
      trend: data ? calcTrend(data.today.revenue, data.yesterday.revenue) : undefined,
    },
    {
      title: 'Orders',
      value: data?.today.orders ?? '—',
      trend: data ? calcTrend(data.today.orders, data.yesterday.orders) : undefined,
    },
    {
      title: 'Avg. order',
      value: data && data.today.orders > 0 ? formatPrice(data.today.revenue / data.today.orders) : '—',
    },
    {
      title: 'Visitors',
      value: data?.overview.totalUsers?.toLocaleString() ?? '—',
    },
  ];

  return (
    <div className="flex flex-col">
      <Topbar title="Dashboard" />

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {STATS.map(s => <StatsCard key={s.title} {...s} />)}
        </div>

        {/* Revenue Chart + Category Chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <RevenueChart data={chartData} />
          <SalesByCategoryChart data={data?.salesByCategory ?? []} />
        </div>

        {/* Recent Orders */}
        <RecentOrders orders={data?.recentOrders ?? []} />

        {/* Top Products + Low Stock */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <TopProducts products={data?.topProducts ?? []} />
          <LowStockAlert />
        </div>

      </div>
    </div>
  );
}
