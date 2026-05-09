'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { orders as ordersApi } from '@/lib/api';
import type { Order } from '@/types';
import { formatDate } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import StatusBadge from '@/components/orders/StatusBadge';
import { useLang } from '@/hooks/useLang';

export default function OrdersPage() {
  const { t, isRTL } = useLang();
  const { formatPrice } = useCurrency();
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getAll()
      .then((r) => { if (r.success) setOrdersList(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-28 bg-bg-surface border border-border rounded-xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-text-primary mb-5">{t('orders.myOrders')}</h1>

      {ordersList.length === 0 ? (
        <div className="bg-bg-surface border border-border rounded-xl py-16 px-6 text-center">
          <ShoppingBag className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <h2 className="text-text-primary text-base font-semibold mb-1">{t('orders.noOrders')}</h2>
          <p className="text-text-muted text-sm mb-5">{t('orders.noOrdersSub')}</p>
          <Link href="/products" className="btn-accent text-sm">{t('orders.shopNow')}</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {ordersList.map((order) => {
            const productNames = order.items
              ?.map((i) => i.product?.name)
              .filter(Boolean)
              .slice(0, 2)
              .join('، ');
            const extra = (order.items?.length ?? 0) > 2 ? ` +${order.items.length - 2}` : '';

            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block bg-bg-surface border border-border rounded-xl p-4 hover:border-accent/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: icon + info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Package size={18} className="text-text-muted" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {productNames || t('orders.myOrders')}{extra}
                      </p>
                      <p className="mono text-xs text-text-muted mt-0.5">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-text-muted mt-1">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  {/* Right: price + status + arrow */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="text-base font-bold text-text-primary">{formatPrice(order.total)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  {isRTL
                    ? <ChevronLeft size={16} className="text-text-muted flex-shrink-0 self-center group-hover:text-accent transition-colors" />
                    : <ChevronRight size={16} className="text-text-muted flex-shrink-0 self-center group-hover:text-accent transition-colors" />
                  }
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
