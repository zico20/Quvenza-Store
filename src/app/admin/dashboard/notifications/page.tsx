'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Bell, CheckCheck, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Topbar from '@/components/admin/layout/Topbar';
import { adminNotifications } from '@/lib/admin/api';
import { formatDate } from '@/lib/utils';
import type { Notification, NotificationType } from '@/types';

const TYPE_CONFIG: Record<NotificationType, { label: string; icon: string; color: string }> = {
  NEW_ORDER: { label: 'New Order', icon: '🛒', color: 'text-blue-400' },
  LOW_STOCK: { label: 'Low Stock', icon: '⚠️', color: 'text-yellow-400' },
  NEW_CUSTOMER: { label: 'New Customer', icon: '👤', color: 'text-green-400' },
  ORDER_STATUS_CHANGED: { label: 'Status Changed', icon: '📦', color: 'text-purple-400' },
};

type Filter = 'ALL' | 'UNREAD' | NotificationType;

const columnHelper = createColumnHelper<Notification>();

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('ALL');

  async function load() {
    setLoading(true);
    try {
      const res = await adminNotifications.getAll({ limit: 100 });
      if (res.success) setNotifications(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleMarkAllRead() {
    await adminNotifications.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  async function handleDelete(id: string) {
    await adminNotifications.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  async function handleMarkRead(id: string) {
    await adminNotifications.markAsRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  }

  const filtered = useMemo(() => {
    if (filter === 'ALL') return notifications;
    if (filter === 'UNREAD') return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const columns = useMemo(() => [
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => {
        const cfg = TYPE_CONFIG[info.getValue()];
        return (
          <span className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
            <span>{cfg.icon}</span>
            <span>{cfg.label}</span>
          </span>
        );
      },
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => <span className="text-sm font-medium text-text-primary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('message', {
      header: 'Message',
      cell: (info) => <span className="text-sm text-text-secondary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      cell: (info) => <span className="text-xs text-text-muted">{formatDate(info.getValue())}</span>,
    }),
    columnHelper.accessor('isRead', {
      header: 'Status',
      cell: (info) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
          info.getValue()
            ? 'bg-bg-elevated text-text-muted border-border'
            : 'bg-accent/10 text-accent border-accent/20'
        }`}>
          {info.getValue() ? 'Read' : 'Unread'}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <div className="flex gap-1">
          {!info.row.original.isRead && (
            <button
              onClick={() => handleMarkRead(info.row.original.id)}
              className="p-1 text-text-muted hover:text-accent transition-colors"
              title="Mark as read"
            >
              <CheckCheck className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="p-1 text-text-muted hover:text-error transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  const FILTERS: { value: Filter; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'UNREAD', label: 'Unread' },
    { value: 'NEW_ORDER', label: 'Orders' },
    { value: 'LOW_STOCK', label: 'Low Stock' },
    { value: 'NEW_CUSTOMER', label: 'Customers' },
  ];

  return (
    <div className="flex flex-col">
      <Topbar title="Notifications" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === value
                    ? 'bg-accent text-white'
                    : 'bg-bg-elevated text-text-secondary hover:text-text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs text-accent hover:underline"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        </div>

        {loading ? (
          <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-4 py-3 border-b border-border animate-pulse">
                {Array.from({ length: 4 }).map((__, j) => (
                  <div key={j} className="h-4 bg-bg-elevated rounded flex-1" />
                ))}
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-bg-surface border border-border rounded-lg">
            <Bell className="h-12 w-12 text-text-muted mb-4" />
            <p className="text-text-secondary font-medium">No notifications</p>
          </div>
        ) : (
          <>
            <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id} className="bg-bg-elevated border-b border-border">
                      {hg.headers.map((h) => (
                        <th key={h.id} className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                          {flexRender(h.column.columnDef.header, h.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className={`border-b border-border hover:bg-bg-elevated/50 transition-colors ${!row.original.isRead ? 'bg-accent/5' : ''}`}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-text-muted">
                Showing {table.getRowModel().rows.length} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1 rounded hover:bg-bg-elevated disabled:opacity-40 text-text-secondary">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-text-secondary">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1 rounded hover:bg-bg-elevated disabled:opacity-40 text-text-secondary">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
