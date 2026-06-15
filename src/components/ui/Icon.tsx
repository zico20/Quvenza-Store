import * as React from 'react';

/**
 * SoftoDev custom icon set — 40 hand-drawn line/solid SVG icons.
 * Stroke-based by default (1.7px, round caps), inherits `color`.
 * Ported 1:1 from the design prototypes (Icon.dc.html).
 *
 * Usage:  <Icon name="cart" size={20} className="text-text-secondary" />
 *         <Icon name="bolt" size={14} color="#0E7490" />
 */

export type IconName =
  | 'bolt' | 'star' | 'heart' | 'heartFill' | 'shield' | 'bank' | 'chat'
  | 'sparkle' | 'layers' | 'video' | 'book' | 'search' | 'cart' | 'lock'
  | 'check' | 'checkCircle' | 'arrow' | 'arrowLeft' | 'chevron' | 'chevronL'
  | 'x' | 'menu' | 'user' | 'package' | 'pin' | 'filter' | 'sort' | 'trash'
  | 'plus' | 'minus' | 'mail' | 'phone' | 'tag' | 'info' | 'eye' | 'edit'
  | 'logout' | 'clock' | 'grid' | 'facebook' | 'instagram' | 'twitter'
  // Extras added for the lucide→Icon migration (same line style):
  | 'download' | 'upload' | 'save' | 'refresh' | 'toggle' | 'dollar'
  | 'file' | 'settings' | 'alert' | 'bell' | 'calendar' | 'trending'
  | 'dashboard' | 'key' | 'truck' | 'spinner';

type El = ['path' | 'circle' | 'rect', Record<string, string | number>];
type Def = { filled?: boolean; els: El[] };

const ICONS: Record<IconName, Def> = {
  bolt:    { filled: true, els: [['path', { d: 'M13 2 L4 14 L11 14 L10 22 L20 10 L13 10 Z' }]] },
  star:    { filled: true, els: [['path', { d: 'M12 3 L14.6 8.6 L20.5 9.4 L16.2 13.5 L17.3 19.5 L12 16.6 L6.7 19.5 L7.8 13.5 L3.5 9.4 L9.4 8.6 Z' }]] },
  heartFill: { filled: true, els: [['path', { d: 'M12 20.5 C12 20.5 3.5 15.3 3.5 9 C3.5 6.2 5.7 4.3 8.1 4.3 C9.9 4.3 11.4 5.5 12 6.7 C12.6 5.5 14.1 4.3 15.9 4.3 C18.3 4.3 20.5 6.2 20.5 9 C20.5 15.3 12 20.5 12 20.5 Z' }]] },
  shield:  { els: [['path', { d: 'M12 3 L19 6 V11 C19 15.5 16 18.5 12 20.5 C8 18.5 5 15.5 5 11 V6 Z' }], ['path', { d: 'M9 11.5 L11 13.5 L15 9.3' }]] },
  bank:    { els: [['path', { d: 'M3.5 9 L12 4 L20.5 9' }], ['path', { d: 'M5.5 9.5 V17' }], ['path', { d: 'M10 9.5 V17' }], ['path', { d: 'M14 9.5 V17' }], ['path', { d: 'M18.5 9.5 V17' }], ['path', { d: 'M4 20 H20' }]] },
  chat:    { els: [['path', { d: 'M20 12 C20 15.3 16.4 18 12 18 C10.9 18 9.8 17.8 8.8 17.5 L4.5 19 L5.6 15.3 C4.6 14.3 4 13.2 4 12 C4 8.7 7.6 6 12 6 C16.4 6 20 8.7 20 12 Z' }], ['path', { d: 'M8.8 12 H8.81' }], ['path', { d: 'M12 12 H12.01' }], ['path', { d: 'M15.2 12 H15.21' }]] },
  sparkle: { els: [['path', { d: 'M12 3 L13.7 9.1 L20 11 L13.7 12.9 L12 19 L10.3 12.9 L4 11 L10.3 9.1 Z' }], ['path', { d: 'M18.5 3.5 L19.1 5.6 L21 6.2 L19.1 6.8 L18.5 9 L17.9 6.8 L16 6.2 L17.9 5.6 Z' }]] },
  layers:  { els: [['path', { d: 'M12 3 L21 8 L12 13 L3 8 Z' }], ['path', { d: 'M3 12.5 L12 17.5 L21 12.5' }]] },
  video:   { els: [['rect', { x: 4, y: 6, width: 16, height: 12, rx: 2.5 }], ['path', { d: 'M11 9.4 L15 12 L11 14.6 Z', fill: 'currentColor', stroke: 'none' }]] },
  book:    { els: [['path', { d: 'M12 6 C10 4.6 7 4.6 4 5.2 V18 C7 17.4 10 17.4 12 18.8 C14 17.4 17 17.4 20 18 V5.2 C17 4.6 14 4.6 12 6 Z' }], ['path', { d: 'M12 6 V18.8' }]] },
  heart:   { els: [['path', { d: 'M12 20 C12 20 4 15 4 9 C4 6.4 6.1 4.6 8.3 4.6 C10 4.6 11.4 5.7 12 6.9 C12.6 5.7 14 4.6 15.7 4.6 C17.9 4.6 20 6.4 20 9 C20 15 12 20 12 20 Z' }]] },
  search:  { els: [['circle', { cx: 11, cy: 11, r: 6 }], ['path', { d: 'M20 20 L16.5 16.5' }]] },
  cart:    { els: [['path', { d: 'M3 4 H5.5 L7.6 15 H18 L20 7.5 H6.6' }], ['circle', { cx: 9, cy: 19, r: 1.5 }], ['circle', { cx: 17, cy: 19, r: 1.5 }]] },
  lock:    { els: [['rect', { x: 5, y: 10.5, width: 14, height: 9.5, rx: 2.5 }], ['path', { d: 'M8 10.5 V7.5 A4 4 0 0 1 16 7.5 V10.5' }]] },
  check:   { els: [['path', { d: 'M5 12.5 L10 17.5 L19 7' }]] },
  checkCircle: { els: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M8.5 12 L11 14.5 L15.5 9.5' }]] },
  arrow:     { els: [['path', { d: 'M4 12 H19' }], ['path', { d: 'M13 6 L19 12 L13 18' }]] },
  arrowLeft: { els: [['path', { d: 'M20 12 H5' }], ['path', { d: 'M11 6 L5 12 L11 18' }]] },
  chevron:   { els: [['path', { d: 'M6 9.5 L12 15.5 L18 9.5' }]] },
  chevronL:  { els: [['path', { d: 'M14.5 6 L8.5 12 L14.5 18' }]] },
  x:       { els: [['path', { d: 'M6 6 L18 18' }], ['path', { d: 'M18 6 L6 18' }]] },
  menu:    { els: [['path', { d: 'M4 7 H20' }], ['path', { d: 'M4 12 H20' }], ['path', { d: 'M4 17 H20' }]] },
  user:    { els: [['circle', { cx: 12, cy: 8, r: 3.6 }], ['path', { d: 'M5 20 C5 16.1 8.1 14 12 14 C15.9 14 19 16.1 19 20' }]] },
  package: { els: [['path', { d: 'M12 3 L20 7 V16 L12 21 L4 16 V7 Z' }], ['path', { d: 'M4 7 L12 11.5 L20 7' }], ['path', { d: 'M12 11.5 V21' }]] },
  pin:     { els: [['path', { d: 'M12 21 C12 21 19 14.5 19 9.5 A7 7 0 0 0 5 9.5 C5 14.5 12 21 12 21 Z' }], ['circle', { cx: 12, cy: 9.5, r: 2.5 }]] },
  filter:  { els: [['path', { d: 'M4 6 H20' }], ['path', { d: 'M7 12 H17' }], ['path', { d: 'M10 18 H14' }]] },
  sort:    { els: [['path', { d: 'M7 5 V19' }], ['path', { d: 'M4 8 L7 5 L10 8' }], ['path', { d: 'M17 19 V5' }], ['path', { d: 'M14 16 L17 19 L20 16' }]] },
  trash:   { els: [['path', { d: 'M5 7 H19' }], ['path', { d: 'M9.5 7 V5 H14.5 V7' }], ['path', { d: 'M7 7 L7.8 20 H16.2 L17 7' }]] },
  plus:    { els: [['path', { d: 'M12 6 V18' }], ['path', { d: 'M6 12 H18' }]] },
  minus:   { els: [['path', { d: 'M6 12 H18' }]] },
  mail:    { els: [['rect', { x: 3, y: 5, width: 18, height: 14, rx: 2.5 }], ['path', { d: 'M4 7 L12 13 L20 7' }]] },
  phone:   { els: [['path', { d: 'M5 4 H9 L11 9 L8.5 11 C9.5 13.5 11 15 13 16 L15 13.5 L20 15.5 V19 C20 20 19 21 18 21 C10 20.5 4 14.5 3.5 6 C3.5 5 4 4 5 4 Z' }]] },
  tag:     { els: [['path', { d: 'M4 12 L11.5 4.5 H20 V13 L12.5 20.5 Z' }], ['circle', { cx: 16, cy: 8, r: 1.3 }]] },
  info:    { els: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M12 11 V16' }], ['path', { d: 'M12 8 H12.01' }]] },
  eye:     { els: [['path', { d: 'M2.5 12 C4.5 7.5 8 5.5 12 5.5 C16 5.5 19.5 7.5 21.5 12 C19.5 16.5 16 18.5 12 18.5 C8 18.5 4.5 16.5 2.5 12 Z' }], ['circle', { cx: 12, cy: 12, r: 3 }]] },
  edit:    { els: [['path', { d: 'M4 20 L4 16 L15 5 L19 9 L8 20 Z' }], ['path', { d: 'M12.5 7.5 L16.5 11.5' }]] },
  logout:  { els: [['path', { d: 'M14 4 H6 V20 H14' }], ['path', { d: 'M10 12 H21' }], ['path', { d: 'M17.5 8.5 L21 12 L17.5 15.5' }]] },
  clock:   { els: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M12 7.5 V12 L15 14' }]] },
  grid:    { els: [['rect', { x: 4, y: 4, width: 7, height: 7, rx: 1.5 }], ['rect', { x: 13, y: 4, width: 7, height: 7, rx: 1.5 }], ['rect', { x: 4, y: 13, width: 7, height: 7, rx: 1.5 }], ['rect', { x: 13, y: 13, width: 7, height: 7, rx: 1.5 }]] },
  facebook:  { els: [['path', { d: 'M14.5 8.5 H17 V5.5 H14.5 C12.8 5.5 11.5 6.8 11.5 8.5 V10.5 H9.5 V13.5 H11.5 V20 H14.5 V13.5 H16.8 L17.2 10.5 H14.5 V8.8 C14.5 8.6 14.6 8.5 14.5 8.5 Z', fill: 'currentColor', stroke: 'none' }]] },
  instagram: { els: [['rect', { x: 4, y: 4, width: 16, height: 16, rx: 5 }], ['circle', { cx: 12, cy: 12, r: 3.6 }], ['path', { d: 'M16.6 7.4 H16.61' }]] },
  twitter:   { els: [['path', { d: 'M5 5 L11 13 L5 19 H7 L12 14 L16 19 H20 L13.5 10.5 L19 5 H17 L12.5 9.5 L9 5 Z', fill: 'currentColor', stroke: 'none' }]] },
  // ── Extras for the migration (line style, 1.7px stroke) ──
  download:  { els: [['path', { d: 'M12 4 V15' }], ['path', { d: 'M7.5 10.5 L12 15 L16.5 10.5' }], ['path', { d: 'M5 19 H19' }]] },
  upload:    { els: [['path', { d: 'M12 20 V9' }], ['path', { d: 'M7.5 13.5 L12 9 L16.5 13.5' }], ['path', { d: 'M5 5 H19' }]] },
  save:      { els: [['path', { d: 'M5 5 H16 L19 8 V19 H5 Z' }], ['path', { d: 'M8 5 V9 H15 V5' }], ['rect', { x: 8, y: 13, width: 8, height: 6 }]] },
  refresh:   { els: [['path', { d: 'M19 8 A8 8 0 1 0 20 12' }], ['path', { d: 'M20 4 V8 H16' }]] },
  toggle:    { els: [['rect', { x: 3, y: 8, width: 18, height: 8, rx: 4 }], ['circle', { cx: 16, cy: 12, r: 2.5, fill: 'currentColor', stroke: 'none' }]] },
  dollar:    { els: [['path', { d: 'M12 4 V20' }], ['path', { d: 'M16 7.5 C16 6 14.5 5 12 5 C9.5 5 8 6.2 8 8 C8 12 16 11 16 15 C16 16.8 14.5 18 12 18 C9.5 18 8 17 8 15.5' }]] },
  file:      { els: [['path', { d: 'M6 3 H14 L19 8 V21 H6 Z' }], ['path', { d: 'M14 3 V8 H19' }], ['path', { d: 'M9 13 H15' }], ['path', { d: 'M9 16.5 H15' }]] },
  settings:  { els: [['circle', { cx: 12, cy: 12, r: 3 }], ['path', { d: 'M12 3 V6' }], ['path', { d: 'M12 18 V21' }], ['path', { d: 'M3 12 H6' }], ['path', { d: 'M18 12 H21' }], ['path', { d: 'M5.6 5.6 L7.7 7.7' }], ['path', { d: 'M16.3 16.3 L18.4 18.4' }], ['path', { d: 'M18.4 5.6 L16.3 7.7' }], ['path', { d: 'M7.7 16.3 L5.6 18.4' }]] },
  alert:     { els: [['path', { d: 'M12 4 L21 19 H3 Z' }], ['path', { d: 'M12 10 V14' }], ['path', { d: 'M12 16.5 H12.01' }]] },
  bell:      { els: [['path', { d: 'M6 16 V11 A6 6 0 0 1 18 11 V16 L20 18 H4 Z' }], ['path', { d: 'M10 18 A2 2 0 0 0 14 18' }]] },
  calendar:  { els: [['rect', { x: 4, y: 5.5, width: 16, height: 15, rx: 2 }], ['path', { d: 'M4 9.5 H20' }], ['path', { d: 'M8 3.5 V7' }], ['path', { d: 'M16 3.5 V7' }]] },
  trending:  { els: [['path', { d: 'M4 16 L10 10 L13 13 L20 6' }], ['path', { d: 'M15 6 H20 V11' }]] },
  dashboard: { els: [['rect', { x: 4, y: 4, width: 7, height: 9, rx: 1.5 }], ['rect', { x: 13, y: 4, width: 7, height: 5, rx: 1.5 }], ['rect', { x: 13, y: 11, width: 7, height: 9, rx: 1.5 }], ['rect', { x: 4, y: 15, width: 7, height: 5, rx: 1.5 }]] },
  key:       { els: [['circle', { cx: 8, cy: 8, r: 4 }], ['path', { d: 'M11 11 L20 20' }], ['path', { d: 'M17 17 L19 15' }]] },
  truck:     { els: [['rect', { x: 3, y: 7, width: 11, height: 9 }], ['path', { d: 'M14 10 H18 L21 13 V16 H14 Z' }], ['circle', { cx: 7, cy: 18, r: 1.6 }], ['circle', { cx: 17, cy: 18, r: 1.6 }]] },
  spinner:   { els: [['path', { d: 'M12 3 A9 9 0 0 1 21 12' }]] },
};

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name' | 'stroke'> {
  name: IconName;
  size?: number;
  /** Overrides CSS `color`. By default the icon inherits `currentColor`. */
  color?: string;
  stroke?: number;
}

export function Icon({ name, size = 20, color, stroke = 1.7, style, ...rest }: IconProps) {
  const def = ICONS[name] ?? ICONS.check;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={def.filled ? 'currentColor' : 'none'}
      stroke={def.filled ? 'none' : 'currentColor'}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color, display: 'block', flexShrink: 0, ...style }}
      aria-hidden="true"
      {...rest}
    >
      {def.els.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}

export default Icon;
