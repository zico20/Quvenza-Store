'use client';
import { useLang } from '@/hooks/useLang';

const STYLES: Record<string, string> = {
  PENDING:    'bg-warning/10 text-warning border border-warning/20',
  PROCESSING: 'bg-accent/10 text-accent border border-accent/20',
  SHIPPED:    'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  DELIVERED:  'bg-success/10 text-success border border-success/20',
  CANCELLED:  'bg-error/10 text-error border border-error/20',
  REFUNDED:   'bg-bg-elevated text-text-muted border border-border',
};

export default function StatusBadge({ status }: { status: string }) {
  const { t } = useLang();
  const key = status.toUpperCase();
  const style = STYLES[key] ?? 'bg-bg-elevated text-text-muted border border-border';
  const label = (() => {
    const translated = t(`orders.status.${key}`);
    return translated !== `orders.status.${key}` ? translated : (key.charAt(0) + key.slice(1).toLowerCase());
  })();
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
