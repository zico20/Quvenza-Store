'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '@/hooks/useLang';
import type { Lang } from '@/lib/i18n';

// ─── Slide config ───────────────────────────────────────────────────────────
// Desktop images (16:9): /public/banners/desktop/banner-1.jpg  …banner-3.jpg
// Mobile  images (9:16): /public/banners/mobile/banner-1.jpg   …banner-3.jpg
// Missing file → colored gradient fallback is shown automatically.
const SLIDES = [
  { desktop: '/banners/desktop/gpt%20baneer.jpeg', mobile: '/banners/mobile/gpt%20baneer_mobile.jpeg', tone: 2 },
  { desktop: '/banners/desktop/coursera.jpeg',     mobile: '/banners/mobile/coursera_mobile.jpeg',     tone: 3 },
];

function SlideBg({ desktop, mobile, tone, priority }: { desktop: string; mobile: string; tone: number; priority?: boolean }) {
  const hues = [18, 220, 280, 140, 40, 320];
  const h = hues[(tone - 1) % hues.length];
  // Dark Voltage fallback: a deep near-black wash with an accent/tone glow
  const gradient = `
    radial-gradient(ellipse at 30% 20%, oklch(0.5 0.13 ${h} / 0.4), transparent 60%),
    radial-gradient(ellipse at 80% 80%, rgba(25,212,232,0.10), transparent 55%),
    linear-gradient(160deg, #16161b, #0A0A0C)
  `;
  return (
    <>
      {/* Gradient fallback — always visible until image loads */}
      <div style={{ position: 'absolute', inset: 0, background: gradient }} />
      {/* Mobile image — shown on small screens */}
      <Image
        src={mobile}
        alt=""
        aria-hidden="true"
        fill
        priority={priority}
        sizes="100vw"
        className="md:hidden object-cover"
      />
      {/* Desktop image — shown on md+ screens */}
      <Image
        src={desktop}
        alt=""
        aria-hidden="true"
        fill
        priority={priority}
        sizes="100vw"
        className="hidden md:block object-cover"
      />
    </>
  );
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

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative overflow-hidden mb-6 md:mb-16 w-full"
      style={{ height: 'calc(100vh - 110px)', minHeight: 380 }}
    >
      {/* Full-coverage background */}
      <SlideBg desktop={slide.desktop} mobile={slide.mobile} tone={slide.tone} priority={idx === 0} />

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
              background: i === idx ? '#FF7A33' : 'rgba(255,255,255,0.45)',
              boxShadow: i === idx ? '0 0 10px rgba(255,122,51,0.6)' : 'none',
              border: 'none', cursor: 'pointer',
              transition: 'width 0.3s, box-shadow 0.3s',
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
