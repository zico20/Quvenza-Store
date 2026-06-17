import type { DeviceKind } from '@/types';

export interface NavCategory {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  count?: number;
}

export interface NavBrand {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  count?: number;
}

/** Both browse modes for the mega-menu: by device type (cross-brand) and by brand. */
export interface NavData {
  brands: NavBrand[];
  /** Device-kind quick links — cross-brand "All Phones / Laptops / …". */
  kinds: Array<{ kind: DeviceKind; count: number }>;
}
