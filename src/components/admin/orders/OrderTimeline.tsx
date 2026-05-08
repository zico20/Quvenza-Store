import type { OrderStatusHistory } from '@/types';
import StatusBadge from './StatusBadge';

const STATUS_DOT_COLOR: Record<string, string> = {
  PENDING:    'bg-yellow-500',
  PROCESSING: 'bg-blue-500',
  SHIPPED:    'bg-purple-500',
  DELIVERED:  'bg-green-500',
  CANCELLED:  'bg-red-500',
  REFUNDED:   'bg-gray-500',
};

function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

interface OrderTimelineProps {
  history: OrderStatusHistory[];
}

export default function OrderTimeline({ history }: OrderTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-text-muted py-4 text-center">No status history available.</p>
    );
  }

  return (
    <div className="relative">
      {history.map((step, index) => {
        const isLast = index === history.length - 1;
        const dotColor = STATUS_DOT_COLOR[step.toStatus] ?? 'bg-gray-500';

        return (
          <div key={step.id} className="flex gap-4">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {isLast ? (
                  <span className="relative flex h-3 w-3 mt-1">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-50`} />
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${dotColor}`} />
                  </span>
                ) : (
                  <div className={`h-3 w-3 rounded-full mt-1 ${dotColor}`} />
                )}
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-border mt-1 mb-1" />}
            </div>

            {/* Content */}
            <div className={`${isLast ? '' : 'pb-6'} flex-1 min-w-0`}>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={step.toStatus} />
                {step.fromStatus && (
                  <span className="text-xs text-text-muted">← from {step.fromStatus}</span>
                )}
              </div>
              <p className="text-xs text-text-muted mt-1">{formatDateTime(step.createdAt)}</p>
              {step.note && (
                <p className="text-xs text-text-secondary mt-1 italic">{step.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
