import type { MetadataRoute } from 'next';

const BASE = 'https://softodeviqstore.com';
const API  = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

async function fetchProducts(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const res = await fetch(`${API}/products?limit=500&isActive=true`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return (await res.json()).data ?? [];
  } catch { return []; }
}

async function fetchCategories(): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(`${API}/categories?limit=100`, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    return (await res.json()).data ?? [];
  } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);

  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: now,                    changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/products`,            lastModified: now,                    changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/faq`,                 lastModified: now,                    changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/about`,               lastModified: new Date('2026-04-27'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`,             lastModified: new Date('2026-04-27'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/how-it-works`,        lastModified: new Date('2026-04-27'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/payment-methods`,     lastModified: new Date('2026-04-27'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/glossary`,            lastModified: now,                    changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`,             lastModified: new Date('2026-04-01'), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,               lastModified: new Date('2026-04-01'), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
