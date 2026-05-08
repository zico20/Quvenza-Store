'use client';

import { type ReactNode } from 'react';
import Sidebar from '@/components/admin/layout/Sidebar';
import AdminLangInitializer from '@/components/admin/layout/LangInitializer';
import { useAdminUIStore } from '@/store/admin/ui.store';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen, closeSidebar } = useAdminUIStore();

  return (
    <div className="flex min-h-screen bg-bg-base">
      <AdminLangInitializer />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          style={{ border: 'none', cursor: 'pointer' }}
        />
      )}

      {/* Sidebar — drawer on mobile, persistent on desktop */}
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
