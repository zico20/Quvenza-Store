'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import Topbar from '@/components/admin/layout/Topbar';
import { adminCustomers } from '@/lib/admin/api';
import { formatPrice, formatDate } from '@/lib/utils';
import type { CustomerDetail, OrderStatus } from '@/types';

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  PROCESSING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  SHIPPED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  DELIVERED: 'bg-green-500/10 text-green-400 border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  REFUNDED: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);

  useEffect(() => {
    adminCustomers.getById(id)
      .then((res) => { if (res.success) setCustomer(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleToggle() {
    setConfirmToggle(false);
    setToggling(true);
    try {
      const res = await adminCustomers.toggleStatus(id);
      if (res.success && customer) {
        setCustomer({ ...customer, isActive: res.data.isActive });
      }
    } catch (e) { console.error(e); }
    finally { setToggling(false); }
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <Topbar title="Customer Details" />
        <div className="p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-bg-elevated rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col">
        <Topbar title="Customer Details" />
        <div className="p-6 text-center py-16">
          <p className="text-text-secondary">Customer not found</p>
          <button onClick={() => router.back()} className="mt-3 text-sm text-accent hover:underline">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Topbar title="Customer Details" />
      <div className="p-6 space-y-6 max-w-5xl">
        {/* Back + Header */}
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard/customers" className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors">
            <Icon name="arrowLeft" className="h-4 w-4" size={16} />
            Back to Customers
          </Link>
          <button
            onClick={() => setConfirmToggle(true)}
            disabled={toggling}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
              customer.isActive
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
            }`}
          >
            {customer.isActive ? <Icon name="toggle" className="h-4 w-4" size={16} /> : <Icon name="toggle" className="h-4 w-4" size={16} />}
            {customer.isActive ? 'Disable Account' : 'Enable Account'}
          </button>
        </div>

        {/* Customer Info Card */}
        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-full bg-accent-subtle text-accent-text flex items-center justify-center text-xl font-bold flex-shrink-0">
              {(customer.name || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg font-semibold text-text-primary">{customer.name}</h2>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
                  customer.isActive
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {customer.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-0.5">{customer.email}</p>
              <p className="text-xs text-text-muted mt-1">Member since {formatDate(customer.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 bg-bg-elevated rounded-md text-success"><Icon name="dollar" className="h-5 w-5" size={20} /></div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">Total Spent</p>
              <p className="text-lg font-bold text-text-primary">{formatPrice(customer.totalSpent)}</p>
            </div>
          </div>
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 bg-bg-elevated rounded-md text-accent"><Icon name="cart" className="h-5 w-5" size={20} /></div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">Total Orders</p>
              <p className="text-lg font-bold text-text-primary">{customer.totalOrders}</p>
            </div>
          </div>
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 bg-bg-elevated rounded-md text-warning"><Icon name="calendar" className="h-5 w-5" size={20} /></div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">Last Order</p>
              <p className="text-lg font-bold text-text-primary">
                {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">Order History</h3>
          </div>
          {customer.orders.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">No orders yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-bg-elevated border-b border-border">
                  {['Order ID', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customer.orders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-bg-elevated/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-text-muted">#{order.id.slice(-8)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-text-primary">{formatPrice(Number(order.total))}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ORDER_STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-text-muted">{formatDate(order.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Addresses */}
        {customer.addresses.length > 0 && (
          <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">Saved Addresses</h3>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customer.addresses.map((addr) => (
                <div key={addr.id} className="bg-bg-elevated rounded-lg p-4 text-sm text-text-secondary space-y-1">
                  <p className="font-medium text-text-primary">{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.address}</p>
                  <p>{addr.city}, {addr.country}</p>
                  {addr.isDefault && (
                    <span className="inline-block text-xs text-accent border border-accent/20 bg-accent/10 px-2 py-0.5 rounded-full">Default</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Toggle Modal */}
      {confirmToggle && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-bg-surface border border-border rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-base font-semibold text-text-primary mb-2">
              {customer.isActive ? 'Disable Account' : 'Enable Account'}
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              {customer.isActive
                ? `Disable ${customer.name}'s account? They won't be able to login.`
                : `Enable ${customer.name}'s account? They'll be able to login again.`}
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmToggle(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary rounded-md hover:bg-bg-elevated transition-colors">
                Cancel
              </button>
              <button
                onClick={handleToggle}
                className={`px-4 py-2 text-sm text-white rounded-md transition-colors ${customer.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {customer.isActive ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
