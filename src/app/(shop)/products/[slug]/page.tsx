import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import JsonLd from '@/components/seo/JsonLd';
import { productSchema, breadcrumbSchema, faqSchema, getDefaultFAQs } from '@/lib/schema';
import ProductDetailClient, { ProductNotFound } from './ProductDetailClient';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
const BASE = 'https://softodeviqstore.com';

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API}/products/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch { return null; }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/products?limit=500`, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const products: { slug: string }[] = (await res.json()).data ?? [];
    return products.map((p) => ({ slug: p.slug }));
  } catch { return []; }
}

// Builds description ≤ 170 chars — no USD, Arabic CTA
function buildProductDescription(product: Product): string {
  if ((product as any).metaDescription) {
    return (product as any).metaDescription.slice(0, 170);
  }
  const cta = ' — تفعيل فوري، دفع بالدينار العراقي، ضمان كامل من SoftoDev.';
  const base = (product as any).shortDescription || product.description || product.name;
  const maxBase = 170 - cta.length;
  const trimmed = base.length > maxBase ? base.slice(0, maxBase - 3) + '...' : base;
  return trimmed + cta;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return { title: 'المنتج غير موجود' };

  // Title: no manual suffix — layout template adds "| SoftoDev — اشتراكات رقمية العراق"
  const title = (product as any).metaTitle || `${product.name} — اشتراك في العراق`;
  const description = buildProductDescription(product);
  const ogImage = product.images?.length
    ? { url: product.images[0], width: 800, height: 800, alt: product.name }
    : { url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'SoftoDev' };

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.name} العراق`,
      `اشتراك ${product.name}`,
      `${product.name} Iraq`,
      `شراء ${product.name} عراق`,
      `${product.name} بالدينار العراقي`,
    ],
    alternates: { canonical: `${BASE}/products/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE}/products/${slug}`,
      images: [ogImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function ProductPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) return <ProductNotFound />;

  const faqs = getDefaultFAQs(product.name);

  const breadcrumbs = breadcrumbSchema([
    { name: 'الرئيسية', url: BASE },
    { name: 'المنتجات', url: `${BASE}/products` },
    ...(product.category ? [{ name: product.category.name, url: `${BASE}/category/${(product.category as any).slug ?? ''}` }] : []),
    { name: product.name, url: `${BASE}/products/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={productSchema({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images ?? [],
        stock: product.stock,
        category: product.category ?? null,
      })} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faqSchema(faqs)} />
      <ProductDetailClient product={product} />
    </>
  );
}
