import Link from 'next/link';
import { storeConfig } from '@/config/store.config';
import { getServerLang, t } from '@/lib/i18n';

function FooterCol({ title, links, isRTL }: { title: string; links: { label: string; href: string }[]; isRTL: boolean }) {
  return (
    <div>
      <div style={{
        fontSize: 12, fontWeight: 700, color: '#f5f5f4', marginBottom: 14,
        fontFamily: isRTL ? 'Cairo, sans-serif' : 'JetBrains Mono, monospace',
        letterSpacing: isRTL ? 0 : '0.1em',
        textTransform: isRTL ? 'none' : 'uppercase',
      }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map(l => (
          <li key={l.href}>
            <Link href={l.href} className="footer-link">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function Footer() {
  const lang = await getServerLang();

  const SHOP_LINKS = [
    { label: t('footer.links.laptops', lang),   href: '/products?category=laptops' },
    { label: t('footer.links.phones', lang),    href: '/products?category=phones' },
    { label: t('footer.links.audio', lang),     href: '/products?category=audio' },
    { label: t('footer.links.wearables', lang), href: '/products?category=wearables' },
    { label: t('footer.links.gaming', lang),    href: '/products?category=gaming' },
  ];

  const SUPPORT_LINKS = [
    { label: t('footer.links.faq', lang),      href: '/support' },
    { label: t('footer.links.shipping', lang), href: '/support/shipping' },
    { label: t('footer.links.returns', lang),  href: '/support/returns' },
    { label: t('footer.links.warranty', lang), href: '/support/warranty' },
    { label: t('footer.links.contact', lang),  href: '/support/contact' },
  ];

  const COMPANY_LINKS = [
    { label: t('footer.links.about', lang),    href: '/about' },
    { label: t('footer.links.careers', lang),  href: '/careers' },
    { label: t('footer.links.blog', lang),     href: '/blog' },
    { label: t('footer.links.partners', lang), href: '/partners' },
    { label: t('footer.links.privacy', lang),  href: storeConfig.legal.privacyUrl },
  ];

  return (
    <footer
      className="border-t border-[#2a2a30] mt-16 px-4 sm:px-6 md:px-8 pt-10 pb-8 md:pt-16 md:pb-10"
      style={{ background: '#17171a' }}
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand column — spans both cols on mobile */}
        <div className="col-span-2 md:col-span-1">
          <div style={{ fontSize: 20, fontWeight: 700, color: '#f5f5f4', marginBottom: 12, letterSpacing: '-0.01em' }}>
            {storeConfig.name}
          </div>
          <p style={{ color: '#a1a1a6', fontSize: 13, lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
            {t('footer.tagline', lang)}
          </p>
          <div style={{ marginTop: 16, fontSize: 13, color: '#a1a1a6' }}>
            <div>{storeConfig.support.email}</div>
            <div style={{ marginTop: 4 }}>{storeConfig.support.phone}</div>
          </div>
          <div className="mono" style={{ marginTop: 24, fontSize: 10, color: '#6b6b70' }}>
            {storeConfig.copyright}
          </div>
        </div>

        <FooterCol title={t('footer.cols.shop', lang)}    links={SHOP_LINKS}    isRTL={lang === 'ar'} />
        <FooterCol title={t('footer.cols.support', lang)} links={SUPPORT_LINKS} isRTL={lang === 'ar'} />
        <FooterCol title={t('footer.cols.company', lang)} links={COMPANY_LINKS} isRTL={lang === 'ar'} />
      </div>
    </footer>
  );
}
