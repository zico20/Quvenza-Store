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

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface CartItem {
  productId: string;
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
}

export interface CustomerDetail extends CustomerSummary {
  role: 'USER' | 'ADMIN';
  orders: Order[];
  addresses: Address[];
  totalSpent: number;
}

// Dashboard stats
export interface DashboardStats {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
    lowStockCount: number;
  };
  today: { orders: number; revenue: number };
  yesterday: { orders: number; revenue: number };
  recentOrders: Array<Order & { user: { name: string; email: string } }>;
  topProducts: Array<{
    productId: string;
    name: string;
    price: number;
    image: string | null;
    totalSold: number;
  }>;
  ordersByStatus: Array<{ status: OrderStatus; count: number }>;
  salesByCategory: Array<{ name: string; total: number }>;
}
