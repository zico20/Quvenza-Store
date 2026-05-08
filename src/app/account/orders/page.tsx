'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { orders as ordersApi } from '@/lib/api';
import type { Order } from '@/types';
import { formatDate } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import StatusBadge from '@/components/orders/StatusBadge';
import { useLang } from '@/hooks/useLang';

export default function OrdersPage() {
  const { t } = useLang();
  const { formatPrice } = useCurrency();
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getAll().then((r) => { if (r.success) setOrdersList(r.data); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 bg-bg-surface border border-border rounded-lg animate-pulse" />
      ))}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">{t('orders.myOrders')}</h1>
      {ordersList.length === 0 ? (
        <div className="bg-bg-surface border border-border rounded-lg py-16 px-6 text-center">
          <ShoppingBag className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h2 className="text-text-primary text-lg font-semibold mb-2">{t('orders.noOrders')}</h2>
          <p className="text-text-muted text-sm mb-6">{t('orders.noOrdersSub')}</p>
          <Link href="/products" className="btn-primary">{t('orders.shopNow')}</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {ordersList.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block bg-bg-surface border border-border rounded-lg p-5 hover:border-border-strong hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-medium text-text-primary">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-text-muted mt-0.5">{formatDate(order.createdAt)}</p>
                  <p className="text-xs text-text-muted mt-1">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-bold text-text-primary">{formatPrice(order.total)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
