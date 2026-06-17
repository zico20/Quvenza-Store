'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useCompareStore } from '@/store/compare.store';
import { useLang } from '@/hooks/useLang';

/**
 * Floating "Compare (N)" pill, visible whenever the compare list is non-empty
 * (except on the compare page itself). Hydration-safe count via
 * useSyncExternalStore — server snapshot is 0.
 */
export default function CompareBar() {
  const { t } = useLang();
  const pathname = usePathname();

  const count = useSyncExternalStore(
    useCompareStore.subscribe,
    () => useCompareStore.getState().items.length,
    () => 0
  );
  const clear = useCompareStore((s) => s.clear);

  if (count === 0 || pathname === '/compare') return null;

  return (
    <div className="fixed bottom-4 z-40 left-1/2 -translate-x-1/2 lg:bottom-6">
      <div className="flex items-center gap-2 rounded-full border border-border bg-bg-surface/95 backdrop-blur px-2 py-2 shadow-lg" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <button
          onClick={clear}
          aria-label={t('compare.clearAll')}
          className="h-9 w-9 grid place-items-center rounded-full text-text-muted hover:text-error hover:bg-bg-elevated transition-colors"
        >
          <Icon name="x" size={16} />
        </button>
        <Link
          href="/compare"
          className="btn-accent rounded-full px-5 py-2 text-sm flex items-center gap-2"
        >
          <Icon name="scale" size={16} />
          {t('compare.viewCompare').replace('{n}', String(count))}
        </Link>
      </div>
    </div>
  );
}
