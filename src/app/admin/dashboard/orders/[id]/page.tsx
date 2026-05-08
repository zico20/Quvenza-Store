'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, FileText, Settings2 } from 'lucide-react';
import type { Order } from '@/types';
import { adminOrders } from '@/lib/admin/api';
import StatusBadge from '@/components/admin/orders/StatusBadge';
import OrderTimeline from '@/components/admin/orders/OrderTimeline';
import StatusChangeModal from '@/components/admin/orders/StatusChangeModal';
import Topbar from '@/components/admin/layout/Topbar';
import { useLang } from '@/hooks/admin/useLang';

function formatPrice(price: number | string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price));
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLang();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  const loadOrder = useCallback(async () => {
    try {
      const res = await adminOrders.getById(id);
      if (res.success) setOrder(res.data);
    } catch {
      showToast(t('orders.failedToLoad'), 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadOrder(); }, [loadOrder]);

  async function handleDownloadInvoice() {
    try {
      setDownloadingInvoice(true);
      const response = await adminOrders.downloadInvoice(id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${id.slice(-8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      showToast(t('orders.failedInvoice'), 'error');
    } finally {
      setDownloadingInvoice(false);
    }
  }

  function handleStatusSuccess() {
    showToast(t('orders.statusUpdated'), 'success');
    loadOrder();
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <Topbar title={t('orders.title')} />
        <div className="p-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-bg-elevated rounded animate-pulse" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-bg-elevated rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col">
        <Topbar title={t('orders.title')} />
        <div className="p-6 text-center">
          <p className="text-text-muted">{t('orders.orderNotFound')}</p>
          <button onClick={() => router.push('/admin/dashboard/orders')} className="mt-4 text-sm text-accent hover:underline">
            {t('orders.backToOrdersLink')}
          </button>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress as any;

  return (
    <div className="flex flex-col">
      <Topbar title={order ? `${t('orders.columns.order')} #${order.id.slice(-8).toUpperCase()}` : t('orders.title')} />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg text-sm font-medium text-white transition-opacity ${
            toast.type === 'success' ? 'bg-success' : 'bg-error'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <StatusChangeModal
          orderId={order.id}
          currentStatus={order.status}
          onSuccess={handleStatusSuccess}
          onClose={() => setShowStatusModal(false)}
        />
      )}

      <div className="p-6">
        {/* Back */}
        <button
          onClick={() => router.push('/admin/dashboard/orders')}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t('orders.backToOrders')}
        </button>

        {/* Header row */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-semibold text-text-primary">
              {t('orders.columns.order')} #{order.id.slice(-8).toUpperCase()}
            </h1>
            <StatusBadge status={order.status} />
            <StatusBadge status={order.paymentStatus ?? 'PENDING'} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStatusModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-bg-surface text-text-secondary hover:bg-bg-elevated text-sm font-medium transition-colors"
            >
              <Settings2 className="h-4 w-4" />
              {t('orders.changeStatus')}
            </button>
            <button
              onClick={handleDownloadInvoice}
              disabled={downloadingInvoice}
              className="flex items-center gap-2 btn-primary text-sm disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              {downloadingInvoice ? t('orders.generating') : t('orders.printInvoice')}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT: Order Items + Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Table */}
            <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-base font-semibold text-text-primary">{t('orders.orderItems')}</h2>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 480 }}>
                <thead>
                  <tr className="bg-bg-elevated border-b border-border">
                    <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">{t('orders.product')}</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">{t('orders.qty')}</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">{t('orders.unitPrice')}</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">{t('orders.columns.total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-bg-elevated/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-bg-elevated flex-shrink-0 overflow-hidden">
                            {item.product?.images?.[0] ? (
                              <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Package className="h-4 w-4 text-text-muted" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{item.product?.name ?? 'Unknown Product'}</p>
                            <p className="text-xs text-text-muted font-mono">{item.productId.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-text-secondary">{item.quantity}</td>
                      <td className="px-4 py-4 text-right text-sm text-text-secondary">{formatPrice(item.price)}</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-text-primary">{formatPrice(Number(item.price) * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>{/* /overflow-x-auto */}
              <div className="px-6 py-4 border-t border-border bg-bg-elevated space-y-2">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>{t('orders.subtotal')}</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>{t('orders.shipping')}</span>
                  <span className="text-success">{t('orders.free')}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-text-primary pt-2 border-t border-border">
                  <span>{t('orders.total')}</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-bg-surface border border-border rounded-lg p-6">
              <h2 className="text-base font-semibold text-text-primary mb-4">{t('orders.orderTimeline')}</h2>
              <OrderTimeline history={order.statusHistory ?? []} />
            </div>
          </div>

          {/* RIGHT: Order Info + Shipping + Customer */}
          <div className="space-y-4">
            {/* Order Info */}
            <div className="bg-bg-surface border border-border rounded-lg p-5 space-y-3">
              <h2 className="text-base font-semibold text-text-primary">{t('orders.orderInfo')}</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">{t('orders.orderStatus')}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">{t('orders.payment')}</span>
                  <StatusBadge status={order.paymentStatus ?? 'PENDING'} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">{t('orders.datePlaced')}</span>
                  <span className="text-text-primary text-right max-w-[140px]">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">{t('orders.paymentMethod')}</span>
                  <span className="text-text-primary capitalize text-sm">{order.paymentMethod.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">{t('orders.orderId')}</span>
                  <span className="font-mono text-xs text-text-muted">#{order.id.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-bg-surface border border-border rounded-lg p-5">
              <h2 className="text-base font-semibold text-text-primary mb-3">{t('orders.customer')}</h2>
              {order.user ? (
                <div className="text-sm text-text-secondary space-y-1">
                  <p className="font-medium text-text-primary">{order.user.name}</p>
                  <p>{order.user.email}</p>
                </div>
              ) : (
                <p className="text-sm text-text-muted">{t('orders.noCustomer')}</p>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-bg-surface border border-border rounded-lg p-5">
              <h2 className="text-base font-semibold text-text-primary mb-3">{t('orders.shippingAddress')}</h2>
              {shippingAddress ? (
                <div className="text-sm text-text-secondary space-y-1">
                  <p className="font-medium text-text-primary">{shippingAddress.fullName}</p>
                  {shippingAddress.phone && <p>{shippingAddress.phone}</p>}
                  {shippingAddress.address && <p>{shippingAddress.address}</p>}
                  {shippingAddress.city && (
                    <p>{shippingAddress.city}{shippingAddress.country ? `, ${shippingAddress.country}` : ''}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-text-muted">{t('orders.noAddress')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
