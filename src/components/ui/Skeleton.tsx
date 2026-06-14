import { cn } from '@/lib/utils';

/** Base shimmer block. Compose into grids/tables to avoid layout shift while loading. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-bg-elevated/70',
        className,
      )}
      aria-hidden
    />
  );
}

/** Product-grid placeholder (mirrors ProductCard footprint). */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-bg-surface overflow-hidden">
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-12" />
        <div className="flex items-end justify-between pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Generic table placeholder for admin/data screens. */
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-lg border border-border bg-bg-surface overflow-hidden">
      <Skeleton className="h-11 w-full rounded-none" />
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-3.5">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className={cn('h-4 flex-1', c === 0 && 'max-w-[40%]')} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
