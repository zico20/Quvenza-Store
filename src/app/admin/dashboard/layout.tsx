'use client';

import { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/admin/layout/Sidebar';
import AdminLangInitializer from '@/components/admin/layout/LangInitializer';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-base">
      <AdminLangInitializer />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          style={{ border: 'none', cursor: 'pointer' }}
        />
      )}

      {/* Sidebar — drawer on mobile, persistent on desktop */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Hamburger — mobile only, positioned above page content */}
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
