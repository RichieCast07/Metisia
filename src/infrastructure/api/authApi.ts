import { apiClient } from './apiClient';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  business_name: string;
  business_type: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  business_name: string;
  business_type: string;
  plan: string;
  created_at: string;
  last_login_at: string | null;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.postForm<LoginResponse>('/auth/login', { username: email, password }),

  register: (body: RegisterBody) =>
    apiClient.post<LoginResponse>('/auth/register', body),

  me: () => apiClient.get<UserResponse>('/auth/me'),
};
