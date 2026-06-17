import type { IconName } from '@/components/ui/Icon';
import type { DeviceKind } from '@/types';

/** Device-kind → outline icon. All inherit the same accent color; only glyph differs. */
const KIND_ICON: Record<DeviceKind, IconName> = {
  PHONE: 'phone',
  LAPTOP: 'laptop',
  TABLET: 'tablet',
  HEADPHONE: 'headphones',
};

export function deviceKindIcon(kind: DeviceKind): IconName {
  return KIND_ICON[kind] ?? 'package';
}

/**
 * Per-brand DB category slugs follow `<brand>-<type>` (e.g. apple-iphones,
 * sony-headphones). Infer the device glyph from the slug suffix.
 */
export function categoryIcon(slug: string): IconName {
  const s = slug.toLowerCase();
  if (s.includes('phone') && !s.includes('headphone') && !s.includes('earphone')) return 'phone';
  if (s.includes('headphone') || s.includes('airpod') || s.includes('earbud') || s.includes('audio')) return 'headphones';
  if (s.includes('ipad') || s.includes('tablet') || s.includes('tab')) return 'tablet';
  if (s.includes('macbook') || s.includes('laptop') || s.includes('book')) return 'laptop';
  return 'package';
}
