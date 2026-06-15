'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { OrderStatus } from '@/types';
import { adminOrders } from '@/lib/admin/api';
import StatusBadge from './StatusBadge';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING:    ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED:    ['DELIVERED', 'CANCELLED'],
  DELIVERED:  ['REFUNDED'],
  CANCELLED:  [],
  REFUNDED:   [],
};

interface StatusChangeModalProps {
  orderId: string;
  currentStatus: OrderStatus;
  onSuccess: () => void;
  onClose: () => void;
}

export default function StatusChangeModal({
  orderId,
  currentStatus,
  onSuccess,
  onClose,
}: StatusChangeModalProps) {
  const allowed = VALID_TRANSITIONS[currentStatus] ?? [];
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>(allowed[0] ?? '');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    if (!selectedStatus) return;
    setLoading(true);
    setError('');
    try {
      await adminOrders.updateStatus(orderId, { status: selectedStatus, note: note.trim() || undefined });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to update status');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">Change Order Status</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
          >
            <Icon name="x" className="h-5 w-5" size={20} />
          </button>
        </div>

        {/* Current status */}
        <div className="mb-4">
          <p className="text-xs text-text-muted mb-1.5">Current Status</p>
          <StatusBadge status={currentStatus} />
        </div>

        {/* Allowed transitions */}
        {allowed.length === 0 ? (
          <div className="rounded-lg bg-bg-elevated border border-border p-4 text-sm text-text-muted text-center">
            No further status changes are allowed for this order.
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-xs text-text-muted mb-1.5">New Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="input w-full"
              >
                {allowed.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-xs text-text-muted mb-1.5">Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this status change..."
                rows={3}
                className="input w-full resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-error mb-4">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-bg-elevated text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || !selectedStatus}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Confirm Change'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
