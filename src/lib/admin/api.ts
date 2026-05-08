import axios from 'axios';
import type { ApiResponse, PaginatedResponse, Product, Order, User, AuthTokens, Notification, CustomerSummary, CustomerDetail, DashboardStats } from '@/types';
import { useAdminAuthStore } from '@/store/admin/auth.store';

const adminApiClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api/v1', headers: { 'Content-Type': 'application/json' } });
adminApiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;
  const token = useAdminAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
adminApiClient.interceptors.response.use((r) => r, (error) => {
  if (error.response?.status === 401 && typeof window !== 'undefined') {
    const url = error.config?.url ?? '';
    if (!url.includes('/auth/login') && !url.includes('/auth/refresh')) {
      useAdminAuthStore.getState().logout();
      window.location.href = '/admin/login';
    }
  }
  return Promise.reject(error);
});

export const adminAuth = {
  login: (credentials: { email: string; password: string }) => adminApiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', credentials).then((r) => r.data),
  logout: () => adminApiClient.post('/auth/logout').then((r) => r.data),
};

export const adminStats = {
  getDashboard: () => adminApiClient.get<ApiResponse<DashboardStats>>('/admin/stats').then((r) => r.data),
};

export const adminProducts = {
  getAll: (params?: Record<string, unknown>) => adminApiClient.get<PaginatedResponse<Product>>('/products', { params }).then((r) => r.data),
  create: (data: Partial<Product>) => adminApiClient.post<ApiResponse<Product>>('/products', data).then((r) => r.data),
  update: (id: string, data: Partial<Product>) => adminApiClient.put<ApiResponse<Product>>(`/products/${id}`, data).then((r) => r.data),
  uploadImages: (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return adminApiClient.post<ApiResponse<Product>>(`/products/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
  },
  delete: (id: string) => adminApiClient.delete<ApiResponse<null>>(`/products/${id}`).then((r) => r.data),
  getLowStock: (threshold?: number) => adminApiClient.get<ApiResponse<Product[]>>('/admin/products/low-stock', { params: { threshold } }).then((r) => r.data),
};

export const adminOrders = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => adminApiClient.get<PaginatedResponse<Order>>('/admin/orders', { params }).then((r) => r.data),
  getById: (id: string) => adminApiClient.get<ApiResponse<Order>>(`/admin/orders/${id}`).then((r) => r.data),
  updateStatus: (id: string, data: { status: string; note?: string }) =>
    adminApiClient.patch<ApiResponse<Order>>(`/admin/orders/${id}/status`, data).then((r) => r.data),
  exportOrders: (params?: {
    status?: string;
    paymentStatus?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => adminApiClient.get('/admin/orders/export', { params, responseType: 'blob' }),
  downloadInvoice: (orderId: string) =>
    adminApiClient.get(`/admin/orders/${orderId}/invoice`, { responseType: 'blob' }),
};

export const adminCustomers = {
  getAll: (params?: Record<string, unknown>) => adminApiClient.get<PaginatedResponse<CustomerSummary>>('/admin/customers', { params }).then((r) => r.data),
  getById: (id: string) => adminApiClient.get<ApiResponse<CustomerDetail>>(`/admin/customers/${id}`).then((r) => r.data),
  toggleStatus: (id: string) => adminApiClient.patch<ApiResponse<{ id: string; isActive: boolean }>>(`/admin/customers/${id}/toggle-status`).then((r) => r.data),
};

export const adminNotifications = {
  getAll: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => adminApiClient.get<PaginatedResponse<Notification>>('/notifications', { params }).then((r) => r.data),
  getUnreadCount: () => adminApiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count').then((r) => r.data),
  markAsRead: (id: string) => adminApiClient.patch<ApiResponse<null>>(`/notifications/${id}/read`).then((r) => r.data),
  markAllAsRead: () => adminApiClient.patch<ApiResponse<null>>('/notifications/read-all').then((r) => r.data),
  delete: (id: string) => adminApiClient.delete<ApiResponse<null>>(`/notifications/${id}`).then((r) => r.data),
};

export const adminUsers = {
  list: () =>
    adminApiClient.get<ApiResponse<any[]>>('/admin/users').then(r => r.data),
  create: (data: { name: string; email: string; password: string }) =>
    adminApiClient.post<ApiResponse<any>>('/admin/users', data).then(r => r.data),
  update: (id: string, data: { name?: string; email?: string }) =>
    adminApiClient.patch<ApiResponse<any>>(`/admin/users/${id}`, data).then(r => r.data),
  delete: (id: string) =>
    adminApiClient.delete<ApiResponse<null>>(`/admin/users/${id}`).then(r => r.data),
  resetPassword: (id: string, newPassword: string) =>
    adminApiClient.patch<ApiResponse<null>>(`/admin/users/${id}/reset-password`, { newPassword }).then(r => r.data),
  changeOwnPassword: (currentPassword: string, newPassword: string) =>
    adminApiClient.patch<ApiResponse<null>>('/admin/me/password', { currentPassword, newPassword }).then(r => r.data),
  updateOwnProfile: (data: { name?: string; email?: string }) =>
    adminApiClient.patch<ApiResponse<any>>('/admin/me/profile', data).then(r => r.data),
};

export default adminApiClient;
