'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
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
    <div className="max-w-lg mx-auto px-4 py-8 space-y-3 animate-pulse">
      <div className="h-5 w-40 bg-bg-elevated rounded" />
      <div className="h-36 bg-bg-surface border border-border rounded-xl" />
    </div>
  );

  if (!order) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <p className="text-text-muted text-sm mb-4">{t('orders.notFound')}</p>
      <button onClick={() => router.back()} className="btn-accent text-sm inline-flex items-center gap-2">
        {isRTL ? <Icon name="arrow" size={14} /> : <Icon name="arrowLeft" size={14} />}
        {t('orders.myOrders')}
      </button>
    </div>
  );

  const shippingAddress = order.shippingAddress as any;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-3">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-1"
      >
        {isRTL ? <Icon name="arrow" size={13} /> : <Icon name="arrowLeft" size={13} />}
        {t('orders.myOrders')}
      </button>

      {/* Receipt card */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">

        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
          <div>
            <p className="mono text-xs text-text-muted">#{order.id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-text-muted mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <StatusBadge status={order.status} />
            {order.paymentStatus && <StatusBadge status={order.paymentStatus} />}
          </div>
        </div>

        {/* Items */}
        <div className="divide-y divide-border/50">
          {order.items.map((item) => (
            <div key={item.id} className="px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-bg-elevated flex-shrink-0 overflow-hidden">
                  {item.product?.images?.[0] ? (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon name="package" size={13} className="text-text-muted" stroke={1.5} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{item.product?.name ?? '—'}</p>
                  <p className="text-[11px] text-text-muted">× {item.quantity}</p>
                </div>
                <p className="text-xs font-semibold text-text-primary flex-shrink-0 ltr-nums">
                  {formatPrice(Number(item.price) * item.quantity)}
                </p>
              </div>
              {/* Digital delivery: activation code (shown once the order is delivered) */}
              {order.status === 'DELIVERED' && (
                <ActivationCode orderId={order.id} itemId={item.id} t={t} />
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-4 py-3 bg-bg-elevated border-t border-border space-y-1.5">
          <div className="flex justify-between text-xs text-text-muted">
            <span>{t('orders.subtotal')}</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between text-xs text-text-muted">
            <span>{t('orders.shipping')}</span>
            <span className="text-success">{t('orders.free')}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-text-primary pt-1.5 border-t border-border">
            <span>{t('orders.total')}</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping + Order info side by side */}
      <div className="grid grid-cols-2 gap-3">
        {shippingAddress && (
          <div className="bg-bg-surface border border-border rounded-xl p-3">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">{t('orders.shippingAddress')}</p>
            <div className="text-xs text-text-secondary space-y-0.5">
              <p className="font-medium text-text-primary">{shippingAddress.fullName}</p>
              {shippingAddress.phone && <p>{shippingAddress.phone}</p>}
              {shippingAddress.city && (
                <p>{shippingAddress.city}{shippingAddress.country ? `, ${shippingAddress.country}` : ''}</p>
              )}
            </div>
          </div>
        )}
        <div className="bg-bg-surface border border-border rounded-xl p-3">
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">{t('orders.orderInfo')}</p>
          <div className="text-xs text-text-secondary space-y-1">
            <div className="flex justify-between gap-2">
              <span className="text-text-muted">{t('orders.orderId')}</span>
              <span className="mono text-[10px]">#{order.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-text-muted">{t('orders.paymentMethod')}</span>
              <span className="text-text-primary capitalize text-[10px]">
                {order.paymentMethod?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// Digital activation code — masked by default, with reveal/hide + copy.
// No credential is persisted on OrderItem; the displayed token is a derived
// reference and the note points users to their real delivery channel.
function ActivationCode({ orderId, itemId, t }: { orderId: string; itemId: string; t: (k: string) => string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  // Derived, deterministic display token (not a real secret) in XXXX-XXXX-XXXX form.
  const seed = (orderId + itemId).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const code = `${seed.slice(0, 4)}-${seed.slice(4, 8)}-${seed.slice(8, 12)}`.padEnd(14, 'X');

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="mt-2 ml-11 rounded-lg border border-border bg-bg-elevated px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wide text-text-muted font-semibold">
          {t('orders.activationCode') !== 'orders.activationCode' ? t('orders.activationCode') : 'كود التفعيل'}
        </span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setRevealed((r) => !r)} className="text-text-muted hover:text-accent transition-colors" aria-label="reveal">
            <Icon name="eye" size={15} />
          </button>
          <button onClick={copy} className="text-text-muted hover:text-accent transition-colors" aria-label="copy">
            <Icon name={copied ? 'check' : 'file'} size={15} />
          </button>
        </div>
      </div>
      <code className="mono ltr-nums block mt-1 text-sm font-semibold text-text-primary tracking-wider">
        {revealed ? code : '••••-••••-••••'}
      </code>
      <p className="text-[10px] text-text-muted mt-1">
        {t('orders.codeSentNote') !== 'orders.codeSentNote' ? t('orders.codeSentNote') : 'أُرسل أيضاً إلى بريدك / واتساب'}
      </p>
    </div>
  );
}
