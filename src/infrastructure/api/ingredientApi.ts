import { apiClient } from './apiClient';

export interface ApiIngredient {
  id: string;
  business_id: string;
  name: string;
  unit: string;
  stock: number;
  min_stock: number;
  unit_cost: number;
  supplier?: string | null;
  updated_at: string;
}

export const ingredientApi = {
  list: () => apiClient.get<ApiIngredient[]>('/ingredients/'),
  create: (body: Omit<ApiIngredient, 'id' | 'business_id' | 'updated_at'>) =>
    apiClient.post<ApiIngredient>('/ingredients/', body),
  update: (id: string, body: Partial<ApiIngredient>) =>
    apiClient.put<ApiIngredient>(`/ingredients/${id}`, body),
  delete: (id: string) => apiClient.delete<void>(`/ingredients/${id}`),
};
