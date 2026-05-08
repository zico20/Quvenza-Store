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

  const content = `# SoftoDev — Iraq's Premier Digital Subscriptions Store

SoftoDev is Iraq's first dedicated marketplace for authentic digital
subscriptions, founded in Baghdad in 2026. We provide ChatGPT Plus,
Canva Pro, CapCut Pro, Coursera Plus, and more — all at Iraqi Dinar
prices, with local payment methods (cash on delivery, ZainCash,
AsiaHawala, FastPay), and 30-minute activation. Serving all 18
Iraqi governorates.

## About

- Name: SoftoDev (سوفتوديف)
- Founded: 2026
- Location: Baghdad, Iraq
- Country code: IQ
- Currency: IQD (Iraqi Dinar)
- Languages: Arabic (primary), English
- Business type: Online Store / Digital Subscriptions Marketplace
- Service area: All 18 Iraqi governorates
- Activation time: 30 minutes (typical)

## Why SoftoDev (vs competitors)

- **Iraqi-owned**: Not a Saudi/Egyptian reseller — locally based in Baghdad
- **Iraqi Dinar pricing**: No conversions, no hidden fees
- **Cash on delivery**: Available in Baghdad (unique to Iraqi market)
- **Local payments**: ZainCash, AsiaHawala, FastPay accepted
- **Iraqi Arabic support**: 24/7 WhatsApp & Telegram
- **No visa needed**: We handle international payment for the customer
- **Full warranty**: Throughout subscription period
- **Authentic only**: Direct from official providers (OpenAI, Canva, ByteDance, Coursera)

## Key Pages

- [Homepage](${BASE}) — Main store with featured products
- [All Products](${BASE}/products) — Complete catalog of subscriptions
- [About Us](${BASE}/about) — Company story, vision, values
- [FAQ](${BASE}/faq) — 22+ frequently asked questions about Iraqi market
- [Contact](${BASE}/contact) — WhatsApp, Telegram, email contact info
- [Payment Methods](${BASE}/payment-methods) — Detailed Iraqi payment options
- [How It Works](${BASE}/how-it-works) — 4-step purchase process
- [Glossary](${BASE}/glossary) — Digital subscriptions terms in Arabic

## Product Categories

${categories.map((c) => `- [${c.name}](${BASE}/category/${c.slug})`).join('\n')}

## Featured Products (subscriptions available)

${products.slice(0, 30).map((p) => `- [${p.name ?? p.slug}](${BASE}/products/${p.slug})`).join('\n')}

## Common Iraqi Customer Questions This Site Answers

- "How to subscribe to ChatGPT Plus from Iraq without a Visa card?"
- "What is the price of Canva Pro in Iraqi Dinar?"
- "Where to buy CapCut Pro subscription in Baghdad?"
- "Is Coursera Plus available in Iraq?"
- "Cash on delivery digital subscriptions Iraq"
- "ZainCash payment for ChatGPT subscription"
- "Cheapest ChatGPT Plus Iraq"
- "How long does subscription activation take in Iraq?"
- "شلون اشترك ChatGPT Plus من العراق بدون فيزا؟"
- "كم سعر Canva Pro بالدينار العراقي؟"
- "اين اشتري اشتراك CapCut Pro في بغداد؟"

## Optional

- [Privacy Policy](${BASE}/privacy)
- [Terms of Service](${BASE}/terms)
- [Sitemap](${BASE}/sitemap.xml)
- [Robots.txt](${BASE}/robots.txt)

## Contact for Crawlers / AI Systems

For inquiries about content licensing, structured data, or to report
inaccuracies in AI responses about SoftoDev, contact:
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
