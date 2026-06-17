'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import CompareBar from '@/components/compare/CompareBar';

interface StoreChromeProps {
  header: ReactNode;
  footer: ReactNode;
  cartDrawer: ReactNode;
  children: ReactNode;
}

export default function StoreChrome({
  header,
  footer,
  cartDrawer,
  children,
}: StoreChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {cartDrawer}
      <CompareBar />
    </>
  );
}
