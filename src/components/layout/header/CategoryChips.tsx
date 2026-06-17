'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/hooks/useLang';
import { deviceKindLabel } from '@/lib/i18n';
import { deviceKindIcon } from './categoryIcons';
import type { NavData } from './types';

/** Mobile horizontally-scrollable device-kind chips, starting with an "All" chip. */
export default function CategoryChips({ data }: { data: NavData }) {
  // useSearchParams must sit under a Suspense boundary or it bails static
  // prerender of every page (this renders in the global Header).
  return (
    <Suspense fallback={<ChipsShell data={data} activeKind={null} />}>
      <ChipsInner data={data} />
    </Suspense>
  );
}

function ChipsInner({ data }: { data: NavData }) {
  const searchParams = useSearchParams();
  return <ChipsShell data={data} activeKind={searchParams.get('kind')} />;
}

function ChipsShell({ data, activeKind }: { data: NavData; activeKind: string | null }) {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const allActive = pathname === '/products' && !activeKind;

  return (
    <nav
      aria-label={t('brand.deviceTypes')}
      className="md:hidden flex gap-2 overflow-x-auto px-4 pb-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <Link
        href="/products"
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
          allActive ? 'border-accent bg-accent text-white' : 'border-border bg-bg-surface text-text-secondary'
        }`}
      >
        <Icon name="grid" size={14} />
        {t('nav.allCategories')}
      </Link>
      {data.kinds.map(({ kind }) => {
        const active = pathname === '/products' && activeKind === kind;
        return (
          <Link
            key={kind}
            href={`/products?kind=${kind}`}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              active ? 'border-accent bg-accent text-white' : 'border-border bg-bg-surface text-text-secondary'
            }`}
          >
            <Icon name={deviceKindIcon(kind)} size={14} />
            {deviceKindLabel(kind, lang)}
          </Link>
        );
      })}
    </nav>
  );
}
