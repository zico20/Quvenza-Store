import axios from 'axios';
import type { User, AuthTokens, Product, Cart, Order, ApiResponse, PaginatedResponse, Address, Brand } from '@/types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state?.accessToken) config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch {}
  }
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', credentials).then((r) => r.data),
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', data).then((r) => r.data),
  logout: () => apiClient.post('/auth/logout').then((r) => r.data),
  me: () => apiClient.get<ApiResponse<User>>('/auth/me').then((r) => r.data),
};

export const products = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<Product>>('/products', { params }).then((r) => r.data),
  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/${slug}`).then((r) => r.data),
};

export const brandsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse<Brand[]>>('/brands', { params }).then((r) => r.data),
};

export const cartApi = {
  get: () => apiClient.get<ApiResponse<Cart>>('/cart').then((r) => r.data),
  add: (productId: string, quantity: number) =>
    apiClient.post<ApiResponse<Cart>>('/cart/items', { productId, quantity }).then((r) => r.data),
  update: (itemId: string, quantity: number) =>
    apiClient.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity }).then((r) => r.data),
  remove: (itemId: string) => apiClient.delete(`/cart/items/${itemId}`).then((r) => r.data),
  clear: () => apiClient.delete('/cart').then((r) => r.data),
};

export const orders = {
  create: (data: { items: { productId: string; quantity: number }[]; shippingAddress: Address; paymentMethod: string }) =>
    apiClient.post<ApiResponse<Order>>('/orders', data).then((r) => r.data),
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<Order>>('/orders', { params }).then((r) => r.data),
  getById: (id: string) => apiClient.get<ApiResponse<Order>>(`/orders/${id}`).then((r) => r.data),
};

export default apiClient;
