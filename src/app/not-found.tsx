import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="font-[family-name:var(--font-display)] text-7xl font-extrabold text-accent tracking-tight ltr-nums">404</div>
        <h1 className="mt-3 text-2xl font-bold text-text-primary">الصفحة غير موجودة</h1>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها. جرّب البحث أو عُد إلى الرئيسية.
        </p>

        {/* Search */}
        <form action="/search" className="mt-6 flex items-center gap-2 rounded-md border border-border-strong bg-white px-3 py-2.5">
          <Icon name="search" size={18} className="text-text-muted shrink-0" />
          <input
            name="q"
            placeholder="ابحث عن منتج…"
            className="flex-1 bg-transparent outline-none text-sm text-text-primary min-w-0"
          />
          <button type="submit" className="btn-accent text-xs px-3 py-1.5">بحث</button>
        </form>

        {/* CTAs */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link href="/" className="btn-accent">العودة للرئيسية</Link>
          <Link href="/products" className="btn-secondary">تصفّح المنتجات</Link>
        </div>

        {/* Popular searches */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-text-muted">الأكثر بحثاً:</span>
          {['iPhone', 'MacBook', 'Galaxy', 'AirPods'].map((q) => (
            <Link
              key={q}
              href={`/search?q=${encodeURIComponent(q)}`}
              className="tag hover:bg-accent-subtle transition-colors"
            >
              {q}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
