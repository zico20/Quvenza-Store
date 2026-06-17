'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/hooks/useLang';
import { getCategoryName } from '@/lib/i18n';
import { categoryIcon } from './categoryIcons';
import type { NavCategory } from './types';

/** Mobile horizontally-scrollable category chips, starting with an "All" chip. */
export default function CategoryChips({ categories }: { categories: NavCategory[] }) {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const allActive = pathname === '/products';

  return (
    <nav
      aria-label={t('nav.categoriesMenu')}
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
      {categories.map((cat) => {
        const href = `/category/${cat.slug}`;
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={cat.id}
            href={href}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              active ? 'border-accent bg-accent text-white' : 'border-border bg-bg-surface text-text-secondary'
            }`}
          >
            <Icon name={categoryIcon(cat.slug)} size={14} />
            {getCategoryName(cat.slug, cat.name, lang)}
          </Link>
        );
      })}
    </nav>
  );
}
