'use client';

import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

const config: Record<ToastVariant, { icon: ReactNode; ring: string; text: string }> = {
  success: { icon: <Icon name="checkCircle" className="h-5 w-5" size={20} />, ring: 'border-success/40 bg-success/10', text: 'text-success' },
  error: { icon: <Icon name="x" className="h-5 w-5" size={20} />, ring: 'border-error/40 bg-error/10', text: 'text-error' },
  warning: { icon: <Icon name="alert" className="h-5 w-5" size={20} />, ring: 'border-warning/40 bg-warning/10', text: 'text-warning' },
  info: { icon: <Icon name="info" className="h-5 w-5" size={20} />, ring: 'border-plasma/40 bg-plasma/10', text: 'text-plasma' },
};

interface ToastProps {
  variant?: ToastVariant;
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

/** Shared toast / inline alert. Same component for transient toasts and inline form alerts. */
export default function Toast({ variant = 'info', title, description, onClose, className }: ToastProps) {
  const c = config[variant];
  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md bg-bg-surface',
        c.ring,
        className,
      )}
    >
      <span className={cn('mt-0.5 shrink-0', c.text)}>{c.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        {description && <p className="text-[13px] text-text-secondary mt-0.5 leading-relaxed">{description}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
        >
          <Icon name="x" className="h-4 w-4" size={16} />
        </button>
      )}
    </div>
  );
}
