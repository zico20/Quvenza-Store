import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import JsonLd from '@/components/seo/JsonLd';
import { productSchema, breadcrumbSchema } from '@/lib/schema';
import ProductDetailClient, { ProductNotFound } from './ProductDetailClient';

const BASE = 'https://quvenzaiq.com';

// Rendered on demand: product data comes from the DB and the shared layout
// reads the language cookie, so this route must be dynamic (a static render
// that touches cookies() throws "static to dynamic" in Next.js 16).
export const dynamic = 'force-dynamic';

function toPlainProduct(p: any): Product {
  return {
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice != null ? Number(p.comparePrice) : undefined,
    variants: (p.variants ?? []).map((v: any) => ({
      ...v,
      price: Number(v.price),
      comparePrice: v.comparePrice != null ? Number(v.comparePrice) : undefined,
    })),
  } as Product;
}

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const { getProductBySlug } = await import('@/services/products/product.service');
    return toPlainProduct(await getProductBySlug(slug));
  } catch { return null; }
}

async function fetchRelated(productId: string, categoryId: string): Promise<Product[]> {
  try {
    const { getRelatedProducts } = await import('@/services/products/product.service');
    const items = await getRelatedProducts(productId, categoryId, 4);
    return items.map(toPlainProduct);
  } catch { return []; }
}

// Builds description ≤ 170 chars — electronics CTA
function buildProductDescription(product: Product): string {
  if ((product as any).metaDescription) {
    return (product as any).metaDescription.slice(0, 170);
  }
  const cta = ' — توصيل سريع، دفع بالدينار العراقي، ضمان رسمي من Quvenza.';
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

  // Title: no manual suffix — layout template adds the brand suffix
  const title = (product as any).metaTitle || `${product.name} — ${product.brand?.name ?? ''} في العراق`.trim();
  const description = buildProductDescription(product);
  const ogImage = product.images?.length
    ? { url: product.images[0], width: 800, height: 800, alt: product.name }
    : { url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'Quvenza' };

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.name} العراق`,
      `${product.brand?.name ?? ''} ${product.name}`.trim(),
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

  const related = await fetchRelated(product.id, product.categoryId);

  const breadcrumbs = breadcrumbSchema([
    { name: 'الرئيسية', url: BASE },
    ...(product.brand ? [{ name: product.brand.name, url: `${BASE}/brands/${product.brand.slug}` }] : []),
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
        brandName: product.brand?.name,
        rating: product.rating ? { value: product.rating, count: (product as any).reviews?.length ?? 0 } : null,
      })} />
      <JsonLd data={breadcrumbs} />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
