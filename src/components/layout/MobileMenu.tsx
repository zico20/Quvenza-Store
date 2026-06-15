'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
      >
        {isOpen ? <Icon name="x" className="h-5 w-5" size={20} /> : <Icon name="menu" className="h-5 w-5" size={20} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-bg-surface border-b border-border shadow-lg z-50">
          <nav className="flex flex-col p-4 gap-3">
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Products
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
