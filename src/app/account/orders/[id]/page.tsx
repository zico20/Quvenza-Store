'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { orders as ordersApi } from '@/lib/api';
import type { Order } from '@/types';
import { formatDate } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import { useLang } from '@/hooks/useLang';
import StatusBadge from '@/components/orders/StatusBadge';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, isRTL } = useLang();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getById(id)
      .then((r) => { if (r.success) setOrder(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="space-y-3 animate-pulse">
      <div className="h-6 w-48 bg-bg-elevated rounded" />
      <div className="h-4 w-32 bg-bg-elevated rounded" />
      <div className="h-40 bg-bg-surface border border-border rounded-xl mt-4" />
    </div>
  );

  if (!order) return (
    <div className="text-center py-12">
      <p className="text-text-muted mb-4">{t('orders.notFound')}</p>
      <button onClick={() => router.back()} className="btn-accent text-sm">
        {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
        {t('orders.myOrders')}
      </button>
    </div>
  );

  const shippingAddress = order.shippingAddress as any;

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        {isRTL ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
        {t('orders.myOrders')}
      </button>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-text-primary">
            {t('orders.order')} #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          {order.paymentStatus && <StatusBadge status={order.paymentStatus} />}
        </div>
      </div>

      {/* Items */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">{t('orders.items')}</h2>
        </div>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3">
              <div className="w-10 h-10 rounded-lg bg-bg-elevated flex-shrink-0 overflow-hidden">
                {item.product?.images?.[0] ? (
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={16} className="text-text-muted" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {item.product?.name ?? '—'}
                </p>
                <p className="text-xs text-text-muted mt-0.5">× {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-text-primary flex-shrink-0">
                {formatPrice(Number(item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-5 py-3 bg-bg-elevated border-t border-border space-y-2">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>{t('orders.subtotal')}</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            <span>{t('orders.shipping')}</span>
            <span className="text-success">{t('orders.free')}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-text-primary pt-1 border-t border-border">
            <span>{t('orders.total')}</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {shippingAddress && (
        <div className="bg-bg-surface border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3">{t('orders.shippingAddress')}</h2>
          <div className="text-sm text-text-secondary space-y-1">
            <p className="font-medium text-text-primary">{shippingAddress.fullName}</p>
            {shippingAddress.phone && <p>{shippingAddress.phone}</p>}
            {shippingAddress.address && <p>{shippingAddress.address}</p>}
            {shippingAddress.city && (
              <p>{shippingAddress.city}{shippingAddress.country ? `, ${shippingAddress.country}` : ''}</p>
            )}
          </div>
        </div>
      )}

      {/* Order info */}
      <div className="bg-bg-surface border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3">{t('orders.orderInfo')}</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">{t('orders.orderId')}</span>
            <span className="mono text-xs text-text-muted">#{order.id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">{t('orders.paymentMethod')}</span>
            <span className="text-text-primary capitalize">{order.paymentMethod?.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
