import { apiClient } from './apiClient';

export interface ApiPromotion {
  id: string;
  business_id: string;
  name: string;
  type: string;
  value: number;
  applicable_to: string;
  target_id?: string | null;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

export const promotionApi = {
  list: () => apiClient.get<ApiPromotion[]>('/promotions/'),
  create: (body: Omit<ApiPromotion, 'id' | 'business_id' | 'created_at'>) =>
    apiClient.post<ApiPromotion>('/promotions/', body),
  toggle: (id: string) => apiClient.patch<ApiPromotion>(`/promotions/${id}/toggle`),
  delete: (id: string) => apiClient.delete<void>(`/promotions/${id}`),
};
