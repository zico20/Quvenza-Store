export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type DeviceKind = 'PHONE' | 'LAPTOP' | 'TABLET' | 'HEADPHONE';

export interface Brand {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  logo?: string;
  description?: string;
  isFeatured?: boolean;
}

/** Type-shaped technical specs (keys depend on the device kind). */
export interface ProductSpecs {
  // phone
  screen?: string;
  chip?: string;
  camera?: string;
  battery?: string;
  os?: string;
  // laptop
  cpu?: string;
  ram?: string;
  storage?: string;
  gpu?: string;
  // headphone
  type?: string;
  anc?: string;
  batteryLife?: string;
  connectivity?: string;
  // free-form extras
  [key: string]: string | undefined;
}

export interface Variant {
  id: string;
  productId: string;
  name: string;
  nameAr?: string;
  sku: string;
  storage?: string;
  color?: string;
  colorHex?: string;
  ram?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  image?: string;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  rating?: number;
  brandId?: string;
  brand?: Brand;
  categoryId: string;
  category?: Category;
  variants?: Variant[];
  specs?: ProductSpecs;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  kind?: DeviceKind;
  image?: string;
  icon?: string;
  brandId?: string;
  brand?: Brand;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  variant?: Variant;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  variantName?: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note?: string;
  changedBy?: string;
  createdAt: string;
}

export interface OrderExportRow {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  itemsCount: number;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  statusHistory?: OrderStatusHistory[];
  user?: { id?: string; name: string; email: string };
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  nearestLandmark?: string;
  country: string;
  isDefault?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
}

// Notifications
export type NotificationType = 'NEW_ORDER' | 'LOW_STOCK' | 'NEW_CUSTOMER' | 'ORDER_STATUS_CHANGED';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Enhanced customer (from admin API)
export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  totalOrders: number;
  lastOrderDate: string | null;
  lastOrderTotal: number | null;
  totalSpent: number;
}

export interface CustomerDetail extends CustomerSummary {
  role: 'USER' | 'ADMIN';
  orders: Order[];
  addresses: Address[];
  totalSpent: number;
}

// Dashboard stats — shape matches getDashboardStats() in admin.service.ts
export interface DashboardStats {
  today: { orders: number; revenue: number };
  yesterday: { orders: number; revenue: number };
  totals: {
    products: number;
    users: number;
    orders: number;
    revenue: number;
  };
  recentOrders: Array<{
    id: string;
    total: number | string;
    status: string;
    paymentStatus: string;
    createdAt: string | Date;
    user: { id: string; name: string; email: string };
  }>;
  topProducts: Array<{
    id?: string;
    name?: string;
    slug?: string;
    images?: string[];
    price?: number | string;
    totalSold: number;
  }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  lowStockCount: number;
  salesByCategory: Array<{ name: string; total: number }>;
}
