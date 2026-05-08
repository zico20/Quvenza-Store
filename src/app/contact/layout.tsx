import type { Metadata } from 'next';

const BASE = 'https://softodeviqstore.com';

export const metadata: Metadata = {
  title: 'اتصل بنا — تواصل مع متجر SoftoDev',
  description: 'تواصل مع متجر SoftoDev الآن عبر WhatsApp أو Telegram أو Email. دعم عربي عراقي 24/7. نخدم كل محافظات العراق — بغداد، البصرة، أربيل وأكثر.',
  alternates: { canonical: `${BASE}/contact` },
  openGraph: {
    title: 'اتصل بنا — SoftoDev',
    description: 'دعم عراقي 24/7 عبر WhatsApp وTelegram وEmail.',
    url: `${BASE}/contact`,
    images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'SoftoDev' }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
