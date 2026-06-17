import type { Metadata, Viewport } from 'next';
import { Cairo, Hanken_Grotesk, IBM_Plex_Sans_Arabic, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import LangInitializer from '@/components/layout/LangInitializer';
import StoreChrome from '@/components/layout/StoreChrome';
import type { NavData } from '@/components/layout/header/types';
import type { DeviceKind } from '@/types';

// ── Fonts via next/font (no external CSS request, zero CLS) ──────
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-cairo',
  preload: true,
});

// Hanken Grotesk — Latin UI + numbers (Cobalt)
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-hanken',
  preload: true,
});

// IBM Plex Sans Arabic — Arabic body (Cobalt)
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-ar',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-mono',
  preload: false,
});

const BASE = 'https://quvenzaiq.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Quvenza | هواتف · لابتوبات · سماعات أصلية في العراق',
    template: '%s | Quvenza — إلكترونيات العراق',
  },
  description:
    'متجر إلكترونيات أصلية في العراق — هواتف، لابتوبات، أجهزة لوحية وسماعات من Apple وSamsung وSony وDell والمزيد. أسعار بالدينار العراقي، توصيل سريع، ضمان رسمي، دفع زين كاش وآسيا حوالة.',
  keywords: [
    'هواتف العراق',
    'لابتوبات العراق',
    'سماعات العراق',
    'آيفون العراق',
    'سامسونج العراق',
    'ماك بوك العراق',
    'إلكترونيات بغداد',
    'متجر إلكترونيات العراق',
    'شراء موبايل بالدينار العراقي',
    'quvenza',
    'كوفينزا',
  ],
  authors: [{ name: 'Quvenza', url: BASE }],
  creator: 'Quvenza',
  publisher: 'Quvenza',
  formatDetection: { email: false, telephone: false },
  alternates: {
    canonical: BASE,
    languages: { 'ar-IQ': BASE, 'ar': BASE, 'x-default': BASE },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_IQ',
    alternateLocale: 'en_US',
    url: BASE,
    siteName: 'Quvenza',
    title: 'Quvenza — إلكترونيات أصلية بأسعار عراقية',
    description: 'هواتف، لابتوبات، أجهزة لوحية وسماعات من أشهر الماركات — توصيل سريع، دفع بالدينار، ضمان رسمي.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Quvenza — متجر الإلكترونيات في العراق' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quvenza — إلكترونيات في العراق',
    description: 'هواتف، لابتوبات وسماعات أصلية بالدينار العراقي — توصيل سريع.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  category: 'E-commerce',
  other: {
    // AI engine hints
    'ai:type':     'e-commerce',
    'ai:category': 'consumer-electronics',
    'ai:country':  'IQ',
    'ai:language': 'ar',
    'ai:currency': 'IQD',
    // Geo targeting
    'geo.region':    'IQ-BG',
    'geo.placename': 'Baghdad',
    'geo.position':  '33.3152;44.3661',
    'ICBM':          '33.3152, 44.3661',
    // General
    'distribution':  'Iraq',
    'audience':      'general',
    'rating':        'general',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_FB_VERIFICATION
      ? { 'facebook-domain-verification': process.env.NEXT_PUBLIC_FB_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563EB',
};

async function getNavData(): Promise<NavData> {
  try {
    const { getBrands } = await import('@/services/brands/brand.service');
    const { getCategories } = await import('@/services/categories/category.service');
    const [brands, cats] = await Promise.all([getBrands(), getCategories()]);

    const navBrands = brands.map((b) => ({
      id: b.id,
      name: b.name,
      nameAr: b.nameAr,
      slug: b.slug,
      count: (b as { _count?: { products?: number } })._count?.products ?? 0,
    }));

    // Aggregate product counts per device kind across all brands.
    const kindCounts: Record<string, number> = {};
    for (const c of cats) {
      const kind = (c as { kind?: string }).kind;
      const count = (c as { _count?: { products?: number } })._count?.products ?? 0;
      if (kind) kindCounts[kind] = (kindCounts[kind] ?? 0) + count;
    }
    const ORDER: DeviceKind[] = ['PHONE', 'LAPTOP', 'TABLET', 'HEADPHONE'];
    const kinds = ORDER.filter((k) => kindCounts[k]).map((k) => ({ kind: k, count: kindCounts[k] }));

    return { brands: navBrands, kinds };
  } catch {
    return { brands: [], kinds: [] };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navData = await getNavData();

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${hanken.variable} ${plexArabic.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="author" href="/humans.txt" />
      </head>
      <body className="flex flex-col min-h-screen" style={{ background: '#F7F8FA', color: '#111827' }}>
        <LangInitializer />
        <StoreChrome
          header={<Header navData={navData} />}
          footer={<Footer />}
          cartDrawer={<CartDrawer />}
        >
          {children}
        </StoreChrome>
      </body>
    </html>
  );
}
