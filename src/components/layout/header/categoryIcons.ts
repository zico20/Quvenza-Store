import type { IconName } from '@/components/ui/Icon';

/**
 * Maps a category slug → a neutral outline icon from the custom set.
 * Keep the treatment consistent (no rainbow of colors) — all icons inherit
 * the same muted/accent color via CSS; only the glyph differs.
 * Unknown slugs fall back to a generic grid icon.
 */
const SLUG_ICON: Record<string, IconName> = {
  'ai-tools': 'sparkle',
  'productivity': 'bank',
  'entertainment': 'video',
  'design': 'layers',
  'education': 'book',
  'video-editing': 'video',
};

export function categoryIcon(slug: string): IconName {
  return SLUG_ICON[slug] ?? 'grid';
}
