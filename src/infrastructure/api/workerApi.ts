import { apiClient } from './apiClient';

export interface ApiWorker {
  id: string;
  business_id: string;
  name: string;
  role: string;
  phone?: string | null;
  daily_rate: number;
  is_active: boolean;
  hired_at: string;
}

export interface ApiWorkerPayment {
  amount: number;
  paid_at: string;
  notes?: string | null;
}

export const workerApi = {
  list: () => apiClient.get<ApiWorker[]>('/workers/'),
  create: (body: Omit<ApiWorker, 'id' | 'business_id'>) =>
    apiClient.post<ApiWorker>('/workers/', body),
  update: (id: string, body: Partial<ApiWorker>) =>
    apiClient.put<ApiWorker>(`/workers/${id}`, body),
  toggle: (id: string) => apiClient.patch<ApiWorker>(`/workers/${id}/toggle`),
  registerPayment: (workerId: string, body: ApiWorkerPayment) =>
    apiClient.post(`/workers/${workerId}/payments`, body),
};
