import { apiClient } from './apiClient';

export interface ApiProduct {
  id: string;
  business_id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const productApi = {
  list: () => apiClient.get<ApiProduct[]>('/products/'),
  get: (id: string) => apiClient.get<ApiProduct>(`/products/${id}`),
  create: (body: Omit<ApiProduct, 'id' | 'business_id' | 'created_at' | 'updated_at'>) =>
    apiClient.post<ApiProduct>('/products/', body),
  update: (id: string, body: Partial<Omit<ApiProduct, 'id' | 'business_id' | 'created_at' | 'updated_at'>>) =>
    apiClient.put<ApiProduct>(`/products/${id}`, body),
  delete: (id: string) => apiClient.delete<void>(`/products/${id}`),
};
