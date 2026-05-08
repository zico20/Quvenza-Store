'use client';

import { type ReactNode } from 'react';
import Sidebar from '@/components/admin/layout/Sidebar';
import AdminLangInitializer from '@/components/admin/layout/LangInitializer';
import { useAdminUIStore } from '@/store/admin/ui.store';
import { useLang } from '@/hooks/admin/useLang';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen, closeSidebar } = useAdminUIStore();
  const { isRTL } = useLang();

  return (
    <div className="flex min-h-screen bg-bg-base">
      <AdminLangInitializer />

      {/* Desktop sidebar — sticky flex item, always visible, never overlays */}
      <div className="hidden lg:flex lg:w-60 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          style={{ border: 'none', cursor: 'pointer' }}
        />
      )}

      {/* Mobile sidebar drawer — fixed overlay, toggle-controlled */}
      <div
        className={[
          'fixed top-0 z-40 h-screen w-60 flex flex-col lg:hidden',
          'transition-transform duration-300 ease-in-out',
          isRTL ? 'right-0' : 'left-0',
          sidebarOpen
            ? 'translate-x-0'
            : isRTL ? 'translate-x-full' : '-translate-x-full',
        ].join(' ')}
      >
        <Sidebar onClose={closeSidebar} showCloseButton />
      </div>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
