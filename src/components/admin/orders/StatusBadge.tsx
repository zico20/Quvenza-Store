const STYLES: Record<string, string> = {
  PENDING:    'bg-[rgba(245,158,11,0.1)] text-warning border border-[rgba(245,158,11,0.2)]',
  PROCESSING: 'bg-accent-subtle text-accent-text border border-[rgba(255,106,43,0.2)]',
  SHIPPED:    'bg-[rgba(168,85,247,0.1)] text-purple-300 border border-[rgba(168,85,247,0.2)]',
  DELIVERED:  'bg-[rgba(34,197,94,0.1)] text-success border border-[rgba(34,197,94,0.2)]',
  CANCELLED:  'bg-[rgba(239,68,68,0.1)] text-error border border-[rgba(239,68,68,0.2)]',
  REFUNDED:   'bg-bg-elevated text-text-muted border border-border',
  PAID:       'bg-[rgba(34,197,94,0.1)] text-success border border-[rgba(34,197,94,0.2)]',
  FAILED:     'bg-[rgba(239,68,68,0.1)] text-error border border-[rgba(239,68,68,0.2)]',
};

export default function StatusBadge({ status }: { status: string }) {
  const key = status.toUpperCase();
  const style = STYLES[key] ?? 'bg-bg-elevated text-text-muted border border-border';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
