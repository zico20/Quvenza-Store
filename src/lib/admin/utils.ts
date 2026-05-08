import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { adminConfig } from '@/config/admin.config';

export function cn(...inputs: ClassValue[]): string { return twMerge(clsx(inputs)); }
export function formatPrice(price: number | string): string { return new Intl.NumberFormat(adminConfig.locale, { style: 'currency', currency: adminConfig.currency }).format(Number(price)); }
export function formatDate(dateString: string): string { return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString)); }
