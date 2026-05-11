import Link from 'next/link';
import { storeConfig } from '@/config/store.config';
import { getServerLang, t } from '@/lib/i18n';

function ColTitle({ text, isRTL }: { text: string; isRTL: boolean }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: '#f5f5f4', marginBottom: 14,
      fontFamily: isRTL ? 'Cairo, sans-serif' : 'JetBrains Mono, monospace',
      letterSpacing: isRTL ? 0 : '0.1em',
      textTransform: isRTL ? 'none' : 'uppercase',
    }}>{text}</div>
  );
}

function FooterCol({ title, links, isRTL }: { title: string; links: { label: string; href: string }[]; isRTL: boolean }) {
  return (
    <div>
      <ColTitle text={title} isRTL={isRTL} />
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
  const isRTL = lang === 'ar';

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
    <footer className="border-t border-[#2a2a30] mt-16" style={{ background: '#17171a' }}>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-8 pt-10 md:pt-16 pb-8 md:pb-10">

        {/* ── MOBILE layout (< md) ── */}
        <div className="md:hidden flex flex-col">

          {/* Brand block */}
          <div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid #2a2a30' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f4', letterSpacing: '-0.02em' }}>
                {storeConfig.name}
              </span>
              <span className="mono" style={{ fontSize: 9, color: '#ff6a2b', letterSpacing: '0.15em' }}>store</span>
            </div>
            <p style={{ color: '#a1a1a6', fontSize: 13, lineHeight: 1.65, margin: '0 0 12px' }}>
              {t('footer.tagline', lang)}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <a href={`mailto:${storeConfig.support.email}`}
                style={{ color: '#6b6b70', fontSize: 12, textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>
                {storeConfig.support.email}
              </a>
              <span style={{ color: '#6b6b70', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                {storeConfig.support.phone}
              </span>
            </div>
          </div>

          {/* Shop + Support — 2 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', marginBottom: 24 }}>
            <FooterCol title={t('footer.cols.shop', lang)}    links={SHOP_LINKS}    isRTL={isRTL} />
            <FooterCol title={t('footer.cols.support', lang)} links={SUPPORT_LINKS} isRTL={isRTL} />
          </div>

          {/* Company — horizontal pill links */}
          <div style={{ paddingTop: 20, paddingBottom: 20, borderTop: '1px solid #2a2a30', borderBottom: '1px solid #2a2a30', marginBottom: 20 }}>
            <ColTitle text={t('footer.cols.company', lang)} isRTL={isRTL} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px' }}>
              {COMPANY_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="footer-link" style={{ fontSize: 13 }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="mono" style={{ fontSize: 10, color: '#6b6b70', textAlign: 'center' }}>
            {storeConfig.copyright}
          </div>
          {/* Development attribution */}
          <div style={{ marginTop: 8, fontSize: 11, color: '#6b6b70', textAlign: 'center' }}>
            {lang === 'ar' ? (
              <>
                طُوّر بواسطة{' '}
                <a
                  href="https://softodeviq.com"
                  target="_blank"
                  rel="noopener"
                  title="SoftoDevIq - شركة برمجة في بغداد"
                  style={{ color: '#fb923c', textDecoration: 'none' }}
                >
                  SoftoDevIq
                </a>
                {' '}— شركة برمجة عراقية في بغداد
              </>
            ) : (
              <>
                Developed by{' '}
                <a
                  href="https://softodeviq.com"
                  target="_blank"
                  rel="noopener"
                  title="SoftoDevIq - Software Development Company in Baghdad"
                  style={{ color: '#fb923c', textDecoration: 'none' }}
                >
                  SoftoDevIq
                </a>
                {' '}— Iraqi software development company
              </>
            )}
          </div>
        </div>

        {/* ── DESKTOP layout (md+) ── */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-12">
          <div>
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
            {/* Development attribution */}
            <div style={{ marginTop: 8, fontSize: 11, color: '#6b6b70' }}>
              {lang === 'ar' ? (
                <>
                  طُوّر بواسطة{' '}
                  <a
                    href="https://softodeviq.com"
                    target="_blank"
                    rel="noopener"
                    title="SoftoDevIq - شركة برمجة في بغداد"
                    style={{ color: '#fb923c', textDecoration: 'none' }}
                  >
                    SoftoDevIq
                  </a>
                </>
              ) : (
                <>
                  Developed by{' '}
                  <a
                    href="https://softodeviq.com"
                    target="_blank"
                    rel="noopener"
                    title="SoftoDevIq - Software Development Company in Baghdad"
                    style={{ color: '#fb923c', textDecoration: 'none' }}
                  >
                    SoftoDevIq
                  </a>
                </>
              )}
            </div>
          </div>
          <FooterCol title={t('footer.cols.shop', lang)}    links={SHOP_LINKS}    isRTL={isRTL} />
          <FooterCol title={t('footer.cols.support', lang)} links={SUPPORT_LINKS} isRTL={isRTL} />
          <FooterCol title={t('footer.cols.company', lang)} links={COMPANY_LINKS} isRTL={isRTL} />
        </div>
      </div>
    </footer>
  );
}
