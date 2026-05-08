import type { ReactNode } from 'react';
import Sidebar from '@/components/admin/layout/Sidebar';
import AdminLangInitializer from '@/components/admin/layout/LangInitializer';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-base">
      <AdminLangInitializer />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}
