'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { orders as ordersApi } from '@/lib/api';
import type { Order } from '@/types';
import { formatDate } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import { useLang } from '@/hooks/useLang';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getById(id).then((r) => { if (r.success) setOrder(r.data); }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-text-muted">{t('common.loading')}</p>;
  if (!order) return <p className="text-error">{t('orders.notFound')}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Order #{order.id.slice(-8)}</h1>
      <p className="text-sm text-text-muted mb-6">{formatDate(order.createdAt)}</p>
      <div className="bg-bg-surface border border-border rounded-lg p-6">
        <h2 className="font-semibold text-text-primary mb-4">Items</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-text-secondary">
              <span>{item.product.name} × {item.quantity}</span>
              <span className="font-medium text-text-primary">{formatPrice(Number(item.price) * item.quantity)}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-border flex justify-between font-bold text-text-primary">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
