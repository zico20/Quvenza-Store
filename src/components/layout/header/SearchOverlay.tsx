'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/hooks/useLang';

/** Full-width search overlay that drops from the top. Esc closes; Enter searches. */
export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const router = useRouter();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998]" role="dialog" aria-modal="true" aria-label={t('common.search')}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative mx-auto mt-0 w-full bg-bg-surface border-b border-border shadow-[0_14px_36px_rgba(16,24,40,0.12)] animate-[slideIn_.18s_cubic-bezier(.16,1,.3,1)]">
        <form onSubmit={submit} className="mx-auto flex max-w-[760px] items-center gap-3 px-4 py-4 sm:px-6">
          <Icon name="search" size={20} className="text-text-muted shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('common.search')}
            className="min-w-0 flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted"
          />
          <button type="button" onClick={onClose} aria-label={t('nav.closeSearch')} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-text-muted hover:bg-bg-elevated hover:text-text-primary">
            <Icon name="x" size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
