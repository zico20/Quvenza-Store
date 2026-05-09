'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
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
  return (
    <div style={{ position: 'absolute', inset: 0, background: bg }}>
      <span
        className="mono hidden sm:block"
        style={{
          position: 'absolute', top: 16, left: 32,
          fontSize: 10, color: 'rgba(23,22,26,0.4)',
          letterSpacing: '0.15em',
        }}
      >
        EDITORIAL / HERO IMAGE
      </span>
    </div>
  );
}

interface HeroSliderProps {
  lang?: Lang;
}

export default function HeroSlider({ lang: serverLang }: HeroSliderProps) {
  const { lang: clientLang, isRTL } = useLang();
  const lang: Lang = clientLang || serverLang || 'en';
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];

  const prev = () => setIdx((idx - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIdx((idx + 1) % SLIDES.length);

  const gradient = isRTL
    ? 'linear-gradient(270deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.52) 45%, rgba(0,0,0,0.18) 100%)'
    : 'linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.52) 45%, rgba(0,0,0,0.18) 100%)';

  return (
    <section
      className="relative overflow-hidden mb-6 md:mb-16 aspect-[9/16] max-h-[680px] md:aspect-[16/9] md:max-h-[600px]"
    >
      {/* Background */}
      <SlideBg tone={slide.tone} />

      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: gradient }} />

      {/* Slide counter */}
      <div
        className="mono hidden sm:block"
        style={{
          position: 'absolute', top: 24, left: 32, zIndex: 2,
          fontSize: 10, color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.15em',
        }}
      >
        SDQ · {String(idx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>

      {/* Content */}
      <div
        className="px-5 sm:px-10 md:px-12"
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: 1440, margin: '0 auto',
          height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          color: '#fff',
        }}
      >
        <div
          className="mono"
          style={{ fontSize: 11, letterSpacing: '0.18em', opacity: 0.75, marginBottom: 16 }}
        >
          ✦ {slide.kicker[lang]}
        </div>

        <h1
          style={{
            fontSize: 'clamp(28px, 7vw, 84px)',
            fontWeight: 700,
            lineHeight: 0.96,
            letterSpacing: '-0.03em',
            margin: 0, maxWidth: 820,
            whiteSpace: 'pre-line',
          }}
        >
          {slide.title[lang]}
        </h1>

        <p style={{
          marginTop: 16, fontSize: 'clamp(13px, 3.5vw, 17px)',
          lineHeight: 1.55, opacity: 0.82, maxWidth: 520,
        }}>
          {slide.body[lang]}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-9">
          <Link
            href={slide.ctaHref}
            style={{
              padding: '14px 22px', fontSize: 14, fontWeight: 600,
              background: '#fff', color: '#111', borderRadius: 100,
              display: 'inline-flex', alignItems: 'center', gap: 10,
              textDecoration: 'none', fontFamily: 'inherit',
            }}
          >
            {slide.cta[lang]} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </Link>
          <Link
            href="/products"
            style={{
              padding: '14px 22px', fontSize: 14, fontWeight: 600,
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.4)', borderRadius: 100,
              display: 'inline-flex', alignItems: 'center', gap: 10,
              textDecoration: 'none', fontFamily: 'inherit',
            }}
          >
            {slide.ctaAll[lang]}
          </Link>
        </div>
      </div>

      {/* Pagination dots */}
      <div style={{ position: 'absolute', bottom: 20, left: 20, display: 'flex', gap: 8, zIndex: 2 }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: i === idx ? 28 : 8, height: 8, borderRadius: 4,
              background: i === idx ? '#fff' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer',
              transition: 'width 0.3s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Arrows — hidden on mobile */}
      <div className="hidden sm:flex" style={{ position: 'absolute', bottom: 16, right: 20, gap: 8, zIndex: 2 }}>
        <button
          onClick={prev}
          style={{
            width: 44, height: 44, borderRadius: 22,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button
          onClick={next}
          style={{
            width: 44, height: 44, borderRadius: 22,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </section>
  );
}
