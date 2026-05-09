'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '@/hooks/useLang';
import type { Lang } from '@/lib/i18n';

const SLIDES = [
  {
    kicker:  { en: "Limited drop / Spring '26", ar: 'إصدار محدود / ربيع ٢٠٢٦' },
    title:   { en: 'Pro-grade tools,\nwithout the noise.',     ar: 'أدوات احترافية،\nبدون تعقيد.' },
    body:    { en: 'Hand-picked from the best global brands — local warranty and fast delivery across Iraq.', ar: 'منتخبة من أفضل الماركات العالمية — ضمان محلي وتوصيل سريع في العراق.' },
    cta:     { en: 'Shop now',          ar: 'تسوق الآن' },
    ctaAll:  { en: 'View all products', ar: 'كل المنتجات' },
    ctaHref: '/products',
    tone: 2,
  },
  {
    kicker:  { en: 'This week only',   ar: 'هذا الأسبوع فقط' },
    title:   { en: 'Up to 40% off\non flagship devices.', ar: 'خصم يصل إلى ٤٠٪\nعلى الأجهزة الرائدة.' },
    body:    { en: "Pick from a wide selection of phones and laptops at prices you can't miss.", ar: 'اختر من تشكيلة واسعة من الهواتف واللابتوبات بأسعار لا تُفوَّت.' },
    cta:     { en: 'Explore deals',    ar: 'استعرض العروض' },
    ctaAll:  { en: 'View all products', ar: 'كل المنتجات' },
    ctaHref: '/products?tag=sale',
    tone: 3,
  },
  {
    kicker:  { en: 'Audio collection', ar: 'مجموعة الصوتيات' },
    title:   { en: 'Hear every detail\nin studio clarity.', ar: 'اسمع كل التفاصيل\nبجودة الاستوديو.' },
    body:    { en: "Headphones and speakers certified by the world's top audio brands.", ar: 'سماعات ومكبرات صوت معتمدة من أفضل علامات الصوت العالمية.' },
    cta:     { en: 'Browse audio',     ar: 'تصفح الصوتيات' },
    ctaAll:  { en: 'View all products', ar: 'كل المنتجات' },
    ctaHref: '/products?category=audio',
    tone: 4,
  },
];

function SlideBg({ tone }: { tone: number }) {
  const hues = [18, 220, 280, 140, 40, 320];
  const h = hues[(tone - 1) % hues.length];
  const bg = `
    repeating-linear-gradient(135deg, oklch(0.78 0.04 ${h}) 0 2px, transparent 2px 14px),
    linear-gradient(160deg, oklch(0.88 0.03 ${h}), oklch(0.72 0.05 ${h}))
  `;
  return <div style={{ position: 'absolute', inset: 0, background: bg }} />;
}

interface HeroSliderProps {
  lang?: Lang;
}

export default function HeroSlider({ lang: serverLang }: HeroSliderProps) {
  const { isRTL } = useLang();
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];

  const prev = () => setIdx((idx - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIdx((idx + 1) % SLIDES.length);

  return (
    <section className="relative overflow-hidden mb-6 md:mb-16 aspect-[9/16] max-h-[680px] md:aspect-auto md:h-[calc(100vh-110px)]">
      {/* Full-coverage background */}
      <SlideBg tone={slide.tone} />

      {/* Subtle edge vignette — no directional bias */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.35) 100%)',
      }} />

      {/* Centered pagination dots */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 2,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === idx ? 28 : 8, height: 8, borderRadius: 4,
              background: i === idx ? '#fff' : 'rgba(255,255,255,0.45)',
              border: 'none', cursor: 'pointer',
              transition: 'width 0.3s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Arrows */}
      <div style={{
        position: 'absolute', bottom: 16,
        [isRTL ? 'left' : 'right']: 20,
        display: 'flex', gap: 8, zIndex: 2,
      }}>
        <button
          onClick={prev}
          style={{
            width: 40, height: 40, borderRadius: 20,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button
          onClick={next}
          style={{
            width: 40, height: 40, borderRadius: 20,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </section>
  );
}
