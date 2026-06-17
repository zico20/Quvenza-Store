'use client';

import Image from 'next/image';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Product, DeviceKind } from '@/types';

const KIND_ICON: Record<DeviceKind, IconName> = {
  PHONE: 'phone', LAPTOP: 'laptop', TABLET: 'tablet', HEADPHONE: 'headphones',
};

/** A stored image counts as "real" only if it isn't one of the seed placeholders. */
function realImage(images?: string[]): string | undefined {
  const first = images?.[0];
  if (!first) return undefined;
  if (first.includes('placehold.co')) return undefined;
  return first;
}

/**
 * Unified product image. Shows the real (Cloudinary/uploaded) image when present,
 * otherwise a clean Cobalt placeholder: device-type icon + brand mark + model name.
 * Drop a real image on the product and it appears automatically — no code change.
 */
export default function ProductImage({
  product,
  name,
  sizes = '(max-width: 768px) 50vw, 25vw',
  priority = false,
  rounded = false,
}: {
  product: Product;
  /** localized display name (caller already resolved AR/EN) */
  name: string;
  sizes?: string;
  priority?: boolean;
  rounded?: boolean;
}) {
  const src = realImage(product.images);
  const kind = product.category?.kind;
  const brandSlug = product.brand?.slug;
  const brandName = product.brand?.name;

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        fill
        priority={priority}
        className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
        sizes={sizes}
        unoptimized={src.startsWith('http://localhost')}
      />
    );
  }

  // ── Cobalt placeholder ──
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none"
      style={{
        background:
          'radial-gradient(circle at 50% 32%, rgba(37,99,235,0.07), transparent 62%), linear-gradient(165deg,#FFFFFF,#F3F4F6)',
        borderRadius: rounded ? 12 : 0,
      }}
      aria-hidden="true"
    >
      {/* device-type glyph */}
      {kind && (
        <div className="text-accent/70">
          <Icon name={KIND_ICON[kind]} size={44} stroke={1.4} />
        </div>
      )}

      {/* brand mark (monochrome SVG) */}
      {brandSlug && (
        <div className="relative h-6 w-20 opacity-55">
          <Image
            src={`/brands/${brandSlug}.svg`}
            alt={brandName ?? ''}
            fill
            className="object-contain"
            sizes="80px"
            unoptimized
          />
        </div>
      )}

      {/* model name */}
      <span className="mono px-3 text-center text-[10px] leading-tight text-text-muted line-clamp-2 max-w-[85%]">
        {name}
      </span>
    </div>
  );
}
