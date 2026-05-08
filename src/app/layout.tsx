import type { Metadata, Viewport } from 'next';
import { Cairo, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import LangInitializer from '@/components/layout/LangInitializer';
import StoreChrome from '@/components/layout/StoreChrome';

// ── Fonts via next/font (no external CSS request, zero CLS) ──────
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-cairo',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-mono',
  preload: false,
});

const BASE = 'https://softodeviqstore.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'SoftoDev | اشتراكات ChatGPT Plus · Canva Pro · CapCut · Coursera في العراق',
    template: '%s | SoftoDev — اشتراكات رقمية العراق',
  },
  description:
    'أكبر متجر اشتراكات رقمية أصلية في العراق. اشترك في ChatGPT Plus، Canva Pro، CapCut Pro، Coursera Plus بأسعار بالدينار العراقي — تفعيل فوري، ضمان كامل، دفع زين كاش وآسيا حوالة.',
  keywords: [
    'اشتراك ChatGPT Plus العراق',
    'شراء ChatGPT بالدينار العراقي',
    'Canva Pro العراق',
    'CapCut Pro العراق',
    'Coursera Plus العراق',
    'اشتراكات رقمية بغداد',
    'متجر اشتراكات العراق',
    'اشتراك شات جي بي تي عراق',
    'softodeviqstore',
    'سوفتوديف',
  ],
  authors: [{ name: 'SoftoDev', url: BASE }],
  creator: 'SoftoDev',
  publisher: 'SoftoDev',
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
    siteName: 'SoftoDev',
    title: 'SoftoDev — اشتراكات رقمية أصلية بأسعار عراقية',
    description: 'ChatGPT Plus، Canva Pro، CapCut Pro و أكثر — تسليم فوري، دفع بالدينار، ضمان كامل.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'SoftoDev — متجر الاشتراكات الرقمية في العراق' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoftoDev — اشتراكات رقمية في العراق',
    description: 'ChatGPT Plus، Canva Pro، CapCut Pro بالدينار العراقي — تفعيل فوري.',
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
    'ai:category': 'digital-subscriptions',
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
  themeColor: '#ff6a2b',
};

async function getNavCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  try {
    const { getCategories } = await import('@/services/categories/category.service');
    return await getCategories();
  } catch {
    return [];
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navCategories = await getNavCategories();

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="author" href="/humans.txt" />
      </head>
      <body className="flex flex-col min-h-screen" style={{ background: '#0e0e10', color: '#f5f5f4' }}>
        <LangInitializer />
        <StoreChrome
          header={<Header navCategories={navCategories} />}
          footer={<Footer />}
          cartDrawer={<CartDrawer />}
        >
          {children}
        </StoreChrome>
      </body>
    </html>
  );
}
