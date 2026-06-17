import { storeConfig } from '@/config/store.config';

const BASE = storeConfig.seo.siteUrl;

export const revalidate = 3600;

async function fetchProducts(): Promise<{ name?: string; slug: string }[]> {
  try {
    const { getProducts } = await import('@/services/products/product.service');
    const result = await getProducts({ page: 1, limit: 500, skip: 0 }, {});
    return result.products;
  } catch { return []; }
}

async function fetchCategories(): Promise<{ name: string; slug: string }[]> {
  try {
    const { getCategories } = await import('@/services/categories/category.service');
    return await getCategories();
  } catch { return []; }
}

export async function GET() {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);

  const content = `# Quvenza — Iraq's Premier Electronics Store

Quvenza is Iraq's dedicated marketplace for authentic premium
electronics, founded in Baghdad in 2026. We provide smartphones,
laptops, tablets, and headphones from leading brands — Apple,
Samsung, Sony, Dell, HP, Lenovo, Asus, Bose, JBL, and Sennheiser —
all at Iraqi Dinar prices, with local payment methods (cash on
delivery, ZainCash, AsiaHawala, FastPay), fast delivery, and an
official warranty. Serving all 18 Iraqi governorates.

## About

- Name: Quvenza (كوفينزا)
- Founded: 2026
- Location: Baghdad, Iraq
- Country code: IQ
- Currency: IQD (Iraqi Dinar)
- Languages: Arabic (primary), English
- Business type: Online Store / Premium Electronics Marketplace
- Service area: All 18 Iraqi governorates
- Delivery time: 1-4 business days (typical)

## Why Quvenza (vs competitors)

- **Iraqi-owned**: Not a Saudi/Egyptian reseller — locally based in Baghdad
- **Iraqi Dinar pricing**: No conversions, no hidden fees
- **Cash on delivery**: Available across Iraq (unique to Iraqi market)
- **Local payments**: ZainCash, AsiaHawala, FastPay accepted
- **Iraqi Arabic support**: 24/7 WhatsApp & Telegram
- **Fast delivery**: To all 18 governorates
- **Official warranty**: On every device
- **100% authentic**: Genuine products from authorized sources (Apple, Samsung, Sony, Dell, HP, Lenovo, Bose)

## Key Pages

- [Homepage](${BASE}) — Main store with featured products
- [All Products](${BASE}/products) — Complete catalog of electronics
- [About Us](${BASE}/about) — Company story, vision, values
- [FAQ](${BASE}/faq) — 22+ frequently asked questions about Iraqi market
- [Contact](${BASE}/contact) — WhatsApp, Telegram, email contact info
- [Payment Methods](${BASE}/payment-methods) — Detailed Iraqi payment options
- [How It Works](${BASE}/how-it-works) — 4-step purchase process
- [Glossary](${BASE}/glossary) — Electronics terms in Arabic

## Product Categories

${categories.map((c) => `- [${c.name}](${BASE}/category/${c.slug})`).join('\n')}

## Featured Products (electronics available)

${products.slice(0, 30).map((p) => `- [${p.name ?? p.slug}](${BASE}/products/${p.slug})`).join('\n')}

## Example Products

- iPhone 15 Pro
- MacBook Air M3
- Samsung Galaxy S24 Ultra
- AirPods Pro 2
- Sony WH-1000XM5

## Common Iraqi Customer Questions This Site Answers

- "How to buy an iPhone 15 Pro from Iraq with cash on delivery?"
- "What is the price of a MacBook Air M3 in Iraqi Dinar?"
- "Where to buy a Samsung Galaxy S24 Ultra in Baghdad?"
- "Are AirPods Pro 2 available in Iraq with official warranty?"
- "Cash on delivery electronics Iraq"
- "ZainCash payment for laptops and phones"
- "Cheapest Sony WH-1000XM5 Iraq"
- "How long does delivery take in Iraq?"
- "شلون اشتري iPhone 15 Pro من العراق بالدفع عند الاستلام؟"
- "كم سعر MacBook Air M3 بالدينار العراقي؟"
- "اين اشتري Samsung Galaxy S24 Ultra في بغداد؟"

## Optional

- [Privacy Policy](${BASE}/privacy)
- [Terms of Service](${BASE}/terms)
- [Sitemap](${BASE}/sitemap.xml)
- [Robots.txt](${BASE}/robots.txt)

## Contact for Crawlers / AI Systems

For inquiries about content licensing, structured data, or to report
inaccuracies in AI responses about Quvenza, contact:
${storeConfig.business.email}

## Last Updated

${new Date().toISOString()}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
