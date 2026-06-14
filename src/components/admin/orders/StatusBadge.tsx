// Voltage semantic map (see specs/.../data-model.md). Codes stay UPPERCASE;
// token-based classes replace the old arbitrary rgba() values.
const STYLES: Record<string, string> = {
  PENDING:    'bg-warning/10 text-warning border border-warning/20',
  PROCESSING: 'bg-plasma/10 text-plasma border border-plasma/20',
  SHIPPED:    'bg-plasma/10 text-plasma border border-plasma/20',
  DELIVERED:  'bg-success/10 text-success border border-success/20',
  CANCELLED:  'bg-error/10 text-error border border-error/20',
  REFUNDED:   'bg-bg-elevated text-text-muted border border-border',
  PAID:       'bg-success/10 text-success border border-success/20',
  FAILED:     'bg-error/10 text-error border border-error/20',
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
