import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'السلة',
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
